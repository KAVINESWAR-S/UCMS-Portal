import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { ShieldCheck, Mail, ArrowRight, CheckCircle, RefreshCw, KeyRound, Building } from 'lucide-react';

export const CitizenLogin = () => {
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Enter Aadhaar/Email, 2: Enter OTP
  const [otpMeta, setOtpMeta] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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

  const handleSendOtp = async (e) => {
    e.preventDefault();
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
        // Pre-suggest or let user click to auto-fill
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Aadhaar verification failed. Please check the number.');
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
      setError(err.response?.data?.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: '2.5rem', maxWidth: '520px', margin: '0 auto' }}>
      {/* Aadhaar Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
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
          <ShieldCheck size={32} />
        </div>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--slate-900)' }}>
          Aadhaar Citizen Sign-In
        </h2>
        <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
          National Identity Verification & Email OTP Authentication
        </p>
      </div>

      {error && <div className="alert alert-danger" style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}>{error}</div>}

      {step === 1 ? (
        /* STEP 1: Enter Aadhaar */
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
                placeholder="e.g. 9876-5432-1001"
                value={identifier}
                onChange={handleIdentifierChange}
                required
                style={{ fontSize: '1rem', letterSpacing: identifier.includes('-') ? '1.5px' : 'normal', fontWeight: 600 }}
              />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '0.35rem' }}>
              New users with a valid Aadhaar number are automatically registered with UIDAI demographics.
            </p>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            disabled={loading}
          >
            {loading ? <RefreshCw className="animate-spin" size={18} /> : <Mail size={18} />}
            <span>{loading ? 'Verifying with UIDAI...' : 'Get OTP on Registered Email'}</span>
          </button>
        </form>
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
                Panchayat: <strong>{otpMeta.village}</strong> • Code sent to: <strong>{otpMeta.maskedEmail}</strong>
              </div>

              {otpMeta.debugOtp && (
                <div style={{ marginTop: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', padding: '0.35rem 0.6rem', borderRadius: '6px', border: '1px dashed #86efac' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-600)' }}>
                    Test OTP Code: <strong style={{ color: '#166534', fontSize: '0.9rem' }}>{otpMeta.debugOtp}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setOtp(otpMeta.debugOtp)}
                    className="btn btn-sm"
                    style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: '#dcfce7', color: '#166534', border: '1px solid #86efac' }}
                  >
                    Auto-Fill
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
              style={{ fontSize: '1.25rem', letterSpacing: '4px', textAlign: 'center', fontWeight: 700 }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-success"
            style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: '#16a34a', borderColor: '#16a34a' }}
            disabled={loading}
          >
            {loading ? <RefreshCw className="animate-spin" size={18} /> : <KeyRound size={18} />}
            <span>{loading ? 'Verifying...' : 'Verify OTP & Enter Workspace'}</span>
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

export const OfficerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authService.loginOfficer({ email, password });
      login(res.token, res.citizen);
      navigate('/officer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid officer credentials for this Panchayat.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: '2.5rem', maxWidth: '520px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
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
          <Building size={30} />
        </div>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--slate-900)' }}>
          Panchayat Officer Portal
        </h2>
        <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
          Village Administrative Officer Jurisdiction & Management Console
        </p>
      </div>

      {error && <div className="alert alert-danger" style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}>{error}</div>}

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
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '0.3rem' }}>
            Default password: <code style={{ color: 'var(--primary-700)' }}>Officer@123</code>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-danger"
          style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          disabled={loading}
        >
          <span>{loading ? 'Authenticating...' : 'Sign In as Panchayat Officer'}</span>
          <ArrowRight size={18} />
        </button>
      </form>

      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem' }}>
        <Link to="/login" style={{ color: 'var(--slate-600)' }}>← Switch back to Citizen Aadhaar Login</Link>
      </div>
    </div>
  );
};
