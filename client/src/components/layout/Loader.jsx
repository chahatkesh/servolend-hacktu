import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, FileText, Activity, CheckCircle } from 'lucide-react';
import Lottie from 'lottie-react';
import animationData from '../../assets/Animation.json';

const Loader = () => {
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.8,
      },
    },
  };

  const itemVariants = {
    initial: { 
      opacity: 0,
      y: 20,
      scale: 0.95 
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  const progressVariants = {
    initial: { width: "0%" },
    animate: { 
      width: "100%",
      transition: {
        duration: 2,
        ease: "easeInOut"
      }
    }
  };

  const iconVariants = {
    initial: { scale: 0.8, rotate: 0 },
    animate: {
      scale: 1,
      rotate: 360,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-6 rounded-xl bg-white">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">ServoLend AI</h2>
        <p className="text-gray-600">Advanced Risk Analysis System</p>
      </div>
      
      <div className="w-24 h-24 mb-6">
        <Lottie 
          animationData={animationData}
          loop={true}
          autoplay={true}
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="space-y-3 max-w-md w-full"
      >
        <motion.div 
          variants={itemVariants} 
          className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-50 to-white shadow-sm border border-blue-100"
        >
          <motion.div 
            variants={progressVariants}
            className="absolute bottom-0 left-0 h-0.5 bg-blue-500"
          />
          <div className="flex items-center gap-3 p-3">
            <motion.div 
              variants={iconVariants}
              className="p-2 rounded-full bg-blue-100/50"
            >
              <FileText className="w-5 h-5 text-blue-600" />
            </motion.div>
            <div className="flex-1">
              <p className="text-gray-800 font-semibold">Processing Application</p>
              <p className="text-gray-600 text-sm">Analyzing financial documents</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-50 to-white shadow-sm border border-blue-100"
        >
          <motion.div 
            variants={progressVariants}
            className="absolute bottom-0 left-0 h-0.5 bg-blue-500"
          />
          <div className="flex items-center gap-3 p-3">
            <motion.div 
              variants={iconVariants}
              className="p-2 rounded-full bg-blue-100/50"
            >
              <Activity className="w-5 h-5 text-blue-600" />
            </motion.div>
            <div className="flex-1">
              <p className="text-gray-800 font-semibold">Risk Assessment</p>
              <p className="text-gray-600 text-sm">Evaluating credit factors</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-50 to-white shadow-sm border border-blue-100"
        >
          <motion.div 
            variants={progressVariants}
            className="absolute bottom-0 left-0 h-0.5 bg-blue-500"
          />
          <div className="flex items-center gap-3 p-3">
            <motion.div 
              variants={iconVariants}
              className="p-2 rounded-full bg-blue-100/50"
            >
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </motion.div>
            <div className="flex-1">
              <p className="text-gray-800 font-semibold">Finalizing Report</p>
              <p className="text-gray-600 text-sm">Generating loan analysis</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div className="mt-4 text-gray-500 text-sm">
        This may take a few moments...
      </div>
    </div>
  );
};

export default Loader;