import React from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, Shield, Clock, LineChart, Zap, Users, Database, Lock,
  CheckCircle
} from 'lucide-react';

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
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
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
          className="text-center mb-20"
        >
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full mb-4"
          >
            <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-blue-600 font-medium">Powerful Features</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
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
              whileHover={{ scale: 1.02, translateY: -5 }}
              className="group bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-7 w-7 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Additional Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            { title: '99.9%', subtitle: 'System Uptime', description: 'Reliable platform you can count on' },
            { title: '256-bit', subtitle: 'Encryption', description: 'Bank-grade security for your data' },
            { title: '24/7', subtitle: 'Support', description: 'Round-the-clock expert assistance' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="text-center p-8 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-colors duration-300"
            >
              <h4 className="text-3xl font-bold text-blue-600 mb-1">{stat.title}</h4>
              <p className="text-gray-900 font-medium mb-2">{stat.subtitle}</p>
              <p className="text-gray-600">{stat.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;