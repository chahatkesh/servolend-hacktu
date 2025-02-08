import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, ChartBar, FileText, CheckCircle } from 'lucide-react';

const Loader = () => {
  // Animation sequence for the loading states
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 2,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: [0, 1, 1, 0],
      y: [20, 0, 0, -20],
      transition: {
        duration: 4,
        repeat: Infinity,
        repeatType: 'loop',
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
      <motion.div
        className="relative w-16 h-16"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 className="w-16 h-16 text-blue-500" />
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="text-center"
      >
        <motion.div variants={itemVariants} className="flex items-center gap-2 text-blue-600">
          <FileText className="w-5 h-5" />
          <span>Analyzing your application data...</span>
        </motion.div>

        <motion.div variants={itemVariants} className="flex items-center gap-2 text-blue-600">
          <ChartBar className="w-5 h-5" />
          <span>Calculating risk factors...</span>
        </motion.div>

        <motion.div variants={itemVariants} className="flex items-center gap-2 text-blue-600">
          <CheckCircle className="w-5 h-5" />
          <span>Preparing your personalized report...</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Loader;
