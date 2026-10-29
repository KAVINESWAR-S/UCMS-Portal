import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import {
  Users,
  Search,
  Building2,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  FileText,
  MessageSquare,
  Award,
  X,
  Shield,
  Eye,
} from 'lucide-react';

export const CitizenManagement = () => {
  const [citizens, setCitizens] = useState([]);
  const [villages, setVillages] = useState([]);
  const [selectedVillage, setSelectedVillage] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Citizen Detail Modal
  const [selectedCitizenDossier, setSelectedCitizenDossier] = useState(null);
  const [dossierLoading, setDossierLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [citizensRes, villagesRes] = await Promise.all([
        adminService.getCitizens(selectedVillage, searchTerm),
        adminService.getVillages(),
      ]);
      setCitizens(citizensRes);
      setVillages(villagesRes);
    } catch (err) {
      setError('Failed to load citizen records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedVillage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleViewCitizen = async (id) => {
    setDossierLoading(true);
    try {
      const detail = await adminService.getCitizenDetail(id);
      setSelectedCitizenDossier(detail);
    } catch (err) {
      console.error('Failed to load citizen dossier:', err);
    } finally {
      setDossierLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Unified Citizen Registry
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.25rem 0 0' }}>
            Multi-village citizen directory with masked Aadhaar protection and cross-panchayat records.
          </p>
        </div>

        {/* Filter Bar */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <select
            value={selectedVillage}
            onChange={(e) => setSelectedVillage(e.target.value)}
            style={{
              padding: '0.55rem 0.85rem',
              borderRadius: '8px',
              border: '1.5px solid #cbd5e1',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#334155',
              background: '#ffffff',
            }}
          >
            <option value="all">All Panchayats</option>
            {villages.map((v) => (
              <option key={v.name} value={v.name}>{v.name}</option>
            ))}
          </select>

          <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '280px' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem 0.55rem 2.2rem',
                border: '1.5px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </form>

          <button
            onClick={loadData}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#ffffff',
              border: '1.5px solid #cbd5e1',
              borderRadius: '8px',
              padding: '0.55rem 0.9rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              color: '#334155',
            }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: '0.85rem 1rem', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', color: '#991b1b', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      {/* Citizens Table */}
      <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>
            Showing {citizens.length} registered citizens
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', background: '#f8fafc' }}>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Citizen Profile</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Masked Aadhaar</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Village Jurisdiction</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Occupation & Income</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {citizens.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                        {c.fullName ? c.fullName.substring(0, 2).toUpperCase() : 'CT'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{c.fullName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{c.email} | {c.phoneNumber || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#475569', background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.825rem' }}>
                      {c.aadhaarNumber || 'XXXXXXXX9999'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.6rem', borderRadius: '6px', background: '#f1f5f9', fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                      <Building2 size={12} color="#4338ca" />
                      {c.village || 'Sathyamangalam'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.825rem', color: '#475569' }}>
                    <div>{c.occupation || 'Farmer'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {c.annualIncome ? `₹${Number(c.annualIncome).toLocaleString('en-IN')}/yr` : '—'}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => handleViewCitizen(c.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        background: '#e0e7ff',
                        color: '#3730a3',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.4rem 0.75rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <Eye size={13} /> View Dossier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Citizen Dossier Modal */}
      {selectedCitizenDossier && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '700px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={22} color="#4338ca" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                  Citizen Dossier: {selectedCitizenDossier.citizen.fullName}
                </h3>
              </div>
              <button onClick={() => setSelectedCitizenDossier(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>

            {/* Profile Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', background: '#f8fafc', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
              <div><strong>Village:</strong> {selectedCitizenDossier.citizen.village}</div>
              <div><strong>Aadhaar:</strong> {selectedCitizenDossier.citizen.aadhaarNumber}</div>
              <div><strong>Email:</strong> {selectedCitizenDossier.citizen.email}</div>
              <div><strong>Phone:</strong> {selectedCitizenDossier.citizen.phoneNumber || 'N/A'}</div>
              <div><strong>Occupation:</strong> {selectedCitizenDossier.citizen.occupation || 'N/A'}</div>
              <div><strong>Farmer Status:</strong> {selectedCitizenDossier.citizen.farmerStatus ? 'Yes' : 'No'}</div>
            </div>

            {/* Applications List */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FileText size={16} color="#4338ca" /> Scheme Applications ({selectedCitizenDossier.applications?.length || 0})
              </h4>
              {selectedCitizenDossier.applications?.length === 0 ? (
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>No applications on record.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {selectedCitizenDossier.applications.map((app) => (
                    <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.825rem' }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>{app.schemeName || app.applicationId}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>App Date: {app.applicationDate}</div>
                      </div>
                      <span style={{ padding: '0.2rem 0.5rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700, background: app.status === 'APPROVED' ? '#ecfdf5' : '#fef3c7', color: app.status === 'APPROVED' ? '#065f46' : '#92400e', alignSelf: 'center' }}>
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Grievances */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MessageSquare size={16} color="#ea580c" /> Grievances ({selectedCitizenDossier.grievances?.length || 0})
              </h4>
              {selectedCitizenDossier.grievances?.length === 0 ? (
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>No grievances submitted.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {selectedCitizenDossier.grievances.map((g) => (
                    <div key={g.id} style={{ padding: '0.65rem 0.85rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.825rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                        <span>{g.subject}</span>
                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{g.status}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>{g.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
