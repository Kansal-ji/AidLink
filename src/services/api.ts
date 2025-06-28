import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aidlink_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('aidlink_token');
      localStorage.removeItem('aidlink_user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData: any) => api.post('/auth/register', userData),
  login: (credentials: any) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
};

// Alerts API
export const alertsAPI = {
  create: (alertData: any) => api.post('/alerts', alertData),
  getAll: (params?: any) => api.get('/alerts', { params }),
  getById: (id: string) => api.get(`/alerts/${id}`),
  updateStatus: (id: string, status: string) => api.put(`/alerts/${id}/status`, { status }),
  respond: (id: string) => api.post(`/alerts/${id}/respond`),
};

// Requests API
export const requestsAPI = {
  create: (requestData: any) => api.post('/requests', requestData),
  getAll: (params?: any) => api.get('/requests', { params }),
  getById: (id: string) => api.get(`/requests/${id}`),
  accept: (id: string) => api.post(`/requests/${id}/accept`),
  updateStatus: (id: string, status: string) => api.put(`/requests/${id}/status`, { status }),
  getUserRequests: () => api.get('/requests/user/my-requests'),
  getVolunteerRequests: () => api.get('/requests/volunteer/accepted'),
};

// Users API
export const usersAPI = {
  getNearbyVolunteers: (params: any) => api.get('/users/volunteers/nearby', { params }),
  updateLocation: (location: any) => api.put('/users/location', location),
  updateAvailability: (availability: boolean) => api.put('/users/availability', { availability }),
  updateSkills: (skills: string[]) => api.put('/users/skills', { skills }),
  getStats: () => api.get('/users/stats'),
};

// News API
export const newsAPI = {
  getAll: (params?: any) => api.get('/news', { params }),
  getByLocation: (location: string, params?: any) => api.get(`/news/location/${location}`, { params }),
};

export default api;