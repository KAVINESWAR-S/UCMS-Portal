import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { Building, ArrowRight, RefreshCw, AlertCircle, Shield } from 'lucide-react';

export const OfficerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDemoFill = (officerEmail) => {
    setEmail(officerEmail);
    setPassword('Officer@123');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authService.loginOfficer({ email, password });
      login(res.token, res.citizen);
      navigate('/officer/dashboard');
    } catch (err) {
      if (!err.response) {
        setError(
          'Cannot connect to UCMS Backend server. Please verify your connection or check if the backend service is awake.'
        );
      } else {
        setError(err.response?.data?.message || 'Invalid officer credentials for this Panchayat.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: '2.5rem', maxWidth: '540px', margin: '0 auto', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <div
          style={{
            width: '58px',
            height: '58px',
            borderRadius: '50%',
            backgroundColor: '#fef2f2',
            border: '2px solid #fecaca',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem',
            color: 'var(--danger-text)',
          }}
        >
          <Building size={32} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)' }}>
          Panchayat Officer Portal
        </h2>
        <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
          Village Administrative Officer Jurisdiction & Management Console
        </p>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>{error}</span>
        </div>
      )}

      {/* Quick Demo Officer Accounts */}
      <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '10px', padding: '0.85rem', marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9f1239', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Shield size={14} color="#e11d48" /> Quick Demo Officer Logins
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.4rem' }}>
          <button
            type="button"
            onClick={() => handleDemoFill('officer.sathyamangalam@example.com')}
            style={{
              background: email === 'officer.sathyamangalam@example.com' ? '#ffe4e6' : '#ffffff',
              border: email === 'officer.sathyamangalam@example.com' ? '1.5px solid #e11d48' : '1px solid #fda4af',
              borderRadius: '6px',
              padding: '0.45rem 0.6rem',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#881337' }}>Sathyamangalam</div>
            <div style={{ fontSize: '0.675rem', color: '#9f1239' }}>officer.sathyamangalam</div>
          </button>
          <button
            type="button"
            onClick={() => handleDemoFill('officer.bhavanisagar@example.com')}
            style={{
              background: email === 'officer.bhavanisagar@example.com' ? '#ffe4e6' : '#ffffff',
              border: email === 'officer.bhavanisagar@example.com' ? '1.5px solid #e11d48' : '1px solid #fda4af',
              borderRadius: '6px',
              padding: '0.45rem 0.6rem',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#881337' }}>Bhavanisagar</div>
            <div style={{ fontSize: '0.675rem', color: '#9f1239' }}>officer.bhavanisagar</div>
          </button>
          <button
            type="button"
            onClick={() => handleDemoFill('officer.gobichettipalayam@example.com')}
            style={{
              background: email === 'officer.gobichettipalayam@example.com' ? '#ffe4e6' : '#ffffff',
              border: email === 'officer.gobichettipalayam@example.com' ? '1.5px solid #e11d48' : '1px solid #fda4af',
              borderRadius: '6px',
              padding: '0.45rem 0.6rem',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#881337' }}>Gobichettipalayam</div>
            <div style={{ fontSize: '0.675rem', color: '#9f1239' }}>officer.gobichettipalayam</div>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label className="form-label" style={{ fontWeight: 700 }}>Officer Email Address</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="officer.keeranur@ucms.gov.in"
          />
        </div>

        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
          <label className="form-label" style={{ fontWeight: 700 }}>Officer Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '0.35rem' }}>
            Default test password: <code style={{ color: 'var(--primary-700)', fontWeight: 600 }}>Officer@123</code>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-danger"
          style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 700 }}
          disabled={loading}
        >
          {loading ? <RefreshCw className="animate-spin" size={18} /> : <ArrowRight size={18} />}
          <span>{loading ? 'Authenticating...' : 'Sign In as Panchayat Officer'}</span>
        </button>
      </form>

      <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.825rem' }}>
        <Link to="/login" style={{ color: 'var(--slate-600)', textDecoration: 'none' }}>
          ← Citizen Aadhaar Login
        </Link>
        <Link to="/admin/login" style={{ color: '#4338ca', fontWeight: 700, textDecoration: 'none' }}>
          Central Admin Portal →
        </Link>
      </div>
    </div>
  );
};
