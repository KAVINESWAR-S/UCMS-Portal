import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import {
  Building2,
  Users,
  FileText,
  Wallet,
  Hammer,
  ShieldCheck,
  Search,
  RefreshCw,
  X,
  History,
  Phone,
  Mail,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export const VillageManagement = () => {
  const [villages, setVillages] = useState([]);
  const [selectedVillageDetail, setSelectedVillageDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const loadVillages = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getVillages();
      setVillages(data);

      const target = searchParams.get('selected');
      if (target) {
        handleSelectVillage(target);
      }
    } catch (err) {
      setError('Failed to fetch village data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVillages();
  }, []);

  const handleSelectVillage = async (villageName) => {
    setDetailLoading(true);
    try {
      const detail = await adminService.getVillageDetail(villageName);
      setSelectedVillageDetail(detail);
    } catch (err) {
      console.error('Failed to load village detail:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredVillages = villages.filter((v) =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.officerName && v.officerName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Village Jurisdictions Management
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.25rem 0 0' }}>
            Inspect and control multi-panchayat administrative boundaries, budgets, officers, and civic records.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search panchayat..."
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
          </div>
          <button
            onClick={loadVillages}
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

      {/* Villages Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {filteredVillages.map((v) => {
          const total = v.totalAllocatedBudget || 0;
          const spent = v.totalSpentBudget || 0;
          const remaining = v.remainingBudget || (total - spent);
          const pct = total > 0 ? Math.min(100, Math.round((spent / total) * 100)) : 0;
          const isSelected = selectedVillageDetail?.village === v.name;

          return (
            <div
              key={v.name}
              style={{
                background: '#ffffff',
                borderRadius: '14px',
                border: isSelected ? '2px solid #4338ca' : '1px solid #e2e8f0',
                padding: '1.5rem',
                boxShadow: isSelected ? '0 10px 25px -5px rgba(67, 56, 202, 0.15)' : '0 4px 6px -1px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
              }}
            >
              <div>
                {/* Title & Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Building2 size={22} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        {v.name}
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Erode District Panchayat</span>
                    </div>
                  </div>
                  <span
                    style={{
                      padding: '0.25rem 0.6rem',
                      borderRadius: '9999px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      background: v.officerName ? '#ecfdf5' : '#fee2e2',
                      color: v.officerName ? '#065f46' : '#991b1b',
                    }}
                  >
                    {v.officerName ? 'Officer Assigned' : 'Vacant'}
                  </span>
                </div>

                {/* Officer In Charge Box */}
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #f1f5f9',
                    borderRadius: '8px',
                    padding: '0.85rem',
                    marginBottom: '1rem',
                  }}
                >
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    Assigned Panchayat Officer
                  </div>
                  {v.officerName ? (
                    <div>
                      <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>{v.officerName}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                        <Mail size={12} /> {v.officerEmail}
                      </div>
                      {v.officerPhone && (
                        <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.15rem' }}>
                          <Phone size={12} /> {v.officerPhone}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ color: '#dc2626', fontSize: '0.825rem', fontWeight: 600 }}>No officer currently assigned</span>
                      <button
                        onClick={() => navigate(`/admin/officers?assignVillage=${encodeURIComponent(v.name)}`)}
                        style={{
                          background: '#fee2e2',
                          color: '#991b1b',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '0.3rem 0.6rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Assign Now
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.25rem', textAlign: 'center' }}>
                  <div style={{ background: '#f8fafc', padding: '0.65rem 0.4rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>{v.citizenCount}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Citizens</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '0.65rem 0.4rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>{v.applicationCount}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Applications</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '0.65rem 0.4rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>{v.developmentWorkCount}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Works</div>
                  </div>
                </div>

                {/* Financial Health Progress */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#475569', marginBottom: '0.3rem' }}>
                    <span>Budget Utilized: <strong>{formatCurrency(spent)}</strong></span>
                    <span style={{ fontWeight: 700 }}>{pct}%</span>
                  </div>
                  <div style={{ height: '7px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: pct > 85 ? '#ef4444' : pct > 60 ? '#f59e0b' : '#10b981',
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem' }}>
                    <span>Total: {formatCurrency(total)}</span>
                    <span style={{ color: '#10b981', fontWeight: 600 }}>Rem: {formatCurrency(remaining)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                <button
                  onClick={() => handleSelectVillage(v.name)}
                  style={{
                    flex: 1,
                    padding: '0.6rem',
                    background: isSelected ? '#312e81' : '#e0e7ff',
                    color: isSelected ? '#ffffff' : '#3730a3',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.825rem',
                    cursor: 'pointer',
                  }}
                >
                  {isSelected ? 'Viewing Details' : 'Deep Inspection'}
                </button>
                <button
                  onClick={() => navigate(`/admin/budgets?village=${encodeURIComponent(v.name)}`)}
                  style={{
                    padding: '0.6rem 0.85rem',
                    background: '#f8fafc',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.825rem',
                    cursor: 'pointer',
                  }}
                >
                  Budget
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep Inspection Drawer / Section */}
      {selectedVillageDetail && (
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '2px solid #4338ca',
            padding: '2rem',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.08)',
            marginTop: '1rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ padding: '0.6rem', borderRadius: '10px', background: '#312e81', color: '#ffffff' }}>
                <Building2 size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {selectedVillageDetail.village} — Comprehensive Audit & Records
                </h2>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Complete village scoping inspection: {selectedVillageDetail.citizenCount} citizens, {selectedVillageDetail.applicationCount} applications
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedVillageDetail(null)}
              style={{
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '8px',
                padding: '0.4rem',
                cursor: 'pointer',
                color: '#64748b',
              }}
            >
              <X size={20} />
            </button>
          </div>

          {detailLoading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
              <RefreshCw size={28} className="animate-spin" />
              <div>Loading detailed records...</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Officer Assignment History for this Village */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <History size={18} color="#4338ca" />
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>
                    Officer Assignment History for {selectedVillageDetail.village}
                  </h4>
                </div>
                {(!selectedVillageDetail.assignmentHistory || selectedVillageDetail.assignmentHistory.length === 0) ? (
                  <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', color: '#94a3b8', fontSize: '0.85rem' }}>
                    No assignment records stored yet.
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                          <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#475569' }}>Officer Name</th>
                          <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#475569' }}>Officer Email</th>
                          <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#475569' }}>Status</th>
                          <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#475569' }}>Assigned Date</th>
                          <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#475569' }}>Revoked Date</th>
                          <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#475569' }}>Assigned By</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedVillageDetail.assignmentHistory.map((item) => (
                          <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{item.officerName || 'Officer'}</td>
                            <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>{item.officerEmail}</td>
                            <td style={{ padding: '0.75rem 1rem' }}>
                              <span
                                style={{
                                  padding: '0.2rem 0.5rem',
                                  borderRadius: '9999px',
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  background: item.isActive ? '#ecfdf5' : '#f1f5f9',
                                  color: item.isActive ? '#065f46' : '#64748b',
                                }}
                              >
                                {item.isActive ? 'ACTIVE IN CHARGE' : 'SUPERSEDED / REVOKED'}
                              </span>
                            </td>
                            <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>
                              {item.assignedAt ? new Date(item.assignedAt).toLocaleDateString() : 'N/A'}
                            </td>
                            <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>
                              {item.revokedAt ? new Date(item.revokedAt).toLocaleDateString() : '—'}
                            </td>
                            <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>{item.assignedByAdminEmail || 'System'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Development Works Scoped to Village */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Hammer size={18} color="#ea580c" />
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>
                      Village Development Works ({selectedVillageDetail.works?.length || 0})
                    </h4>
                  </div>
                  <button
                    onClick={() => navigate(`/admin/development-works?village=${encodeURIComponent(selectedVillageDetail.village)}`)}
                    style={{ background: 'none', border: 'none', color: '#4338ca', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Manage Works →
                  </button>
                </div>
                {(!selectedVillageDetail.works || selectedVillageDetail.works.length === 0) ? (
                  <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', color: '#94a3b8', fontSize: '0.85rem' }}>
                    No development works scoped to this village yet.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                    {selectedVillageDetail.works.map((w) => (
                      <div key={w.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', background: '#ffffff' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4338ca' }}>{w.workId}</span>
                          <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: '#f1f5f9', fontWeight: 600 }}>{w.status}</span>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', margin: '0.3rem 0' }}>{w.title}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Category: {w.category} | Spent: {formatCurrency(w.spentAmount)}</div>
                        <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
                          <div style={{ flex: 1, height: '5px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${w.progressPercentage}%`, height: '100%', background: '#4338ca' }} />
                          </div>
                          <span>{w.progressPercentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
