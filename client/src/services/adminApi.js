// client/src/services/adminApi.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const adminApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
});

// Request interceptor to add auth header
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const adminService = {
  // Application Management
  getAllApplications: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await adminApi.get(`/admin/applications?${params}`);
    return response.data;
  },

  getApplicationById: async (id) => {
    const response = await adminApi.get(`/admin/applications/${id}`);
    return response.data;
  },

  updateApplicationStatus: async (id, data) => {
    const response = await adminApi.put(`/admin/applications/${id}/status`, data);
    return response.data;
  },

  assignApplication: async (id, assignedTo) => {
    const response = await adminApi.put(`/admin/applications/${id}/assign`, { assignedTo });
    return response.data;
  },

  // Document Management
  verifyDocument: async (applicationId, documentId, status, rejectionReason) => {
    const response = await adminApi.put(`/admin/applications/${applicationId}/documents/${documentId}`, {
      status,
      rejectionReason
    });
    return response.data;
  },

  // User Management
  getAllUsers: async () => {
    const response = await adminApi.get('/admin/users');
    return response.data;
  },

  getLoanOfficers: async () => {
    const response = await adminApi.get('/admin/users/loan-officers');
    return response.data;
  },

  // Analytics
  getApplicationStats: async (timeframe = 'month') => {
    const response = await adminApi.get(`/admin/applications/stats?timeframe=${timeframe}`);
    return response.data;
  },

  getRiskMetrics: async () => {
    const response = await adminApi.get('/admin/analytics/risk-metrics');
    return response.data;
  },

  getPerformanceMetrics: async (officerId, timeframe = 'month') => {
    const response = await adminApi.get(`/admin/analytics/performance/${officerId}?timeframe=${timeframe}`);
    return response.data;
  }
};

export default adminService;