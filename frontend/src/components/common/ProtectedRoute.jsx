import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

export const ProtectedRoute = ({ allowedRole }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="btn btn-secondary disabled">Loading Portal...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const hasRole = Array.isArray(allowedRole)
    ? allowedRole.includes(role)
    : !allowedRole || role === allowedRole;

  if (!hasRole) {
    const redirectPath = role === 'ADMIN' ? '/admin/dashboard' : role === 'OFFICER' ? '/officer/dashboard' : '/citizen/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};
