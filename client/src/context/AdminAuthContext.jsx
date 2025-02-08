import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize admin state from localStorage on mount
    const savedAdmin = localStorage.getItem('adminData');
    if (savedAdmin) {
      try {
        setAdmin(JSON.parse(savedAdmin));
      } catch (error) {
        console.error('Error parsing admin data:', error);
        localStorage.removeItem('adminData');
      }
    }
    setLoading(false);
  }, []);

  const handleAdminLogin = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      if (credentials.id === 'test01' && credentials.password === 'test@ccs') {
        const adminData = {
          id: 'test01',
          name: 'Test Officer',
          role: 'loan_officer'
        };
        setAdmin(adminData);
        localStorage.setItem('adminData', JSON.stringify(adminData));
        navigate('/admin/dashboard');
        return true;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogout = () => {
    setAdmin(null);
    localStorage.removeItem('adminData');
    navigate('/admin/login');
  };

  const checkAdminAuthStatus = async () => {
    const savedAdmin = localStorage.getItem('adminData');
    if (savedAdmin) {
      try {
        const adminData = JSON.parse(savedAdmin);
        setAdmin(adminData);
        return true;
      } catch (error) {
        console.error('Error checking admin auth status:', error);
        localStorage.removeItem('adminData');
      }
    }
    return false;
  };

  const value = {
    admin,
    loading,
    error,
    handleAdminLogin,
    handleAdminLogout,
    checkAdminAuthStatus,
    isAdminAuthenticated: !!admin
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};