import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import {
  Download,
  Calendar,
  Building2,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  Hammer,
  ShieldCheck,
  RefreshCw,
  Landmark,
  FileCheck,
  MessageSquare,
  History,
  Filter,
} from 'lucide-react';

export const Reports = () => {
  // Filters & Parameters
  const [selectedMonth, setSelectedMonth] = useState('2026-10');
  const [fromDate, setFromDate] = useState('2026-10-01');
  const [toDate, setToDate] = useState('2026-10-31');
  const [selectedVillage, setSelectedVillage] = useState('all');

  // Live Data
  const [villages, setVillages] = useState([]);
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [grievances, setGrievances] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [developmentWorks, setDevelopmentWorks] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Report Metadata
  const [generatedAt, setGeneratedAt] = useState(new Date());
  const [reportRef] = useState(`TN-UCMS/REP/${selectedMonth.replace('-', '')}/${Math.floor(1000 + Math.random() * 9000)}`);


  // Month Options for quick select
  const MONTH_OPTIONS = [
    { label: 'October 2026 (Current)', value: '2026-10', from: '2026-10-01', to: '2026-10-31' },
    { label: 'September 2026', value: '2026-09', from: '2026-09-01', to: '2026-09-30' },
    { label: 'August 2026', value: '2026-08', from: '2026-08-01', to: '2026-08-31' },
    { label: 'July 2026', value: '2026-07', from: '2026-07-01', to: '2026-07-31' },
    { label: 'June 2026', value: '2026-06', from: '2026-06-01', to: '2026-06-30' },
  ];

  const loadAllData = async () => {
    setLoading(true);
    setError('');
    try {
      const [
        vRes,
        sRes,
        appRes,
        grievRes,
        certRes,
        workRes,
        auditRes,
      ] = await Promise.all([
        adminService.getVillages().catch(() => []),
        adminService.getDashboardStats().catch(() => null),
        adminService.getApplications('all').catch(() => []),
        adminService.getGrievances('all').catch(() => []),
        adminService.getCertificates('all').catch(() => []),
        adminService.getDevelopmentWorks('all').catch(() => []),
        adminService.getAuditLogs(0, 100).catch(() => ({ content: [] })),
      ]);

      setVillages(vRes || []);
      setStats(sRes || null);
      setApplications(appRes || []);
      setGrievances(grievRes || []);
      setCertificates(certRes || []);
      setDevelopmentWorks(workRes || []);
      setAuditLogs(auditRes?.content || auditRes || []);
      setGeneratedAt(new Date());
    } catch (err) {
      console.error('Failed to load comprehensive reporting data:', err);
      setError('Failed to load reporting records from backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);



  const handleMonthChange = (e) => {
    const val = e.target.value;
    setSelectedMonth(val);
    const found = MONTH_OPTIONS.find((m) => m.value === val);
    if (found) {
      setFromDate(found.from);
      setToDate(found.to);
    }
  };

  // Helper date calculations
  const calculateDays = () => {
    if (!fromDate || !toDate) return 0;
    const d1 = new Date(fromDate);
    const d2 = new Date(toDate);
    const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 1;
  };

  const formatDayDate = (dStr) => {
    if (!dStr) return 'N/A';
    const d = new Date(dStr);
    if (isNaN(d.getTime())) return dStr;
    return d.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dStr) => {
    if (!dStr) return '';
    const d = new Date(dStr);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Date Range Filtering
  const isWithinPeriod = (dateVal) => {
    if (!dateVal) return true; // Include if date unavailable
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return true;
    const start = new Date(fromDate + 'T00:00:00');
    const end = new Date(toDate + 'T23:59:59');
    return d >= start && d <= end;
  };

  // Filtered Datasets
  const filteredApps = applications.filter((a) => {
    const vMatch = selectedVillage === 'all' || a.village?.toLowerCase() === selectedVillage.toLowerCase();
    const dMatch = isWithinPeriod(a.createdAt || a.appliedAt);
    return vMatch && dMatch;
  });

  const filteredGrievances = grievances.filter((g) => {
    const vMatch = selectedVillage === 'all' || g.village?.toLowerCase() === selectedVillage.toLowerCase();
    const dMatch = isWithinPeriod(g.createdAt);
    return vMatch && dMatch;
  });

  const filteredCerts = certificates.filter((c) => {
    const vMatch = selectedVillage === 'all' || c.village?.toLowerCase() === selectedVillage.toLowerCase();
    const dMatch = isWithinPeriod(c.createdAt || c.requestedAt);
    return vMatch && dMatch;
  });

  const filteredWorks = developmentWorks.filter((w) => {
    const vMatch = selectedVillage === 'all' || w.village?.toLowerCase() === selectedVillage.toLowerCase();
    const dMatch = isWithinPeriod(w.createdAt || w.startDate);
    return vMatch && dMatch;
  });

  const filteredAudits = auditLogs.filter((l) => isWithinPeriod(l.timestamp));

  // Print Action
  const handlePrint = () => {
    window.print();
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Category', 'Record_ID', 'Citizen_Name', 'Village', 'Subject_or_Scheme', 'Status', 'Date', 'Time'];
    const rows = [];

    filteredApps.forEach((a) => {
      rows.push([
        'Application',
        a.applicationId || a.id,
        `"${a.citizenName || ''}"`,
        a.village || '',
        `"${a.schemeName || ''}"`,
        a.status || '',
        formatDayDate(a.createdAt),
        formatTime(a.createdAt),
      ]);
    });

    filteredGrievances.forEach((g) => {
      rows.push([
        'Grievance',
        g.ticketNumber || g.id,
        `"${g.citizenName || ''}"`,
        g.village || '',
        `"${g.title || g.category || ''}"`,
        g.status || '',
        formatDayDate(g.createdAt),
        formatTime(g.createdAt),
      ]);
    });

    filteredCerts.forEach((c) => {
      rows.push([
        'Certificate',
        c.certificateNumber || c.id,
        `"${c.citizenName || ''}"`,
        c.village || '',
        c.certificateType || '',
        c.status || '',
        formatDayDate(c.createdAt),
        formatTime(c.createdAt),
      ]);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `UCMS_Report_${fromDate}_to_${toDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // KPI calculations
  const totalAllocated = villages.reduce((acc, v) => acc + (v.totalAllocatedBudget || 0), 0);
  const totalSpent = villages.reduce((acc, v) => acc + (v.totalSpentBudget || 0), 0);
  const overallUtil = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;

  return (
    <div style={{ maxWidth: '1350px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Print Specific CSS */}
      <style>{`
        @media print {
          .no-print, aside, header, nav {
            display: none !important;
          }
          body, html, .app-container, main {
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            overflow: visible !important;
          }
          .report-printable-sheet {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
          }
          .page-break {
            page-break-before: always;
            break-before: page;
          }
          table {
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
        }
      `}</style>

      {/* Screen Control Bar (Hidden on Print) */}
      <div
        className="no-print"
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '1.25rem 1.5rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={22} color="#4338ca" /> Executive Monthly Governance & Audit Report
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>
            Generate, inspect, and print official Tamil Nadu Gram Panchayat administrative records.
          </p>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
          {/* Quick Month Select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar size={15} color="#4338ca" />
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              style={{
                padding: '0.5rem 0.75rem',
                border: '1.5px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.825rem',
                fontWeight: 600,
                color: '#1e293b',
                background: '#ffffff',
              }}
            >
              {MONTH_OPTIONS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          {/* From Date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>From:</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              style={{
                padding: '0.45rem 0.65rem',
                border: '1.5px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.825rem',
                color: '#0f172a',
              }}
            />
          </div>

          {/* To Date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>To:</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              style={{
                padding: '0.45rem 0.65rem',
                border: '1.5px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.825rem',
                color: '#0f172a',
              }}
            />
          </div>

          {/* Village Scope */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Filter size={15} color="#64748b" />
            <select
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value)}
              style={{
                padding: '0.5rem 0.75rem',
                border: '1.5px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.825rem',
                fontWeight: 600,
              }}
            >
              <option value="all">All Jurisdictions (Consolidated)</option>
              {villages.map((v) => (
                <option key={v.name} value={v.name}>{v.name}</option>
              ))}
            </select>
          </div>

          {/* Actions */}

          <button
            onClick={handleExportCSV}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#f8fafc',
              color: '#334155',
              border: '1.5px solid #cbd5e1',
              borderRadius: '8px',
              padding: '0.55rem 0.85rem',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Download size={15} /> Export CSV
          </button>

          <button
            onClick={loadAllData}
            title="Reload Data"
            style={{
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '0.55rem 0.65rem',
              cursor: 'pointer',
              color: '#475569',
            }}
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* OFFICIAL PRINTABLE REPORT CONTAINER (Visible on Screen & PDF) */}
      {/* ============================================================== */}
      <div
        className="report-printable-sheet"
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '2.5rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* 1. Official Government Header */}
        <div style={{ borderBottom: '2.5px solid #0f172a', paddingBottom: '1.5rem', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #0f172a, #1e1b4b)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 16px rgba(15, 23, 42, 0.25)',
                }}
              >
                <Landmark size={38} color="#f8fafc" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1px', color: '#4338ca', textTransform: 'uppercase' }}>
                  Government of Tamil Nadu • Rural Development & Panchayat Raj
                </div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: '0.2rem 0 0', letterSpacing: '-0.5px' }}>
                  Unified Citizen Management System (UCMS)
                </h1>
                <div style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                  Executive Governance, Civic Operations & Financial Audit Report
                </div>
              </div>
            </div>


          </div>

          {/* 2. Official Metadata Matrix */}
          <div
            style={{
              marginTop: '1.5rem',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '1rem 1.25rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              fontSize: '0.825rem',
            }}
          >
            <div>
              <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Document Reference No:</div>
              <div style={{ fontWeight: 800, color: '#0f172a', fontFamily: 'monospace', fontSize: '0.9rem' }}>{reportRef}</div>
            </div>

            <div>
              <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Reporting Period (From - To):</div>
              <div style={{ fontWeight: 800, color: '#1e1b4b' }}>
                {formatDayDate(fromDate)} <span style={{ color: '#64748b' }}>to</span> {formatDayDate(toDate)}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700 }}>
                Total Duration: {calculateDays()} Calendar Days
              </div>
            </div>

            <div>
              <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Report Generation Day & Time:</div>
              <div style={{ fontWeight: 800, color: '#0f172a' }}>
                {formatDayDate(generatedAt)}
              </div>
              <div style={{ color: '#4338ca', fontWeight: 700, fontSize: '0.75rem' }}>
                Exact Time: {formatTime(generatedAt)} (IST)
              </div>
            </div>

            <div>
              <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Jurisdiction & Sign-Off:</div>
              <div style={{ fontWeight: 700, color: '#0f172a' }}>
                {selectedVillage === 'all' ? 'All Gram Panchayats (Consolidated)' : selectedVillage}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Authorized: Central Administrator</div>
            </div>
          </div>
        </div>

        {/* 3. Executive KPI Dashboard Summary */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            I. Key Civic Performance Indicators (KPI Summary)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
            {/* KPI 1 */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem', background: '#f8fafc' }}>
              <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Citizen Applications</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: '0.2rem 0' }}>{filteredApps.length}</div>
              <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>
                Approved: {filteredApps.filter((a) => a.status === 'APPROVED').length} • Pending: {filteredApps.filter((a) => a.status === 'PENDING').length}
              </div>
            </div>

            {/* KPI 2 */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem', background: '#f8fafc' }}>
              <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Public Grievances</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: '0.2rem 0' }}>{filteredGrievances.length}</div>
              <div style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 600 }}>
                Resolved: {filteredGrievances.filter((g) => g.status === 'RESOLVED').length} • Open: {filteredGrievances.filter((g) => g.status !== 'RESOLVED').length}
              </div>
            </div>

            {/* KPI 3 */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem', background: '#f8fafc' }}>
              <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>e-Certificates Issued</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: '0.2rem 0' }}>{filteredCerts.length}</div>
              <div style={{ fontSize: '0.72rem', color: '#8b5cf6', fontWeight: 600 }}>Income, Residence & Caste Orders</div>
            </div>

            {/* KPI 4 */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem', background: '#f8fafc' }}>
              <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Grants Allocated</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: '0.2rem 0' }}>{formatCurrency(totalAllocated)}</div>
              <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>Spent: {formatCurrency(totalSpent)} ({overallUtil}%)</div>
            </div>
          </div>
        </div>

        {/* 4. Multi-Panchayat Performance & Financial Matrix */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            II. Gram Panchayat Jurisdictional Performance & Budget Matrix
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.825rem' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                <th style={{ padding: '0.75rem 0.85rem', fontWeight: 700, color: '#334155' }}>Panchayat Name</th>
                <th style={{ padding: '0.75rem 0.85rem', fontWeight: 700, color: '#334155' }}>Assigned Officer</th>
                <th style={{ padding: '0.75rem 0.85rem', fontWeight: 700, color: '#334155', textAlign: 'center' }}>Citizens</th>
                <th style={{ padding: '0.75rem 0.85rem', fontWeight: 700, color: '#334155', textAlign: 'center' }}>Applications</th>
                <th style={{ padding: '0.75rem 0.85rem', fontWeight: 700, color: '#334155', textAlign: 'center' }}>Grievances</th>
                <th style={{ padding: '0.75rem 0.85rem', fontWeight: 700, color: '#334155', textAlign: 'center' }}>Works</th>
                <th style={{ padding: '0.75rem 0.85rem', fontWeight: 700, color: '#334155' }}>Allocated Grant</th>
                <th style={{ padding: '0.75rem 0.85rem', fontWeight: 700, color: '#334155' }}>Expenditure</th>
                <th style={{ padding: '0.75rem 0.85rem', fontWeight: 700, color: '#334155', textAlign: 'center' }}>Util %</th>
              </tr>
            </thead>
            <tbody>
              {villages.map((v) => {
                const alloc = v.totalAllocatedBudget || 0;
                const spent = v.totalSpentBudget || 0;
                const pct = alloc > 0 ? Math.round((spent / alloc) * 100) : 0;

                return (
                  <tr key={v.name} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.75rem 0.85rem', fontWeight: 800, color: '#0f172a' }}>{v.name}</td>
                    <td style={{ padding: '0.75rem 0.85rem', color: '#475569' }}>{v.officerName || 'Vacant / Unassigned'}</td>
                    <td style={{ padding: '0.75rem 0.85rem', textAlign: 'center', fontWeight: 600 }}>{v.citizenCount}</td>
                    <td style={{ padding: '0.75rem 0.85rem', textAlign: 'center', fontWeight: 600 }}>{v.applicationCount}</td>
                    <td style={{ padding: '0.75rem 0.85rem', textAlign: 'center', fontWeight: 600 }}>{v.grievanceCount}</td>
                    <td style={{ padding: '0.75rem 0.85rem', textAlign: 'center', fontWeight: 600 }}>{v.developmentWorkCount}</td>
                    <td style={{ padding: '0.75rem 0.85rem', fontWeight: 700 }}>{formatCurrency(alloc)}</td>
                    <td style={{ padding: '0.75rem 0.85rem', fontWeight: 700, color: '#16a34a' }}>{formatCurrency(spent)}</td>
                    <td style={{ padding: '0.75rem 0.85rem', textAlign: 'center' }}>
                      <span
                        style={{
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: pct > 85 ? '#fee2e2' : '#ecfdf5',
                          color: pct > 85 ? '#991b1b' : '#065f46',
                        }}
                      >
                        {pct}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: '#f8fafc', fontWeight: 800, borderTop: '2px solid #cbd5e1' }}>
                <td style={{ padding: '0.75rem 0.85rem' }} colSpan={2}>State Total / Consolidated</td>
                <td style={{ padding: '0.75rem 0.85rem', textAlign: 'center' }}>{villages.reduce((a, b) => a + (b.citizenCount || 0), 0)}</td>
                <td style={{ padding: '0.75rem 0.85rem', textAlign: 'center' }}>{villages.reduce((a, b) => a + (b.applicationCount || 0), 0)}</td>
                <td style={{ padding: '0.75rem 0.85rem', textAlign: 'center' }}>{villages.reduce((a, b) => a + (b.grievanceCount || 0), 0)}</td>
                <td style={{ padding: '0.75rem 0.85rem', textAlign: 'center' }}>{villages.reduce((a, b) => a + (b.developmentWorkCount || 0), 0)}</td>
                <td style={{ padding: '0.75rem 0.85rem', color: '#1e1b4b' }}>{formatCurrency(totalAllocated)}</td>
                <td style={{ padding: '0.75rem 0.85rem', color: '#16a34a' }}>{formatCurrency(totalSpent)}</td>
                <td style={{ padding: '0.75rem 0.85rem', textAlign: 'center' }}>{overallUtil}%</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* 5. Detailed Activity Log: Scheme Applications */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              III. Citizen Welfare Scheme Applications in Selected Period ({filteredApps.length})
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Filtered by: {fromDate} to {toDate}</span>
          </div>

          {filteredApps.length === 0 ? (
            <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1', fontSize: '0.8rem', color: '#64748b', textAlign: 'center' }}>
              No applications submitted during this date range.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', borderBottom: '1.5px solid #cbd5e1' }}>
                  <th style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Application ID</th>
                  <th style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Citizen Name</th>
                  <th style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Panchayat</th>
                  <th style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Welfare Scheme</th>
                  <th style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Day, Date & Time</th>
                  <th style={{ padding: '0.65rem 0.75rem', fontWeight: 700, textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((a) => (
                  <tr key={a.id || a.applicationId} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.65rem 0.75rem', fontFamily: 'monospace', fontWeight: 700 }}>{a.applicationId || `APP-${a.id}`}</td>
                    <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#0f172a' }}>{a.citizenName}</td>
                    <td style={{ padding: '0.65rem 0.75rem' }}>{a.village}</td>
                    <td style={{ padding: '0.65rem 0.75rem', color: '#334155' }}>{a.schemeName}</td>
                    <td style={{ padding: '0.65rem 0.75rem', color: '#475569', fontSize: '0.75rem' }}>
                      <strong>{formatDayDate(a.createdAt)}</strong> • {formatTime(a.createdAt)}
                    </td>
                    <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>
                      <span
                        style={{
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.725rem',
                          fontWeight: 700,
                          background: a.status === 'APPROVED' ? '#dcfce7' : a.status === 'REJECTED' ? '#fee2e2' : '#fef3c7',
                          color: a.status === 'APPROVED' ? '#166534' : a.status === 'REJECTED' ? '#991b1b' : '#92400e',
                        }}
                      >
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 6. Detailed Activity Log: Public Grievance Redressal */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              IV. Public Grievances Registered & Redressed ({filteredGrievances.length})
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Filtered by: {fromDate} to {toDate}</span>
          </div>

          {filteredGrievances.length === 0 ? (
            <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1', fontSize: '0.8rem', color: '#64748b', textAlign: 'center' }}>
              No grievances filed during this date range.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', borderBottom: '1.5px solid #cbd5e1' }}>
                  <th style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Ticket ID</th>
                  <th style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Complainant</th>
                  <th style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Panchayat</th>
                  <th style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Category & Subject</th>
                  <th style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Logged Day, Date & Time</th>
                  <th style={{ padding: '0.65rem 0.75rem', fontWeight: 700, textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrievances.map((g) => (
                  <tr key={g.id || g.ticketNumber} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.65rem 0.75rem', fontFamily: 'monospace', fontWeight: 700 }}>{g.ticketNumber || `GRV-${g.id}`}</td>
                    <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#0f172a' }}>{g.citizenName}</td>
                    <td style={{ padding: '0.65rem 0.75rem' }}>{g.village}</td>
                    <td style={{ padding: '0.65rem 0.75rem', color: '#334155' }}>
                      <span style={{ fontWeight: 600 }}>{g.category || 'General'}:</span> {g.title || g.description}
                    </td>
                    <td style={{ padding: '0.65rem 0.75rem', color: '#475569', fontSize: '0.75rem' }}>
                      <strong>{formatDayDate(g.createdAt)}</strong> • {formatTime(g.createdAt)}
                    </td>
                    <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>
                      <span
                        style={{
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.725rem',
                          fontWeight: 700,
                          background: g.status === 'RESOLVED' ? '#dcfce7' : '#fef3c7',
                          color: g.status === 'RESOLVED' ? '#166534' : '#92400e',
                        }}
                      >
                        {g.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 7. Detailed Activity Log: Development Works Progress */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              V. Village Infrastructure & Development Works Outlay ({filteredWorks.length})
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Coverage: {fromDate} to {toDate}</span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderBottom: '1.5px solid #cbd5e1' }}>
                <th style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Work ID</th>
                <th style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Project Title</th>
                <th style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Panchayat</th>
                <th style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Sector</th>
                <th style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Approved Outlay</th>
                <th style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Start Day & Time</th>
                <th style={{ padding: '0.65rem 0.75rem', fontWeight: 700, textAlign: 'center' }}>Progress</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorks.map((w) => (
                <tr key={w.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.65rem 0.75rem', fontFamily: 'monospace', fontWeight: 700 }}>DW-{w.id}</td>
                  <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700, color: '#0f172a' }}>{w.title}</td>
                  <td style={{ padding: '0.65rem 0.75rem' }}>{w.village}</td>
                  <td style={{ padding: '0.65rem 0.75rem', color: '#475569' }}>{w.category || 'Infrastructure'}</td>
                  <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700, color: '#16a34a' }}>{formatCurrency(w.estimatedCost)}</td>
                  <td style={{ padding: '0.65rem 0.75rem', color: '#475569', fontSize: '0.75rem' }}>
                    <strong>{formatDayDate(w.createdAt || w.startDate)}</strong> • {formatTime(w.createdAt || w.startDate) || '10:00 AM'}
                  </td>
                  <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>
                    <span
                      style={{
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.725rem',
                        fontWeight: 700,
                        background: w.status === 'COMPLETED' ? '#dcfce7' : '#eff6ff',
                        color: w.status === 'COMPLETED' ? '#166534' : '#1d4ed8',
                      }}
                    >
                      {w.status || 'IN_PROGRESS'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 8. Detailed Activity Log: Governance Audit Trail */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              VI. Governance Actions & Administrative System Audit Trail ({filteredAudits.length})
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Immutable Security Log</span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.78rem' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderBottom: '1.5px solid #cbd5e1' }}>
                <th style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Event Day, Date & Time</th>
                <th style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Admin / Officer Actor</th>
                <th style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Category</th>
                <th style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Target Entity</th>
                <th style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Administrative Log Narrative</th>
              </tr>
            </thead>
            <tbody>
              {filteredAudits.slice(0, 15).map((l) => (
                <tr key={l.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.65rem 0.75rem', color: '#0f172a', whiteSpace: 'nowrap' }}>
                    <strong>{formatDayDate(l.timestamp)}</strong>
                    <div style={{ color: '#4338ca', fontSize: '0.72rem', fontWeight: 600 }}>{formatTime(l.timestamp)}</div>
                  </td>
                  <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#334155' }}>{l.actorEmail}</td>
                  <td style={{ padding: '0.65rem 0.75rem' }}>
                    <span style={{ padding: '0.15rem 0.45rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, background: '#f1f5f9', color: '#334155' }}>
                      {l.actionType}
                    </span>
                  </td>
                  <td style={{ padding: '0.65rem 0.75rem', color: '#64748b', fontFamily: 'monospace' }}>
                    {l.entityName} #{l.entityId}
                  </td>
                  <td style={{ padding: '0.65rem 0.75rem', color: '#334155' }}>{l.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        {/* 9. Official Document Sign-Off & Verification Block (Printed at Footer) */}
        <div
          style={{
            marginTop: '3rem',
            paddingTop: '1.5rem',
            borderTop: '2px solid #0f172a',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem',
            textAlign: 'center',
            fontSize: '0.8rem',
          }}
        >
          <div>
            <div style={{ height: '50px' }}></div>
            <div style={{ borderTop: '1px solid #475569', paddingTop: '0.35rem', fontWeight: 800, color: '#0f172a' }}>
              Prepared by: Central Data Officer
            </div>
            <div style={{ fontSize: '0.725rem', color: '#64748b' }}>UCMS Data Centre, Tamil Nadu</div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.15rem' }}>
              Timestamp: {formatDayDate(generatedAt)} {formatTime(generatedAt)}
            </div>
          </div>

          <div>
            <div style={{ height: '50px' }}></div>
            <div style={{ borderTop: '1px solid #475569', paddingTop: '0.35rem', fontWeight: 800, color: '#0f172a' }}>
              Verified by: Block Development Officer (BDO)
            </div>
            <div style={{ fontSize: '0.725rem', color: '#64748b' }}>Panchayat Union Administration</div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.15rem' }}>
              Seal & Inspection Verification
            </div>
          </div>

          <div>
            <div style={{ height: '50px' }}></div>
            <div style={{ borderTop: '1px solid #475569', paddingTop: '0.35rem', fontWeight: 800, color: '#0f172a' }}>
              Approved by: District Collector & Magistrate
            </div>
            <div style={{ fontSize: '0.725rem', color: '#64748b' }}>Rural Development Division</div>
            <div style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700, marginTop: '0.15rem' }}>
              ✓ Digitally Certified & Published
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.72rem', color: '#94a3b8' }}>
          This document is an electronically generated official performance and financial report from the Unified Citizen Management System (UCMS).
          Generated under Government of Tamil Nadu e-Governance Rules.
        </div>
      </div>
    </div>
  );
};
