import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Create a context
const UserContext = createContext();

// Provider component to wrap the app
export const UserProvider = ({ children }) => {
  // State to track user information
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate= useNavigate();

  // useEffect to check authentication status and fetch user data on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://localhost:5000/user/info', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setUser(response.data.user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
        setLoading(false); // Set loading to false after checking auth status
      } catch (error) {
        console.error('Error verifying token:', error);
        setIsAuthenticated(false);
        setLoading(false); // Set loading to false even in case of error
      }
    };

    checkAuthStatus();
  }, []);

  // Function to update user information
  const updateUser = (data) => {
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
  };

  // Function to clear user information on logout
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false); // Set isAuthenticated to false on logout
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // navigate('/login');
  };

  // Provide the user context to the app
  return (
    <UserContext.Provider value={{ user, loading, isAuthenticated, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
