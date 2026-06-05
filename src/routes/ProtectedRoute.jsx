import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function ProtectedRoute({ children, adminOnly = false }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // Redirect them to the /login page
    return <Navigate to="/login" replace />;
  }

  
  if (adminOnly && currentUser.email !== 'admin@gmail.com') {
    toast.error("Unauthorized. Admin access required.");
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
