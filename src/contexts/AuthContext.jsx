// Authentication Context untuk manage user state global
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, handleAPIResponse, handleAPIError } from '../services/unifiedAPI';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Development mode - always authenticated
  const [user, setUser] = useState({
    id: 1,
    name: 'Development User',
    email: 'dev@stockflow.com',
    role: 'admin',
  });
  const [token, setToken] = useState('dev-token-123');
  const [loading, setLoading] = useState(false); // No loading in dev mode
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Always authenticated in dev mode

  // No need to check auth status in development
  useEffect(() => {
    console.log('🔧 Development Mode: Authentication bypassed');
  }, []);

  const checkAuthStatus = async () => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      try {
        // Verify token with backend
        const response = await authAPI.me(storedToken);
        if (response.success) {
          setUser(response.data);
          setToken(storedToken);
          setIsAuthenticated(true);
        } else {
          // Token invalid, clear it
          logout();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        logout();
      }
    }
    setLoading(false);
  };

  const login = async credentials => {
    try {
      setLoading(true);
      const response = await authAPI.login(credentials);

      if (response.success) {
        const { token, user } = response.data;

        // Store token
        localStorage.setItem('authToken', token);
        setToken(token);
        setUser(user);
        setIsAuthenticated(true);

        return { success: true, data: response.data };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await authAPI.logout(token);
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear local state regardless of API call result
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUser = userData => {
    setUser(userData);
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
