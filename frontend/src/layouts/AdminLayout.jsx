import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Building2,
  ShieldCheck,
  Users,
  FileText,
  FileCheck,
  MessageSquare,
  Wallet,
  Hammer,
  Award,
  AlertTriangle,
  History,
  BarChart3,
  LogOut,
  Shield,
  ExternalLink,
} from 'lucide-react';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navSections = [
    {
      title: 'Overview',
      items: [
        { to: '/admin/dashboard', label: 'System Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Jurisdiction & Governance',
      items: [
        { to: '/admin/villages', label: 'Village Management', icon: Building2 },
        { to: '/admin/officers', label: 'Officers & Assignments', icon: ShieldCheck },
        { to: '/admin/citizens', label: 'Citizen Directory', icon: Users },
      ],
    },
    {
      title: 'Civic Services',
      items: [
        { to: '/admin/applications', label: 'Applications', icon: FileText },
        { to: '/admin/certificates', label: 'Certificates', icon: FileCheck },
        { to: '/admin/grievances', label: 'Grievance Redressal', icon: MessageSquare },
      ],
    },
    {
      title: 'Finance & Works',
      items: [
        { to: '/admin/budgets', label: 'Village Budgets', icon: Wallet },
        { to: '/admin/development-works', label: 'Development Works', icon: Hammer },
        { to: '/admin/schemes', label: 'Welfare Schemes', icon: Award },
      ],
    },
    {
      title: 'Security & Intelligence',
      items: [
        { to: '/admin/ai-fraud', label: 'AI Fraud Monitoring', icon: AlertTriangle },
        { to: '/admin/audit-logs', label: 'Audit Trail', icon: History },
        { to: '/admin/reports', label: 'Reports & Analytics', icon: BarChart3 },
      ],
    },
  ];

  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Admin Sidebar */}
      <aside
        className="no-print"
        style={{
          width: '260px',
          background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
          color: '#e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 40,
          boxShadow: '4px 0 15px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #4338ca, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 10px rgba(99, 102, 241, 0.35)',
            }}
          >
            <Shield size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#ffffff', letterSpacing: '-0.3px' }}>
              UCMS ADMIN
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600 }}>
              Central Administration
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.75rem' }}>
          {navSections.map((section, idx) => (
            <div key={idx} style={{ marginBottom: '1.25rem' }}>
              <div
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  color: '#64748b',
                  padding: '0 0.75rem',
                  marginBottom: '0.4rem',
                }}
              >
                {section.title}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        style={({ isActive }) => ({
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.6rem 0.75rem',
                          borderRadius: '8px',
                          color: isActive ? '#ffffff' : '#94a3b8',
                          background: isActive ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.25) 0%, rgba(99, 102, 241, 0.08) 100%)' : 'transparent',
                          borderLeft: isActive ? '3px solid #818cf8' : '3px solid transparent',
                          fontWeight: isActive ? 600 : 500,
                          fontSize: '0.875rem',
                          textDecoration: 'none',
                          transition: 'all 0.15s ease',
                        })}
                      >
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Sidebar Footer User info */}
        <div
          style={{
            padding: '1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#312e81',
                color: '#a5b4fc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.8rem',
                flexShrink: 0,
              }}
            >
              ADM
            </div>
            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.fullName || 'Administrator'}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#818cf8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.email || 'admin@ucms.gov.in'}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out of Admin Console"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '0.4rem',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Navbar */}
        <header
          className="no-print"
          style={{
            height: '64px',
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            position: 'sticky',
            top: 0,
            zIndex: 30,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                padding: '0.3rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#334155',
                textTransform: 'uppercase',
              }}
            >
              <ShieldCheck size={14} color="#4338ca" /> Central Admin Mode
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>|</span>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Tamil Nadu Gram Panchayat Administration Portal
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => window.open('/officer/dashboard', '_blank')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '0.4rem 0.8rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer',
              }}
            >
              <ExternalLink size={14} /> Open Officer View
            </button>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#fee2e2',
                border: '1px solid #fecaca',
                borderRadius: '6px',
                padding: '0.4rem 0.8rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#991b1b',
                cursor: 'pointer',
              }}
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
