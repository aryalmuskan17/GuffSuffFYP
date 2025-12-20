// client/src/components/ProtectedRoute.jsx

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

// This component checks if the user is authenticated before rendering the children (the page).
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useContext(UserContext);
  
  // OPTIONAL: You could add a simple loading state check here if user is null but token is present
  if (isAuthenticated && !user) {
      // If we have a token but no user object yet (still fetching profile), show a loading message
      return <div>Loading user data...</div>;
  }

  // 1. If authenticated, render the child component (the page).
  if (isAuthenticated && user) {
    return children;
  }

  // 2. If NOT authenticated, redirect to the login page.
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;