import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { applicationService } from '../../services/applicationService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ECertificateModal } from '../../components/certificate/ECertificateModal';
import { FileText, ArrowLeft, Paperclip, MessageSquare, Award, Eye, X } from 'lucide-react';

export const ApplicationDetails = () => {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const data = await applicationService.getApplicationDetails(id);
        setApp(data);
      } catch (err) {
        console.error('Error loading application details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApp();
  }, [id]);

  if (loading) return <div className="card">Loading Application Details...</div>;
  if (!app) return <div className="card">Application not found.</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/citizen/applications" className="btn btn-secondary btn-sm" style={{ marginBottom: '1rem' }}>
        <ArrowLeft size={14} /> Back to Applications
      </Link>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <span className="badge badge-info">{app.applicationId}</span>
            <h2 className="card-title" style={{ margin: '0.25rem 0 0', fontSize: '1.4rem' }}>
              {app.schemeName || app.schemeId}
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {app.status === 'APPROVED' && (
              <button
                className="btn btn-success btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
                onClick={() => setModalOpen(true)}
              >
                <Award size={16} /> Download e-Sanction & QR
              </button>
            )}
            {app.status === 'REJECTED' && (
              <button
                className="btn btn-danger btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
                onClick={() => setModalOpen(true)}
              >
                <Award size={16} /> View Revoked Record & QR
              </button>
            )}
            <StatusBadge status={app.status} />
          </div>
        </div>

        <div style={{ background: 'var(--slate-50)', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
          <div><strong>Application Date:</strong> {app.applicationDate}</div>
          <div><strong>Applicant:</strong> {app.citizenName || app.citizenEmail}</div>
          <div><strong>Declared Income:</strong> ₹{app.declaredIncome ? Number(app.declaredIncome).toLocaleString('en-IN') : '0'}</div>
          <div><strong>Declared Land Holding:</strong> {app.declaredLandArea} Acres</div>
        </div>

        {/* Attached Verification Documents */}
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Paperclip size={18} /> Attached Verification Documents ({app.documents?.length || 0})
        </h3>

        {app.documents && app.documents.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {app.documents.map((doc) => (
              <div key={doc.id} style={{ background: '#ffffff', border: '1px solid var(--slate-200)', padding: '0.75rem 1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <FileText size={20} className="text-primary-600" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{doc.documentType}</div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--slate-500)' }}>{doc.fileName}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {doc.filePath && doc.filePath.startsWith('data:image') && (
                    <button
                      type="button"
                      onClick={() => setPreviewImage(doc.filePath)}
                      className="btn btn-sm btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <Eye size={13} /> View
                    </button>
                  )}
                  <span className="badge badge-success">Attached</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--slate-500)', fontStyle: 'italic', marginBottom: '1.5rem' }}>No documents attached.</p>
        )}

        {/* Officer Review Remarks */}
        {app.officerRemarks && (
          <div className="alert alert-info" style={{ marginTop: '1rem' }}>
            <MessageSquare size={20} />
            <div>
              <strong>Officer Remarks:</strong>
              <p style={{ marginTop: '0.25rem' }}>{app.officerRemarks}</p>
            </div>
          </div>
        )}
      </div>

      {/* Official e-Sanction Order Modal */}
      <ECertificateModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        data={app}
        type="APPLICATION"
      />

      {/* Lightbox for Document Preview */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
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
              onClick={() => setPreviewImage(null)}
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
              src={previewImage}
              alt="Document full preview"
              style={{ maxWidth: '85vw', maxHeight: '80vh', objectFit: 'contain', display: 'block' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
