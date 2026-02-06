import axios from 'axios';

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

// Validate API URL is set
if (!API_URL) {
  console.error('VITE_API_URL is not set in environment variables!');
  console.error('Please set VITE_API_URL in Vercel Dashboard');
  throw new Error('VITE_API_URL environment variable is not configured. Please add it in Vercel Dashboard.');
}

// Log the API URL for debugging (only in development)
if (import.meta.env.DEV) {
  console.log('API URL:', API_URL);
}

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add token
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

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
