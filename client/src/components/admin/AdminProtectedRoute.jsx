import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useEffect, useState } from 'react';

const AdminProtectedRoute = ({ children }) => {
  const { isAdminAuthenticated, loading, checkAdminAuthStatus } = useAdminAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (!isAdminAuthenticated && !loading) {
        await checkAdminAuthStatus();
      }
      setIsChecking(false);
    };

    verifyAuth();
  }, [isAdminAuthenticated, loading, checkAdminAuthStatus]);

  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminProtectedRoute;