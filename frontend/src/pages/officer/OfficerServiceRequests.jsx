import React, { useEffect, useState } from 'react';
import { serviceRequestService } from '../../services/serviceRequestService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { ImageLightbox } from '../../components/common/ImageLightbox';
import {
  Zap,
  Droplet,
  Waves,
  Lightbulb,
  Sun,
  MapPin,
  ExternalLink,
  Eye,
  User,
  Phone,
  Mail,
  Calendar,
  Filter,
  Search,
  CheckCircle,
  UserCheck,
  FileText,
  Clock,
  Layers,
} from 'lucide-react';

const SERVICE_TYPE_ICONS = {
  EB_CONNECTION: { label: 'EB Connection', icon: Zap, color: '#eab308', bgColor: '#fefce8' },
  WATER_CONNECTION: { label: 'Water Connection', icon: Droplet, color: '#0284c7', bgColor: '#f0f9ff' },
  DRAINAGE_SEWAGE: { label: 'Drainage / Sewage', icon: Waves, color: '#0d9488', bgColor: '#f0fdfa' },
  STREET_LIGHT: { label: 'Street Light', icon: Lightbulb, color: '#f59e0b', bgColor: '#fffbeb' },
  SOLAR_ROOFTOP: { label: 'Solar Rooftop', icon: Sun, color: '#ea580c', bgColor: '#fff7ed' },
  WASTE_MANAGEMENT: { label: 'Waste Sanitation', icon: Layers, color: '#64748b', bgColor: '#f1f5f9' },
};

import { useAuth } from '../../context/AuthContext';

