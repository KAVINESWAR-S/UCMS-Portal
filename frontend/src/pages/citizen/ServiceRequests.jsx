import React, { useEffect, useState, useRef } from 'react';
import { serviceRequestService } from '../../services/serviceRequestService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { ImageLightbox } from '../../components/common/ImageLightbox';
import { compressImage, formatFileSize } from '../../utils/imageUtils';
import {
  Zap,
  Droplet,
  Waves,
  Lightbulb,
  Sun,
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
  Calendar,
  UserCheck,
  FileText,
  Clock,
  Layers,
} from 'lucide-react';

const SERVICE_TYPES = [
  {
    type: 'EB_CONNECTION',
    label: 'Electricity Board (EB) Connection',
    icon: Zap,
    color: '#eab308',
    bgColor: '#fefce8',
    description: 'Apply for new domestic, agricultural, or commercial power meter connection.',
    subCategories: [
      'Domestic Single-Phase (Up to 5 kW)',
      'Domestic Three-Phase (Above 5 kW)',
      'Agricultural Free Electricity (3-Phase 7.5HP)',
      'Commercial / Shop Enterprise Meter',
      'Load Extension / Meter Replacement',
    ],
  },
  {
    type: 'WATER_CONNECTION',
    label: 'Drinking Water Pipeline Connection',
    icon: Droplet,
    color: '#0284c7',
    bgColor: '#f0f9ff',
    description: 'Piped drinking water distribution line connection for household or farm.',
    subCategories: [
      'Household Piped Tap (0.5 inch)',
      'Residential Sump Feeder (0.75 inch)',
      'Agricultural / Dairy Water Line',
      'Pipeline Relocation / Meter Replacement',
    ],
  },
  {
    type: 'DRAINAGE_SEWAGE',
    label: 'Underground Drainage / Sewage',
    icon: Waves,
    color: '#0d9488',
    bgColor: '#f0fdfa',
    description: 'Connect property outlet to the panchayat underground drainage network.',
    subCategories: [
      'Residential Sewage Line Connection',
      'Stormwater Drain Outflow',
      'Soak Pit / Septic Tank Overflow Outflow',
    ],
  },
  {
    type: 'STREET_LIGHT',
    label: 'Street Light Installation / Repair',
    icon: Lightbulb,
    color: '#f59e0b',
    bgColor: '#fffbeb',
    description: 'Request new street light pole or LED lamp replacement in your lane.',
    subCategories: [
      'New Street Light Pole Installation',
      'LED Fixture Replacement',
      'Solar Street Light Maintenance',
    ],
  },
  {
    type: 'SOLAR_ROOFTOP',
    label: 'Rooftop Solar Grid Net-Metering',
    icon: Sun,
    color: '#ea580c',
    bgColor: '#fff7ed',
    description: 'Net-metering connection for rural rooftop solar energy generation.',
    subCategories: [
      'Residential Rooftop (1 kW - 3 kW)',
      'Agricultural Solar Pump Feeder',
      'Micro-Enterprise Commercial Solar Grid',
    ],
  },
];

