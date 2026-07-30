import axios from 'axios';
import jwtDecode from 'jwt-decode';

const BASE_URL = import.meta.env.VITE_API_URL || '';
const API_URL = BASE_URL.replace(/\/$/, '');
const FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY || '';
const FIREBASE_PASSWORD_RESET_URL = FIREBASE_API_KEY
  ? `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${FIREBASE_API_KEY}`
  : '';
const FIREBASE_SIGNIN_URL = FIREBASE_API_KEY
  ? `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`
  : '';
const FIREBASE_SIGNUP_URL = FIREBASE_API_KEY
  ? `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`
  : '';

const authService = {
  login: async (email, password) => {
    if (FIREBASE_SIGNIN_URL) {
      const response = await axios.post(FIREBASE_SIGNIN_URL, {
        email,
        password,
        returnSecureToken: true,
      });
      return { access_token: response.data.idToken, role: 'student' };
    }

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
    if (FIREBASE_SIGNUP_URL) {
      const response = await axios.post(FIREBASE_SIGNUP_URL, {
        email,
        password,
        returnSecureToken: true,
      });
      return response.data;
    }

    const response = await axios.post(`${API_URL}/auth/register`, {
      email,
      password,
    });
    return response.data;
  },

  requestPasswordReset: async (email) => {
    if (FIREBASE_PASSWORD_RESET_URL) {
      const response = await axios.post(FIREBASE_PASSWORD_RESET_URL, {
        requestType: 'PASSWORD_RESET',
        email,
      });
      return response.data;
    }

    const response = await axios.post(`${API_URL}/auth/request-password-reset`, {
      email,
    });
    return response.data;
  },
};

export default authService;