import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GoogleAuthButton from "../components/auth/GoogleAuthButton";
import Lottie from "lottie-react";
import animationData from "../assets/Animation.json";

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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Card Container */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-8 border border-gray-100">
          {/* Lottie Animation */}
          <div className="flex flex-col items-center space-y-3">
            <Lottie animationData={animationData} loop={true} className="w-32 h-32" />
            <h2 className="text-3xl font-bold text-gray-900">Welcome to Servolend</h2>
            <p className="text-gray-500 text-center">
              Check your loan eligibility and manage applications seamlessly.
            </p>
          </div>

          {/* Login Section */}
          <div className="space-y-6">
            <div className="space-y-4">
              <GoogleAuthButton />

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    Secure Loan Management
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            <div className="space-y-4">
              <Link
                to="/"
                className="block w-full text-center py-3 px-4 rounded-lg text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Return to Home
              </Link>

              <div className="text-center space-y-2">
                <p className="text-sm text-gray-500">
                  Need help? Contact our support team
                </p>
                <div className="text-xs text-gray-400">
                  Secure & trusted financial service by Servolend
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