export const ServiceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  // Form states
  const [serviceType, setServiceType] = useState('EB_CONNECTION');
  const [subCategory, setSubCategory] = useState('Domestic Single-Phase (Up to 5 kW)');
  const [title, setTitle] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [wardNumber, setWardNumber] = useState('Ward 1');
  const [surveyNumber, setSurveyNumber] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [description, setDescription] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [documentType, setDocumentType] = useState('Property Tax Receipt / Site Photo');
  const [documentFileName, setDocumentFileName] = useState('');
  const [documentFileSize, setDocumentFileSize] = useState(0);

  // Geo & helper states
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoStatus, setGeoStatus] = useState(null);
  const [showManualCoords, setShowManualCoords] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const fetchRequests = async () => {
    try {
      const data = await serviceRequestService.getMyRequests();
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

  const handleSelectServiceType = (typeKey) => {
    setServiceType(typeKey);
    const selected = SERVICE_TYPES.find((s) => s.type === typeKey);
    if (selected && selected.subCategories.length > 0) {
      setSubCategory(selected.subCategories[0]);
    }
  };

  const resetForm = () => {
    setServiceType('EB_CONNECTION');
    setSubCategory('Domestic Single-Phase (Up to 5 kW)');
    setTitle('');
    setPropertyAddress('');
    setWardNumber('Ward 1');
    setSurveyNumber('');
    setLatitude('');
    setLongitude('');
    setDescription('');
    setDocumentUrl('');
    setDocumentFileName('');
    setDocumentFileSize(0);
    setGeoStatus(null);
    setShowManualCoords(false);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleOpenModal = () => {
    resetForm();
    setModalOpen(true);
  };

  // Browser Geolocation
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

        if (!propertyAddress) {
          setPropertyAddress(`Site Location (${lat}, ${lng}), ${wardNumber}`);
        }
      },
      (err) => {
        setGeoLoading(false);
        let msg = 'Could not acquire GPS coordinates automatically.';
        if (err.code === 1) msg = 'Location access denied. Please type your street / door address.';
        setGeoStatus({ type: 'error', message: msg });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Site Photo Upload
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please attach a valid image or photo file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    try {
      setDocumentFileName(file.name);
      setDocumentFileSize(file.size);
      const compressed = await compressImage(file, 1280, 1280, 0.82);
      setDocumentUrl(compressed);
      setError('');
    } catch (err) {
      console.error('Image compression error:', err);
      setError('Failed to process image file.');
    }
  };

  const handleRemoveImage = () => {
    setDocumentUrl('');
    setDocumentFileName('');
    setDocumentFileSize(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const activeTypeConfig = SERVICE_TYPES.find((s) => s.type === serviceType);
      const requestTitle = title.trim() || `${activeTypeConfig?.label || serviceType} - ${subCategory}`;

      await serviceRequestService.createRequest({
        serviceType,
        subCategory,
        title: requestTitle,
        propertyAddress: propertyAddress.trim(),
        wardNumber,
        surveyNumber: surveyNumber.trim() || null,
        latitude: latitude !== '' ? parseFloat(latitude) : null,
        longitude: longitude !== '' ? parseFloat(longitude) : null,
        description: description.trim(),
        documentUrl: documentUrl || null,
        documentType,
      });

      setModalOpen(false);
      resetForm();
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit service request.');
    } finally {
      setSubmitting(false);
    }
  };

  const activeTypeObj = SERVICE_TYPES.find((s) => s.type === serviceType) || SERVICE_TYPES[0];

  if (loading) return <div className="card">Loading Service Requests...</div>;

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--slate-900)' }}>Civic Utility Service Requests</h2>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
            Apply for new Electricity (EB) meter connections, drinking water pipelines, drainage connections, and street light installations with GPS location tagging.
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenModal} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Plus size={18} /> New Service Request
        </button>
      </div>

      {/* Service Categories Showcase Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {SERVICE_TYPES.map((st) => {
          const Icon = st.icon;
          return (
            <div
              key={st.type}
              onClick={() => {
                handleSelectServiceType(st.type);
                handleOpenModal();
              }}
              className="card"
              style={{
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                borderLeft: `4px solid ${st.color}`,
                padding: '1rem',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                <div style={{ background: st.bgColor, padding: '0.5rem', borderRadius: '8px', color: st.color }}>
                  <Icon size={20} />
                </div>
                <strong style={{ fontSize: '0.9rem', color: 'var(--slate-900)' }}>{st.label}</strong>
              </div>
              <p style={{ fontSize: '0.775rem', color: 'var(--slate-500)', margin: 0, lineHeight: 1.4 }}>
                {st.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Service Requests Table Card */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 className="card-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Layers size={18} className="text-primary-600" /> My Service Connection Requests ({requests.length})
          </h3>
        </div>

        {requests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <Zap size={44} style={{ color: 'var(--slate-300)', margin: '0 auto 0.75rem' }} />
            <h4 style={{ color: 'var(--slate-700)', marginBottom: '0.25rem' }}>No Service Requests Logged Yet</h4>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem' }}>
              Need an electricity connection, drinking water tap, or street light in your ward? Click "New Service Request" above.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Service Category</th>
                  <th>Sub-Category</th>
                  <th>Property Location</th>
                  <th>Survey No</th>
                  <th>Site Proof</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => {
                  const hasCoords = req.latitude !== null && req.latitude !== undefined && req.longitude !== null && req.longitude !== undefined;
                  const googleMapsUrl = hasCoords ? `https://www.google.com/maps?q=${req.latitude},${req.longitude}` : null;
                  const typeObj = SERVICE_TYPES.find((s) => s.type === req.serviceType) || SERVICE_TYPES[0];
                  const Icon = typeObj.icon;

                  return (
                    <tr key={req.id}>
                      <td><strong>{req.requestId}</strong></td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            backgroundColor: typeObj.bgColor,
                            color: typeObj.color,
                            border: `1px solid ${typeObj.color}40`,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontWeight: 700,
                          }}
                        >
                          <Icon size={12} /> {typeObj.label}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--slate-800)', fontSize: '0.85rem' }}>
                        {req.subCategory}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.825rem', color: 'var(--slate-700)' }}>
                          <MapPin size={13} style={{ color: '#ef4444', flexShrink: 0 }} />
                          <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
                              width: '40px',
                              height: '40px',
                              borderRadius: '6px',
                              overflow: 'hidden',
                              cursor: 'pointer',
                              border: '1px solid var(--slate-300)',
                            }}
                            title="Click to view site document / photo"
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
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.6rem' }}
                          onClick={() => setSelectedRequest(req)}
                        >
                          <Eye size={13} /> View Status
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

      {/* New Service Request Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Apply for Civic Utility Service Connection" maxWidth="750px">
        {error && <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Service Category Selector */}
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 700 }}>Service Category</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem', marginBottom: '0.5rem' }}>
              {SERVICE_TYPES.map((st) => {
                const Icon = st.icon;
                const isSelected = serviceType === st.type;
                return (
                  <button
                    key={st.type}
                    type="button"
                    onClick={() => handleSelectServiceType(st.type)}
                    style={{
                      padding: '0.6rem 0.5rem',
                      borderRadius: '8px',
                      border: isSelected ? `2px solid ${st.color}` : '1px solid var(--slate-200)',
                      backgroundColor: isSelected ? st.bgColor : '#ffffff',
                      color: isSelected ? 'var(--slate-900)' : 'var(--slate-600)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontWeight: isSelected ? 700 : 500,
                      fontSize: '0.75rem',
                      textAlign: 'center',
                    }}
                  >
                    <Icon size={18} style={{ color: st.color }} />
                    {st.label.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub-Category */}
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 700 }}>Connection Specification / Capacity</label>
            <select className="form-control" value={subCategory} onChange={(e) => setSubCategory(e.target.value)}>
              {activeTypeObj.subCategories.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          {/* Title / Short Note */}
          <div className="form-group">
            <label className="form-label">Application Title (Optional)</label>
            <input
              type="text"
              className="form-control"
              placeholder={`e.g. New ${activeTypeObj.label} for residential home`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Location & Property Information */}
          <div style={{ background: 'var(--slate-50)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--slate-200)', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="form-label" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
                <MapPin size={16} style={{ color: '#ef4444' }} /> Property Location & Land Coordinates
              </label>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleGetLocation}
                disabled={geoLoading}
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', padding: '0.25rem 0.65rem' }}
              >
                {geoLoading ? <Loader2 size={14} className="animate-spin" /> : <Navigation size={14} />}
                {geoLoading ? 'Detecting...' : '📍 Use Current GPS Location'}
              </button>
            </div>

            <div className="form-group" style={{ marginBottom: '0.5rem' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Door No, Street Name, Landmark (e.g. Door 14/2, North Car Street)"
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--slate-600)', display: 'block', marginBottom: '0.2rem' }}>Ward / Colony</label>
                <select className="form-control" value={wardNumber} onChange={(e) => setWardNumber(e.target.value)}>
                  <option value="Ward 1">Ward 1 - North Colony</option>
                  <option value="Ward 2">Ward 2 - Anna Nagar</option>
                  <option value="Ward 3">Ward 3 - Mada Street</option>
                  <option value="Ward 4">Ward 4 - Gandhi Nagar</option>
                  <option value="Ward 5">Ward 5 - South Colony</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--slate-600)', display: 'block', marginBottom: '0.2rem' }}>
                  Survey No / Patta No / Plot No (Optional)
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. SF-108/2A"
                  value={surveyNumber}
                  onChange={(e) => setSurveyNumber(e.target.value)}
                />
              </div>
            </div>

            {/* GPS Feedback */}
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
                    Preview Map
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
                {showManualCoords ? '− Hide coordinates' : '+ View/Edit manual GPS coordinates (Latitude & Longitude)'}
              </button>

              {showManualCoords && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--slate-600)', display: 'block', marginBottom: '0.2rem' }}>Latitude</label>
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      placeholder="e.g. 10.7815"
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
                      placeholder="e.g. 78.6932"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Description */}
          <div className="form-group">
            <label className="form-label">Connection Requirements & Nearest Infrastructure Details</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="e.g. Distance to nearest electric pole, water distribution valve location, single or three-phase requirement..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Site Photo / Property Assessment Proof */}
          <div style={{ background: 'var(--slate-50)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--slate-200)', marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              <Camera size={16} style={{ color: 'var(--primary-600)' }} /> Attach Site Photo or Property Proof
            </label>
            <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginBottom: '0.75rem' }}>
              Upload property tax receipt, patta document, or building photo showing the entrance or electric pole.
            </p>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              id="service-document-input"
            />

            {!documentUrl ? (
              <label
                htmlFor="service-document-input"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1.25rem',
                  border: '2px dashed var(--slate-300)',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                }}
              >
                <ImageIcon size={30} style={{ color: 'var(--slate-400)', marginBottom: '0.4rem' }} />
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-700)' }}>
                  Click to select photo or capture document
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '0.15rem' }}>
                  Supports PNG, JPG, JPEG, WEBP
                </span>
              </label>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#ffffff', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--slate-200)' }}>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    border: '1px solid var(--slate-200)',
                    cursor: 'pointer',
                  }}
                  onClick={() => setLightboxImage(documentUrl)}
                  title="Click to preview full document"
                >
                  <img src={documentUrl} alt="Uploaded document" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-800)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {documentFileName || 'site-proof.jpg'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                    {documentFileSize ? formatFileSize(documentFileSize) : 'Optimized'} • Attached
                  </div>
                  <button
                    type="button"
                    onClick={() => setLightboxImage(documentUrl)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary-600)', fontSize: '0.75rem', padding: 0, cursor: 'pointer', marginTop: '0.15rem' }}
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
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting Application...' : 'Submit Service Request'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Status & Inspection Tracking Modal */}
      {selectedRequest && (
        <Modal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          title={`Service Request Tracking: ${selectedRequest.requestId}`}
          maxWidth="750px"
        >
          <div>
            {/* Header Category and Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--slate-200)', paddingBottom: '0.75rem' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                  {selectedRequest.serviceTypeName || selectedRequest.serviceType}
                </h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '0.15rem' }}>
                  {selectedRequest.subCategory} • Applied on {selectedRequest.createdAt ? selectedRequest.createdAt.substring(0, 10) : 'Recent'}
                </div>
              </div>
              <StatusBadge status={selectedRequest.status} />
            </div>

            {/* Lifecycle Timeline Steps */}
            <div style={{ background: 'var(--slate-50)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--slate-200)', marginBottom: '1.25rem' }}>
              <h5 style={{ fontSize: '0.825rem', textTransform: 'uppercase', color: 'var(--slate-500)', letterSpacing: '0.5px', marginBottom: '0.75rem' }}>
                Service Lifecycle Progress
              </h5>

              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', flexWrap: 'wrap', gap: '0.5rem' }}>
                {selectedRequest.status === 'REJECTED' ? (
                  <div style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <AlertCircle size={16} /> Application Infeasible / Rejected by Administrative Officer. Please review officer remarks below.
                  </div>
                ) : (
                  [
                    { step: 'SUBMITTED', label: '1. Submitted' },
                    { step: 'UNDER_VERIFICATION', label: '2. Document Verification' },
                    { step: 'SITE_INSPECTION_SCHEDULED', label: '3. Site Inspection' },
                    { step: 'APPROVED', label: '4. Sanctioned' },
                    { step: 'WORK_IN_PROGRESS', label: '5. Work In Progress' },
                    { step: 'COMPLETED', label: '6. Connected' },
                  ].map((st, idx) => {
                    const statusOrder = ['SUBMITTED', 'UNDER_VERIFICATION', 'SITE_INSPECTION_SCHEDULED', 'APPROVED', 'WORK_IN_PROGRESS', 'COMPLETED'];
                    const currentIndex = statusOrder.indexOf(selectedRequest.status);
                    const isDone = currentIndex >= idx;
                    const isCurrent = selectedRequest.status === st.step;

                    return (
                      <div
                        key={st.step}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          fontSize: '0.75rem',
                          fontWeight: isCurrent ? 700 : 500,
                          color: isDone ? 'var(--primary-700)' : 'var(--slate-400)',
                          minWidth: '85px',
                        }}
                      >
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: isDone ? 'var(--primary-600)' : 'var(--slate-200)',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '0.35rem',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                          }}
                        >
                          {isDone ? '✓' : idx + 1}
                        </div>
                        <span style={{ textAlign: 'center' }}>{st.label}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Property Location & GPS Details Card */}
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid var(--slate-200)', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-700)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={15} style={{ color: '#ef4444' }} /> Property & Site Location Details
                </h5>

                {selectedRequest.latitude !== null && selectedRequest.longitude !== null && (
                  <a
                    href={`https://www.google.com/maps?q=${selectedRequest.latitude},${selectedRequest.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.5rem' }}
                  >
                    <ExternalLink size={12} /> Open in Google Maps
                  </a>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', fontSize: '0.875rem' }}>
                <div><strong>Address:</strong> {selectedRequest.propertyAddress}</div>
                <div><strong>Ward:</strong> {selectedRequest.wardNumber || 'Village Center'}</div>
                <div><strong>Survey Number:</strong> {selectedRequest.surveyNumber || 'Not specified'}</div>
                {selectedRequest.latitude && selectedRequest.longitude && (
                  <div><strong>GPS Coordinates:</strong> {selectedRequest.latitude}°, {selectedRequest.longitude}°</div>
                )}
              </div>
            </div>

            {/* Inspection & Officer Notes */}
            <div style={{ background: 'var(--info-bg)', padding: '1rem', borderRadius: '8px', border: '1px solid #bae6fd', marginBottom: '1.25rem' }}>
              <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--info-text)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <UserCheck size={16} /> Field Inspection & Work Order Updates
              </h5>

              <div style={{ fontSize: '0.875rem', color: 'var(--slate-800)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div>
                  <strong>Assigned Staff / Lineman:</strong><br />
                  {selectedRequest.assignedStaff || <span style={{ color: 'var(--slate-500)', fontStyle: 'italic' }}>Pending Staff Assignment</span>}
                </div>
                <div>
                  <strong>Scheduled Inspection Date:</strong><br />
                  {selectedRequest.inspectionDate || <span style={{ color: 'var(--slate-500)', fontStyle: 'italic' }}>Will be scheduled by Junior Engineer</span>}
                </div>
              </div>

              {selectedRequest.connectionReferenceNo && (
                <div style={{ background: '#ffffff', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #bae6fd', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                  <strong>Sanctioned Connection / Meter Reference No:</strong>{' '}
                  <span style={{ color: 'var(--primary-700)', fontWeight: 700 }}>{selectedRequest.connectionReferenceNo}</span>
                </div>
              )}

              <div>
                <strong>Officer Remarks:</strong>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--slate-700)', fontStyle: selectedRequest.officerRemarks ? 'normal' : 'italic' }}>
                  {selectedRequest.officerRemarks || 'Your service connection request is undergoing administrative feasibility review.'}
                </p>
              </div>
            </div>

            {/* Attached Site Photo */}
            {selectedRequest.documentUrl && (
              <div style={{ background: 'var(--slate-50)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--slate-200)', marginBottom: '1rem' }}>
                <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ImageIcon size={15} style={{ color: 'var(--primary-600)' }} /> Attached Site Photo / Property Assessment
                </h5>
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
                  onClick={() => setLightboxImage(selectedRequest.documentUrl)}
                >
                  <img src={selectedRequest.documentUrl} alt="Site proof" style={{ maxWidth: '100%', maxHeight: '220px', objectFit: 'contain' }} />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedRequest(null)}>Close</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Lightbox Modal */}
      <ImageLightbox
        isOpen={!!lightboxImage}
        onClose={() => setLightboxImage(null)}
        imageUrl={lightboxImage}
        title="Site Photo / Property Assessment Proof"
      />
    </div>
  );
};
