import axios from 'axios';
import config from '../utils/config';
import navigationConfig from '../utils/navigationConfig';

// Set default config for all requests
axios.defaults.withCredentials = true;

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
    // The cookie will be automatically managed by the browser with withCredentials: true
    const response = await api.post(config.apiEndpoints.login, credentials);
    
    if (response.data && response.data.status === "success") {
      // No need to manually manage tokens - cookies are handled by the browser
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
    // Cookies are automatically sent with the request
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
 * Fetch backend health status
 * @returns {Promise<Object>} Health status object
 */
export const fetchHealthStatus = async () => {
  try {
    const response = await api.get(config.apiEndpoints.health);
    return response.data;
  } catch (error) {
    console.error('Error fetching health status:', error);
    throw error;
  }
};

// No need for authorization token management as we're using cookies
// The browser will automatically include the cookie with each request

// Add request interceptor to ensure credentials are sent with every request
api.interceptors.request.use(
  (config) => {
    // Always ensure withCredentials is true for all requests
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => {
    return response;
  },  (error) => {
    // Handle authentication errors (401 Unauthorized)
    if (error.response && error.response.status === 401) {
      // Redirect to login page on authentication failure
      window.location.href = navigationConfig.fullPaths.login;
    }
    return Promise.reject(error);
  }
);

export default api;
