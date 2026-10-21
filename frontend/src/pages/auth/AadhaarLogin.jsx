import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { ShieldCheck, Mail, ArrowRight, CheckCircle, RefreshCw, KeyRound, Building, UserCheck, AlertCircle } from 'lucide-react';

export const AadhaarLogin = () => {
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Enter Aadhaar/Email, 2: Enter OTP
  const [otpMeta, setOtpMeta] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Demo Citizen Accounts for 1-click testing
  const DEMO_CITIZENS = [
    {
      name: 'Kavineswar Shanmugam',
      aadhaar: '9999-0000-0001',
      village: 'Sathyamangalam',
      tag: 'Farmer • ₹95k Inc.',
      icon: '🌾',
    },
    {
      name: 'Kavineswar Kumar',
      aadhaar: '9999-0000-0002',
      village: 'Bhavanisagar',
      tag: 'Handloom • ₹1.4L Inc.',
      icon: '🧵',
    },
    {
      name: 'Kavineswar P',
      aadhaar: '9999-0000-0003',
      village: 'Gobichettipalayam',
      tag: 'Agro-Logistics • ₹1.8L',
      icon: '🚚',
    },
  ];

  // Format Aadhaar number with hyphens (XXXX-XXXX-XXXX)
  const handleIdentifierChange = (e) => {
    let val = e.target.value;
    if (/^[0-9\s-]*$/.test(val)) {
      let digits = val.replace(/\D/g, '').slice(0, 12);
      if (digits.length > 8) {
        val = `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8)}`;
      } else if (digits.length > 4) {
        val = `${digits.slice(0, 4)}-${digits.slice(4)}`;
      } else {
        val = digits;
      }
      setIdentifier(val);
    } else {
      setIdentifier(val); // allow email format
    }
  };

  const handleSelectDemo = (demoAadhaar) => {
    setIdentifier(demoAadhaar);
    setError('');
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setError('');
    const raw = identifier.trim();
    if (!raw) {
      setError('Please enter your 12-digit Aadhaar number or linked email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.sendAadhaarOtp(raw);
      setOtpMeta(res);
      setStep(2);
      if (res.debugOtp) {
        setOtp(res.debugOtp);
      }
    } catch (err) {
      if (!err.response) {
        setError(
          'Cannot connect to UCMS Backend (http://localhost:8080). Please ensure the Spring Boot backend server is running.'
        );
      } else {
        setError(err.response?.data?.message || 'Aadhaar verification failed. Please verify the number.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!otp.trim()) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.verifyAadhaarOtp(identifier.trim(), otp.trim());
      login(res.token, res.citizen);
      navigate('/citizen/dashboard');
    } catch (err) {
      if (!err.response) {
        setError(
          'Cannot connect to UCMS Backend (http://localhost:8080). Please check if backend is running.'
        );
      } else {
        setError(err.response?.data?.message || 'Invalid or expired OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: '2.5rem', maxWidth: '540px', margin: '0 auto', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)' }}>
      {/* Aadhaar Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <div
          style={{
            width: '58px',
            height: '58px',
            borderRadius: '50%',
            backgroundColor: '#f0fdf4',
            border: '2px solid #bbf7d0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem',
            color: '#16a34a',
          }}
        >
          <ShieldCheck size={34} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)' }}>
          Aadhaar Citizen Sign-In
        </h2>
        <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
          UIDAI National Identity Verification & One-Time Password Authentication
        </p>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>{error}</span>
        </div>
      )}

      {step === 1 ? (
        /* STEP 1: Enter Aadhaar */
        <div>
          {/* Quick Demo Selector */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.9rem', marginBottom: '1.35rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-600)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <UserCheck size={14} color="#0284c7" /> Quick Demo Accounts (Click to Fill)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.45rem' }}>
              {DEMO_CITIZENS.map((c) => (
                <button
                  key={c.aadhaar}
                  type="button"
                  onClick={() => handleSelectDemo(c.aadhaar)}
                  style={{
                    background: identifier === c.aadhaar ? '#dcfce7' : '#ffffff',
                    border: identifier === c.aadhaar ? '1.5px solid #16a34a' : '1px solid #cbd5e1',
                    borderRadius: '7px',
                    padding: '0.5rem 0.6rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#0f172a' }}>
                    {c.icon} {c.name.split(' ')[0]} {c.name.split(' ')[1]?.[0] || ''}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#475569', fontFamily: 'monospace', marginTop: '2px' }}>
                    {c.aadhaar}
                  </div>
                  <div style={{ fontSize: '0.675rem', color: '#16a34a', fontWeight: 600 }}>
                    {c.village}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSendOtp}>
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
                <span>12-Digit Aadhaar Number</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 400 }}>Or Linked Email</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 9999-0000-0001"
                  value={identifier}
                  onChange={handleIdentifierChange}
                  required
                  style={{ fontSize: '1.05rem', letterSpacing: identifier.includes('-') ? '1.5px' : 'normal', fontWeight: 600 }}
                />
              </div>
              <p style={{ fontSize: '0.75rem', color: '#15803d', marginTop: '0.4rem', background: '#f0fdf4', padding: '0.35rem 0.6rem', borderRadius: '6px', border: '1px solid #dcfce7' }}>
                ✓ Enter any of the pre-seeded demo accounts above, or <strong>any 12-digit number</strong> to simulate instant new citizen registration via UIDAI.
              </p>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 700 }}
              disabled={loading}
            >
              {loading ? <RefreshCw className="animate-spin" size={18} /> : <Mail size={18} />}
              <span>{loading ? 'Verifying with UIDAI...' : 'Get OTP on Registered Email'}</span>
            </button>
          </form>
        </div>
      ) : (
        /* STEP 2: Enter OTP */
        <form onSubmit={handleVerifyOtp}>
          {/* Aadhaar Verified Cardlet */}
          {otpMeta && (
            <div
              style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                padding: '0.85rem 1rem',
                marginBottom: '1.25rem',
                fontSize: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#166534', fontWeight: 700, marginBottom: '0.35rem' }}>
                <CheckCircle size={16} /> Aadhaar Verified: {otpMeta.fullName}
              </div>
              <div style={{ color: '#15803d', fontSize: '0.775rem' }}>
                Panchayat: <strong>{otpMeta.village}</strong> • Code dispatched to: <strong>{otpMeta.maskedEmail}</strong>
              </div>

              {otpMeta.debugOtp && (
                <div style={{ marginTop: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', padding: '0.45rem 0.75rem', borderRadius: '6px', border: '1.5px dashed #86efac' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--slate-700)' }}>
                    Auto-Dispatched OTP: <strong style={{ color: '#166534', fontSize: '1rem', letterSpacing: '1px' }}>{otpMeta.debugOtp}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setOtp(otpMeta.debugOtp)}
                    className="btn btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem', background: '#dcfce7', color: '#166534', border: '1px solid #86efac', fontWeight: 700 }}
                  >
                    Auto-Fill OTP
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ fontWeight: 700 }}>Enter 6-Digit Email OTP</label>
            <input
              type="text"
              maxLength={6}
              className="form-control"
              placeholder="e.g. 123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              required
              autoFocus
              style={{ fontSize: '1.35rem', letterSpacing: '6px', textAlign: 'center', fontWeight: 800 }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-success"
            style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: '#16a34a', borderColor: '#16a34a', fontWeight: 700 }}
            disabled={loading}
          >
            {loading ? <RefreshCw className="animate-spin" size={18} /> : <KeyRound size={18} />}
            <span>{loading ? 'Verifying OTP...' : 'Verify OTP & Enter Citizen Workspace'}</span>
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '0.8rem' }}>
            <button
              type="button"
              onClick={() => { setStep(1); setOtp(''); }}
              style={{ background: 'none', border: 'none', color: 'var(--slate-500)', cursor: 'pointer', padding: 0 }}
            >
              ← Change Aadhaar Number
            </button>
            <button
              type="button"
              onClick={handleSendOtp}
              style={{ background: 'none', border: 'none', color: 'var(--primary-600)', cursor: 'pointer', padding: 0, fontWeight: 600 }}
            >
              Resend Code
            </button>
          </div>
        </form>
      )}

      {/* Switch to Officer Login */}
      <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--slate-200)', textAlign: 'center', fontSize: '0.85rem' }}>
        <Link to="/officer/login" style={{ color: 'var(--slate-600)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <Building size={14} /> Are you a Panchayat Officer? <strong>Officer Portal Login →</strong>
        </Link>
      </div>
    </div>
  );
};
