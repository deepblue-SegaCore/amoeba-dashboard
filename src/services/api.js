
class ApiService {
  constructor(baseUrl = null) {
    this.API_BASE_URL = baseUrl || import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  }
  async request(endpoint, options = {}) {
    const url = `${this.API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Environmental data
  async getEnvironmentalStatus() {
    return this.request('/environmental');
  }

  // Signal data
  async getSignalHistory(limit = 100) {
    return this.request(`/signals?limit=${limit}`);
  }

  async submitSignal(signal) {
    return this.request('/signals', {
      method: 'POST',
      body: JSON.stringify(signal),
    });
  }

  // Learning metrics
  async getLearningMetrics() {
    return this.request('/learning');
  }

  // Position management
  async getPositions() {
    return this.request('/positions');
  }

  async createPosition(position) {
    return this.request('/positions', {
      method: 'POST',
      body: JSON.stringify(position),
    });
  }

  async closePosition(positionId) {
    return this.request(`/positions/${positionId}`, {
      method: 'DELETE',
    });
  }

  // Risk metrics
  async getRiskMetrics() {
    return this.request('/risk');
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export default ApiService;
export const defaultApiService = new ApiService();
