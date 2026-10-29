import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import {
  Award,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  Edit3,
  X,
  FileText,
} from 'lucide-react';

export const SchemeManagement = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editingScheme, setEditingScheme] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    incomeLimit: '',
    landLimit: '',
    ageMin: '',
    ageMax: '',
    requiredDocuments: '',
    active: true,
  });
  const [submitting, setSubmitting] = useState(false);

  const loadSchemes = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getSchemes();
      setSchemes(data);
    } catch (err) {
      setError('Failed to fetch welfare schemes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchemes();
  }, []);

  const handleOpenCreate = () => {
    setEditingScheme(null);
    setForm({
      name: '',
      description: '',
      incomeLimit: '',
      landLimit: '',
      ageMin: '',
      ageMax: '',
      requiredDocuments: '',
      active: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (s) => {
    setEditingScheme(s);
    setForm({
      name: s.name || '',
      description: s.description || '',
      incomeLimit: s.incomeLimit?.toString() || '',
      landLimit: s.landLimit?.toString() || '',
      ageMin: s.ageMin?.toString() || '',
      ageMax: s.ageMax?.toString() || '',
      requiredDocuments: s.requiredDocuments || '',
      active: s.active !== false,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        ...form,
        incomeLimit: form.incomeLimit ? parseFloat(form.incomeLimit) : null,
        landLimit: form.landLimit ? parseFloat(form.landLimit) : null,
        ageMin: form.ageMin ? parseInt(form.ageMin, 10) : null,
        ageMax: form.ageMax ? parseInt(form.ageMax, 10) : null,
      };

      if (editingScheme) {
        await adminService.updateScheme(editingScheme.id, payload);
        setSuccessMsg(`Scheme "${form.name}" updated successfully.`);
      } else {
        await adminService.createScheme(payload);
        setSuccessMsg(`New scheme "${form.name}" created successfully.`);
      }

      setShowModal(false);
      await loadSchemes();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save scheme.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Welfare Schemes Registry & Eligibility Criteria
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.25rem 0 0' }}>
            Configure state and central rural schemes, income ceilings, land limits, and required document checklists.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '0.55rem 1.1rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(49, 46, 129, 0.25)',
          }}
        >
          <Plus size={16} /> New Scheme
        </button>
      </div>

      {successMsg && (
        <div style={{ padding: '0.85rem 1rem', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', color: '#065f46', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#065f46' }}>✕</button>
        </div>
      )}

      {error && (
        <div style={{ padding: '0.85rem 1rem', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', color: '#991b1b', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      {/* Schemes Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {schemes.map((s) => (
          <div
            key={s.id}
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4338ca' }}>
                  {s.schemeId}
                </span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '9999px',
                    background: s.active !== false ? '#ecfdf5' : '#fee2e2',
                    color: s.active !== false ? '#065f46' : '#991b1b',
                  }}
                >
                  {s.active !== false ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem' }}>
                {s.name}
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 1rem', lineHeight: 1.4 }}>
                {s.description}
              </p>

              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', border: '1px solid #f1f5f9' }}>
                <div><strong>Income Limit:</strong> {s.incomeLimit ? `₹${Number(s.incomeLimit).toLocaleString('en-IN')}/year` : 'No Limit'}</div>
                <div><strong>Land Limit:</strong> {s.landLimit ? `${s.landLimit} acres` : 'No Limit'}</div>
                <div><strong>Age Range:</strong> {s.ageMin || '0'} - {s.ageMax || '100'} years</div>
                <div><strong>Required Docs:</strong> {s.requiredDocuments || 'Aadhaar, Ration Card'}</div>
              </div>
            </div>

            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => handleOpenEdit(s)}
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
                <Edit3 size={13} /> Edit Scheme
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '540px', width: '100%', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={22} color="#4338ca" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                  {editingScheme ? 'Edit Scheme' : 'Create Welfare Scheme'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>Scheme Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chief Minister Rural Housing Scheme"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>Description</label>
                <textarea
                  rows="2"
                  placeholder="Objectives and benefits of this scheme..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>Income Ceiling (₹/yr)</label>
                  <input
                    type="number"
                    placeholder="250000"
                    value={form.incomeLimit}
                    onChange={(e) => setForm({ ...form, incomeLimit: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>Max Land Limit (acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="5.0"
                    value={form.landLimit}
                    onChange={(e) => setForm({ ...form, landLimit: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>Required Documents</label>
                <input
                  type="text"
                  placeholder="Aadhaar Card, Smart Ration Card, Bank Passbook"
                  value={form.requiredDocuments}
                  onChange={(e) => setForm({ ...form, requiredDocuments: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ padding: '0.6rem 1rem', background: '#f1f5f9', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ padding: '0.6rem 1.25rem', background: '#312e81', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  {submitting ? 'Saving...' : 'Save Scheme'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
