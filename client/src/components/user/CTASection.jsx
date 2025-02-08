import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, CheckCircle } from 'lucide-react';

const CTASection = () => {
  const { isAuthenticated } = useAuth();

  const benefits = [
    'Instant loan decisions',
    'Paperless processing',
    'Competitive rates',
    'Dedicated support'
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative overflow-hidden py-24"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
        <div className="absolute inset-0 bg-[linear-gradient(30deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.1)_100%)] bg-[length:5px_5px]" />
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 bg-white/5 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 bg-blue-500/20 rounded-full mb-4"
            >
              <span className="text-blue-100">Limited Time Offer</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your
              <span className="relative ml-2">
                <span className="relative z-10">Lending?</span>
                <motion.span
                  className="absolute bottom-0 left-0 w-full h-3 bg-blue-400/30 -rotate-1"
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                />
              </span>
            </h2>
            <p className="text-xl text-blue-100 mb-12">
              Join thousands of satisfied customers who have modernized their lending operations
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center justify-center text-blue-100"
                >
                  <CheckCircle className="h-5 w-5 mr-2 text-blue-300" />
                  <span>{benefit}</span>
                </motion.div>
              ))}
            </div>

            {!isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Link
                  to="/login"
                  className="w-full sm:w-auto bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 flex items-center justify-center group"
                >
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/demo"
                  className="w-full sm:w-auto bg-blue-700/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700/40 transition-all border border-blue-400/30 flex items-center justify-center"
                >
                  Schedule Demo
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default CTASection;