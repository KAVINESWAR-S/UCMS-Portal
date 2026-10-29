import api from './api';

export const adminService = {
  // Dashboard Metrics
  getDashboardStats: async () => {
    const res = await api.get('/api/admin/dashboard/stats');
    return res.data;
  },

  // Village Management
  getVillages: async () => {
    const res = await api.get('/api/admin/villages');
    return res.data;
  },

  getVillageDetail: async (village) => {
    const res = await api.get(`/api/admin/villages/${encodeURIComponent(village)}`);
    return res.data;
  },

  getVillageAssignmentHistory: async (village) => {
    const res = await api.get(`/api/admin/villages/${encodeURIComponent(village)}/assignment-history`);
    return res.data;
  },

  // Officer Management
  getOfficers: async () => {
    const res = await api.get('/api/admin/officers');
    return res.data;
  },

  createOfficer: async (data) => {
    const res = await api.post('/api/admin/officers', data);
    return res.data;
  },

  assignOfficer: async (officerId, data) => {
    const res = await api.post(`/api/admin/officers/${officerId}/assign`, data);
    return res.data;
  },

  revokeOfficer: async (officerId) => {
    const res = await api.post(`/api/admin/officers/${officerId}/revoke`);
    return res.data;
  },

  // Budget Management
  getBudgets: async () => {
    const res = await api.get('/api/admin/budgets');
    return res.data;
  },

  updateVillageBudget: async (village, data) => {
    const res = await api.put(`/api/admin/budgets/${encodeURIComponent(village)}`, data);
    return res.data;
  },

  // Citizen Management
  getCitizens: async (village = '', search = '') => {
    const params = new URLSearchParams();
    if (village && village !== 'all') params.append('village', village);
    if (search) params.append('search', search);
    const res = await api.get(`/api/admin/citizens?${params.toString()}`);
    return res.data;
  },

  getCitizenDetail: async (id) => {
    const res = await api.get(`/api/admin/citizens/${id}`);
    return res.data;
  },

  // Application Management
  getApplications: async (village = '', status = '') => {
    const params = new URLSearchParams();
    if (village && village !== 'all') params.append('village', village);
    if (status && status !== 'ALL') params.append('status', status);
    const res = await api.get(`/api/admin/applications?${params.toString()}`);
    return res.data;
  },

  updateApplicationStatus: async (id, status, remarks = '') => {
    const res = await api.put(`/api/admin/applications/${id}/status`, { status, remarks });
    return res.data;
  },

  // Grievance Management
  getGrievances: async (village = '', status = '') => {
    const params = new URLSearchParams();
    if (village && village !== 'all') params.append('village', village);
    if (status && status !== 'ALL') params.append('status', status);
    const res = await api.get(`/api/admin/grievances?${params.toString()}`);
    return res.data;
  },

  respondGrievance: async (id, response, status) => {
    const res = await api.put(`/api/admin/grievances/${id}/respond`, { response, status });
    return res.data;
  },

  // Certificate Management
  getCertificates: async (village = '', status = '') => {
    const params = new URLSearchParams();
    if (village && village !== 'all') params.append('village', village);
    if (status && status !== 'ALL') params.append('status', status);
    const res = await api.get(`/api/admin/certificates?${params.toString()}`);
    return res.data;
  },

  // Development Works
  getDevelopmentWorks: async (village = '') => {
    const params = new URLSearchParams();
    if (village && village !== 'all') params.append('village', village);
    const res = await api.get(`/api/admin/development-works?${params.toString()}`);
    return res.data;
  },

  createDevelopmentWork: async (data) => {
    const res = await api.post('/api/admin/development-works', data);
    return res.data;
  },

  // Scheme Management
  getSchemes: async () => {
    const res = await api.get('/api/admin/schemes');
    return res.data;
  },

  createScheme: async (data) => {
    const res = await api.post('/api/admin/schemes', data);
    return res.data;
  },

  updateScheme: async (id, data) => {
    const res = await api.put(`/api/admin/schemes/${id}`, data);
    return res.data;
  },

  // AI Fraud Monitoring
  getAiFraudAnalyses: async () => {
    const res = await api.get('/api/admin/ai-fraud');
    return res.data;
  },

  // Audit Logs
  getAuditLogs: async (page = 0, size = 20) => {
    const res = await api.get(`/api/admin/audit-logs?page=${page}&size=${size}`);
    return res.data;
  },
};
