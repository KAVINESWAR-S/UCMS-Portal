import React, { useEffect, useState, useRef } from 'react';
import { grievanceService } from '../../services/grievanceService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { ImageLightbox } from '../../components/common/ImageLightbox';
import { compressImage, formatFileSize } from '../../utils/imageUtils';
import {
  MessageSquare,
  Plus,
  MapPin,
  Navigation,
  Image as ImageIcon,
  Camera,
  Trash2,
  ExternalLink,
  Eye,
  CheckCircle,
  AlertCircle,
  Loader2,
  Compass,
} from 'lucide-react';

export const Grievances = () => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  // Form states
  const [category, setCategory] = useState('Infrastructure');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFileName, setImageFileName] = useState('');
  const [imageFileSize, setImageFileSize] = useState(0);

  // Geo & upload helper states
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoStatus, setGeoStatus] = useState(null);
  const [showManualCoords, setShowManualCoords] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const fetchGrievances = async () => {
    try {
      const data = await grievanceService.getMyGrievances();
      setGrievances(data);
    } catch (err) {
      console.error('Failed to load grievances:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const resetForm = () => {
    setCategory('Infrastructure');
    setSubject('');
    setDescription('');
    setLocation('');
    setLatitude('');
    setLongitude('');
    setImageUrl('');
    setImageFileName('');
    setImageFileSize(0);
    setGeoStatus(null);
    setShowManualCoords(false);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleOpenModal = () => {
    resetForm();
    setModalOpen(true);
  };

  // Browser Geolocation Handler
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus({ type: 'error', message: 'Geolocation is not supported by your browser.' });
      return;
    }

    setGeoLoading(true);
    setGeoStatus(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = parseFloat(position.coords.latitude.toFixed(6));
        const lng = parseFloat(position.coords.longitude.toFixed(6));
        setLatitude(lat);
        setLongitude(lng);
        setGeoLoading(false);
        setGeoStatus({
          type: 'success',
          message: `GPS Captured: ${lat}°, ${lng}° (accuracy ±${Math.round(position.coords.accuracy)}m)`,
        });

        if (!location) {
          setLocation(`GPS Pinned Location (${lat}, ${lng})`);
        }
      },
      (err) => {
        setGeoLoading(false);
        let msg = 'Could not retrieve GPS location.';
        if (err.code === 1) msg = 'Location access denied. Please allow location permissions or enter address manually.';
        else if (err.code === 2) msg = 'Position unavailable. Please type your village landmark/ward.';
        else if (err.code === 3) msg = 'Location request timed out. Please enter landmark manually.';
        setGeoStatus({ type: 'error', message: msg });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Image Upload & Client-side Compression
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    try {
      setImageFileName(file.name);
      setImageFileSize(file.size);
      const compressedDataUrl = await compressImage(file, 1280, 1280, 0.82);
      setImageUrl(compressedDataUrl);
      setError('');
    } catch (err) {
      console.error('Image compression error:', err);
      setError('Failed to process image file. Please try another image.');
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    setImageFileName('');
    setImageFileSize(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await grievanceService.createGrievance({
        category,
        subject,
        description,
        location: location.trim() || null,
        latitude: latitude !== '' ? parseFloat(latitude) : null,
        longitude: longitude !== '' ? parseFloat(longitude) : null,
        imageUrl: imageUrl || null,
      });

      setModalOpen(false);
      resetForm();
      fetchGrievances();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log grievance. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="card">Loading Grievances...</div>;

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--slate-900)' }}>Civic Grievances</h2>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
            Submit complaints with GPS location and photographic evidence for quick resolution by Village Administrative Officers.
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenModal} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Plus size={18} /> Submit Grievance
        </button>
      </div>

      {/* Grievances List Card */}
      <div className="card">
        {grievances.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <MessageSquare size={44} style={{ color: 'var(--slate-300)', margin: '0 auto 0.75rem' }} />
            <h4 style={{ color: 'var(--slate-700)', marginBottom: '0.25rem' }}>No grievances logged yet</h4>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem' }}>
              Have an infrastructure or water supply issue in your ward? Click Submit Grievance above to report it.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Grievance ID</th>
                  <th>Category</th>
                  <th>Subject</th>
                  <th>Location</th>
                  <th>Photo</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {grievances.map((g) => {
                  const hasCoords = g.latitude !== null && g.latitude !== undefined && g.longitude !== null && g.longitude !== undefined;
                  const googleMapsUrl = hasCoords ? `https://www.google.com/maps?q=${g.latitude},${g.longitude}` : null;

                  return (
                    <tr key={g.id}>
                      <td><strong>{g.grievanceId}</strong></td>
                      <td><span className="badge badge-info">{g.category}</span></td>
                      <td style={{ maxWidth: '220px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--slate-800)' }}>{g.subject}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {g.description}
                        </div>
                      </td>
                      <td>
                        {g.location ? (
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: 'var(--slate-700)' }}>
                              <MapPin size={14} style={{ color: '#ef4444', flexShrink: 0 }} />
                              <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {g.location}
                              </span>
                            </div>
                            {hasCoords && (
                              <a
                                href={googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ fontSize: '0.725rem', color: 'var(--primary-600)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.15rem' }}
                              >
                                View Map <ExternalLink size={11} />
                              </a>
                            )}
                          </div>
                        ) : (
                          <span style={{ color: 'var(--slate-400)', fontSize: '0.8rem', fontStyle: 'italic' }}>Not specified</span>
                        )}
                      </td>
                      <td>
                        {g.imageUrl ? (
                          <div
                            onClick={() => setLightboxImage(g.imageUrl)}
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '6px',
                              overflow: 'hidden',
                              cursor: 'pointer',
                              border: '1px solid var(--slate-300)',
                              position: 'relative',
                            }}
                            title="Click to view full photo evidence"
                          >
                            <img
                              src={g.imageUrl}
                              alt="Evidence thumbnail"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                        ) : (
                          <span style={{ color: 'var(--slate-400)', fontSize: '0.8rem', fontStyle: 'italic' }}>No photo</span>
                        )}
                      </td>
                      <td style={{ fontSize: '0.825rem', color: 'var(--slate-600)' }}>
                        {g.createdAt ? g.createdAt.substring(0, 10) : 'Today'}
                      </td>
                      <td><StatusBadge status={g.status} /></td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.6rem' }}
                          onClick={() => setSelectedGrievance(g)}
                        >
                          <Eye size={13} /> View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Grievance Submission Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Log Civic Grievance" maxWidth="720px">
        {error && <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Category */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Infrastructure">Roads, Bridges & Street Lights</option>
              <option value="Water Supply">Drinking Water & Sanitation</option>
              <option value="Scheme Disbursement">Welfare Allowance Delay</option>
              <option value="General Admin">Panchayat Administration</option>
              <option value="Waste Management">Solid Waste & Drainage</option>
            </select>
          </div>

          {/* Subject */}
          <div className="form-group">
            <label className="form-label">Subject</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Broken water pipe leaking near South Colony"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          {/* Detailed Description */}
          <div className="form-group">
            <label className="form-label">Detailed Description</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Explain the issue in detail, how long it has persisted, and urgency..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Location Section */}
          <div style={{ background: 'var(--slate-50)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--slate-200)', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="form-label" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
                <MapPin size={16} style={{ color: '#ef4444' }} /> Incident Location & Ward
              </label>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleGetLocation}
                disabled={geoLoading}
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', padding: '0.25rem 0.65rem' }}
              >
                {geoLoading ? <Loader2 size={14} className="animate-spin" /> : <Navigation size={14} />}
                {geoLoading ? 'Detecting GPS...' : '📍 Use Current GPS Location'}
              </button>
            </div>

            <input
              type="text"
              className="form-control"
              placeholder="Enter Street name, Landmark, or Ward (e.g. North Car Street near Community Well)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{ marginBottom: '0.5rem' }}
            />

            {/* Geolocation Feedback Message */}
            {geoStatus && (
              <div
                style={{
                  fontSize: '0.8rem',
                  padding: '0.45rem 0.75rem',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem',
                  backgroundColor: geoStatus.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)',
                  color: geoStatus.type === 'success' ? 'var(--success-text)' : 'var(--danger-text)',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  {geoStatus.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                  {geoStatus.message}
                </span>

                {geoStatus.type === 'success' && latitude && longitude && (
                  <a
                    href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontWeight: 600, color: 'var(--success-text)', textDecoration: 'underline', fontSize: '0.75rem' }}
                  >
                    Preview on Map
                  </a>
                )}
              </div>
            )}

            {/* Manual Lat/Lng coordinates toggler */}
            <div style={{ marginTop: '0.25rem' }}>
              <button
                type="button"
                onClick={() => setShowManualCoords(!showManualCoords)}
                style={{ background: 'none', border: 'none', color: 'var(--primary-600)', fontSize: '0.75rem', cursor: 'pointer', padding: 0 }}
              >
                {showManualCoords ? '− Hide GPS coordinates' : '+ View/Edit manual GPS coordinates (Latitude & Longitude)'}
              </button>

              {showManualCoords && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--slate-600)', display: 'block', marginBottom: '0.2rem' }}>Latitude</label>
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      placeholder="e.g. 10.7828"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--slate-600)', display: 'block', marginBottom: '0.2rem' }}>Longitude</label>
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      placeholder="e.g. 78.6945"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Photo Evidence Upload Section */}
          <div style={{ background: 'var(--slate-50)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--slate-200)', marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              <Camera size={16} style={{ color: 'var(--primary-600)' }} /> Upload Photo Evidence
            </label>
            <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginBottom: '0.75rem' }}>
              Attach a clear photo of the damaged road, water leak, or civic defect. Photos are automatically optimized for fast submission.
            </p>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              id="grievance-image-input"
            />

            {!imageUrl ? (
              <label
                htmlFor="grievance-image-input"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1.5rem',
                  border: '2px dashed var(--slate-300)',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
              >
                <ImageIcon size={32} style={{ color: 'var(--slate-400)', marginBottom: '0.5rem' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--slate-700)' }}>
                  Click to select photo or take camera picture
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '0.2rem' }}>
                  Supports PNG, JPG, JPEG, WEBP (Max 15MB)
                </span>
              </label>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#ffffff', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--slate-200)' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    border: '1px solid var(--slate-200)',
                    cursor: 'pointer',
                  }}
                  onClick={() => setLightboxImage(imageUrl)}
                  title="Click to preview full image"
                >
                  <img src={imageUrl} alt="Uploaded evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-800)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {imageFileName || 'photo-evidence.jpg'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                    {imageFileSize ? formatFileSize(imageFileSize) : 'Optimized'} • Ready for upload
                  </div>
                  <button
                    type="button"
                    onClick={() => setLightboxImage(imageUrl)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary-600)', fontSize: '0.75rem', padding: 0, cursor: 'pointer', marginTop: '0.2rem' }}
                  >
                    🔍 Preview full photo
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="btn btn-secondary btn-sm"
                  style={{ color: 'var(--danger-text)', display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.6rem' }}
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Log Grievance'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Citizen Grievance Details Modal */}
      {selectedGrievance && (
        <Modal
          isOpen={!!selectedGrievance}
          onClose={() => setSelectedGrievance(null)}
          title={`Grievance Details: ${selectedGrievance.grievanceId}`}
          maxWidth="700px"
        >
          <div>
            {/* Header Status & Category */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--slate-200)', paddingBottom: '0.75rem' }}>
              <div>
                <span className="badge badge-info" style={{ marginRight: '0.5rem' }}>{selectedGrievance.category}</span>
                <span style={{ fontSize: '0.825rem', color: 'var(--slate-500)' }}>
                  Filed on: {selectedGrievance.createdAt ? selectedGrievance.createdAt.substring(0, 10) : 'Today'}
                </span>
              </div>
              <StatusBadge status={selectedGrievance.status} />
            </div>

            {/* Subject & Description */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.4rem' }}>
                {selectedGrievance.subject}
              </h4>
              <p style={{ color: 'var(--slate-700)', fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {selectedGrievance.description}
              </p>
            </div>

            {/* Location Details Card */}
            <div style={{ background: 'var(--slate-50)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--slate-200)', marginBottom: '1.25rem' }}>
              <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={15} style={{ color: '#ef4444' }} /> Location Information
              </h5>
              <div style={{ fontSize: '0.9rem', color: 'var(--slate-800)', marginBottom: '0.4rem' }}>
                <strong>Location / Landmark:</strong> {selectedGrievance.location || 'Not specified'}
              </div>

              {selectedGrievance.latitude !== null && selectedGrievance.longitude !== null && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--slate-200)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)' }}>
                    <strong>GPS Coordinates:</strong> {selectedGrievance.latitude}°, {selectedGrievance.longitude}°
                  </div>
                  <a
                    href={`https://www.google.com/maps?q=${selectedGrievance.latitude},${selectedGrievance.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.775rem', padding: '0.25rem 0.6rem' }}
                  >
                    <ExternalLink size={12} /> Open in Google Maps
                  </a>
                </div>
              )}
            </div>

            {/* Attached Photo Evidence Card */}
            <div style={{ background: 'var(--slate-50)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--slate-200)', marginBottom: '1.25rem' }}>
              <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ImageIcon size={15} style={{ color: 'var(--primary-600)' }} /> Attached Photographic Evidence
              </h5>

              {selectedGrievance.imageUrl ? (
                <div>
                  <div
                    style={{
                      maxHeight: '260px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '1px solid var(--slate-300)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#0f172a',
                    }}
                    onClick={() => setLightboxImage(selectedGrievance.imageUrl)}
                    title="Click to enlarge photo evidence"
                  >
                    <img
                      src={selectedGrievance.imageUrl}
                      alt="Grievance evidence"
                      style={{ maxWidth: '100%', maxHeight: '260px', objectFit: 'contain' }}
                    />
                  </div>
                  <div style={{ textAlign: 'right', marginTop: '0.4rem' }}>
                    <button
                      type="button"
                      onClick={() => setLightboxImage(selectedGrievance.imageUrl)}
                      style={{ background: 'none', border: 'none', color: 'var(--primary-600)', fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      <Eye size={13} /> View Full Screen
                    </button>
                  </div>
                </div>
              ) : (
                <p style={{ color: 'var(--slate-500)', fontSize: '0.85rem', fontStyle: 'italic', margin: 0 }}>
                  No photo was uploaded with this grievance.
                </p>
              )}
            </div>

            {/* Officer Response */}
            <div style={{ background: selectedGrievance.officerResponse ? 'var(--info-bg)' : 'var(--slate-100)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--slate-200)' }}>
              <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: selectedGrievance.officerResponse ? 'var(--info-text)' : 'var(--slate-700)', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MessageSquare size={15} /> Administrative Resolution Response
              </h5>
              <p style={{ margin: 0, fontSize: '0.875rem', color: selectedGrievance.officerResponse ? 'var(--slate-800)' : 'var(--slate-500)', fontStyle: selectedGrievance.officerResponse ? 'normal' : 'italic' }}>
                {selectedGrievance.officerResponse || 'No resolution response posted by the Village Administrative Officer yet.'}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedGrievance(null)}>
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Lightbox Modal */}
      <ImageLightbox
        isOpen={!!lightboxImage}
        onClose={() => setLightboxImage(null)}
        imageUrl={lightboxImage}
        title="Grievance Photographic Evidence"
      />
    </div>
  );
};
