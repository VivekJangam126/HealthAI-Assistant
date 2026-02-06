import axios from 'axios';

// Get API URL from environment variable
// In production, this is set at build time by Vercel
const API_URL = import.meta.env.VITE_API_URL;

// Validate API URL is set
if (!API_URL) {
  console.error('VITE_API_URL is not set in environment variables!');
  console.error('Available env vars:', import.meta.env);
  console.error('Please set VITE_API_URL in Vercel Dashboard and redeploy');
  // Fallback for now to prevent app from crashing
  // TODO: Remove this fallback once environment variable is properly set
}

// Use the API URL or fallback
const baseURL = API_URL || 'https://ayumitra-backend.vercel.app/api';

// Log the API URL for debugging
console.log('Using API URL:', baseURL);

const axiosInstance = axios.create({
  baseURL: baseURL,
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
