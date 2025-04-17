import axios from 'axios';
import config from '../config/config';

// Create axios instance with default config
const api = axios.create({
  baseURL: config.apiBaseUrl
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Certificate API calls
export const certificateAPI = {
  // Submit new certificate application
  submit: (applicationData) => api.post('/certificates', applicationData),

  // Get all certificates (admin) or user certificates (citizen)
  getAll: () => api.get('/certificates'),

  // Get single certificate by ID
  getById: (id) => api.get(`/certificates/${id}`),

  // Update certificate status (admin only)
  updateStatus: (id, statusData) => api.put(`/certificates/${id}`, statusData),

  // Get dashboard statistics (admin only)
  getDashboardStats: () => api.get('/certificates/stats/dashboard'),

  // Upload supporting documents
  uploadDocuments: (formData) => {
    return api.post('/certificates/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me')
};

export default api;