export const OfficerServiceRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReq, setSelectedReq] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Review Form States
  const [status, setStatus] = useState('UNDER_VERIFICATION');
  const [remarks, setRemarks] = useState('');
  const [assignedStaff, setAssignedStaff] = useState('');
  const [inspectionDate, setInspectionDate] = useState('');
  const [connectionReferenceNo, setConnectionReferenceNo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  // Filters & Search
  const [filterVillage, setFilterVillage] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRequests = async () => {
    try {
      const data = await serviceRequestService.getAllRequests();
      setRequests(data);
    } catch (err) {
      console.error('Failed to load service requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleOpenReview = (req) => {
    setSelectedReq(req);
    setStatus(req.status || 'UNDER_VERIFICATION');
    setRemarks(req.officerRemarks || '');
    setAssignedStaff(req.assignedStaff || '');
    setInspectionDate(req.inspectionDate || '');
    setConnectionReferenceNo(req.connectionReferenceNo || '');
    setModalOpen(true);
  };

  const selectStage = (newStatus, defaultRemark) => {
    setStatus(newStatus);
    if (!remarks) {
      setRemarks(defaultRemark);
    }
    if (newStatus === 'APPROVED' && !connectionReferenceNo) {
      const prefix = selectedReq?.serviceType === 'WATER_CONNECTION' ? 'WTR-CON-' : 'EB-SANCTION-';
      setConnectionReferenceNo(prefix + Math.floor(100000 + Math.random() * 900000));
    }
    if (newStatus === 'SITE_INSPECTION_SCHEDULED') {
      if (!inspectionDate) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 2);
        setInspectionDate(tomorrow.toISOString().split('T')[0]);
      }
      if (!assignedStaff) {
        setAssignedStaff('Er. K. Sivakumar, Field Junior Engineer (9443210987)');
      }
    }
  };

  const handleReviewSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!selectedReq) return;
    setSubmitting(true);

    try {
      await serviceRequestService.reviewRequest(selectedReq.id, {
        status,
        remarks: remarks.trim() || `Status updated to ${status.replace(/_/g, ' ')}`,
        assignedStaff: assignedStaff.trim() || null,
        inspectionDate: inspectionDate || null,
        connectionReferenceNo: connectionReferenceNo.trim() || null,
      });

      setModalOpen(false);
      await fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update service request.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter & Search Logic
  const filteredRequests = requests.filter((r) => {
    const matchesVillage = filterVillage === 'ALL' ||
      (r.propertyAddress && r.propertyAddress.toLowerCase().includes(filterVillage.toLowerCase())) ||
      (r.citizenVillage && r.citizenVillage.toLowerCase().includes(filterVillage.toLowerCase()));
    const matchesCategory = filterCategory === 'ALL' || r.serviceType === filterCategory;
    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;
    const matchesSearch =
      searchTerm === '' ||
      r.requestId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.citizenName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.propertyAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.surveyNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.wardNumber?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesVillage && matchesCategory && matchesStatus && matchesSearch;
  });

  if (loading) return <div className="card">Loading Service Requests...</div>;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--slate-900)' }}>Civic Utility Service Requests</h2>
        <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
          Inspect applications for Electricity (EB) meters, water supply connections, drainage lines, and street lights. Schedule site inspections and assign field staff.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          marginBottom: '1.25rem',
          padding: '1rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        {/* Category Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-600)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Filter size={14} /> Service Type:
          </span>
          {[
            { key: 'ALL', label: 'All Services' },
            { key: 'EB_CONNECTION', label: '⚡ EB Power' },
            { key: 'WATER_CONNECTION', label: '💧 Water Line' },
            { key: 'DRAINAGE_SEWAGE', label: '🚰 Drainage' },
            { key: 'STREET_LIGHT', label: '💡 Street Light' },
            { key: 'SOLAR_ROOFTOP', label: '☀️ Solar Grid' },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setFilterCategory(cat.key)}
              className="btn btn-sm"
              style={{
                backgroundColor: filterCategory === cat.key ? 'var(--primary-600)' : 'var(--slate-100)',
                color: filterCategory === cat.key ? '#ffffff' : 'var(--slate-700)',
                padding: '0.25rem 0.6rem',
                fontSize: '0.775rem',
                fontWeight: filterCategory === cat.key ? 700 : 500,
                border: '1px solid',
                borderColor: filterCategory === cat.key ? 'var(--primary-600)' : 'var(--slate-200)',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Status Filters & Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--slate-100)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>Status:</span>
            {['ALL', 'SUBMITTED', 'UNDER_VERIFICATION', 'SITE_INSPECTION_SCHEDULED', 'APPROVED', 'COMPLETED', 'REJECTED'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                style={{
                  background: filterStatus === st ? 'var(--slate-800)' : 'none',
                  color: filterStatus === st ? '#ffffff' : 'var(--slate-600)',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.2rem 0.5rem',
                  fontSize: '0.725rem',
                  cursor: 'pointer',
                  fontWeight: filterStatus === st ? 700 : 500,
                }}
              >
                {st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', minWidth: '220px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search by ID, survey, ward..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '30px', fontSize: '0.8rem', height: '32px' }}
            />
          </div>
        </div>
      </div>

      {/* Requests Table Card */}
      <div className="card">
        {filteredRequests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <Zap size={44} style={{ color: 'var(--slate-300)', margin: '0 auto 0.75rem' }} />
            <h4 style={{ color: 'var(--slate-700)', marginBottom: '0.25rem' }}>No Service Requests Found</h4>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem' }}>
              No utility connection applications match the selected filter criteria.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Citizen Applicant</th>
                  <th>Service Type</th>
                  <th>Specification</th>
                  <th>Location & Ward</th>
                  <th>Survey No</th>
                  <th>Site Proof</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => {
                  const typeMeta = SERVICE_TYPE_ICONS[req.serviceType] || SERVICE_TYPE_ICONS.EB_CONNECTION;
                  const Icon = typeMeta.icon;
                  const hasCoords = req.latitude !== null && req.latitude !== undefined && req.longitude !== null && req.longitude !== undefined;
                  const googleMapsUrl = hasCoords ? `https://www.google.com/maps?q=${req.latitude},${req.longitude}` : null;

                  return (
                    <tr key={req.id}>
                      <td><strong>{req.requestId}</strong></td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--slate-900)', fontSize: '0.875rem' }}>
                          {req.citizenName || 'Citizen'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                          {req.citizenPhone || req.citizenEmail || ''}
                        </div>
                      </td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            backgroundColor: typeMeta.bgColor,
                            color: typeMeta.color,
                            border: `1px solid ${typeMeta.color}40`,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontWeight: 700,
                          }}
                        >
                          <Icon size={12} /> {typeMeta.label}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.825rem', color: 'var(--slate-800)', fontWeight: 500 }}>
                        {req.subCategory}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.825rem', color: 'var(--slate-700)' }}>
                          <MapPin size={13} style={{ color: '#ef4444', flexShrink: 0 }} />
                          <span style={{ maxWidth: '170px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {req.propertyAddress}
                          </span>
                        </div>
                        {hasCoords && (
                          <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: '0.725rem', color: 'var(--primary-600)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.15rem' }}
                          >
                            View Pin <ExternalLink size={11} />
                          </a>
                        )}
                      </td>
                      <td style={{ fontSize: '0.825rem', color: 'var(--slate-600)' }}>
                        {req.surveyNumber || <span style={{ color: 'var(--slate-400)', fontStyle: 'italic' }}>N/A</span>}
                      </td>
                      <td>
                        {req.documentUrl ? (
                          <div
                            onClick={() => setLightboxImage(req.documentUrl)}
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '6px',
                              overflow: 'hidden',
                              cursor: 'pointer',
                              border: '1px solid var(--slate-300)',
                            }}
                            title="Click to view site proof"
                          >
                            <img src={req.documentUrl} alt="Site proof" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        ) : (
                          <span style={{ color: 'var(--slate-400)', fontSize: '0.775rem', fontStyle: 'italic' }}>None</span>
                        )}
                      </td>
                      <td><StatusBadge status={req.status} /></td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', whiteSpace: 'nowrap' }}
                          onClick={() => handleOpenReview(req)}
                        >
                          <Eye size={13} /> Process & Inspect
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

      {/* Process & Inspect Modal */}
      {selectedReq && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={`Process Utility Service: ${selectedReq.requestId}`}
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
                <strong style={{ color: 'var(--slate-900)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.15rem' }}>
                  <User size={14} className="text-primary-600" /> {selectedReq.citizenName || 'Citizen Applicant'}
                </strong>
              </div>

              <div>
                <span style={{ color: 'var(--slate-500)', display: 'block', fontSize: '0.75rem' }}>Contact Info</span>
                <span style={{ color: 'var(--slate-800)', display: 'block', marginTop: '0.15rem' }}>
                  {selectedReq.citizenPhone || 'No phone'} {selectedReq.citizenEmail ? `• ${selectedReq.citizenEmail}` : ''}
                </span>
              </div>

              <div>
                <span style={{ color: 'var(--slate-500)', display: 'block', fontSize: '0.75rem' }}>Requested Service</span>
                <span style={{ fontWeight: 700, color: 'var(--primary-700)', display: 'block', marginTop: '0.15rem' }}>
                  {selectedReq.serviceTypeName || selectedReq.serviceType}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--slate-600)' }}>{selectedReq.subCategory}</span>
              </div>

              <div>
                <span style={{ color: 'var(--slate-500)', display: 'block', fontSize: '0.75rem' }}>Current Status</span>
                <div style={{ marginTop: '0.2rem' }}>
                  <StatusBadge status={selectedReq.status} />
                </div>
              </div>
            </div>

            {/* Description & Technical Requirements */}
            {selectedReq.description && (
              <div style={{ marginBottom: '1.25rem' }}>
                <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                  Applicant Notes & Requirements
                </h5>
                <p style={{ color: 'var(--slate-700)', fontSize: '0.875rem', lineHeight: 1.5, background: '#ffffff', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--slate-200)', margin: 0 }}>
                  {selectedReq.description}
                </p>
              </div>
            )}

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
                  <MapPin size={16} style={{ color: '#ef4444' }} /> Property Location & GPS Survey Pin
                </h5>

                {selectedReq.latitude !== null && selectedReq.longitude !== null && (
                  <a
                    href={`https://www.google.com/maps?q=${selectedReq.latitude},${selectedReq.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.775rem', padding: '0.25rem 0.65rem' }}
                  >
                    <ExternalLink size={12} /> Open in Google Maps
                  </a>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', fontSize: '0.875rem', color: '#14532d', marginBottom: '0.35rem' }}>
                <div><strong>Address:</strong> {selectedReq.propertyAddress}</div>
                <div><strong>Ward / Area:</strong> {selectedReq.wardNumber || 'Village Center'}</div>
                <div><strong>Survey / Patta No:</strong> {selectedReq.surveyNumber || 'Unspecified'}</div>
              </div>

              {selectedReq.latitude !== null && selectedReq.longitude !== null ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: '#166534', background: '#dcfce7', padding: '0.4rem 0.75rem', borderRadius: '6px', marginTop: '0.4rem' }}>
                  <span><strong>Latitude:</strong> {selectedReq.latitude}° N</span>
                  <span><strong>Longitude:</strong> {selectedReq.longitude}° E</span>
                  <span style={{ opacity: 0.75 }}>• Pinned via GPS</span>
                </div>
              ) : (
                <div style={{ fontSize: '0.775rem', color: 'var(--slate-500)', fontStyle: 'italic', marginTop: '0.25rem' }}>
                  No GPS coordinates attached.
                </div>
              )}
            </div>

            {/* Attached Site Document / Photo */}
            {selectedReq.documentUrl && (
              <div style={{ background: 'var(--slate-50)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--slate-200)', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-800)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <FileText size={15} style={{ color: 'var(--primary-600)' }} /> Site Verification Photo / Assessment Document
                  </h5>

                  <button
                    type="button"
                    onClick={() => setLightboxImage(selectedReq.documentUrl)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                  >
                    <Eye size={12} /> Inspect Full Screen
                  </button>
                </div>

                <div
                  style={{
                    maxHeight: '220px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    backgroundColor: '#0f172a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() => setLightboxImage(selectedReq.documentUrl)}
                >
                  <img src={selectedReq.documentUrl} alt="Site document" style={{ maxWidth: '100%', maxHeight: '220px', objectFit: 'contain' }} />
                </div>
              </div>
            )}

            {/* Administrative Action Form */}
            <form onSubmit={handleReviewSubmit} style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--slate-200)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h5 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <UserCheck size={18} className="text-primary-600" /> Workflow Progress & Technical Assignment
                </h5>
                <span className="badge badge-info" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                  Active Stage: {status.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Quick One-Click Lifecycle Stage Selector Buttons */}
              <div style={{ background: 'var(--slate-50)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--slate-200)', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-600)', display: 'block', marginBottom: '0.4rem' }}>
                  Advance Progress Stage (Click to select & auto-populate):
                </span>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => selectStage('UNDER_VERIFICATION', 'Land survey and property ownership records verified with Revenue department.')}
                    className="btn btn-sm"
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.35rem 0.6rem',
                      backgroundColor: status === 'UNDER_VERIFICATION' ? '#0284c7' : '#ffffff',
                      color: status === 'UNDER_VERIFICATION' ? '#ffffff' : 'var(--slate-700)',
                      border: status === 'UNDER_VERIFICATION' ? '1px solid #0369a1' : '1px solid var(--slate-300)',
                      fontWeight: status === 'UNDER_VERIFICATION' ? 700 : 500,
                    }}
                  >
                    1. Document Scrutiny
                  </button>

                  <button
                    type="button"
                    onClick={() => selectStage('SITE_INSPECTION_SCHEDULED', 'Field inspection scheduled by Assistant Engineer / Junior Lineman.')}
                    className="btn btn-sm"
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.35rem 0.6rem',
                      backgroundColor: status === 'SITE_INSPECTION_SCHEDULED' ? '#0d9488' : '#ffffff',
                      color: status === 'SITE_INSPECTION_SCHEDULED' ? '#ffffff' : 'var(--slate-700)',
                      border: status === 'SITE_INSPECTION_SCHEDULED' ? '1px solid #0f766e' : '1px solid var(--slate-300)',
                      fontWeight: status === 'SITE_INSPECTION_SCHEDULED' ? 700 : 500,
                    }}
                  >
                    2. Assign Inspection
                  </button>

                  <button
                    type="button"
                    onClick={() => selectStage('APPROVED', 'Technical feasibility approved. Connection sanctioned and work order released.')}
                    className="btn btn-sm"
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.35rem 0.6rem',
                      backgroundColor: status === 'APPROVED' ? '#16a34a' : '#ffffff',
                      color: status === 'APPROVED' ? '#ffffff' : 'var(--slate-700)',
                      border: status === 'APPROVED' ? '1px solid #15803d' : '1px solid var(--slate-300)',
                      fontWeight: status === 'APPROVED' ? 700 : 500,
                    }}
                  >
                    3. Sanction & Approve
                  </button>

                  <button
                    type="button"
                    onClick={() => selectStage('WORK_IN_PROGRESS', 'Field linemen initiated line cable pulling / pipeline valve connection work.')}
                    className="btn btn-sm"
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.35rem 0.6rem',
                      backgroundColor: status === 'WORK_IN_PROGRESS' ? '#d97706' : '#ffffff',
                      color: status === 'WORK_IN_PROGRESS' ? '#ffffff' : 'var(--slate-700)',
                      border: status === 'WORK_IN_PROGRESS' ? '1px solid #b45309' : '1px solid var(--slate-300)',
                      fontWeight: status === 'WORK_IN_PROGRESS' ? 700 : 500,
                    }}
                  >
                    4. Work In Progress
                  </button>

                  <button
                    type="button"
                    onClick={() => selectStage('COMPLETED', 'Connection completed, meter energized, and water/power supply officially active.')}
                    className="btn btn-sm"
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.35rem 0.6rem',
                      backgroundColor: status === 'COMPLETED' ? '#2563eb' : '#ffffff',
                      color: status === 'COMPLETED' ? '#ffffff' : 'var(--slate-700)',
                      border: status === 'COMPLETED' ? '1px solid #1d4ed8' : '1px solid var(--slate-300)',
                      fontWeight: status === 'COMPLETED' ? 700 : 500,
                    }}
                  >
                    5. Mark Connected & Active
                  </button>

                  <button
                    type="button"
                    onClick={() => selectStage('REJECTED', 'Application rejected due to infeasible line distance or invalid property deeds.')}
                    className="btn btn-sm"
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.35rem 0.6rem',
                      backgroundColor: status === 'REJECTED' ? '#dc2626' : '#ffffff',
                      color: status === 'REJECTED' ? '#ffffff' : '#dc2626',
                      border: '1px solid #f87171',
                      fontWeight: status === 'REJECTED' ? 700 : 500,
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: 700 }}>Current Status</label>
                  <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="UNDER_VERIFICATION">1. UNDER VERIFICATION (Document Scrutiny)</option>
                    <option value="SITE_INSPECTION_SCHEDULED">2. SITE INSPECTION SCHEDULED</option>
                    <option value="APPROVED">3. APPROVED (Connection Sanctioned)</option>
                    <option value="WORK_IN_PROGRESS">4. WORK IN PROGRESS (Cable/Pipe Laying)</option>
                    <option value="COMPLETED">5. COMPLETED (Meter Installed & Energized/Connected)</option>
                    <option value="REJECTED">REJECTED (Infeasible / Documentation Incomplete)</option>
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: 700 }}>Scheduled Inspection Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={inspectionDate}
                    onChange={(e) => setInspectionDate(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Assigned Lineman / Junior Engineer</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Er. K. Sivakumar, TNEB JE (9443210987)"
                    value={assignedStaff}
                    onChange={(e) => setAssignedStaff(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Sanction / Meter Reference Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. EB-MTR-884210 or WTR-CON-9921"
                    value={connectionReferenceNo}
                    onChange={(e) => setConnectionReferenceNo(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Officer Remarks / Feasibility Notes</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Enter feasibility report, pole distance remarks, estimated connection charges, or schedule details..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Updating...' : 'Save Resolution & Assignment'}
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
        title="Site Verification Photo / Assessment Document"
      />
    </div>
  );
};
