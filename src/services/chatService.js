import axios from 'axios';
import useAuthStore from '../store/authStore';

const BASE_URL = import.meta.env.VITE_API_URL || '';
const API_URL = BASE_URL.replace(/\/$/, '');

// Interceptor para añadir el token a todas las peticiones
axios.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const chatService = {
  uploadReport: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_URL}/chat/upload-report`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getRecommendation: async (sendEmail = false) => {
    const response = await axios.post(`${API_URL}/chat/recommend`, {
      send_email: sendEmail,
    });
    return response.data;
  },

  getMyAcademicHistory: async () => {
    const response = await axios.get(`${API_URL}/chat/my-academic-history`);
    return response.data;
  },

  getRecommendationHistory: async () => {
    const response = await axios.get(`${API_URL}/chat/history`);
    return response.data;
  },

  sendGeneralQuery: async (query) => {
    const response = await axios.post(`${API_URL}/chat/general-query`, {
      query,
    });
    return response.data;
  },

  sendEmail: async ({ to_email, subject, content }) => {
    const response = await axios.post(`${API_URL}/chat/send-email`, {
      to_email,
      subject,
      content,
    });
    return response.data;
  },
};

export default chatService;