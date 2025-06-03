import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// API instance oluşturma
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Yardımcı fonksiyonlar
const createParams = (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  return params.toString();
};

// Public API endpoints
export const publicService = {
  getServices: () => api.get('/public/services'),
  getMechanics: () => api.get('/public/mechanics'),
  createAppointment: (data) => api.post('/public/appointments', data),
  getAppointment: (trackingNumber) => api.get(`/public/appointments/${trackingNumber}`),
  sendContactMessage: (data) => api.post('/public/contact', data),
  getVehicleBrands: () => api.get('/public/vehicle-brands'),
  getSettings: () => {
    return api.get('/public/settings');
  }
};

// Auth API endpoints
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    window.location.href = '/admin/login';
  },
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
};

// Admin API endpoints
export const adminService = {
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard'),

  // Appointments
  getAppointments: (filters = {}) => api.get(`/admin/appointments?${createParams(filters)}`),
  createAppointment: (data) => api.post('/admin/appointments', data),
  updateAppointment: (id, data) => api.put(`/admin/appointments/${id}`, data),
  updateAppointmentStatus: (id, status) => api.put(`/admin/appointments/${id}/status`, { status }),
  deleteAppointment: (id) => api.delete(`/admin/appointments/${id}`),

  // Services
  getServices: (filters = {}) => api.get(`/admin/services?${createParams(filters)}`),
  createService: (data) => api.post('/admin/services', data),
  updateService: (id, data) => api.put(`/admin/services/${id}`, data),
  deleteService: (id) => api.delete(`/admin/services/${id}`),

  // Inventory
  getInventory: (filters = {}) => api.get(`/admin/inventory?${createParams(filters)}`),
  createInventoryItem: (data) => api.post('/admin/inventory', data),
  updateInventoryItem: (id, data) => api.put(`/admin/inventory/${id}`, data),
  deleteInventoryItem: (id) => api.delete(`/admin/inventory/${id}`),

  // Users
  getUsers: (filters = {}) => api.get(`/admin/users?${createParams(filters)}`),
  createUser: (data) => api.post('/admin/users', data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  updateUserStatus: (id, active) => api.put(`/admin/users/${id}/status`, { active }),

  // Masters (Mechanics)
  getMechanics: (filters = {}) => api.get(`/admin/masters?${createParams(filters)}`),
  createMaster: (data) => api.post('/admin/masters', data),
  updateMaster: (id, data) => api.put(`/admin/masters/${id}`, data),
  deleteMaster: (id) => api.delete(`/admin/masters/${id}`),

  // Customers
  getCustomers: (filters = {}) => api.get(`/admin/customers?${createParams(filters)}`),
  createCustomer: (data) => api.post('/admin/customers', data),
  updateCustomer: (id, data) => api.put(`/admin/customers/${id}`, data),
  deleteCustomer: (id) => api.delete(`/admin/customers/${id}`),

  // Vehicles
  getVehicles: (filters = {}) => api.get(`/admin/vehicles?${createParams(filters)}`),
  createVehicle: (data) => api.post('/admin/vehicles', data),
  updateVehicle: (id, data) => api.put(`/admin/vehicles/${id}`, data),
  deleteVehicle: (id) => api.delete(`/admin/vehicles/${id}`),

  // Categories
  getCategories: (filters = {}) => api.get(`/admin/categories?${createParams(filters)}`),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),

  // Reports
  getReports: (filters = {}) => api.get(`/admin/reports?${createParams(filters)}`),

  // Settings
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.put('/admin/settings', { settings: data }),
  uploadFile: (formData) => api.post('/admin/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
};

export default api;
