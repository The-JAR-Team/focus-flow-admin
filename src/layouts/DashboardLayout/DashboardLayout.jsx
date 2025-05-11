import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/userSlice';
import { clearDashboard } from '../../redux/dashboardSlice';
import axios from 'axios';
import { fetchUserInfo } from '../../services/api';
import styles from './DashboardLayout.module.css';
import HealthStatus from '../../components/HealthStatus';
import navigationConfig from '../../utils/navigationConfig';

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [apiReady, setApiReady] = useState(false);

  // Check authentication first before any other API calls
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First try to get user info to verify authentication
        await fetchUserInfo();
        // If successful, mark API as ready for other components
        setApiReady(true);
      } catch (error) {
        console.error('Authentication check failed:', error);
        
        // If it's a 401 error, handle as unauthorized
        if (error.response && error.response.status === 401) {
          // Clear user data from redux
          dispatch(logoutUser());
          // Clear dashboard data
          dispatch(clearDashboard());
          // Redirect to login page
          window.location.href = navigationConfig.fullPaths.login;
        }
      } finally {
        setAuthChecked(true);
      }
    };
    
    checkAuth();
  }, [dispatch]);
  
  const handleLogout = async () => {
    try {
      // Clear user data from redux
      dispatch(logoutUser());
      
      // Clear dashboard data from redux
      dispatch(clearDashboard());
      
      // Call logout endpoint to clear cookies on the server side
      const config = (await import('../../utils/config')).default;
      await axios.post(`${config.baseURL}${config.apiEndpoints.logout}`, {}, { withCredentials: true });
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Use window.location for a full page refresh to ensure all state is cleared
      window.location.href = navigationConfig.fullPaths.login;
    }
  };

  // Show loading indicator while checking authentication
  if (!authChecked) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Checking session...</p>
      </div>
    );
  }

  return (
    <div className={styles.layoutContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Focus Flow</h2>
          <p>Admin Dashboard</p>
        </div>
        <div className={styles.healthStatusContainer}>
          {apiReady && <HealthStatus />}
        </div>
        
        <nav className={styles.navigation}>
          <button 
            className={styles.navButton}
            onClick={() => navigate(navigationConfig.routes.dashboard)}
          >
            Dashboard
          </button>
          
          <button
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </aside>
      
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
