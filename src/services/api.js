import axios from 'axios';
import { Preferences } from '@capacitor/preferences';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to attach the auth token asynchronously
api.interceptors.request.use(
  async (config) => {
    // Await the native preference bridge
    const { value: token } = await Preferences.get({ key: 'token' });
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercept responses to handle expired tokens globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // If the server returns a 401 Unauthorized (invalid/expired token)
    if (error.response && error.response.status === 401) {
      // Clear native preferences
      await Preferences.remove({ key: 'token' });
      await Preferences.remove({ key: 'user' }); 
      
      // Force redirect to the login screen
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;