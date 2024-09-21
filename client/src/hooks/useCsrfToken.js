import { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';

const useCsrfToken = () => {
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('/api/csrf-token', { withCredentials: true });
        const token = response.data.csrfToken;

        // Store the fetched token in localStorage and state
        localStorage.setItem('csrfToken', token);
        setCsrfToken(token);
      } catch (error) {
        console.error('Failed to fetch CSRF token', error.response?.data || error.message);
      }
    };

    // Check if the CSRF token is already stored in local storage
    const storedCsrfToken = localStorage.getItem('csrfToken');
    if (storedCsrfToken) {
      setCsrfToken(storedCsrfToken); // Use the stored token
    } else {
      fetchCsrfToken(); // Fetch the token if not present
    }
  }, []);

  return csrfToken; // Return the CSRF token
};

export default useCsrfToken;
