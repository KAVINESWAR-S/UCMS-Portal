import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import {
  AlertTriangle,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  Building2,
  FileText,
  Eye,
  X,
  Cpu,
  BarChart2,
} from 'lucide-react';

export const AiFraudMonitoring = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [highRiskOnly, setHighRiskOnly] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getAiFraudAnalyses();
      setAnalyses(data);
    } catch (err) {
      setError('Failed to fetch AI Fraud Analysis records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredAnalyses = analyses.filter((a) => {
    if (highRiskOnly) {
      return a.fraudRiskLevel === 'HIGH' || a.prediction === 'FRAUD' || (a.fraudProbability && a.fraudProbability > 0.6);
    }
    return true;
  });

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            AI Fraud Detection & Risk Analytics
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.25rem 0 0' }}>
            Machine learning fraud probabilities, SHAP feature attributions, and high-risk scheme application alerts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: '#334155', cursor: 'pointer', background: highRiskOnly ? '#fee2e2' : '#ffffff', padding: '0.5rem 0.8rem', borderRadius: '8px', border: '1.5px solid #cbd5e1' }}>
            <input
              type="checkbox"
              checked={highRiskOnly}
              onChange={(e) => setHighRiskOnly(e.target.checked)}
            />
            <span>High Risk Only</span>
          </label>

          <button
            onClick={loadData}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '8px', padding: '0.55rem 0.9rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', color: '#334155' }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: '0.85rem 1rem', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', color: '#991b1b', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Analyses Executed</div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0' }}>{analyses.length}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>FastAPI + ML Model runs</div>
        </div>

        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>High Risk Flags</div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#dc2626', margin: '0.2rem 0' }}>
            {analyses.filter((a) => a.fraudRiskLevel === 'HIGH' || a.prediction === 'FRAUD').length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Requires field physical audit</div>
        </div>

        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Legitimate Clearances</div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#16a34a', margin: '0.2rem 0' }}>
            {analyses.filter((a) => a.fraudRiskLevel === 'LOW' && a.prediction !== 'FRAUD').length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Verified low fraud likelihood</div>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', background: '#f8fafc' }}>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Application</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Applicant & Village</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>ML Prediction</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Fraud Probability</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Risk Level</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAnalyses.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                    No AI analysis records found.
                  </td>
                </tr>
              ) : (
                filteredAnalyses.map((a) => {
                  const probPct = a.fraudProbability ? Math.round(a.fraudProbability * 100) : 0;
                  const isHigh = a.fraudRiskLevel === 'HIGH' || a.prediction === 'FRAUD';

                  return (
                    <tr key={a.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '1rem', fontWeight: 700, color: '#4338ca' }}>
                        {a.applicationId || `APP-${a.id}`}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}>{a.citizenEmail}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{a.village || 'Sathyamangalam'}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: isHigh ? '#dc2626' : '#16a34a' }}>
                          {a.prediction || 'LEGITIMATE'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ width: '120px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                            <span>{probPct}%</span>
                          </div>
                          <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${probPct}%`, height: '100%', background: probPct > 50 ? '#dc2626' : '#10b981', borderRadius: '3px' }} />
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span
                          style={{
                            padding: '0.2rem 0.55rem',
                            borderRadius: '9999px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            background: isHigh ? '#fee2e2' : '#ecfdf5',
                            color: isHigh ? '#991b1b' : '#065f46',
                          }}
                        >
                          {a.fraudRiskLevel || 'LOW'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <button
                          onClick={() => setSelectedAnalysis(a)}
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
                          <Eye size={13} /> Inspect SHAP
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SHAP Explanation Modal */}
      {selectedAnalysis && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '600px', width: '100%', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Cpu size={22} color="#4338ca" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                  SHAP Explainability Breakdown
                </h3>
              </div>
              <button onClick={() => setSelectedAnalysis(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem', marginBottom: '1rem' }}>
              <div><strong>Application ID:</strong> {selectedAnalysis.applicationId}</div>
              <div><strong>Risk Level:</strong> {selectedAnalysis.fraudRiskLevel}</div>
              <div><strong>Probability:</strong> {Math.round((selectedAnalysis.fraudProbability || 0) * 100)}%</div>
              <div><strong>Requirement:</strong> {selectedAnalysis.verificationRequirement || 'Standard Verification'}</div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.4rem' }}>
                Feature Attribution & Evidence
              </h4>
              <pre
                style={{
                  background: '#0f172a',
                  color: '#e2e8f0',
                  padding: '1rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  maxHeight: '220px',
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {selectedAnalysis.explanation || 'No detailed SHAP explanation payload available.'}
              </pre>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button
                onClick={() => setSelectedAnalysis(null)}
                style={{ padding: '0.6rem 1.25rem', background: '#312e81', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
