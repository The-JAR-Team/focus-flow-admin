import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/userSlice';
import { clearDashboard } from '../../redux/dashboardSlice';
import axios from 'axios';
import styles from './DashboardLayout.module.css';
import HealthStatus from '../../components/HealthStatus';
import navigationConfig from '../../utils/navigationConfig';

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();  const handleLogout = async () => {
    try {
      // Clear user data from redux
      dispatch(logoutUser());
      
      // Clear dashboard data from redux
      dispatch(clearDashboard());
      
      // Call logout endpoint to clear cookies on the server side
      const config = (await import('../../utils/config')).default;
      await axios.post(`${config.baseURL}${config.apiEndpoints.logout}`, {}, { withCredentials: true });
    } catch (error) {
      console.error('Error during logout:', error);    } finally {
      // Navigate to login page
      navigate(navigationConfig.routes.login);
    }
  };

  return (
    <div className={styles.layoutContainer}>      <aside className={styles.sidebar}>      <div className={styles.sidebarHeader}>
          <h2>Focus Flow</h2>
          <p>Admin Dashboard</p>
        </div>
        <div className={styles.healthStatusContainer}>
          <HealthStatus />
        </div>
        
        <nav className={styles.navigation}>
          <button 
            className={styles.navButton}
            onClick={() => navigate('/dashboard')}
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
