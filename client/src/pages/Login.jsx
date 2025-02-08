import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GoogleAuthButton from "../components/auth/GoogleAuthButton";
import Lottie from "lottie-react";
import animationData from "../assets/Animation.json";
import { FaLock } from "react-icons/fa";

const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/user";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 relative">
      {/* Admin Login - Subtle version */}
      <div className="absolute top-4 right-4">
        <Link
          to="/admin"
          className="group flex items-center gap-2 py-1.5 px-3 text-xs rounded-full 
            text-gray-500 hover:text-gray-700 transition-all duration-300
            hover:bg-white/80"
        >
          <FaLock className="text-[10px] opacity-60 group-hover:opacity-100" />
          <span className="font-medium">Admin</span>
        </Link>
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Main Card with subtle animation on hover */}
        <div className="w-full max-w-md transform transition-all duration-300 hover:translate-y-[-4px]">
          <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 space-y-8 border border-gray-100">
            {/* Animation and Header */}
            <div className="flex flex-col items-center space-y-4">
              <Lottie animationData={animationData} loop={true} className="w-32 h-32" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Welcome to Servolend
              </h2>
              <p className="text-gray-600 text-center text-sm leading-relaxed max-w-sm">
                Check your loan eligibility and manage applications seamlessly through our secure platform.
              </p>
            </div>

            {/* Login Section */}
            <div className="space-y-6">
              <div className="space-y-4">
                <GoogleAuthButton />

                {/* Enhanced Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">
                      Secure Platform
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer Links with hover effects */}
              <div className="space-y-4">
                <Link
                  to="/"
                  className="block w-full text-center py-3 px-4 rounded-xl 
                    text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 
                    font-medium transition-all duration-200"
                >
                  Return to Home
                </Link>

                <div className="text-center space-y-3 pt-2">
                  <p className="text-sm text-gray-600">
                    Need assistance?{" "}
                    <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                      Contact support
                    </a>
                  </p>
                  <div className="text-xs text-gray-400 flex items-center justify-center gap-1">
                    <FaLock className="text-[10px]" />
                    Secure & trusted financial service by Servolend
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="mt-8 text-center text-sm text-gray-500">
          © 2025 Servolend. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;