// src/components/layout/Layout.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, Home, FileText, Settings, User, CreditCard, Activity, Bell } from 'lucide-react';

const Layout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: User, label: 'Profile', path: '/user' },
    { icon: Home, label: 'Dashboard', path: '/user/dashboard' },
    { icon: FileText, label: 'Applications', path: '/user/applications' },
    { icon: CreditCard, label: 'Repayments', path: '/user/repayments' },
    { icon: Activity, label: 'Transactions', path: '/user/transactions' },
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
    <motion.div whileHover={{ x: 10 }} whileTap={{ scale: 0.95 }}>
      <NavLink
        to={item.path}
        end={item.path === '/user'}
        className={({ isActive }) => `
          flex items-center px-6 py-4 rounded-xl transition-all duration-200
          ${
            isActive
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-blue-100/80 hover:bg-white/5 hover:text-white'
          }
        `}
      >
        <item.icon className="h-5 w-5 mr-3" />
        <span className="font-medium">{item.label}</span>
      </NavLink>
    </motion.div>
  );

  return (
    <>
      <AnimatePresence>{isLoading && <LoadingOverlay />}</AnimatePresence>

      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -250 }}
          animate={{ x: isSidebarOpen ? 0 : -250 }}
          className="w-72 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 fixed h-full z-20"
        >
          <div className="p-8">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold text-white"
            >
              ServoLend
            </motion.h1>
          </div>

          <nav className="mt-8 px-4 space-y-2">
            {menuItems.map((item, index) => (
              <MenuItem key={index} item={item} />
            ))}
          </nav>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-0 w-full p-6"
          >
            <div className="bg-blue-700/30 rounded-xl p-4 mb-6">
              <h4 className="text-white text-sm mb-2">Need Help?</h4>
              <p className="text-blue-100/70 text-xs">Contact our support team 24/7</p>
              <button className="mt-3 w-full bg-white text-blue-600 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                Get Support
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 ml-72">
          <header className="bg-white shadow-sm fixed w-[calc(100%-18rem)] z-10">
            <div className="flex items-center justify-between px-8 py-4">
              <div className="flex items-center space-x-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSidebarOpen(true)}
                  className={`lg:hidden ${isSidebarOpen ? 'hidden' : 'block'}`}
                >
                  <Menu size={24} />
                </motion.button>
                <h2 className="text-xl font-semibold text-gray-800">
                  {menuItems.find((item) => item.path === location.pathname)?.label || 'Dashboard'}
                </h2>
              </div>

              <div className="flex items-center space-x-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 rounded-full hover:bg-gray-50"
                >
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full"
                  />
                  <Bell size={22} className="text-gray-600" />
                </motion.button>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-4 bg-gray-50 p-2 rounded-xl cursor-pointer"
                >
                  <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-medium shadow-lg">
                    JD
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">John Doe</p>
                    <p className="text-gray-500">Premium User</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </header>

          <main className="pt-24 px-8 pb-8">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;
