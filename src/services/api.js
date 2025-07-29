import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Get historical signals
  getSignals: async (symbol, limit = 100) => {
    try {
      const response = await api.get('/api/v1/signals', {
        params: { symbol, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching signals:', error);
      return [];
    }
  },

  // Get patterns
  getPatterns: async (symbol) => {
    try {
      const response = await api.get(`/api/v1/patterns/${symbol}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching patterns:', error);
      return [];
    }
  },

  // Get risk metrics
  getRiskMetrics: async () => {
    try {
      const response = await api.get('/api/v1/risk/metrics');
      return response.data;
    } catch (error) {
      console.error('Error fetching risk metrics:', error);
      return null;
    }
  }
};

export default apiService;