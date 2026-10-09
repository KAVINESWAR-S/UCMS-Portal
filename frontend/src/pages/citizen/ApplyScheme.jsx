import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { schemeService } from '../../services/schemeService';
import { citizenService } from '../../services/citizenService';
import { applicationService } from '../../services/applicationService';
import {
  FileText,
  CheckCircle,
  ArrowLeft,
  AlertTriangle,
  XCircle,
  UploadCloud,
  Paperclip,
  Trash2,
  Eye,
  Plus,
  FileCheck,
  X,
  File,
} from 'lucide-react';

const DOCUMENT_TYPES = [
  'Income Certificate',
  'Aadhaar Card Proof',
  'Land Chitta / Patta Proof',
  'Bank Passbook Copy',
  'Ration Card / Smart Card',
  'Community Certificate',
  'Residence / Nativity Proof',
  'Other Supporting Document',
];

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export const ApplyScheme = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scheme, setScheme] = useState(null);
  const [isEligible, setIsEligible] = useState(true);
  const [matchReasons, setMatchReasons] = useState([]);
  const [declaredIncome, setDeclaredIncome] = useState('');
  const [declaredLandArea, setDeclaredLandArea] = useState('');

  // Document Upload States
  const [documentType, setDocumentType] = useState('Income Certificate');
  const [docRefNumber, setDocRefNumber] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [manualFileName, setManualFileName] = useState('');
  const [attachedDocs, setAttachedDocs] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const initData = async () => {
      try {
        let schemeData = null;
        try {
          const recommended = await schemeService.getRecommendedSchemes();
          if (Array.isArray(recommended)) {
            schemeData = recommended.find((s) => s.schemeId === id || String(s.id) === String(id));
          }
        } catch (recErr) {
          console.warn('Could not fetch recommended schemes for eligibility check:', recErr);
        }

        if (!schemeData) {
          schemeData = await schemeService.getSchemeById(id);
        }

        setScheme(schemeData);
        if (schemeData && schemeData.eligible === false) {
          setIsEligible(false);
          setMatchReasons(schemeData.matchReasons || []);
        }

        const profileData = await citizenService.getProfile();
        if (profileData) {
          setDeclaredIncome(profileData.annualIncome || '75000');
          setDeclaredLandArea(profileData.landArea || '0.5');
        }
      } catch (err) {
        setError('Failed to load scheme or profile metadata');
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [id]);

  const processFile = (file) => {
    if (!file) return;

    // Check size limit: 10MB
    if (file.size > 10 * 1024 * 1024) {
      setError('Selected file exceeds maximum allowed limit of 10 MB.');
      return;
    }

    setError('');
    setSelectedFile(file);
    setManualFileName(file.name);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemoveCurrentFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setManualFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddDocumentToList = () => {
    const effectiveFileName = selectedFile ? selectedFile.name : manualFileName.trim();
    if (!effectiveFileName) {
      setError('Please choose a document file to attach or enter a document name.');
      return;
    }

    const newDoc = {
      id: Date.now(),
      documentType,
      fileName: effectiveFileName,
      fileSize: selectedFile ? selectedFile.size : null,
      filePreview: filePreview,
      docRefNumber: docRefNumber.trim(),
      file: selectedFile,
    };

    setAttachedDocs([...attachedDocs, newDoc]);
    handleRemoveCurrentFile();
    setDocRefNumber('');
    setError('');
  };

  const handleRemoveAttachedDoc = (docId) => {
    setAttachedDocs(attachedDocs.filter((d) => d.id !== docId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEligible) {
      setError('Application Blocked: Your profile does not meet the eligibility prerequisites for this scheme.');
      return;
    }

    // Consolidate any active file that wasn't added to list yet
    const finalDocs = [...attachedDocs];
    const currentName = selectedFile ? selectedFile.name : manualFileName.trim();
    if (currentName && !finalDocs.some((d) => d.fileName === currentName && d.documentType === documentType)) {
      finalDocs.push({
        id: Date.now(),
        documentType,
        fileName: currentName,
        fileSize: selectedFile ? selectedFile.size : null,
        filePreview: filePreview,
        docRefNumber: docRefNumber.trim(),
        file: selectedFile,
      });
    }

    setSubmitting(true);
    setError('');

    try {
      // 1. Create Application
      const app = await applicationService.createApplication({
        schemeId: scheme.schemeId,
        declaredIncome: parseFloat(declaredIncome),
        declaredLandArea: parseFloat(declaredLandArea),
        documentCount: finalDocs.length,
      });

      // 2. Upload document metadata for each document
      for (const doc of finalDocs) {
        const cleanName = doc.fileName.replace(/\s+/g, '_');
        const safePath = `/uploads/docs/${cleanName}`;

        const fullType = doc.docRefNumber
          ? `${doc.documentType} (Ref: ${doc.docRefNumber})`
          : doc.documentType;

        await applicationService.uploadDocument(
          app.id,
          fullType,
          doc.fileName,
          safePath
        );
      }

      navigate(`/citizen/applications/${app.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit scheme application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="card">Loading Application Form...</div>;

  return (
    <div style={{ maxWidth: '750px', margin: '0 auto' }}>
      <Link to="/citizen/schemes" className="btn btn-secondary btn-sm" style={{ marginBottom: '1rem' }}>
        <ArrowLeft size={14} /> Back to Schemes
      </Link>

      <div className="card">
        <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText className="text-primary-600" />
          Application for {scheme?.name}
        </h2>
        <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Scheme Reference Code: <strong>{scheme?.schemeId}</strong>
        </p>

        {error && <div className="alert alert-danger">{error}</div>}

        {!isEligible ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', margin: 0 }}>
              <AlertTriangle size={24} style={{ color: '#dc2626', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '1rem' }}>Application Blocked: Ineligible for this Scheme</strong>
                <p style={{ margin: '0.25rem 0 0.5rem', fontSize: '0.875rem' }}>
                  Your verified citizen profile does not meet the eligibility prerequisites for <strong>{scheme?.name}</strong>:
                </p>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {matchReasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              disabled
              className="btn btn-secondary"
              style={{
                width: '100%',
                opacity: 0.65,
                cursor: 'not-allowed',
                background: 'var(--slate-200)',
                color: 'var(--slate-500)',
                border: '1px solid var(--slate-300)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem',
                fontWeight: 600,
              }}
            >
              <XCircle size={18} color="#dc2626" /> Application Blocked - Profile Ineligible
            </button>

            <Link
              to="/citizen/schemes"
              className="btn btn-primary"
              style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.75rem' }}
            >
              <ArrowLeft size={16} /> Browse Eligible Schemes For Your Profile
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Declared Annual Income (₹)</label>
              <input
                type="number"
                className="form-control"
                value={declaredIncome}
                onChange={(e) => setDeclaredIncome(e.target.value)}
                required
              />
              <span style={{ fontSize: '0.775rem', color: 'var(--slate-500)' }}>
                Prefilled from your citizen profile. Ensure accuracy against official certificates.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Declared Land Holding (Acres)</label>
              <input
                type="number"
                step="0.1"
                className="form-control"
                value={declaredLandArea}
                onChange={(e) => setDeclaredLandArea(e.target.value)}
                required
              />
            </div>

            {/* Document Upload Section */}
            <div style={{ borderTop: '1px solid var(--slate-200)', paddingTop: '1.25rem', marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Paperclip size={18} style={{ color: 'var(--primary-600)' }} /> Attach Required Verification Documents
                </h3>
                {attachedDocs.length > 0 && (
                  <span className="badge badge-info" style={{ fontWeight: 700 }}>
                    {attachedDocs.length} Document{attachedDocs.length > 1 ? 's' : ''} Attached
                  </span>
                )}
              </div>

              {/* Already Attached Documents List */}
              {attachedDocs.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  {attachedDocs.map((doc) => (
                    <div
                      key={doc.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.85rem',
                        background: '#f8fafc',
                        border: '1px solid var(--slate-200)',
                        borderRadius: '8px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '6px',
                            background: '#e0f2fe',
                            color: '#0284c7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <FileCheck size={20} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                            <strong style={{ fontSize: '0.85rem', color: 'var(--slate-800)' }}>{doc.documentType}</strong>
                            {doc.docRefNumber && (
                              <span style={{ fontSize: '0.7rem', background: 'var(--slate-200)', padding: '0.1rem 0.35rem', borderRadius: '4px', color: 'var(--slate-600)' }}>
                                Ref: {doc.docRefNumber}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {doc.fileName} {doc.fileSize ? `• ${formatFileSize(doc.fileSize)}` : ''}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {doc.filePreview && (
                          <button
                            type="button"
                            onClick={() => setLightboxImage(doc.filePreview)}
                            className="btn btn-sm"
                            style={{ padding: '0.25rem 0.5rem', background: '#e0f2fe', color: '#0284c7', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            title="Preview Document"
                          >
                            <Eye size={14} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachedDoc(doc.id)}
                          className="btn btn-sm"
                          style={{ padding: '0.25rem 0.5rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                          title="Remove Document"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Document Input Controls */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid var(--slate-200)',
                  borderRadius: '10px',
                  padding: '1.25rem',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontWeight: 600 }}>Document Type</label>
                    <select
                      className="form-control"
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value)}
                    >
                      {DOCUMENT_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontWeight: 600 }}>
                      Certificate / Reference No. <span style={{ fontWeight: 400, color: 'var(--slate-500)', fontSize: '0.75rem' }}>(Optional)</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. TN-REV-2026-98124"
                      value={docRefNumber}
                      onChange={(e) => setDocRefNumber(e.target.value)}
                    />
                  </div>
                </div>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,image/png,image/jpeg,image/webp,.jpg"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id="scheme-document-file-input"
                />

                {/* Upload Area / Dropzone */}
                {!selectedFile ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    style={{
                      border: isDragging ? '2px dashed var(--primary-600)' : '2px dashed var(--slate-300)',
                      backgroundColor: isDragging ? '#eff6ff' : '#ffffff',
                      borderRadius: '8px',
                      padding: '1.75rem 1rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: '#f0fdf4',
                        color: '#16a34a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <UploadCloud size={26} />
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--slate-800)' }}>
                      Click to browse or drag and drop document
                    </span>
                    <span style={{ fontSize: '0.775rem', color: 'var(--slate-500)', marginTop: '0.2rem' }}>
                      Supports PDF, PNG, JPG, JPEG, WEBP (Max 10 MB)
                    </span>
                  </div>
                ) : (
                  /* Selected File Card */
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#ffffff',
                      padding: '0.85rem 1rem',
                      borderRadius: '8px',
                      border: '1px solid var(--slate-300)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0 }}>
                      {filePreview ? (
                        <div
                          style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            border: '1px solid var(--slate-200)',
                            flexShrink: 0,
                            cursor: 'pointer',
                          }}
                          onClick={() => setLightboxImage(filePreview)}
                          title="Click to preview"
                        >
                          <img
                            src={filePreview}
                            alt="Document Preview"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      ) : (
                        <div
                          style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '6px',
                            backgroundColor: '#fee2e2',
                            color: '#dc2626',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <FileText size={24} />
                        </div>
                      )}

                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--slate-900)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {selectedFile.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.15rem' }}>
                          <span>{formatFileSize(selectedFile.size)}</span>
                          <span className="badge badge-success" style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem' }}>
                            Ready to Attach
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {filePreview && (
                        <button
                          type="button"
                          onClick={() => setLightboxImage(filePreview)}
                          className="btn btn-sm btn-secondary"
                          style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem' }}
                        >
                          <Eye size={13} /> Preview
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        className="btn btn-sm btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem' }}
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveCurrentFile}
                        className="btn btn-sm btn-danger"
                        style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Button to attach multiple documents if desired */}
                <div style={{ marginTop: '0.85rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={handleAddDocumentToList}
                    disabled={!selectedFile && !manualFileName.trim()}
                    className="btn btn-secondary btn-sm"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontWeight: 600,
                      opacity: (!selectedFile && !manualFileName.trim()) ? 0.6 : 1,
                    }}
                  >
                    <Plus size={15} /> Add to Attached Documents List
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              disabled={submitting}
            >
              <CheckCircle size={18} />
              <span>{submitting ? 'Submitting Application...' : 'Submit Application for Review'}</span>
            </button>
          </form>
        )}
      </div>

      {/* Lightbox Preview Modal for Image Documents */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(0,0,0,0.6)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
              }}
            >
              <X size={18} />
            </button>
            <img
              src={lightboxImage}
              alt="Verification document full preview"
              style={{ maxWidth: '85vw', maxHeight: '80vh', objectFit: 'contain', display: 'block' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
