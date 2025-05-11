import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserInfo } from '../../services/api';
import { setUserData } from '../../redux/userSlice';

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
          }
        } catch (error) {
          console.error('Failed to restore session:', error);
          // Session cookie is invalid or missing, redirect to login
          navigate('/login', { replace: true });
        }
      };
      checkSession();
    }
  }, [isAuthenticated, dispatch, navigate]);
  // If not authenticated, redirect to login page
  // The component will try to fetch user info first in the useEffect
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render child routes
  return <Outlet />;
};

export default ProtectedRoute;
