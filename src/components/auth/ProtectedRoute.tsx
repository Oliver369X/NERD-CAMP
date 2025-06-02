import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useWalletStore } from '../../stores/walletStore';

const ProtectedRoute: React.FC = () => {
  const { isConnected, authToken } = useWalletStore();
  const location = useLocation();

  // Check if user is authenticated
  if (!isConnected || !authToken) {
    // Redirect to home page but save the attempted URL
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;