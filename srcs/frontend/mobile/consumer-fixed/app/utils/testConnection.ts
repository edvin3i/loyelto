import apiClient from './apiClient';

export const testBackendConnection = async () => {
  try {
    const response = await apiClient.get('/');
    console.log('Backend connection successful:', response);
    return true;
  } catch (error) {
    console.error('Backend connection failed:', error);
    return false;
  }
};

// Add default export to satisfy Expo Router
export default testBackendConnection;