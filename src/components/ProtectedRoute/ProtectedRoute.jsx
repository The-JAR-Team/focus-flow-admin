import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserInfo } from '../../services/api';
import { setUserData } from '../../redux/userSlice';
import navigationConfig from '../../utils/navigationConfig';

/**
 * A wrapper component for routes that require authentication
 * Redirects to login page if user is not authenticated
 */
const ProtectedRoute = () => {
  const { isAuthenticated } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
    useEffect(() => {
    // If Redux state doesn't have the user, try to fetch user info
    // (cookies will be sent automatically if they exist)
    if (!isAuthenticated) {
      const checkSession = async () => {
        try {
          const userData = await fetchUserInfo();
          if (userData) {
            dispatch(setUserData(userData));
          }        } catch (error) {
          console.error('Failed to restore session:', error);
          // Session cookie is invalid or missing, redirect to login
          // Use window.location for a full page refresh
          window.location.href = navigationConfig.fullPaths.login;
        }
      };
      checkSession();
    }
  }, [isAuthenticated, dispatch, navigate]);  // If not authenticated, redirect to login page
  // The component will try to fetch user info first in the useEffect
  if (!isAuthenticated) {
    // Using Navigate component which works within React Router context
    return <Navigate to={navigationConfig.routes.login} replace />;
  }

  // Render child routes
  return <Outlet />;
};

export default ProtectedRoute;
