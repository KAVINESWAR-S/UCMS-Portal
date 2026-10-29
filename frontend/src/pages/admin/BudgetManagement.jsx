import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import {
  Wallet,
  Building2,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Edit3,
  X,
  CheckCircle2,
  Hammer,
  DollarSign,
} from 'lucide-react';

export const BudgetManagement = () => {
  const [budgets, setBudgets] = useState([]);
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Edit Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [formAllocation, setFormAllocation] = useState('');
  const [formSpent, setFormSpent] = useState('');
  const [formYear, setFormYear] = useState('2025-2026');
  const [submitting, setSubmitting] = useState(false);

  const [searchParams] = useSearchParams();

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [budgetsRes, worksRes] = await Promise.all([
        adminService.getBudgets(),
        adminService.getDevelopmentWorks(),
      ]);
      setBudgets(budgetsRes);
      setWorks(worksRes);

      const targetVillage = searchParams.get('village');
      if (targetVillage) {
        const found = budgetsRes.find((b) => b.village?.toLowerCase() === targetVillage.toLowerCase());
        if (found) {
          handleOpenEdit(found);
        }
      }
    } catch (err) {
      setError('Failed to fetch budget records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleOpenEdit = (b) => {
    setSelectedBudget(b);
    setFormAllocation(b.totalAllocation?.toString() || '0');
    setFormSpent(b.spentAmount?.toString() || '0');
    setFormYear(b.financialYear || '2025-2026');
    setShowEditModal(true);
    setError('');
  };

  const handleUpdateBudget = async (e) => {
    e.preventDefault();
    setError('');
    const alloc = parseFloat(formAllocation);
    const spent = parseFloat(formSpent);

    if (isNaN(alloc) || alloc < 0) {
      setError('Total allocation must be a valid positive number.');
      return;
    }
    if (isNaN(spent) || spent < 0) {
      setError('Spent amount must be a non-negative number.');
      return;
    }
    if (spent > alloc) {
      setError('Spent amount cannot exceed the total allocated budget.');
      return;
    }

    setSubmitting(true);
    try {
      await adminService.updateVillageBudget(selectedBudget.village, {
        village: selectedBudget.village,
        financialYear: formYear,
        totalAllocation: alloc,
        spentAmount: spent,
      });

      setSuccessMsg(`Successfully updated budget allocation for ${selectedBudget.village}.`);
      setShowEditModal(false);
      setSelectedBudget(null);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update village budget.');
    } finally {
      setSubmitting(false);
    }
  };

  // Compute Total Stats
  const totalAllocated = budgets.reduce((acc, b) => acc + (Number(b.totalAllocation) || 0), 0);
  const totalSpent = budgets.reduce((acc, b) => acc + (Number(b.spentAmount) || 0), 0);
  const totalRemaining = totalAllocated - totalSpent;
  const overallPct = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Village Budget Allocations & Transparency
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.25rem 0 0' }}>
            Per-panchayat financial grant oversight, development expenditure synchronization, and funds tracking.
          </p>
        </div>

        <button
          onClick={loadData}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: '#ffffff',
            border: '1.5px solid #cbd5e1',
            borderRadius: '8px',
            padding: '0.55rem 0.9rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            color: '#334155',
          }}
        >
          <RefreshCw size={14} /> Refresh Budgets
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

      {/* Aggregate Financial Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '1.25rem 1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Multi-Village Grant</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0.3rem 0' }}>{formatCurrency(totalAllocated)}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Combined state & local allocations</div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '1.25rem 1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Disbursed & Spent</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#16a34a', margin: '0.3rem 0' }}>{formatCurrency(totalSpent)}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Overall Utilization: <strong>{overallPct}%</strong></div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '1.25rem 1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Uncommitted Funds Remaining</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#2563eb', margin: '0.3rem 0' }}>{formatCurrency(totalRemaining)}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Available for new infrastructure</div>
        </div>
      </div>

      {/* Village Budgets Table */}
      <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem' }}>
          Village-by-Village Budget Allocations (FY 2025-2026)
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', background: '#f8fafc' }}>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Panchayat</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>FY</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Allocated Budget</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Spent Amount</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Remaining</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Utilization</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((b) => {
                const alloc = Number(b.totalAllocation) || 0;
                const spent = Number(b.spentAmount) || 0;
                const remaining = Number(b.remainingAmount) || (alloc - spent);
                const pct = alloc > 0 ? Math.min(100, Math.round((spent / alloc) * 100)) : 0;

                return (
                  <tr key={b.id || b.village} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem', fontWeight: 700, color: '#0f172a' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Building2 size={16} color="#4338ca" />
                        <span>{b.village}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem' }}>{b.financialYear || '2025-2026'}</td>
                    <td style={{ padding: '1rem', fontWeight: 700, color: '#0f172a' }}>{formatCurrency(alloc)}</td>
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#16a34a' }}>{formatCurrency(spent)}</td>
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#2563eb' }}>{formatCurrency(remaining)}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ width: '140px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                          <span>{pct}%</span>
                        </div>
                        <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: pct > 85 ? '#ef4444' : '#10b981', borderRadius: '3px' }} />
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleOpenEdit(b)}
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
                        <Edit3 size={13} /> Update Budget
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Budget Modal */}
      {showEditModal && selectedBudget && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '480px', width: '100%', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Wallet size={22} color="#16a34a" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                  Update Budget: {selectedBudget.village}
                </h3>
              </div>
              <button onClick={() => setShowEditModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleUpdateBudget} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>Financial Year</label>
                <input
                  type="text"
                  required
                  value={formYear}
                  onChange={(e) => setFormYear(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>Total Allocation (₹) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="1000"
                  value={formAllocation}
                  onChange={(e) => setFormAllocation(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>Current Spent Amount (₹) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="1000"
                  value={formSpent}
                  onChange={(e) => setFormSpent(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.78rem', color: '#64748b' }}>
                Note: Updating this allocation immediately updates the Village Officer's Transparency view. Spent amounts are verified against development projects.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={{ padding: '0.6rem 1rem', background: '#f1f5f9', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ padding: '0.6rem 1.25rem', background: '#16a34a', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  {submitting ? 'Saving...' : 'Save Allocation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
