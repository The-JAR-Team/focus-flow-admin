import axios from 'axios';
import config from '../utils/config';

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: config.baseURL,
  withCredentials: true, // Important for maintaining session cookies
  headers: {
    'Content-Type': 'application/json',
  }
});

/**
 * Login user with credentials
 * @param {Object} credentials - User login credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise<Object>} Login response
 */
export const loginUser = async (credentials) => {
  try {
    const response = await api.post(config.apiEndpoints.login, credentials);
    
    if (response.data && response.data.status === "success") {
      // Store auth token if provided by API
      if (response.data.auth_token) {
        localStorage.setItem('authToken', response.data.auth_token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.auth_token}`;
      }
      return response.data;
    }
    
    return { 
      status: "error", 
      reason: response.data.reason || "Login failed" 
    };
  } catch (error) {
    console.error('Login error:', error);
    return { 
      status: "error", 
      reason: error.response?.data?.reason || "Network error during login" 
    };
  }
};

/**
 * Fetch current user information
 * @returns {Promise<Object>} User data
 */
export const fetchUserInfo = async () => {
  try {
    const response = await api.get(config.apiEndpoints.userInfo);
    // Check if the response has the expected format with user data
    if (response.data && response.data.status === "success" && response.data.user) {
      return response.data.user; // Return the user object directly
    } else {
      throw new Error("Invalid user data format");
    }
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
};

/**
 * Execute SQL query for debugging/admin purposes
 * @param {string} query - SQL query to execute
 * @param {string} type - Response type (html, string_table, etc.)
 * @returns {Promise<string>} Query results as HTML or string table
 */
export const executeSqlQuery = async (query, type = 'html') => {
  try {
    const response = await api.post(`${config.apiEndpoints.debug.sql}?type=${type}`, {
      query
    });
    
    // For these endpoints, the response is the direct HTML or string table
    // No need to extract from a wrapper object
    return response.data;
  } catch (error) {
    console.error('Error executing SQL query:', error);
    throw error;
  }
};

/**
 * Set authorization header with token
 * @param {string} token - Authentication token
 */
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Check for stored token on initialization
const token = localStorage.getItem('authToken');
if (token) {
  setAuthToken(token);
}

export default api;
