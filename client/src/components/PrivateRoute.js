import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import NotFound from '../pages/NotFound';

const PrivateRoute = ({ children, isAdmin = false }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');

  // Token yoksa login sayfasına yönlendir
  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Admin route'u için rol kontrolü
  if (isAdmin) {
    // Usta rolü için izin verilen sayfalar
    const allowedMechanicRoutes = ['/admin/dashboard', '/admin/appointments', '/admin/reports'];
    
    if (userRole === 'mechanic' && !allowedMechanicRoutes.includes(location.pathname)) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    
    if (userRole !== 'admin' && userRole !== 'mechanic') {
      return <NotFound />;
    }
  }

  // Bilinmeyen rotalar için NotFound sayfasını göster
  if (!children) {
    return <NotFound />;
  }

  // Token ve rol kontrolü başarılı, içeriği göster
  return children;
};

export default PrivateRoute; 