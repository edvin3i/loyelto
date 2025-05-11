import axios from 'axios';

const API_BASE_URL = 'https://api.loyelto.com/api/v1'; // Replace with your actual API URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authentication interceptor
api.interceptors.request.use(
  (config) => {
    // In a real app, use AsyncStorage instead of localStorage for React Native
    const token = ''; // Get from secure storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle common API errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // Redirect to login or refresh token
      console.error('Authentication error');
    }
    return Promise.reject(error);
  }
);

export default api; 