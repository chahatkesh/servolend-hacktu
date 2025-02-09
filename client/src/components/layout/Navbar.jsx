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
  Building2,
  ChevronDown,
  Landmark,
  ExternalLink,
} from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, handleLogout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();

  // Enhanced scroll handling with smoother threshold
  useEffect(() => {
    let timeoutId;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsScrolled(window.scrollY > 10);
      }, 50); // Reduced debounce time for smoother response
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('[data-dropdown]')) {
        setIsProfileDropdownOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsProfileDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const isCurrentPage = (path) => location.pathname === path;

  const NavLink = ({ to, icon: Icon, label, className = '' }) => (
    <Link
      to={to}
      className={`group flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        isCurrentPage(to)
          ? 'bg-blue-50 text-blue-600 shadow-sm'
          : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
      } ${className}`}
      aria-current={isCurrentPage(to) ? 'page' : undefined}
    >
      <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
      <span className="font-medium">{label}</span>
    </Link>
  );

  return (
    <nav
      className={`bg-white backdrop-blur-lg bg-opacity-90 transition-all duration-300 sticky top-0 z-50 ${
        isScrolled ? 'shadow-lg' : 'border-b border-gray-100'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18">
          {/* Enhanced Logo and Brand */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-3 group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2 transition-transform duration-300 hover:scale-105"
              aria-label="ServoLend AI Homepage"
            >
              <Landmark className="h-9 w-9 text-blue-600 group-hover:text-blue-700 transition-all duration-300 transform group-hover:rotate-12" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 tracking-tight">ServoLend AI</span>
                <span className="text-xs text-gray-500 font-medium tracking-wide">
                  Intelligent Lending
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2">
                  {[
                    { to: '/user/apply', icon: FileText, label: 'Applications' },
                    { to: '/user/calculator', icon: Calculator, label: 'Tax Calculator' },
                    { to: '/user/dashboard', icon: Building2, label: 'Dashboard' },
                  ].map((item) => (
                    <NavLink key={item.to} {...item} />
                  ))}
                </div>

                <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-gray-200">
                  <div className="relative" data-dropdown>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsProfileDropdownOpen(!isProfileDropdownOpen);
                      }}
                      className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isProfileDropdownOpen
                          ? 'bg-blue-50 text-blue-600 shadow-sm'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                      }`}
                      aria-expanded={isProfileDropdownOpen}
                      aria-haspopup="true"
                    >
                      <User className="h-5 w-5" />
                      <span className="font-medium">Profile</span>
                      <ChevronDown
                        className={`h-4 w-4 ml-1 transition-transform duration-300 ${
                          isProfileDropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isProfileDropdownOpen && (
                      <div
                        className="absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none transform origin-top-right transition-all duration-200 ease-out"
                        role="menu"
                        aria-orientation="vertical"
                      >
                        {[
                          { to: '/user', label: 'Your Profile' },
                          { to: '/user/settings', label: 'Settings' },
                        ].map(({ to, label }, index) => (
                          <Link
                            key={to}
                            to={to}
                            className={`block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200 ${
                              index === 0 ? 'rounded-t-lg' : ''
                            }`}
                            role="menuitem"
                          >
                            {label}
                          </Link>
                        ))}
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 rounded-b-lg font-medium"
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
              <div className="flex items-center space-x-6">
                {[
                  { to: '/about', label: 'About', icon: Building2 },
                  { to: '/contact', label: 'Contact', icon: ExternalLink },
                ].map((item) => (
                  <NavLink key={item.to} {...item} />
                ))}
                <div className="pl-6 border-l border-gray-200">
                  <Link
                    to="/login"
                    className="inline-flex items-center px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm hover:shadow-lg font-medium space-x-2 transform hover:scale-105"
                  >
                    <User className="h-5 w-5" />
                    <span>Login</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X
                  className="h-6 w-6 transition-transform duration-200 rotate-90"
                  aria-hidden="true"
                />
              ) : (
                <Menu className="h-6 w-6 transition-transform duration-200" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile menu with smooth transitions */}
      <div
        className={`md:hidden transform transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? 'opacity-100 translate-y-0 h-auto'
            : 'opacity-0 -translate-y-4 h-0 overflow-hidden'
        }`}
        id="mobile-menu"
      >
        <div className="px-3 pt-2 pb-4 space-y-2">
          {isAuthenticated ? (
            <>
              {[
                { to: '/user/applications', icon: FileText, label: 'Applications' },
                { to: '/user/calculator', icon: Calculator, label: 'Tax Calculator' },
                { to: '/user/dashboard', icon: Building2, label: 'Dashboard' },
                { to: '/user', icon: User, label: 'Profile' },
              ].map((item) => (
                <NavLink key={item.to} {...item} className="w-full" />
              ))}
              <button
                onClick={handleLogout}
                className="flex w-full items-center space-x-2 px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 font-medium transition-colors duration-200"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign out</span>
              </button>
            </>
          ) : (
            <>
              {[
                { to: '/about', label: 'About', icon: Building2 },
                { to: '/contact', label: 'Contact', icon: ExternalLink },
              ].map((item) => (
                <NavLink key={item.to} {...item} className="w-full" />
              ))}
              <Link
                to="/login"
                className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition-all duration-300 w-full mt-4"
              >
                <User className="h-5 w-5" />
                <span>Login</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
