import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { ShieldCheck, ArrowRight, RefreshCw, AlertCircle, KeyRound, Lock, Mail } from 'lucide-react';

export const AdminLogin = () => {
  const [email, setEmail] = useState('admin@ucms.gov.in');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDemoFill = () => {
    setEmail('admin@ucms.gov.in');
    setPassword('Admin@123');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authService.loginAdmin({ email, password });
      login(res.token, res.user || res.citizen);
      navigate('/admin/dashboard');
    } catch (err) {
      if (!err.response) {
        setError('Cannot connect to UCMS Backend server. Please verify your connection or check if the backend service is awake.');
      } else {
        setError(err.response?.data?.message || 'Invalid administrator credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="card"
      style={{
        padding: '2.5rem',
        maxWidth: '520px',
        margin: '0 auto',
        boxShadow: '0 20px 35px -10px rgba(15, 23, 42, 0.15), 0 10px 15px -3px rgba(15, 23, 42, 0.05)',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.85rem',
            color: '#ffffff',
            boxShadow: '0 8px 16px -4px rgba(67, 56, 202, 0.4)',
          }}
        >
          <ShieldCheck size={36} />
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.2rem 0.65rem', background: '#e0e7ff', color: '#3730a3', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          <KeyRound size={12} /> System Administrator
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Central Admin Portal
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.35rem' }}>
          Unified Citizen Management System — Multi-Village Governance
        </p>
      </div>

      {error && (
        <div
          className="alert alert-danger"
          style={{
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
          }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>{error}</span>
        </div>
      )}

      {/* Demo Credentials Box */}
      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          padding: '0.85rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase' }}>
            Preconfigured Admin Credential
          </div>
          <div style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '0.15rem' }}>
            admin@ucms.gov.in / Admin@123
          </div>
        </div>
        <button
          type="button"
          onClick={handleDemoFill}
          style={{
            background: '#e0e7ff',
            color: '#3730a3',
            border: '1px solid #c7d2fe',
            borderRadius: '6px',
            padding: '0.35rem 0.75rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Auto Fill
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
            Admin Email Address
          </label>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ucms.gov.in"
              required
              className="form-control"
              style={{
                width: '100%',
                padding: '0.65rem 0.75rem 0.65rem 2.5rem',
                border: '1.5px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.9rem',
              }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="form-control"
              style={{
                width: '100%',
                padding: '0.65rem 0.75rem 0.65rem 2.5rem',
                border: '1.5px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.9rem',
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 12px rgba(49, 46, 129, 0.3)',
            marginTop: '0.5rem',
          }}
        >
          {loading ? (
            <>
              <RefreshCw size={18} className="animate-spin" />
              Authenticating...
            </>
          ) : (
            <>
              Sign In to Admin Console <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', color: '#64748b' }}>
        <Link to="/officer/login" style={{ color: '#4338ca', textDecoration: 'none', fontWeight: 600 }}>
          ← Officer Portal
        </Link>
        <Link to="/login" style={{ color: '#64748b', textDecoration: 'none' }}>
          Citizen Portal
        </Link>
      </div>
    </div>
  );
};
