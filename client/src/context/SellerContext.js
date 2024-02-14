import React, { createContext, useContext, useEffect, useState } from 'react';

// Create a context
const SellerContext = createContext();

// Provider component to wrap the app
export const SellerProvider = ({ children }) => {
  // State to track user information
  const [userData, setUserData] = useState(() => {
    // Check localStorage for user information on app load
    const storedUserData = localStorage.getItem('sellerData');
    return storedUserData ? JSON.parse(storedUserData) : null;
  });

  // useEffect to check localStorage on component mount
  useEffect(() => {
    const storedUserData = localStorage.getItem('sellerData');
    setUserData(storedUserData ? JSON.parse(storedUserData) : null);
  }, []);

  // Function to update user information
  const updateUserData = (data) => {
    setUserData(data);
    localStorage.setItem('sellerData', JSON.stringify(data));
  };

  // Function to clear user information on logout
  const logout = () => {
    setUserData(null);
    localStorage.removeItem('sellerData');
  };

  // Provide the user context to the app
  return (
    <SellerContext.Provider value={{ userData, updateUserData, logout }}>
      {children}
    </SellerContext.Provider>
  );
};

// Custom hook to access the user context
export const useSeller = () => {
  const context = useContext(SellerContext);
  if (!context) {
    throw new Error('useSeller must be used within a SellerProvider');
  }
  return context;
};
