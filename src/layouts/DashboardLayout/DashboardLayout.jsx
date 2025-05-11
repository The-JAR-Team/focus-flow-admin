import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/userSlice';
import { clearDashboard } from '../../redux/dashboardSlice';
import styles from './DashboardLayout.module.css';

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data from redux
    dispatch(logoutUser());
    
    // Clear dashboard data from redux
    dispatch(clearDashboard());
    
    // Clear auth token from localStorage
    localStorage.removeItem('authToken');
    
    // Navigate to login page
    navigate('/login');
  };

  return (
    <div className={styles.layoutContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Focus Flow</h2>
          <p>Admin Dashboard</p>
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
