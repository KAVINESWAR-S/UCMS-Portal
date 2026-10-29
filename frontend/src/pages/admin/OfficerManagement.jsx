import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import {
  ShieldCheck,
  UserPlus,
  RefreshCw,
  Search,
  Building2,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  History,
  X,
  Plus,
  RotateCcw,
} from 'lucide-react';

export const OfficerManagement = () => {
  const [officers, setOfficers] = useState([]);
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState(null);

  // Form states
  const [createForm, setCreateForm] = useState({
    fullName: '',
    email: '',
    password: 'Officer@123',
    phoneNumber: '',
    village: '',
  });
  const [isCustomCreate, setIsCustomCreate] = useState(false);
  const [customVillageCreate, setCustomVillageCreate] = useState('');

  const [assignVillage, setAssignVillage] = useState('Sathyamangalam');
  const [isCustomAssign, setIsCustomAssign] = useState(false);
  const [customVillageAssign, setCustomVillageAssign] = useState('');

  const [assignNotes, setAssignNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [searchParams] = useSearchParams();

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [officersRes, villagesRes] = await Promise.all([
        adminService.getOfficers(),
        adminService.getVillages(),
      ]);
      setOfficers(officersRes);
      setVillages(villagesRes);

      const targetVillage = searchParams.get('assignVillage');
      if (targetVillage) {
        setAssignVillage(targetVillage);
        setShowCreateModal(true);
        setCreateForm((prev) => ({ ...prev, village: targetVillage }));
      }
    } catch (err) {
      setError('Failed to fetch officer data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateOfficer = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const finalVillage = isCustomCreate ? customVillageCreate.trim() : createForm.village;
      await adminService.createOfficer({ ...createForm, village: finalVillage });
      setSuccessMsg(`Officer ${createForm.fullName} created successfully${finalVillage ? ` and assigned to ${finalVillage}` : ''}.`);
      setShowCreateModal(false);
      setCreateForm({ fullName: '', email: '', password: 'Officer@123', phoneNumber: '', village: '' });
      setIsCustomCreate(false);
      setCustomVillageCreate('');
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create officer.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignOfficer = async (e) => {
    e.preventDefault();
    if (!selectedOfficer) return;
    const finalVillage = isCustomAssign ? customVillageAssign.trim() : assignVillage;
    if (!finalVillage) {
      setError('Please select or specify a target city or village.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await adminService.assignOfficer(selectedOfficer.id, {
        village: finalVillage,
        notes: assignNotes || 'Assigned by Administrator via Console',
      });
      setSuccessMsg(`Officer ${selectedOfficer.fullName} successfully assigned to ${finalVillage}.`);
      setShowAssignModal(false);
      setSelectedOfficer(null);
      setIsCustomAssign(false);
      setCustomVillageAssign('');
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign officer.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevokeOfficer = async () => {
    if (!selectedOfficer) return;
    setSubmitting(true);
    setError('');
    try {
      await adminService.revokeOfficer(selectedOfficer.id);
      setSuccessMsg(`Officer ${selectedOfficer.fullName}'s assignment was revoked. Account preserved.`);
      setShowRevokeModal(false);
      setSelectedOfficer(null);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to revoke officer.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredOfficers = officers.filter(
    (o) =>
      o.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.village?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Panchayat Officer Directory & Assignments
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.25rem 0 0' }}>
            Manage village administrative officers, create accounts, assign jurisdictional boundaries, and preserve audit histories.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search officer or village..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem 0.55rem 2.2rem',
                border: '1.5px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
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
            <UserPlus size={16} /> Create Officer
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

      {/* Officers Table */}
      <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', background: '#f8fafc' }}>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Officer Details</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Contact Info</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Assigned Panchayat</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOfficers.map((o) => (
                <tr key={o.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                        {o.fullName ? o.fullName.substring(0, 2).toUpperCase() : 'OF'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{o.fullName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Role: Village Administrative Officer</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.825rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Mail size={13} color="#64748b" /> {o.email}
                    </div>
                    {o.phoneNumber && (
                      <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                        <Phone size={13} color="#64748b" /> {o.phoneNumber}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {o.village ? (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          padding: '0.3rem 0.65rem',
                          borderRadius: '6px',
                          background: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: '#334155',
                        }}
                      >
                        <Building2 size={13} color="#4338ca" />
                        {o.village}
                      </span>
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontStyle: 'italic' }}>
                        No Jurisdiction Assigned
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span
                      style={{
                        padding: '0.25rem 0.6rem',
                        borderRadius: '9999px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: o.village ? '#ecfdf5' : '#fee2e2',
                        color: o.village ? '#065f46' : '#991b1b',
                      }}
                    >
                      {o.village ? 'Active In Charge' : 'Unassigned / Revoked'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => {
                          setSelectedOfficer(o);
                          setAssignVillage(o.village || villages[0]?.name || 'Sathyamangalam');
                          setShowAssignModal(true);
                        }}
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
                        {o.village ? 'Reassign' : 'Assign'}
                      </button>

                      {o.village && (
                        <button
                          onClick={() => {
                            setSelectedOfficer(o);
                            setShowRevokeModal(true);
                          }}
                          style={{
                            background: '#fee2e2',
                            color: '#991b1b',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.4rem 0.75rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Create Officer */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '520px', width: '100%', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserPlus size={22} color="#4338ca" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>Create Officer Account</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateOfficer} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. K. Murugesan"
                  value={createForm.fullName}
                  onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>Officer Email *</label>
                <input
                  type="email"
                  required
                  placeholder="officer.name@example.com"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="9443210000"
                  value={createForm.phoneNumber}
                  onChange={(e) => setCreateForm({ ...createForm, phoneNumber: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                  Jurisdiction Village / City (Optional)
                </label>
                <select
                  value={isCustomCreate ? '__NEW__' : createForm.village}
                  onChange={(e) => {
                    if (e.target.value === '__NEW__') {
                      setIsCustomCreate(true);
                      setCreateForm({ ...createForm, village: '' });
                    } else {
                      setIsCustomCreate(false);
                      setCreateForm({ ...createForm, village: e.target.value });
                    }
                  }}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem' }}
                >
                  <option value="">-- No Initial Assignment --</option>
                  {villages.map((v) => (
                    <option key={v.name} value={v.name}>{v.name}</option>
                  ))}
                  <option value="__NEW__" style={{ fontWeight: 700, color: '#4338ca' }}>
                    + Assign to a New City or Village...
                  </option>
                </select>

                {isCustomCreate && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <input
                      type="text"
                      required
                      placeholder="Enter new city or village name (e.g. Keeranur, Tiruppur, Coimbatore)..."
                      value={customVillageCreate}
                      onChange={(e) => setCustomVillageCreate(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1.5px solid #6366f1', borderRadius: '8px', fontSize: '0.85rem', background: '#f5f3ff' }}
                    />
                    <div style={{ fontSize: '0.75rem', color: '#6366f1', marginTop: '0.25rem', fontWeight: 600 }}>
                      ✓ A new village jurisdiction with starting budget will be created automatically.
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{ padding: '0.6rem 1rem', background: '#f1f5f9', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ padding: '0.6rem 1.25rem', background: '#312e81', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  {submitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Assign Officer */}
      {showAssignModal && selectedOfficer && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '500px', width: '100%', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={22} color="#4338ca" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>Assign Village Jurisdiction</h3>
              </div>
              <button onClick={() => setShowAssignModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>

            <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', marginBottom: '1.25rem', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Selected Officer:</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{selectedOfficer.fullName}</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{selectedOfficer.email}</div>
            </div>

            <form onSubmit={handleAssignOfficer} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                  Target Panchayat / City *
                </label>
                <select
                  value={isCustomAssign ? '__NEW__' : assignVillage}
                  onChange={(e) => {
                    if (e.target.value === '__NEW__') {
                      setIsCustomAssign(true);
                    } else {
                      setIsCustomAssign(false);
                      setAssignVillage(e.target.value);
                    }
                  }}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem' }}
                >
                  {villages.map((v) => (
                    <option key={v.name} value={v.name}>{v.name}</option>
                  ))}
                  <option value="__NEW__" style={{ fontWeight: 700, color: '#4338ca' }}>
                    + Assign to a New City or Village...
                  </option>
                </select>

                {isCustomAssign && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <input
                      type="text"
                      required
                      placeholder="Enter new city or village name (e.g. Keeranur, Tiruppur, Coimbatore)..."
                      value={customVillageAssign}
                      onChange={(e) => setCustomVillageAssign(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1.5px solid #6366f1', borderRadius: '8px', fontSize: '0.85rem', background: '#f5f3ff' }}
                    />
                    <div style={{ fontSize: '0.75rem', color: '#6366f1', marginTop: '0.25rem', fontWeight: 600 }}>
                      ✓ The officer will be assigned to this new city, and it will be added to the village network.
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>Assignment Notes / Justification</label>
                <textarea
                  rows="3"
                  placeholder="Official transfer or jurisdiction reassignment notes..."
                  value={assignNotes}
                  onChange={(e) => setAssignNotes(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ background: '#fef3c7', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #fde68a', fontSize: '0.78rem', color: '#92400e', display: 'flex', gap: '0.5rem' }}>
                <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                <span>
                  If {assignVillage} currently has another active officer, their assignment will be automatically archived into history, and this officer will become the sole active officer.
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  style={{ padding: '0.6rem 1rem', background: '#f1f5f9', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ padding: '0.6rem 1.25rem', background: '#312e81', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  {submitting ? 'Assigning...' : 'Confirm Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Revoke Officer Confirmation */}
      {showRevokeModal && selectedOfficer && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '460px', width: '100%', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#dc2626' }}>
              <div style={{ padding: '0.6rem', background: '#fee2e2', borderRadius: '50%' }}>
                <AlertTriangle size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>Revoke Officer Assignment</h3>
            </div>

            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
              Are you sure you want to revoke <strong>{selectedOfficer.fullName}</strong> from <strong>{selectedOfficer.village}</strong>?
            </p>

            <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.78rem', color: '#64748b', marginBottom: '1.25rem' }}>
              ✓ The officer account will <strong>NOT</strong> be deleted.<br />
              ✓ Their historical approvals and records remain intact.<br />
              ✓ They will immediately lose access to village-scoped officer queries.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setShowRevokeModal(false)}
                style={{ padding: '0.6rem 1rem', background: '#f1f5f9', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRevokeOfficer}
                disabled={submitting}
                style={{ padding: '0.6rem 1.25rem', background: '#dc2626', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                {submitting ? 'Revoking...' : 'Confirm Revocation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
