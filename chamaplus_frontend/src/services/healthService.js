import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const checkBackendHealth = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/health`);
    return {
      status: 'success',
      data: response.data,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Health check failed:', error);
    return {
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

// Add more health check functions as needed
