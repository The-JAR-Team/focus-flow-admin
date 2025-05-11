import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser, fetchUserInfo } from '../../services/api';
import { initializeDashboardData } from '../../services/dashboardService';
import { setUserData } from '../../redux/userSlice';
import { setDashboardData } from '../../redux/dashboardSlice';
import navigationConfig from '../../utils/navigationConfig';
import styles from './Login.module.css';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);    try {
      const response = await loginUser({ email, password });
      if (response.status === "success") {
        // Session cookies are now set by the browser
        console.log('Login successful, session cookie should be set');
        
        // Successful login, load dashboard data
        const userData = await fetchUserInfo();
        const dashboardData = await initializeDashboardData(userData);

        // Update Redux store        dispatch(setUserData(userData));
        dispatch(setDashboardData(dashboardData));

        // Use navigate for normal flow within the app
        navigate(navigationConfig.routes.dashboard);
      } else {
        setErrorMsg(response.reason || 'Login failed');
      }    } catch (error) {
      console.error('Login error:', error);
      const errMsg = error.reason || error.message || 'An error occurred during login.';
      setErrorMsg(errMsg);
      // No need to clear tokens since we're using cookies managed by the browser
    }
    
    setLoading(false);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h2 className={styles.loginTitle}>Admin Dashboard Login</h2>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>Email</label>
            <input 
              id="email"
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="admin@example.com"
              className={styles.formInput}
              required 
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>Password</label>
            <input 
              id="password"
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className={styles.formInput}
              required 
            />
          </div>
          
          {errorMsg && <p className={styles.errorMessage}>{errorMsg}</p>}
          
          <button 
            type="submit" 
            disabled={loading}
            className={`${styles.loginButton} ${loading ? styles.loadingButton : ''}`}
          >
            {loading ? (
              <>
                <div className={styles.spinner}></div>
                <span>Logging in...</span>
              </>
            ) : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
