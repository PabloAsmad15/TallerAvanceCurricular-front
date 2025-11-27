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
  async (error) => {
    const originalRequest = error.config;
    
    // Si es 401 y no hemos intentado refrescar el token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Intentar refrescar el token de Firebase
        const { auth } = await import('../config/firebase');
        const user = auth.currentUser;
        
        if (user) {
          // Obtener nuevo token
          const newToken = await user.getIdToken(true); // true = forzar refresh
          localStorage.setItem('token', newToken);
          
          // Reintentar la petición original con el nuevo token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } else {
          // No hay usuario autenticado, redirigir a login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      } catch (refreshError) {
        // Error al refrescar token, cerrar sesión
        console.error('Error al refrescar token:', refreshError);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login-json', data),
  getMe: () => api.get('/api/auth/me'),
  forgotPassword: (email) => api.post('/api/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => 
    api.post('/api/auth/reset-password', { token, new_password: newPassword }),
};

// Mallas API
export const mallasAPI = {
  getById: (id) => api.get(`/api/mallas/${id}`),
};

// Cursos API
export const cursosAPI = {
  getByMalla: (mallaId) => api.get(`/api/cursos/malla/${mallaId}`),
  getByCiclo: (mallaId) => api.get(`/api/cursos/malla/${mallaId}/por-ciclo`),
  getById: (id) => api.get(`/api/cursos/${id}`),
  getPrerequisitos: (mallaId) => api.get(`/api/cursos/malla/${mallaId}/prerequisitos`),
};

// Recomendaciones API
export const recomendacionesAPI = {
  create: (data) => api.post('/api/recommendations/', data),
  comparar: (data) => api.post('/api/recommendations/comparar-algoritmos', data),
  getHistory: () => api.get('/api/recommendations/history'),
  getById: (id) => api.get(`/api/recommendations/${id}`),
  getStats: () => api.get('/api/recommendations/stats/algorithms'),
};

// Admin API
export const adminAPI = {
  getGeneralStats: () => api.get('/api/admin/stats/general'),
  getRecomendacionesStats: () => api.get('/api/admin/stats/recomendaciones'),
  getUsuarios: (skip = 0, limit = 50) => api.get(`/api/admin/usuarios?skip=${skip}&limit=${limit}`),
  getRecomendacionesRecientes: (limit = 10) => api.get(`/api/admin/recomendaciones/recientes?limit=${limit}`),
};

export default api;
