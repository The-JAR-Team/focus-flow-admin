/**
 * Application navigation configuration
 */
const navigationConfig = {
  // Base path for the application when deployed on GitHub Pages
  // Used for direct URL navigation (not React Router)
  basePath: '/focus-flow-admin',
  
  // Routes for React Router (without the GitHub Pages base path)
  routes: {
    login: '/login',
    dashboard: '/dashboard',
    users: '/users',
    sessions: '/sessions'
  },
  
  // Full paths for direct URL navigation (with GitHub Pages base path)
  // Used for window.location.href
  fullPaths: {
    login: '/focus-flow-admin/#/login',
    dashboard: '/focus-flow-admin/#/dashboard',
    users: '/focus-flow-admin/#/users',
    sessions: '/focus-flow-admin/#/sessions'
  }
};

export default navigationConfig;
