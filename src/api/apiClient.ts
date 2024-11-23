// src/api/apiClient.ts

import axios from 'axios';

// Create an instance of Axios with a base configuration
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // Base URL of your API (can be set in .env)
  timeout: 10000, // Request timeout (10 seconds)
  headers: {
    'Content-Type': 'application/json', // Default content type
  },
});

// Request interceptor to attach authorization tokens to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage (or other storage)
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Attach the token to Authorization header
    }
    return config;
  },
  (error) => {
    // Handle errors in the request configuration
    return Promise.reject(error);
  }
);

// Response interceptor to handle responses and errors globally
apiClient.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle responses with error codes (e.g., 401 Unauthorized, 404 Not Found)
      if (error.response.status === 401) {
        // Optionally log out the user or refresh the token
        console.log('Unauthorized. Redirecting to login.');
        window.location.href = '/login'; // Redirect to login if 401
      }
      if (error.response.status === 403) {
        console.log('Forbidden. You do not have access to this resource.');
      }
    }
    // Handle other errors (e.g., network errors)
    return Promise.reject(error);
  }
);

export { apiClient };