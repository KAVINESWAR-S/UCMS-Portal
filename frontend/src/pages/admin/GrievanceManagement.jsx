import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import {
  MessageSquare,
  Search,
  Building2,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  X,
  Send,
  AlertCircle,
} from 'lucide-react';

export const GrievanceManagement = () => {
  const [grievances, setGrievances] = useState([]);
  const [villages, setVillages] = useState([]);
  const [selectedVillage, setSelectedVillage] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Respond Modal
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [responseMsg, setResponseMsg] = useState('');
  const [newStatus, setNewStatus] = useState('RESOLVED');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [gRes, vRes] = await Promise.all([
        adminService.getGrievances(selectedVillage, selectedStatus),
        adminService.getVillages(),
      ]);
      setGrievances(gRes);
      setVillages(vRes);
    } catch (err) {
      setError('Failed to fetch grievances.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedVillage, selectedStatus]);

  const handleRespond = async (e) => {
    e.preventDefault();
    if (!selectedGrievance) return;
    setSubmitting(true);
    setError('');
    try {
      await adminService.respondGrievance(selectedGrievance.id, responseMsg, newStatus);
      setSuccessMsg(`Responded to grievance ${selectedGrievance.grievanceId}.`);
      setSelectedGrievance(null);
      setResponseMsg('');
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit response.');
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
            Citizen Grievance Redressal Monitoring
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.25rem 0 0' }}>
            Multi-village dispute, civic sanitation, street-lighting, and water issue resolutions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <select
            value={selectedVillage}
            onChange={(e) => setSelectedVillage(e.target.value)}
            style={{ padding: '0.55rem 0.85rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 600, color: '#334155', background: '#ffffff' }}
          >
            <option value="all">All Panchayats</option>
            {villages.map((v) => (
              <option key={v.name} value={v.name}>{v.name}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ padding: '0.55rem 0.85rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 600, color: '#334155', background: '#ffffff' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          <button
            onClick={loadData}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '8px', padding: '0.55rem 0.9rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', color: '#334155' }}
          >
            <RefreshCw size={14} /> Refresh
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

      {/* Grievances List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {grievances.length === 0 ? (
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '3rem', textAlign: 'center', color: '#94a3b8', border: '1px solid #e2e8f0' }}>
            No grievances matching the selected filters.
          </div>
        ) : (
          grievances.map((g) => (
            <div
              key={g.id}
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '1.25rem 1.5rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#4338ca' }}>{g.grievanceId}</span>
                    <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: '6px', background: '#f1f5f9', fontWeight: 600, color: '#334155' }}>
                      {g.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      <Building2 size={12} style={{ display: 'inline', marginRight: '3px' }} />
                      {g.citizenVillage || 'Sathyamangalam'}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0 0.15rem' }}>
                    {g.subject}
                  </h3>
                </div>

                <span
                  style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: '9999px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    background: g.status === 'RESOLVED' ? '#ecfdf5' : '#fef3c7',
                    color: g.status === 'RESOLVED' ? '#065f46' : '#92400e',
                  }}
                >
                  {g.status}
                </span>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                {g.description}
              </p>

              {g.officerResponse && (
                <div style={{ background: '#f8fafc', borderLeft: '3px solid #10b981', padding: '0.65rem 0.85rem', borderRadius: '4px', fontSize: '0.8rem', color: '#1e293b' }}>
                  <strong>Official Response:</strong> {g.officerResponse}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.6rem', fontSize: '0.75rem', color: '#64748b' }}>
                <span>Citizen: {g.citizenName} ({g.citizenEmail || 'Citizen'})</span>
                <button
                  onClick={() => {
                    setSelectedGrievance(g);
                    setResponseMsg(g.officerResponse || '');
                    setNewStatus(g.status === 'SUBMITTED' ? 'RESOLVED' : g.status);
                  }}
                  style={{
                    background: '#e0e7ff',
                    color: '#3730a3',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Provide Redressal
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Response Modal */}
      {selectedGrievance && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '520px', width: '100%', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                  Redress Grievance: {selectedGrievance.grievanceId}
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{selectedGrievance.subject}</span>
              </div>
              <button onClick={() => setSelectedGrievance(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleRespond} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>Resolution Status *</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem' }}
                >
                  <option value="RESOLVED">RESOLVED — Action Completed</option>
                  <option value="UNDER_REVIEW">UNDER REVIEW — Inspection Assigned</option>
                  <option value="REJECTED">REJECTED — Outside Gram Panchayat Jurisdiction</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>Official Response to Citizen *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Detail the remedial actions taken by the panchayat union..."
                  value={responseMsg}
                  onChange={(e) => setResponseMsg(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setSelectedGrievance(null)}
                  style={{ padding: '0.6rem 1rem', background: '#f1f5f9', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ padding: '0.6rem 1.25rem', background: '#312e81', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  {submitting ? 'Submitting...' : 'Send Redressal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
