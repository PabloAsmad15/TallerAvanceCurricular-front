import axios from 'axios';
import jwtDecode from 'jwt-decode';

const BASE_URL = import.meta.env.VITE_API_URL || '';
const API_URL = BASE_URL.replace(/\/$/, '');

const authService = {
  login: async (email, password) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, formData);
      const token = response.data?.access_token;
      if (!token) throw new Error('No se recibió access_token');

      let role = null;
      try {
        const decoded = jwtDecode(token);
        role = decoded?.role ?? null;
      } catch (e) {
        // Ignorar error de decodificación
      }

      return { access_token: token, role };
    } catch (err) {
      throw err;
    }
  },

  register: async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/register`, {
      email,
      password,
    });
    return response.data;
  },

  requestPasswordReset: async (email) => {
    const response = await axios.post(`${API_URL}/auth/request-password-reset`, {
      email,
    });
    return response.data;
  },
};

export default authService;