import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { applicationService } from '../../services/applicationService';
import { schemeService } from '../../services/schemeService';
import { certificateService } from '../../services/certificateService';
import { grievanceService } from '../../services/grievanceService';
import { serviceRequestService } from '../../services/serviceRequestService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Award, FileText, FileCheck, MessageSquare, ArrowRight, UserCheck, MapPin, Zap } from 'lucide-react';

export const CitizenDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [grievances, setGrievances] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, schemesRes, certsRes, grvRes, srvRes] = await Promise.allSettled([
          applicationService.getMyApplications(),
          schemeService.getRecommendedSchemes(),
          certificateService.getMyRequests(),
          grievanceService.getMyGrievances(),
          serviceRequestService.getMyRequests(),
        ]);

        if (appsRes.status === 'fulfilled') setApplications(appsRes.value);
        if (schemesRes.status === 'fulfilled') setSchemes(schemesRes.value);
        if (certsRes.status === 'fulfilled') setCertificates(certsRes.value);
        if (grvRes.status === 'fulfilled') setGrievances(grvRes.value);
        if (srvRes.status === 'fulfilled') setServiceRequests(srvRes.value);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="card">Loading Dashboard Data...</div>;
  }

  return (
    <div>
      {/* Welcome Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary-700), var(--primary-800))', color: '#ffffff', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Welcome back, {user?.fullName}!</h2>
        <p style={{ opacity: 0.9, marginTop: '0.25rem', fontSize: '0.9rem' }}>
          Village: <strong>{user?.village || 'Keeranur'}</strong> | Registered Citizen ID: <strong>{user?.email}</strong>
        </p>
      </div>

      {/* Summary Stat Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <div className="stat-label">Active Applications</div>
            <div className="stat-value">{applications.length}</div>
          </div>
          <FileText size={32} className="text-primary-600" />
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Certificate Requests</div>
            <div className="stat-value">{certificates.length}</div>
          </div>
          <FileCheck size={32} style={{ color: 'var(--success-text)' }} />
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Open Grievances</div>
            <div className="stat-value">{grievances.length}</div>
          </div>
          <MessageSquare size={32} style={{ color: 'var(--warning-text)' }} />
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Available Schemes</div>
            <div className="stat-value">{schemes.length}</div>
          </div>
          <Award size={32} style={{ color: 'var(--info-text)' }} />
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Service Requests</div>
            <div className="stat-value">{serviceRequests.length}</div>
          </div>
          <Zap size={32} style={{ color: '#eab308' }} />
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Active Applications Preview */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 className="card-title" style={{ margin: 0 }}>My Recent Applications</h3>
            <Link to="/citizen/applications" className="btn btn-secondary btn-sm">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {applications.length === 0 ? (
            <p style={{ color: 'var(--slate-500)', fontStyle: 'italic' }}>No applications submitted yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>App ID</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.slice(0, 4).map((app) => (
                    <tr key={app.id}>
                      <td>
                        <Link to={`/citizen/applications/${app.id}`} style={{ fontWeight: 600 }}>
                          {app.applicationId}
                        </Link>
                      </td>
                      <td>{app.applicationDate}</td>
                      <td>
                        <StatusBadge status={app.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recommended Welfare Schemes Preview */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 className="card-title" style={{ margin: 0 }}>Top Recommended Schemes for You</h3>
            <Link to="/citizen/schemes" className="btn btn-primary btn-sm">
              Explore All <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[...schemes]
              .sort((a, b) => (b.eligible !== false ? 1 : 0) - (a.eligible !== false ? 1 : 0))
              .slice(0, 3)
              .map((scheme) => {
                const isEligible = scheme.eligible !== false;
                return (
                  <div key={scheme.id} style={{ border: '1px solid var(--slate-200)', borderRadius: '8px', padding: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.925rem' }}>{scheme.name}</div>
                      {isEligible ? (
                        <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                          {scheme.matchScore ? `${scheme.matchScore}% Match` : 'Eligible'}
                        </span>
                      ) : (
                        <span className="badge badge-danger" style={{ fontSize: '0.75rem' }}>
                          Not Eligible
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--slate-600)', margin: '0.25rem 0' }}>{scheme.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                      <span style={{ fontSize: '0.775rem', color: 'var(--primary-700)', fontWeight: 600 }}>
                        Income Limit: ₹{scheme.incomeLimit ? Number(scheme.incomeLimit).toLocaleString('en-IN') : 'N/A'}
                      </span>
                      {isEligible ? (
                        <Link to={`/citizen/apply/${scheme.schemeId}`} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          Apply Now <ArrowRight size={13} />
                        </Link>
                      ) : (
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <button
                            disabled
                            className="btn btn-secondary btn-sm"
                            style={{ opacity: 0.65, cursor: 'not-allowed', color: 'var(--slate-500)', fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}
                          >
                            Ineligible
                          </button>
                          <Link
                            to={`/citizen/schemes/${scheme.schemeId}`}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}
                          >
                            Guidelines
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Recent Civic Grievances Section */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 className="card-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MessageSquare size={18} style={{ color: 'var(--primary-600)' }} /> Recent Civic Grievances & Location Reports
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--slate-500)', margin: '0.2rem 0 0' }}>
              Complaints submitted with GPS coordinates and photographic evidence.
            </p>
          </div>
          <Link to="/citizen/grievances" className="btn btn-secondary btn-sm">
            View All Grievances <ArrowRight size={14} />
          </Link>
        </div>

        {grievances.length === 0 ? (
          <p style={{ color: 'var(--slate-500)', fontStyle: 'italic' }}>No complaints filed yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Category</th>
                  <th>Subject</th>
                  <th>Location</th>
                  <th>Evidence</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {grievances.slice(0, 3).map((g) => (
                  <tr key={g.id}>
                    <td><strong>{g.grievanceId}</strong></td>
                    <td><span className="badge badge-info">{g.category}</span></td>
                    <td style={{ fontWeight: 600 }}>{g.subject}</td>
                    <td>
                      {g.location ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.825rem' }}>
                          <MapPin size={13} style={{ color: '#ef4444' }} /> {g.location}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--slate-400)', fontSize: '0.8rem' }}>Unspecified</span>
                      )}
                    </td>
                    <td>
                      {g.imageUrl ? (
                        <span className="badge badge-success" style={{ fontSize: '0.725rem' }}>📷 Attached</span>
                      ) : (
                        <span style={{ color: 'var(--slate-400)', fontSize: '0.75rem' }}>None</span>
                      )}
                    </td>
                    <td><StatusBadge status={g.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Utility Service Requests Section (EB, Water, etc.) */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 className="card-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Zap size={18} style={{ color: '#eab308' }} /> Utility Service Requests (EB, Water, Drainage)
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--slate-500)', margin: '0.2rem 0 0' }}>
              New electricity meter connections, drinking water pipelines, and municipal civic utility requests.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/citizen/service-requests" className="btn btn-primary btn-sm">
              Request Connection <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {serviceRequests.length === 0 ? (
          <p style={{ color: 'var(--slate-500)', fontStyle: 'italic' }}>
            No utility service requests created yet. Apply for a new EB or Water connection anytime.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Service Type</th>
                  <th>Property Address / Survey No</th>
                  <th>Applied On</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {serviceRequests.slice(0, 3).map((req) => (
                  <tr key={req.id}>
                    <td>
                      <Link to="/citizen/service-requests" style={{ fontWeight: 700, color: 'var(--primary-700)' }}>
                        {req.requestId}
                      </Link>
                    </td>
                    <td>
                      <span className="badge badge-info" style={{ fontWeight: 600 }}>
                        {req.serviceType?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>{req.propertyAddress}</div>
                      {req.surveyNumber && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Survey: {req.surveyNumber}</div>
                      )}
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{req.createdAt?.substring(0, 10) || 'Recently'}</td>
                    <td>
                      <StatusBadge status={req.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
