// src/components/common/SectionHeading.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '../../constants/animations';

const SectionHeading = ({ title, subtitle, center = true }) => {
  return (
    <motion.div 
      variants={fadeInUp}
      className={`mb-16 ${center ? 'text-center' : ''}`}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-xl text-gray-600">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeading;