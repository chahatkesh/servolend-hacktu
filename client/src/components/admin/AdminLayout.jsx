// src/components/admin/AdminLayout.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { 
  Menu, X, Home, FileText, ClipboardCheck, 
  Users, Settings, Shield, LogOut, Bell, Search,
  BarChart, Mail, User, CreditCard
} from 'lucide-react';

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { admin, handleAdminLogout, isAdminAuthenticated, checkAdminAuthStatus } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Verify authentication when component mounts
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
      badge: null
    },
    { 
      icon: ClipboardCheck, 
      label: 'Applications', 
      path: '/admin/applications',
      badge: '12'
    },
    { 
      icon: Shield, 
      label: 'Risk Assessment', 
      path: '/admin/assessment',
      badge: null
    },
    { 
      icon: FileText, 
      label: 'Documents', 
      path: '/admin/verification',
      badge: '5'
    },
    { 
      icon: Users, 
      label: 'Customers', 
      path: '/admin/customers',
      badge: null
    },
    { 
      icon: BarChart, 
      label: 'Reports', 
      path: '/admin/reports',
      badge: null
    }
  ];

  const secondaryMenuItems = [
    { 
      icon: Settings, 
      label: 'Settings', 
      path: '/admin/settings' 
    },
    { 
      icon: User, 
      label: 'Profile', 
      path: '/admin/profile' 
    }
  ];

  const handleLogout = () => {
    handleAdminLogout();
    navigate('/admin/login');
  };

  const MenuItem = ({ item }) => (
    <NavLink
      to={item.path}
      className={({ isActive }) => `
        flex items-center justify-between px-4 py-3 mb-2 rounded-lg transition-all
        ${isActive 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'text-gray-600 hover:bg-gray-100'
        }
      `}
    >
      <div className="flex items-center">
        <item.icon className="h-5 w-5 mr-3" />
        <span className="font-medium">{item.label}</span>
      </div>
      {item.badge && (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.badge 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {item.badge}
        </span>
      )}
    </NavLink>
  );

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isSidebarOpen ? 0 : -280 }}
        className="fixed left-0 top-0 z-40 h-screen w-72 bg-white shadow-lg"
      >
        <div className="flex h-full flex-col">
          {/* Logo and Brand */}
          <div className="flex items-center justify-between px-6 py-5 border-b">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">
                ServoLend
              </h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search */}
          <div className="px-4 py-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Main Navigation */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <MenuItem key={item.path} item={item} />
              ))}
            </nav>

            {/* Secondary Navigation */}
            <div className="mt-8">
              <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Settings & Profile
              </h3>
              <nav className="mt-4 space-y-1">
                {secondaryMenuItems.map((item) => (
                  <MenuItem key={item.path} item={item} />
                ))}
              </nav>
            </div>
          </div>

          {/* Profile Section */}
          <div className="border-t px-4 py-4 bg-gray-50">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                  {admin?.name?.charAt(0) || 'A'}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{admin?.name || 'Admin User'}</p>
                  <p className="text-sm text-gray-500">Loan Officer</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className={`${isSidebarOpen ? 'lg:ml-72' : ''}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className={`p-2 rounded-lg hover:bg-gray-100 lg:hidden ${
                  isSidebarOpen ? 'hidden' : ''
                }`}
              >
                <Menu className="h-6 w-6" />
              </button>
              <h2 className="text-xl font-semibold text-gray-900">
                {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
              </h2>
            </div>

            <div className="flex items-center space-x-6">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                <Bell className="h-6 w-6" />
              </button>

              {/* Messages */}
              <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-500"></span>
                <Mail className="h-6 w-6" />
              </button>

              {/* Profile Menu */}
              <div className="flex items-center space-x-3">
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{admin?.name}</p>
                  <p className="text-xs text-gray-500">Loan Officer</p>
                </div>
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