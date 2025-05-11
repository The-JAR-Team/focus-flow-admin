import { useEffect } from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider, useSelector, useDispatch } from 'react-redux'
import store from './redux/store'
import { setUserData, logoutUser } from './redux/userSlice'
import { fetchUserInfo } from './services/api'
import Login from './pages/Login/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import Users from './pages/Users/Users'
import Sessions from './pages/Sessions/Sessions'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout/DashboardLayout'
import './App.css'

// App wrapper with Redux Provider
const AppWrapper = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.user);

  useEffect(() => {
    // Check if user is already authenticated via cookies
    const checkAuthStatus = async () => {
      try {
        // Try to get user info - cookies will be sent automatically
        const userData = await fetchUserInfo();
        if (userData) {
          dispatch(setUserData(userData));
          console.log('User authenticated from session cookie');
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        // User is not authenticated, nothing else to do
        // The cookie is managed by the browser
      }
    };

    // Check auth status when the component mounts
    checkAuthStatus();
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/sessions" element={<Sessions />} />
            {/* Add more protected routes here */}
          </Route>
        </Route>
        
        {/* Redirect root to dashboard or login */}
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default AppWrapper
