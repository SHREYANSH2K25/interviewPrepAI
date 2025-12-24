import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Warn if API URL is not configured in production
if (import.meta.env.PROD && API_BASE_URL === 'http://localhost:5000/api') {
  console.error('⚠️ VITE_API_BASE_URL is not configured! API requests will fail in production.');
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
axiosInstance.interceptors.request.use(
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

// Handle response errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if it's a network error
    if (!error.response) {
      console.error('❌ Network Error: Unable to reach the API server at', API_BASE_URL);
      console.error('Make sure VITE_API_BASE_URL is correctly configured in Vercel environment variables');
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
