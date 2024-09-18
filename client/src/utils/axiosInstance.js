import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5001', // Your API base URL
  withCredentials: true, // This is important for CSRF token and cookie handling
});

// Interceptor to add CSRF token to requests
instance.interceptors.request.use((config) => {
  const csrfToken = localStorage.getItem('csrfToken'); // Get CSRF token from local storage or other state
  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken; // Add CSRF token to headers
  }
  return config;
});

export default instance;
