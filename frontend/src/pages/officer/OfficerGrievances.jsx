import React, { useEffect, useState } from 'react';
import { officerService } from '../../services/officerService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { ImageLightbox } from '../../components/common/ImageLightbox';
import {
  MessageSquare,
  CheckCircle,
  MapPin,
  ExternalLink,
  Image as ImageIcon,
  Eye,
  User,
  Phone,
  Mail,
  Calendar,
  Filter,
  Search,
} from 'lucide-react';

export const OfficerGrievances = () => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrv, setSelectedGrv] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState('RESOLVED');
  const [submitting, setSubmitting] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  // Filter & Search states
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchGrievances = async () => {
    try {
      const data = await officerService.getAllGrievances();
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

  const handleOpenRespond = (grv) => {
    setSelectedGrv(grv);
    setResponse(grv.officerResponse || '');
    setStatus(grv.status === 'SUBMITTED' ? 'UNDER_REVIEW' : grv.status);
    setModalOpen(true);
  };

  const handleRespond = async (e) => {
    e.preventDefault();
    if (!selectedGrv) return;
    setSubmitting(true);

    try {
      await officerService.respondGrievance(selectedGrv.id, { status, response });
      setModalOpen(false);
      fetchGrievances();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to respond to grievance');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter & search logic
  const filteredGrievances = grievances.filter((g) => {
    const matchesStatus = filterStatus === 'ALL' || g.status === filterStatus;
    const matchesSearch =
      searchTerm === '' ||
      g.grievanceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.citizenName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) return <div className="card">Loading Grievances...</div>;

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--slate-900)' }}>Civic Grievances Lifecycle Management</h2>
        <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
          Inspect citizen complaints with geo-location tags, review photographic evidence, and issue administrative resolutions.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          marginBottom: '1.25rem',
          padding: '0.875rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-600)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Filter size={14} /> Filter Status:
          </span>
          {['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className="btn btn-sm"
              style={{
                backgroundColor: filterStatus === st ? 'var(--primary-600)' : 'var(--slate-100)',
                color: filterStatus === st ? '#ffffff' : 'var(--slate-700)',
                padding: '0.25rem 0.65rem',
                fontSize: '0.775rem',
                fontWeight: filterStatus === st ? 700 : 500,
                border: '1px solid',
                borderColor: filterStatus === st ? 'var(--primary-600)' : 'var(--slate-200)',
              }}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: '240px' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search by ID, ward, subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '32px', fontSize: '0.85rem', height: '36px' }}
          />
        </div>
      </div>

      {/* Grievance Table */}
      <div className="card">
        {filteredGrievances.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <MessageSquare size={44} style={{ color: 'var(--slate-300)', margin: '0 auto 0.75rem' }} />
            <h4 style={{ color: 'var(--slate-700)', marginBottom: '0.25rem' }}>No grievances match the filter</h4>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem' }}>
              {searchTerm ? 'Try adjusting your search criteria.' : 'No citizen complaints logged in this status category.'}
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Citizen</th>
                  <th>Category</th>
                  <th>Subject</th>
                  <th>Location</th>
                  <th>Evidence</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrievances.map((g) => {
                  const hasCoords = g.latitude !== null && g.latitude !== undefined && g.longitude !== null && g.longitude !== undefined;
                  const googleMapsUrl = hasCoords ? `https://www.google.com/maps?q=${g.latitude},${g.longitude}` : null;

                  return (
                    <tr key={g.id}>
                      <td><strong>{g.grievanceId}</strong></td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--slate-900)', fontSize: '0.875rem' }}>
                          {g.citizenName || 'Citizen'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                          {g.citizenEmail || g.citizenPhone || ''}
                        </div>
                      </td>
                      <td><span className="badge badge-info">{g.category}</span></td>
                      <td style={{ maxWidth: '200px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--slate-800)' }}>{g.subject}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {g.description}
                        </div>
                      </td>
                      <td>
                        {g.location ? (
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.825rem', color: 'var(--slate-700)' }}>
                              <MapPin size={14} style={{ color: '#ef4444', flexShrink: 0 }} />
                              <span style={{ maxWidth: '170px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
                          <span style={{ color: 'var(--slate-400)', fontSize: '0.775rem', fontStyle: 'italic' }}>Unspecified</span>
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
                          <span style={{ color: 'var(--slate-400)', fontSize: '0.775rem', fontStyle: 'italic' }}>None</span>
                        )}
                      </td>
                      <td><StatusBadge status={g.status} /></td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap' }}
                          onClick={() => handleOpenRespond(g)}
                        >
                          <Eye size={13} /> Inspect & Respond
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

      {/* Review & Respond Modal */}
      {selectedGrv && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={`Civic Grievance Review: ${selectedGrv?.grievanceId}`}
          maxWidth="820px"
        >
          <div>
            {/* Applicant & Meta Information */}
            <div
              style={{
                background: 'var(--slate-50)',
                padding: '1rem 1.25rem',
                borderRadius: '8px',
                border: '1px solid var(--slate-200)',
                marginBottom: '1.25rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '0.75rem',
                fontSize: '0.85rem',
              }}
            >
              <div>
                <span style={{ color: 'var(--slate-500)', display: 'block', fontSize: '0.75rem' }}>Applicant Name</span>
                <strong style={{ color: 'var(--slate-800)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.15rem' }}>
                  <User size={14} className="text-primary-600" /> {selectedGrv.citizenName || 'Citizen Applicant'}
                </strong>
              </div>

              <div>
                <span style={{ color: 'var(--slate-500)', display: 'block', fontSize: '0.75rem' }}>Contact Info</span>
                <span style={{ color: 'var(--slate-800)', display: 'block', marginTop: '0.15rem' }}>
                  {selectedGrv.citizenEmail || 'No email'} {selectedGrv.citizenPhone ? `• ${selectedGrv.citizenPhone}` : ''}
                </span>
              </div>

              <div>
                <span style={{ color: 'var(--slate-500)', display: 'block', fontSize: '0.75rem' }}>Category & Submission Date</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.15rem' }}>
                  <span className="badge badge-info">{selectedGrv.category}</span>
                  <span style={{ color: 'var(--slate-600)', fontSize: '0.8rem' }}>
                    {selectedGrv.createdAt ? selectedGrv.createdAt.substring(0, 10) : 'Recent'}
                  </span>
                </span>
              </div>

              <div>
                <span style={{ color: 'var(--slate-500)', display: 'block', fontSize: '0.75rem' }}>Current Status</span>
                <div style={{ marginTop: '0.2rem' }}>
                  <StatusBadge status={selectedGrv.status} />
                </div>
              </div>
            </div>

            {/* Complaint Details */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.35rem' }}>
                {selectedGrv.subject}
              </h4>
              <p style={{ color: 'var(--slate-700)', fontSize: '0.875rem', lineHeight: 1.6, whiteSpace: 'pre-line', background: '#ffffff', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--slate-200)' }}>
                {selectedGrv.description}
              </p>
            </div>

            {/* Location & GPS Map Section */}
            <div
              style={{
                background: '#f0fdf4',
                padding: '1rem 1.25rem',
                borderRadius: '8px',
                border: '1px solid #bbf7d0',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#166534', margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={16} style={{ color: '#ef4444' }} /> Incident Location & GPS Coordinates
                </h5>

                {selectedGrv.latitude !== null && selectedGrv.longitude !== null && (
                  <a
                    href={`https://www.google.com/maps?q=${selectedGrv.latitude},${selectedGrv.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.775rem', padding: '0.25rem 0.65rem' }}
                  >
                    <ExternalLink size={12} /> Open in Google Maps
                  </a>
                )}
              </div>

              <div style={{ fontSize: '0.9rem', color: '#14532d', marginBottom: '0.35rem' }}>
                <strong>Reported Location / Landmark:</strong> {selectedGrv.location || 'Location details not specified by applicant'}
              </div>

              {selectedGrv.latitude !== null && selectedGrv.longitude !== null ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: '#166534', background: '#dcfce7', padding: '0.4rem 0.75rem', borderRadius: '6px' }}>
                  <span><strong>Latitude:</strong> {selectedGrv.latitude}° N</span>
                  <span><strong>Longitude:</strong> {selectedGrv.longitude}° E</span>
                  <span style={{ opacity: 0.75 }}>• Pin verified via GPS</span>
                </div>
              ) : (
                <div style={{ fontSize: '0.775rem', color: 'var(--slate-500)', fontStyle: 'italic' }}>
                  No GPS coordinates were captured for this submission.
                </div>
              )}
            </div>

            {/* Photographic Evidence Section */}
            <div
              style={{
                background: 'var(--slate-50)',
                padding: '1rem 1.25rem',
                borderRadius: '8px',
                border: '1px solid var(--slate-200)',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--slate-800)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ImageIcon size={16} style={{ color: 'var(--primary-600)' }} /> Photographic Evidence Submitted
                </h5>

                {selectedGrv.imageUrl && (
                  <button
                    type="button"
                    onClick={() => setLightboxImage(selectedGrv.imageUrl)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <Eye size={12} /> Click to Enlarge
                  </button>
                )}
              </div>

              {selectedGrv.imageUrl ? (
                <div>
                  <div
                    style={{
                      maxHeight: '280px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '1px solid var(--slate-300)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#0f172a',
                    }}
                    onClick={() => setLightboxImage(selectedGrv.imageUrl)}
                    title="Click to view full photo evidence in lightbox"
                  >
                    <img
                      src={selectedGrv.imageUrl}
                      alt="Grievance evidence by citizen"
                      style={{ maxWidth: '100%', maxHeight: '280px', objectFit: 'contain' }}
                    />
                  </div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '0.35rem' }}>
                    Photo attached by citizen. Click the preview to inspect high-resolution details.
                  </span>
                </div>
              ) : (
                <p style={{ color: 'var(--slate-500)', fontSize: '0.85rem', fontStyle: 'italic', margin: 0 }}>
                  No photograph was uploaded with this complaint.
                </p>
              )}
            </div>

            {/* Officer Action Form */}
            <form onSubmit={handleRespond}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700 }}>Update Lifecycle Status</label>
                <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="UNDER_REVIEW">UNDER REVIEW (Work Order Scheduled / Under Inspection)</option>
                  <option value="RESOLVED">RESOLVED (Maintenance Completed / Issue Rectified)</option>
                  <option value="REJECTED">REJECTED (Outside Panchayat Scope / Duplicate)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700 }}>Officer Resolution Remarks & Action Notes</label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Enter details of action taken, assigned contractor/junior engineer, repair schedule, or official response..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving Resolution...' : 'Post Resolution'}
                </button>
              </div>
            </form>
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
