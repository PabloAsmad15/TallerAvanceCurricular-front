import axios from 'axios';
import jwtDecode from 'jwt-decode';

const API_URL = import.meta.env.VITE_API_URL || '';

const authService = {
  login: async (email, password) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, formData);
      const token = response.data?.access_token;
      if (!token) throw new Error('No se recibió access_token');

      // Decodificar el token para obtener el rol (si existe)
      let role = null;
      try {
        const decoded = jwtDecode(token);
        role = decoded?.role ?? null;
      } catch (e) {
        // No es crítico, seguiremos sin role
      }

      return { access_token: token, role };
    } catch (err) {
      // Re-lanzar para que el caller pueda mostrar el error
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