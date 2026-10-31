import axios from 'axios';

// Default to live Render backend for both local dev and production unless overridden by VITE_API_URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ucms-backend-ygej.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ucms_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for auth error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('ucms_token');
      localStorage.removeItem('ucms_user');
    }
    return Promise.reject(error);
  }
);

export default api;
