import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import {
  Building2,
  Users,
  FileText,
  AlertTriangle,
  Wallet,
  Hammer,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  RefreshCw,
  Plus,
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [villages, setVillages] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, villagesRes, logsRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getVillages(),
        adminService.getAuditLogs(0, 5),
      ]);
      setStats(statsRes);
      setVillages(villagesRes);
      setAuditLogs(logsRes?.content || []);
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
      setError('Failed to load dashboard metrics. Ensure backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
        <RefreshCw size={36} className="animate-spin" color="#4338ca" />
        <div style={{ color: '#64748b', fontWeight: 600 }}>Loading Central Governance Dashboard...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)',
          borderRadius: '16px',
          padding: '2rem 2.5rem',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 10px 25px -5px rgba(30, 27, 75, 0.4)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(4px)',
                padding: '0.2rem 0.65rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              Unified Citizen Management System
            </span>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Erode District Jurisdiction</span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>
            Multi-Panchayat Governance Console
          </h1>
          <p style={{ margin: '0.4rem 0 0', opacity: 0.85, fontSize: '0.95rem' }}>
            Central administration over Sathyamangalam, Bhavanisagar, and Gobichettipalayam panchayats.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={loadData}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              padding: '0.65rem 1.1rem',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              backdropFilter: 'blur(4px)',
            }}
          >
            <RefreshCw size={16} /> Refresh Metrics
          </button>
          <Link
            to="/admin/officers"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#ffffff',
              color: '#312e81',
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.875rem',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }}
          >
            <Plus size={16} /> Assign Officer
          </Link>
        </div>
      </div>

      {error && (
        <div style={{ padding: '1rem', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', color: '#991b1b', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      {/* Primary KPI Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        {/* Panchayats */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Panchayats Monitored
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.3rem' }}>
                {stats?.totalVillages || villages.length || 3}
              </div>
            </div>
            <div style={{ padding: '0.75rem', borderRadius: '10px', background: '#e0e7ff', color: '#4338ca' }}>
              <Building2 size={24} />
            </div>
          </div>
          <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b' }}>
            <span>Active Officers: <strong>{stats?.activeOfficers || 3}</strong></span>
            <Link to="/admin/villages" style={{ color: '#4338ca', fontWeight: 600, textDecoration: 'none' }}>
              Manage →
            </Link>
          </div>
        </div>

        {/* Total Citizens */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Total Citizens
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.3rem' }}>
                {stats?.totalCitizens ?? 0}
              </div>
            </div>
            <div style={{ padding: '0.75rem', borderRadius: '10px', background: '#ecfdf5', color: '#059669' }}>
              <Users size={24} />
            </div>
          </div>
          <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b' }}>
            <span>Aadhaar-Verified Population</span>
            <Link to="/admin/citizens" style={{ color: '#059669', fontWeight: 600, textDecoration: 'none' }}>
              Directory →
            </Link>
          </div>
        </div>

        {/* Applications */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Scheme Applications
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.3rem' }}>
                {stats?.totalApplications ?? 0}
              </div>
            </div>
            <div style={{ padding: '0.75rem', borderRadius: '10px', background: '#fef3c7', color: '#d97706' }}>
              <FileText size={24} />
            </div>
          </div>
          <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '0.75rem', fontSize: '0.75rem' }}>
            <span style={{ color: '#d97706', fontWeight: 600 }}>{stats?.pendingApplications || 0} Pending</span>
            <span style={{ color: '#059669', fontWeight: 600 }}>{stats?.approvedApplications || 0} Approved</span>
            <span style={{ color: '#dc2626', fontWeight: 600 }}>{stats?.rejectedApplications || 0} Rejected</span>
          </div>
        </div>

        {/* Multi-Village Budget */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Combined Village Allocation
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginTop: '0.3rem' }}>
                {formatCurrency(stats?.totalAllocatedBudget)}
              </div>
            </div>
            <div style={{ padding: '0.75rem', borderRadius: '10px', background: '#f0fdf4', color: '#16a34a' }}>
              <Wallet size={24} />
            </div>
          </div>
          <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b' }}>
            <span>Spent: <strong>{formatCurrency(stats?.totalSpentBudget)}</strong></span>
            <Link to="/admin/budgets" style={{ color: '#16a34a', fontWeight: 600, textDecoration: 'none' }}>
              Budgets →
            </Link>
          </div>
        </div>
      </div>

      {/* Secondary Metric Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          background: '#ffffff',
          padding: '1.25rem 1.5rem',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ padding: '0.6rem', borderRadius: '8px', background: '#fee2e2', color: '#dc2626' }}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>AI Fraud Flags</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#dc2626' }}>
              {stats?.highRiskFraudCount || 0} High Risk
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ padding: '0.6rem', borderRadius: '8px', background: '#eff6ff', color: '#2563eb' }}>
            <Hammer size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Development Works</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              {stats?.totalWorks || 0} Projects Active
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ padding: '0.6rem', borderRadius: '8px', background: '#f5f3ff', color: '#7c3aed' }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Panchayat Officers</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              {stats?.totalOfficers || 0} Registered
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ padding: '0.6rem', borderRadius: '8px', background: '#fef2f2', color: '#b91c1c' }}>
            <Clock size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Grievances Pending</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              {stats?.pendingGrievances || 0} Open Issues
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Village Overview Table */}
      <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.75rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Gram Panchayat Jurisdictions & Status
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.2rem 0 0' }}>
              Comparative overview of citizens, assigned administrative officers, applications, and budget utilization.
            </p>
          </div>
          <Link
            to="/admin/villages"
            style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#4338ca',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            All Villages <ArrowUpRight size={16} />
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', background: '#f8fafc' }}>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Panchayat</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Officer in Charge</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Citizens</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Applications</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Works</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Budget Allocation / Spent</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {villages.map((v) => {
                const total = v.totalAllocatedBudget || 0;
                const spent = v.totalSpentBudget || 0;
                const pct = total > 0 ? Math.min(100, Math.round((spent / total) * 100)) : 0;

                return (
                  <tr key={v.name} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem', fontWeight: 700, color: '#0f172a' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Building2 size={18} color="#4338ca" />
                        <span>{v.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {v.officerName ? (
                        <div>
                          <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}>{v.officerName}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{v.officerEmail}</div>
                        </div>
                      ) : (
                        <span style={{ color: '#dc2626', fontSize: '0.8rem', fontWeight: 600 }}>Unassigned (Action Required)</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#334155' }}>{v.citizenCount}</td>
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#334155' }}>{v.applicationCount}</td>
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#334155' }}>{v.developmentWorkCount}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ width: '180px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#475569', marginBottom: '0.25rem' }}>
                          <span>{formatCurrency(spent)}</span>
                          <span style={{ fontWeight: 700 }}>{pct}%</span>
                        </div>
                        <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                          <div
                            style={{
                              height: '100%',
                              width: `${pct}%`,
                              background: pct > 85 ? '#ef4444' : pct > 60 ? '#f59e0b' : '#10b981',
                              borderRadius: '3px',
                            }}
                          />
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                          Alloc: {formatCurrency(total)}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button
                        onClick={() => navigate(`/admin/villages?selected=${encodeURIComponent(v.name)}`)}
                        style={{
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
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Row: Quick Management Grid & Recent Audit Logs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {/* Quick Governance Links */}
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem' }}>
            Administrative Control Centers
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            <Link
              to="/admin/officers"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.85rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                textDecoration: 'none',
                color: '#1e293b',
                background: '#f8fafc',
              }}
            >
              <ShieldCheck size={20} color="#4338ca" />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Officers & Assignments</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Assign, replace, or revoke</div>
              </div>
            </Link>

            <Link
              to="/admin/budgets"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.85rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                textDecoration: 'none',
                color: '#1e293b',
                background: '#f8fafc',
              }}
            >
              <Wallet size={20} color="#16a34a" />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Village Budgets</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Configure per-village allocations</div>
              </div>
            </Link>

            <Link
              to="/admin/development-works"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.85rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                textDecoration: 'none',
                color: '#1e293b',
                background: '#f8fafc',
              }}
            >
              <Hammer size={20} color="#ea580c" />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Development Projects</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Track multi-village works</div>
              </div>
            </Link>

            <Link
              to="/admin/ai-fraud"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.85rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                textDecoration: 'none',
                color: '#1e293b',
                background: '#f8fafc',
              }}
            >
              <AlertTriangle size={20} color="#dc2626" />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>AI Fraud Detection</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>SHAP risk explainability</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Audit Log Snippet */}
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Recent Audit Events
            </h3>
            <Link to="/admin/audit-logs" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4338ca', textDecoration: 'none' }}>
              Full Trail →
            </Link>
          </div>

          {auditLogs.length === 0 ? (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
              No audit records generated yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    padding: '0.75rem 1rem',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    borderLeft: '3px solid #6366f1',
                    fontSize: '0.825rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.72rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontWeight: 700, color: '#334155' }}>{log.action}</span>
                    <span>{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                  <div style={{ color: '#1e293b' }}>{log.details}</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                    Actor: {log.actorEmail} ({log.actorRole})
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
