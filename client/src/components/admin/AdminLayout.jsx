import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Menu, X, Home, ClipboardCheck, Users, Shield, LogOut, CreditCard } from 'lucide-react';

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { admin, handleAdminLogout, isAdminAuthenticated, checkAdminAuthStatus } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdminAuthenticated) {
      const hasSession = checkAdminAuthStatus();
      if (!hasSession) {
        navigate('/admin/login');
      }
    }
  }, [isAdminAuthenticated, checkAdminAuthStatus, navigate]);

  const menuItems = [
    {
      icon: Home,
      label: 'Dashboard',
      path: '/admin/dashboard',
    },
    {
      icon: ClipboardCheck,
      label: 'Applications',
      path: '/admin/applications',
    },
    {
      icon: Shield,
      label: 'Risk Assessment',
      path: '/admin/assessment',
    },
    {
      icon: Users,
      label: 'Users',
      path: '/admin/userlist',
    },
  ];

  const handleLogout = () => {
    handleAdminLogout();
    navigate('/admin/login');
  };

  const MenuItem = ({ item }) => (
    <NavLink
      to={item.path}
      className={({ isActive }) => `
        flex items-center px-4 py-3 mb-1 rounded-md transition-colors
        ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}
      `}
    >
      <item.icon className="h-5 w-5 mr-3" />
      <span className="font-medium">{item.label}</span>
    </NavLink>
  );

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isSidebarOpen ? 0 : -280 }}
        className="fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-200"
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-semibold text-gray-900">ServoLend</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-50"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            {menuItems.map((item) => (
              <MenuItem key={item.path} item={item} />
            ))}
          </nav>

          {/* Profile */}
          <div className="border-t border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                  {admin?.name?.charAt(0) || 'A'}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{admin?.name || 'Admin User'}</p>
                  <p className="text-xs text-gray-500">Loan Officer</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 cursor-pointer text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-50"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className={`${isSidebarOpen ? 'lg:ml-64' : ''} transition-margin duration-300`}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className={`p-2 rounded-md hover:bg-gray-50 lg:hidden ${
                  isSidebarOpen ? 'hidden' : ''
                }`}
              >
                <Menu className="h-5 w-5 text-gray-500" />
              </button>
              <h2 className="text-lg font-medium text-gray-900">
                {menuItems.find((item) => item.path === location.pathname)?.label || 'Dashboard'}
              </h2>
            </div>

            <div className="flex items-center">
              <div className="hidden md:block text-right mr-4">
                <p className="text-sm font-medium text-gray-900">{admin?.name}</p>
                <p className="text-xs text-gray-500">Loan Officer</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
