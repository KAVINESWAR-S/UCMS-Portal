import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Sidebar } from '../components/common/Sidebar';
import { ShieldCheck, Building2, User, Landmark } from 'lucide-react';

export const MainLayout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main className="page-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export const AuthLayout = () => {
  const location = useLocation();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #0f172a 60%, #020617 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
      }}
    >
      {/* Top UCMS Identity Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.25rem', color: '#ffffff' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '0.35rem 0.9rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 600,
            letterSpacing: '0.5px',
            marginBottom: '0.65rem',
          }}
        >
          <Landmark size={15} color="#38bdf8" />
          <span>Government of Tamil Nadu • Gram Panchayat Administration</span>
        </div>
        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 900,
            letterSpacing: '-0.5px',
            margin: 0,
            background: 'linear-gradient(to right, #ffffff, #cbd5e1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Unified Citizen Management System
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.35rem 0 0' }}>
          Sathyamangalam • Bhavanisagar • Gobichettipalayam
        </p>
      </div>

      {/* 3-Role Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '12px',
          padding: '0.35rem',
          gap: '0.35rem',
          marginBottom: '1.25rem',
          maxWidth: '540px',
          width: '100%',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
        }}
      >
        <NavLink
          to="/login"
          style={({ isActive }) => ({
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem',
            padding: '0.6rem 0.75rem',
            borderRadius: '8px',
            fontSize: '0.825rem',
            fontWeight: 700,
            textDecoration: 'none',
            color: isActive && location.pathname === '/login' ? '#0f172a' : '#94a3b8',
            background: isActive && location.pathname === '/login' ? '#ffffff' : 'transparent',
            boxShadow: isActive && location.pathname === '/login' ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
            transition: 'all 0.2s ease',
          })}
        >
          <User size={15} />
          <span>Citizen</span>
        </NavLink>

        <NavLink
          to="/officer/login"
          style={({ isActive }) => ({
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem',
            padding: '0.6rem 0.75rem',
            borderRadius: '8px',
            fontSize: '0.825rem',
            fontWeight: 700,
            textDecoration: 'none',
            color: isActive ? '#0f172a' : '#94a3b8',
            background: isActive ? '#ffffff' : 'transparent',
            boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
            transition: 'all 0.2s ease',
          })}
        >
          <Building2 size={15} />
          <span>Officer</span>
        </NavLink>

        <NavLink
          to="/admin/login"
          style={({ isActive }) => ({
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem',
            padding: '0.6rem 0.75rem',
            borderRadius: '8px',
            fontSize: '0.825rem',
            fontWeight: 700,
            textDecoration: 'none',
            color: isActive ? '#ffffff' : '#94a3b8',
            background: isActive ? 'linear-gradient(135deg, #4338ca 0%, #312e81 100%)' : 'transparent',
            boxShadow: isActive ? '0 4px 12px rgba(67, 56, 202, 0.4)' : 'none',
            border: isActive ? '1px solid #6366f1' : 'none',
            transition: 'all 0.2s ease',
          })}
        >
          <ShieldCheck size={15} />
          <span>Admin</span>
        </NavLink>
      </div>

      <div style={{ width: '100%', maxWidth: '540px' }}>
        <Outlet />
      </div>
    </div>
  );
};
