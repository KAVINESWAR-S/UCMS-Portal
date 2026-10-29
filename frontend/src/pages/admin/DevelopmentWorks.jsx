import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import {
  Hammer,
  Search,
  Building2,
  RefreshCw,
  Plus,
  X,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';

export const DevelopmentWorks = () => {
  const [works, setWorks] = useState([]);
  const [villages, setVillages] = useState([]);
  const [selectedVillage, setSelectedVillage] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Add Work Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [formWork, setFormWork] = useState({
    title: '',
    category: 'Electrification',
    village: 'Sathyamangalam',
    location: '',
    estimatedCost: '',
    allocatedAmount: '',
    spentAmount: '0',
    description: '',
    progressPercentage: 0,
    status: 'PLANNED',
  });
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [worksRes, villagesRes] = await Promise.all([
        adminService.getDevelopmentWorks(selectedVillage),
        adminService.getVillages(),
      ]);
      setWorks(worksRes);
      setVillages(villagesRes);
    } catch (err) {
      setError('Failed to fetch development works.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedVillage]);

  const handleCreateWork = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await adminService.createDevelopmentWork({
        ...formWork,
        estimatedCost: parseFloat(formWork.estimatedCost),
        allocatedAmount: parseFloat(formWork.allocatedAmount || formWork.estimatedCost),
        spentAmount: parseFloat(formWork.spentAmount || 0),
        progressPercentage: parseInt(formWork.progressPercentage || 0, 10),
      });

      setSuccessMsg(`Development project "${formWork.title}" registered successfully.`);
      setShowAddModal(false);
      setFormWork({
        title: '',
        category: 'Electrification',
        village: 'Sathyamangalam',
        location: '',
        estimatedCost: '',
        allocatedAmount: '',
        spentAmount: '0',
        description: '',
        progressPercentage: 0,
        status: 'PLANNED',
      });
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create work.');
    } finally {
      setSubmitting(false);
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

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Village Infrastructure & Development Works
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.25rem 0 0' }}>
            Multi-village civil projects, contractor allocations, and physical progress monitoring.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
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

          <button
            onClick={() => setShowAddModal(true)}
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
            <Plus size={16} /> New Project
          </button>
        </div>
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

      {/* Projects Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {works.map((w) => {
          const alloc = w.allocatedAmount || w.estimatedCost || 0;
          const spent = w.spentAmount || 0;
          const pct = alloc > 0 ? Math.min(100, Math.round((spent / alloc) * 100)) : 0;

          return (
            <div
              key={w.id}
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
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4338ca', letterSpacing: '0.5px' }}>
                    {w.workId}
                  </span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '9999px',
                      background: w.status === 'COMPLETED' ? '#ecfdf5' : '#eff6ff',
                      color: w.status === 'COMPLETED' ? '#065f46' : '#1e40af',
                    }}
                  >
                    {w.status}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem' }}>
                  {w.title}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 1rem', lineHeight: 1.4 }}>
                  {w.description || 'No description provided.'}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', fontSize: '0.78rem', marginBottom: '1rem', border: '1px solid #f1f5f9' }}>
                  <div>
                    <span style={{ color: '#64748b' }}>Panchayat:</span> <strong>{w.village}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Category:</span> <strong>{w.category}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Allocated:</span> <strong>{formatCurrency(alloc)}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Spent:</span> <strong>{formatCurrency(spent)}</strong>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#475569', marginBottom: '0.25rem' }}>
                    <span>Physical Progress</span>
                    <span style={{ fontWeight: 700 }}>{w.progressPercentage || 0}%</span>
                  </div>
                  <div style={{ height: '7px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${w.progressPercentage || 0}%`, height: '100%', background: '#4338ca', borderRadius: '4px' }} />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                <span>Location: {w.location || w.village}</span>
                <span>Expected: {w.expectedCompletionDate || '2025-08-30'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Project Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '540px', width: '100%', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Hammer size={22} color="#4338ca" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>Register New Project</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateWork} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bhavanisagar Water Treatment Plant Upgrade"
                  value={formWork.title}
                  onChange={(e) => setFormWork({ ...formWork, title: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>Village *</label>
                  <select
                    value={formWork.village}
                    onChange={(e) => setFormWork({ ...formWork, village: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem' }}
                  >
                    {villages.map((v) => (
                      <option key={v.name} value={v.name}>{v.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>Category *</label>
                  <select
                    value={formWork.category}
                    onChange={(e) => setFormWork({ ...formWork, category: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem' }}
                  >
                    <option value="Electrification">Electrification</option>
                    <option value="Water Supply">Water Supply</option>
                    <option value="Health Infrastructure">Health Infrastructure</option>
                    <option value="Roads & Transport">Roads & Transport</option>
                    <option value="Sanitation">Sanitation</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>Estimated Cost (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    placeholder="500000"
                    value={formWork.estimatedCost}
                    onChange={(e) => setFormWork({ ...formWork, estimatedCost: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>Allocated Grant (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="500000"
                    value={formWork.allocatedAmount}
                    onChange={(e) => setFormWork({ ...formWork, allocatedAmount: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>Detailed Description</label>
                <textarea
                  rows="2"
                  placeholder="Scope of civil engineering work..."
                  value={formWork.description}
                  onChange={(e) => setFormWork({ ...formWork, description: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '0.6rem 1rem', background: '#f1f5f9', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ padding: '0.6rem 1.25rem', background: '#312e81', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  {submitting ? 'Registering...' : 'Register Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
