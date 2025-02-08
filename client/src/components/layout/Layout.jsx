import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Home,
  FileText,
  Settings,
  User,
  Activity,
  Bell,
  Calculator,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Layout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const menuItems = [
    { icon: User, label: 'Profile', path: '/user' },
    { icon: Home, label: 'Dashboard', path: '/user/dashboard' },
    { icon: FileText, label: 'Apply For Loan', path: '/user/apply' },
    { icon: Calculator, label: 'Tax Calculator', path: '/user/calculator' },
    { icon: Bell, label: 'Notifications', path: '/user/notification' },
    { icon: Settings, label: 'Settings', path: '/user/settings' },
  ];

  const LoadingOverlay = () => (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white z-50 flex items-center justify-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
      />
    </motion.div>
  );

  const MenuItem = ({ item }) => (
    <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
      <NavLink
        to={item.path}
        end={item.path === '/user'}
        onClick={() => isMobile && setSidebarOpen(false)}
        className={({ isActive }) => `
          flex items-center px-4 py-3 rounded-xl transition-all duration-200
          ${
            isActive
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-blue-100/80 hover:bg-white/5 hover:text-white'
          }
        `}
      >
        <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
        <span className="font-medium truncate">{item.label}</span>
      </NavLink>
    </motion.div>
  );

  const Sidebar = () => (
    <motion.aside
      initial={isMobile ? { x: -280 } : { x: 0 }}
      animate={{ x: isSidebarOpen ? 0 : -280 }}
      transition={{ type: 'tween', duration: 0.3 }}
      className={`w-[280px] bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 fixed h-full z-30 
        ${isMobile ? 'shadow-2xl' : ''}`}
    >
      <div className="flex justify-between items-center p-6">
        <Link to="/" className="flex items-center space-x-3">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold text-white"
          >
            ServoLend
          </motion.h1>
        </Link>
        {isMobile && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSidebarOpen(false)}
            className="text-white p-1"
          >
            <X size={24} />
          </motion.button>
        )}
      </div>

      <nav className="px-4 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)]">
        {menuItems.map((item, index) => (
          <MenuItem key={index} item={item} />
        ))}
      </nav>

      <div className="absolute bottom-0 w-full p-4 space-y-4">
        <div className="bg-blue-700/30 rounded-xl p-4">
          <h4 className="text-white text-sm mb-2">Need Help?</h4>
          <p className="text-blue-100/70 text-xs">Contact our support team 24/7</p>
          <button className="mt-3 w-full bg-white text-blue-600 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
            Get Support
          </button>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="w-full cursor-pointer flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
        >
          <LogOut size={18} />
          <span className="font-medium">Logout</span>
        </motion.button>
      </div>
    </motion.aside>
  );

  return (
    <>
      <AnimatePresence>{isLoading && <LoadingOverlay />}</AnimatePresence>

      <div className="flex h-screen bg-gray-50">
        {/* Overlay for mobile */}
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-20"
          />
        )}

        <Sidebar />

        {/* Main Content */}
        <div className={`flex-1 ${!isMobile && 'ml-[280px]'} min-h-screen`}>
          <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="flex items-center justify-between px-4 py-4 md:px-6">
              {/* Left Section */}
              <div className="flex items-center space-x-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSidebarOpen(true)}
                  className={isSidebarOpen && !isMobile ? 'hidden' : 'block'}
                >
                  <Menu size={24} className="text-gray-600" />
                </motion.button>
                <div className="flex flex-col">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800 truncate">
                    {menuItems.find((item) => item.path === location.pathname)?.label ||
                      'Dashboard'}
                  </h2>
                  <p className="text-sm text-gray-500 hidden md:block">
                    Welcome back, {user?.name?.split(' ')[0] || 'Guest'}
                  </p>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center space-x-2 md:space-x-4">
                {/* Quick Actions */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/user/apply')}
                  className="hidden md:flex cursor-pointer items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <FileText size={18} />
                  <span className="font-medium">Quick Apply</span>
                </motion.button>

                {/* Notification Button */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/user/notification')}
                    className="relative p-2 rounded-full cursor-pointer hover:bg-gray-50"
                  >
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full"
                    />
                    <Bell size={22} className="text-gray-600" />
                  </motion.button>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    3
                  </span>
                </div>

                {/* User Section */}
                {isMobile ? (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="h-10 w-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-medium shadow-lg"
                  >
                    {getInitials(user?.name)}
                  </motion.div>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center space-x-3 bg-gray-50 px-3 py-2 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div className="h-9 w-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-medium shadow-lg">
                      {getInitials(user?.name)}
                    </div>
                    <div className="hidden md:block">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.name || 'Guest User'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Credit Score: {user?.creditScore || 'N/A'}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </header>
          <main className="p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;
