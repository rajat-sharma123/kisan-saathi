import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to automatically attach JWT token
apiClient.interceptors.request.use((config) => {
  try {
    const userStr = localStorage.getItem('kisan_auth_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
  } catch (e) {}
  return config;
});

export const apiService = {
  // Health
  async checkHealth() {
    try {
      const res = await apiClient.get('/health');
      return res.data;
    } catch (e) {
      return { status: 'offline' };
    }
  },

  // Chat
  async sendChatMessage(message, language = 'hi') {
    return (await apiClient.post('/chat/message', { message, language })).data;
  },

  // Crop Recommendation
  async getCropRecommendation(soilData) {
    return (await apiClient.post('/crop/recommend', soilData)).data;
  },

  // Disease Detection
  async analyzeDiseasePhoto(formData) {
    return (await apiClient.post('/disease/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })).data;
  },

  // Mandi Prices
  async getMandiPrices(filters = {}) {
    return (await apiClient.get('/market/prices', { params: filters })).data;
  }
};
