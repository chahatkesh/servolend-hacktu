import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Menu,
  X,
  User,
  LogOut,
  FileText,
  Calculator,
  Shield,
  Building2,
  ChevronDown,
  Bell,
} from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, handleLogout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();

  // Handle navbar shadow on scroll with debouncing
  useEffect(() => {
    let timeoutId;

    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsScrolled(window.scrollY > 0);
      }, 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location.pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      if (!target.closest('[data-dropdown]')) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsProfileDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const isCurrentPage = (path) => location.pathname === path;

  return (
    <nav
      className={`bg-white transition-all duration-200 sticky top-0 z-50 ${
        isScrolled ? 'shadow-md' : 'border-b border-gray-100'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-3 group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
              aria-label="ServoLend AI Homepage"
            >
              <Shield className="h-8 w-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900">ServoLend AI</span>
                <span className="text-xs text-gray-500 font-medium">Intelligent Lending</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {isAuthenticated ? (
              <>
                {/* Primary Navigation */}
                <div className="flex items-center space-x-1">
                  {[
                    { path: '/user/apply', icon: FileText, label: 'Applications' },
                    { path: '/user/calculator', icon: Calculator, label: 'Tax Calculator' },
                    { path: '/user/dashboard', icon: Building2, label: 'Dashboard' },
                  ].map(({ path, icon: Icon, label }) => (
                    <Link
                      key={path}
                      to={path}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isCurrentPage(path)
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                      }`}
                      aria-current={isCurrentPage(path) ? 'page' : undefined}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{label}</span>
                    </Link>
                  ))}
                </div>

                {/* User Actions */}
                <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200">
                  {/* Notifications */}
                  <button
                    className="relative p-2 cursor-pointer rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
                  </button>

                  {/* Profile Dropdown */}
                  <div className="relative" data-dropdown>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsProfileDropdownOpen(!isProfileDropdownOpen);
                      }}
                      className={`flex cursor-pointer items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isProfileDropdownOpen
                          ? 'bg-gray-100 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                      }`}
                      aria-expanded={isProfileDropdownOpen}
                      aria-haspopup="true"
                    >
                      <User className="h-5 w-5" />
                      <span className="font-medium">Profile</span>
                      <ChevronDown
                        className={`h-4 w-4 ml-1 transition-transform duration-200 ${
                          isProfileDropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {isProfileDropdownOpen && (
                      <div
                        className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transform opacity-100 scale-100 transition-all duration-200"
                        role="menu"
                        aria-orientation="vertical"
                      >
                        {[
                          { path: '/user', label: 'Your Profile' },
                          { path: '/user/settings', label: 'Settings' },
                        ].map(({ path, label }, index) => (
                          <Link
                            key={path}
                            to={path}
                            className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 ${
                              index === 0 ? 'rounded-t-lg' : ''
                            }`}
                            role="menuitem"
                          >
                            {label}
                          </Link>
                        ))}
                        <button
                          onClick={handleLogout}
                          className="w-full cursor-pointer text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                          role="menuitem"
                        >
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                {['About', 'Contact'].map((label) => (
                  <Link
                    key={label}
                    to={`/${label.toLowerCase()}`}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isCurrentPage(`/${label.toLowerCase()}`)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                    }`}
                    aria-current={isCurrentPage(`/${label.toLowerCase()}`) ? 'page' : undefined}
                  >
                    {label}
                  </Link>
                ))}
                <Link
                  to="/login"
                  className="ml-2 px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm hover:shadow-md font-medium"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transform transition-all duration-200 ${
          isMobileMenuOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {isAuthenticated ? (
            <>
              {[
                { path: '/user/applications', icon: FileText, label: 'Applications' },
                { path: '/user/calculator', icon: Calculator, label: 'Tax Calculator' },
                { path: '/user/dashboard', icon: Building2, label: 'Dashboard' },
                { path: '/user', icon: User, label: 'Profile' },
              ].map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isCurrentPage(path)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  } font-medium`}
                  aria-current={isCurrentPage(path) ? 'page' : undefined}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex w-full items-center space-x-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 font-medium"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign out</span>
              </button>
            </>
          ) : (
            <>
              {['About', 'Contact'].map((label) => (
                <Link
                  key={label}
                  to={`/${label.toLowerCase()}`}
                  className={`block px-3 py-2 rounded-lg transition-all duration-200 ${
                    isCurrentPage(`/${label.toLowerCase()}`)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  } font-medium`}
                  aria-current={isCurrentPage(`/${label.toLowerCase()}`) ? 'page' : undefined}
                >
                  {label}
                </Link>
              ))}
              <Link
                to="/login"
                className="block px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium text-center"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
