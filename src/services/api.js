import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Configurar axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login-json', data),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => 
    api.post('/auth/reset-password', { token, new_password: newPassword }),
};

// Mallas API
export const mallasAPI = {
  getAll: () => api.get('/mallas'),
  getById: (id) => api.get(`/mallas/${id}`),
};

// Cursos API
export const cursosAPI = {
  getByMalla: (mallaId) => api.get(`/cursos/malla/${mallaId}`),
  getByCiclo: (mallaId) => api.get(`/cursos/malla/${mallaId}/por-ciclo`),
  getById: (id) => api.get(`/cursos/${id}`),
  getPrerequisitos: (mallaId) => api.get(`/cursos/malla/${mallaId}/prerequisitos`),
};

// Recomendaciones API
export const recomendacionesAPI = {
  create: (data) => api.post('/recommendations/', data),
  getHistory: () => api.get('/recommendations/history'),
  getById: (id) => api.get(`/recommendations/${id}`),
  getStats: () => api.get('/recommendations/stats/algorithms'),
};

// Admin API
export const adminAPI = {
  getGeneralStats: () => api.get('/admin/stats/general'),
  getRecomendacionesStats: () => api.get('/admin/stats/recomendaciones'),
  getUsuarios: (skip = 0, limit = 50) => api.get(`/admin/usuarios?skip=${skip}&limit=${limit}`),
  getRecomendacionesRecientes: (limit = 10) => api.get(`/admin/recomendaciones/recientes?limit=${limit}`),
};

export default api;
