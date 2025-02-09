import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, CheckCircle, Clock, Shield, Coins, DollarSign, Users, ChartBar } from 'lucide-react';

const HeroSection = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Clock,
      text: "5-minute application process"
    },
    {
      icon: Shield,
      text: "Bank-grade security protocols"
    },
    {
      icon: Coins,
      text: "Competitive interest rates"
    }
  ];

  const loanStats = [
    {
      icon: DollarSign,
      title: "Fast Approvals",
      description: "Get decisions in under 5 minutes",
      color: "from-green-400 to-green-600"
    },
    {
      icon: Users,
      title: "Happy Customers",
      description: "Join our satisfied user base",
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: ChartBar,
      title: "Success Rate",
      description: "99% application success rate",
      color: "from-purple-400 to-purple-600"
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
      {/* Animated background pattern */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              animation: `float ${Math.random() * 10 + 10}s infinite linear`
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-white space-y-8">
            <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full">
              <span className="text-blue-100">Trusted by 50,000+ customers</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Smart Lending for the
              <div className="relative inline-block ml-2">
                <span className="relative z-10">Digital Age</span>
                <div className="absolute bottom-2 left-0 w-full h-3 bg-blue-400/30 -rotate-2" />
              </div>
            </h1>

            <p className="text-xl text-blue-100">
              Experience lightning-fast loan approvals with our AI-powered platform.
              Get decisions in minutes, not days.
            </p>

            {!isAuthenticated && (
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/login"
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg inline-flex items-center group"
                >
                  Start Your Application
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/calculator"
                  className="bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-600 transition-all border border-blue-400"
                >
                  Calculate EMI
                </Link>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-lg">
                    <feature.icon className="h-6 w-6 text-blue-100" />
                  </div>
                  <span className="text-blue-100">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Visual Elements */}
          <div className="relative">
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-400/20 rounded-full filter blur-3xl" />
            <div className="relative space-y-6">
              {loanStats.map((stat, index) => (
                <div
                  key={index}
                  className="transform hover:scale-105 transition-transform"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{stat.title}</h3>
                        <p className="text-blue-100">{stat.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="absolute -right-4 top-1/2 w-20 h-20 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full opacity-60 filter blur-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(20px, 20px) rotate(180deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;