import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0b1120] text-slate-400">
        Verifying session...
      </div>
    );
  }

  // Redirect to login if unauthenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to respective default dashboards if the user lacks the specific role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? '/admin/overview' : '/authority/overview'} replace />;
  }

  // Render the protected layout and pages
  return <Outlet />;
};

export default ProtectedRoute;