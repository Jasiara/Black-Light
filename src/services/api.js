import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

console.log('API URL:', API_URL); // Debug log

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
};

// Business endpoints
export const businessAPI = {
  getAll: (params) => api.get('/businesses', { params }),
  getFeatured: (limit = 3) => api.get('/businesses/featured', { params: { limit } }),
  getById: (id) => api.get(`/businesses/${id}`),
  create: (data) => api.post('/businesses', data),
  update: (id, data) => api.put(`/businesses/${id}`, data),
  delete: (id) => api.delete(`/businesses/${id}`),
};

// Review endpoints
export const reviewAPI = {
  getByBusiness: (businessId) => api.get(`/reviews/business/${businessId}`),
  create: (data) => api.post('/reviews', data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

// Favorite endpoints
export const favoriteAPI = {
  getAll: () => api.get('/favorites'),
  add: (businessId) => api.post('/favorites', { business_id: businessId }),
  remove: (businessId) => api.delete(`/favorites/${businessId}`),
};

// Admin endpoints
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getReviews: () => api.get('/admin/reviews'),
  deleteReview: (id) => api.delete(`/admin/reviews/${id}`),
  getBusinesses: () => api.get('/admin/businesses'),
  updateBusiness: (id, data) => api.put(`/admin/businesses/${id}`, data),
  deleteBusiness: (id) => api.delete(`/admin/businesses/${id}`),
};

export default api;
