/**
 * Application configuration settings
 */
const config = {
  baseURL: 'https://focus-flow-server-465005663226.me-west1.run.app',
  debugMode: false,  apiEndpoints: {
    login: '/login',
    logout: '/logout',
    userInfo: '/user_info', // Updated to match actual endpoint
    health: '/health',
    debug: {
      sql: '/debug/sql',
    }
  }
};

export default config;
