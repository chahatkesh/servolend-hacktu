import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const AnimatedCounter = ({ value, label, symbol = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <div ref={ref} className="relative">
      <div className="text-4xl md:text-5xl font-bold mb-2">
        {isInView ? (
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {symbol}{value}
          </motion.span>
        ) : null}
      </div>
      <div className="text-blue-200 text-lg">{label}</div>
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: '40%' } : {}}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute -bottom-2 left-0 h-1 bg-blue-400/30 rounded-full"
      />
    </div>
  );
};

const stats = [
  { value: '500', symbol: '₹', label: 'Cr+ Loans Disbursed' },
  { value: '50,000', symbol: '', label: 'Happy Customers' },
  { value: '99', symbol: '', label: '% Success Rate' },
  { value: '4.8', symbol: '', label: '/5 Customer Rating' }
];

const StatsSection = () => {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="relative overflow-hidden bg-gradient-to-r from-blue-800 via-blue-900 to-blue-950 text-white py-20"
    >
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-2 bg-blue-700/30 rounded-full mb-4"
          >
            <span className="text-blue-200">Our Impact</span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by Leading Institutions
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center relative"
            >
              <AnimatedCounter {...stat} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default StatsSection;