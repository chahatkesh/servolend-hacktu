import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, CheckCircle, Clock, Shield, Coins } from 'lucide-react';

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

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 300}px`,
              height: `${Math.random() * 300}px`,
              transform: `translate(-50%, -50%)`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-block px-4 py-2 bg-blue-500/20 rounded-full mb-6"
            >
              <span className="text-blue-200">Trusted by 50,000+ customers</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Smart Lending for the
              <span className="relative">
                <span className="relative z-10"> Digital Age</span>
                <motion.span
                  className="absolute bottom-0 left-0 w-full h-3 bg-blue-400/30 -rotate-2"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                />
              </span>
            </h1>

            <p className="text-xl mb-8 text-blue-100">
              Experience lightning-fast loan approvals with our AI-powered platform. 
              Get decisions in minutes, not days.
            </p>

            <div className="flex flex-wrap gap-4">
              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 flex items-center shadow-lg"
                  >
                    Start Your Application
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/calculator"
                    className="bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-600 transition-all border border-blue-400 flex items-center"
                  >
                    Calculate EMI
                  </Link>
                </>
              )}
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.2 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm text-blue-100">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
              <div className="space-y-6">
                {[1, 2, 3].map((item) => (
                  <motion.div
                    key={item}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: item * 0.2 }}
                    className="flex items-center space-x-4 bg-white/5 p-4 rounded-xl"
                  >
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="h-2 bg-white/20 rounded-full w-3/4 animate-pulse"></div>
                      <div className="h-2 bg-white/20 rounded-full w-1/2 animate-pulse"></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Floating Elements */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="absolute -top-8 -right-8 w-24 h-24 bg-blue-500/20 rounded-2xl backdrop-blur-lg"
            />
            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="absolute -bottom-8 -left-8 w-20 h-20 bg-blue-400/20 rounded-full backdrop-blur-lg"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;