import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const RestrictedNavigation = ({ children }) => {
  const location = useLocation();
  const userRole = localStorage.getItem('userRole');
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');

  // If user is not logged in, redirect to login
  if (!userRole || !userData) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If user is a mechanic, only allow access to specific routes
  if (userRole === 'mechanic') {
    const allowedRoutes = ['/admin/dashboard', '/admin/appointments', '/admin/reports'];
    if (!allowedRoutes.includes(location.pathname)) {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return children;
};

export default RestrictedNavigation; 