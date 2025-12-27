import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useContext(UserContext);

  if (isAuthenticated && !user) {

      return <div>Loading user data...</div>;
  }

  if (isAuthenticated && user) {
    return children;
  }

  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;