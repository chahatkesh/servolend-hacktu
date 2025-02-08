import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Shield, Clock, LineChart, Zap, Users, Database, Lock } from 'lucide-react';

const features = [
  {
    icon: Clock,
    title: 'Quick Decisions',
    description: 'Get loan decisions faster with our automated assessment system',
    color: 'bg-blue-500'
  },
  {
    icon: Shield,
    title: 'Secure & Compliant',
    description: 'Bank-grade security with full regulatory compliance',
    color: 'bg-indigo-500'
  },
  {
    icon: LineChart,
    title: 'Smart Analytics',
    description: 'AI-powered risk assessment and fraud detection',
    color: 'bg-purple-500'
  },
  {
    icon: Rocket,
    title: 'Digital First',
    description: 'Fully digital application and document verification process',
    color: 'bg-pink-500'
  },
  {
    icon: Zap,
    title: 'Instant Processing',
    description: 'Real-time verification and automated document processing',
    color: 'bg-orange-500'
  },
  {
    icon: Users,
    title: 'Multi-user Access',
    description: 'Collaborative workflow with role-based permissions',
    color: 'bg-green-500'
  },
  {
    icon: Database,
    title: 'Data Integration',
    description: 'Seamless integration with existing banking systems',
    color: 'bg-teal-500'
  },
  {
    icon: Lock,
    title: 'Privacy Focus',
    description: 'Advanced encryption and data protection measures',
    color: 'bg-red-500'
  }
];

const FeaturesSection = () => {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="py-24 bg-gray-50 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 4px 4px, #e5e7eb 2px, transparent 0)',
          backgroundSize: '24px 24px'
        }}/>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div 
            className="inline-block px-4 py-2 bg-blue-100 rounded-full mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-blue-600 font-medium">Powerful Features</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need to
            <span className="relative ml-2">
              <span className="relative z-10">Succeed</span>
              <motion.span
                className="absolute bottom-0 left-0 w-full h-3 bg-blue-200 -rotate-1"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
              />
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of lending with our comprehensive digital platform
            designed to streamline every aspect of your loan processing
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)'
              }}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all"
            >
              <div className={`w-12 h-12 ${feature.color}/10 rounded-xl flex items-center justify-center mb-4`}>
                <feature.icon className={`h-6 w-6 ${feature.color.replace('bg-', 'text-')}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default FeaturesSection;