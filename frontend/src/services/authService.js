import api from './api';

export const authService = {
  // Check / Lookup Aadhaar in mock registry
  checkAadhaar: async (aadhaarNumber) => {
    const response = await api.post('/api/auth/aadhaar/check', { aadhaarNumber, identifier: aadhaarNumber });
    return response.data;
  },

  lookupAadhaar: async (identifier) => {
    const response = await api.post('/api/auth/aadhaar/check', { aadhaarNumber: identifier, identifier });
    return response.data;
  },

  // Send 6-digit OTP to registered email
  sendAadhaarOtp: async (aadhaarNumber) => {
    const response = await api.post('/api/auth/aadhaar/send-otp', { aadhaarNumber, identifier: aadhaarNumber });
    return response.data;
  },

  // Verify OTP and sign in / create account
  verifyAadhaarOtp: async (aadhaarNumber, otp) => {
    const response = await api.post('/api/auth/aadhaar/verify-otp', { aadhaarNumber, identifier: aadhaarNumber, otp });
    return response.data;
  },

  // Dedicated Officer login using Email + Password
  loginOfficer: async (data) => {
    const response = await api.post('/api/officer/auth/login', data);
    return response.data;
  },

  // Dedicated Admin login using Email + Password
  loginAdmin: async (data) => {
    const response = await api.post('/api/admin/auth/login', data);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
};
