import api from './api';

export const serviceRequestService = {
  createRequest: async (data) => {
    const response = await api.post('/api/citizen/service-requests', data);
    return response.data;
  },

  getMyRequests: async () => {
    const response = await api.get('/api/citizen/service-requests');
    return response.data;
  },

  getRequestById: async (id) => {
    const response = await api.get(`/api/citizen/service-requests/${id}`);
    return response.data;
  },

  getAllRequests: async () => {
    const response = await api.get('/api/officer/service-requests');
    return response.data;
  },

  reviewRequest: async (id, reviewData) => {
    const response = await api.post(`/api/officer/service-requests/${id}/review`, reviewData);
    return response.data;
  },
};
