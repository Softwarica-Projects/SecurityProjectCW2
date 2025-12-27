import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, role }) => {
    const { isAuthenticated, userRole } = useAuth();
    
    if (!isAuthenticated || !role.includes(userRole)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;