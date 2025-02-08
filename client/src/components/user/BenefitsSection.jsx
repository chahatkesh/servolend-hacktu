import React from 'react';
import { motion } from 'framer-motion';
import { Building, Users, CheckCircle, ArrowRight } from 'lucide-react';

const benefits = [
  {
    icon: Building,
    title: 'For Financial Institutions',
    features: [
      {
        title: 'Automated Processing',
        description: 'Reduce manual work by 80% with AI-powered automation'
      },
      {
        title: 'Cost Reduction',
        description: 'Lower operational costs by up to 60% through digitization'
      },
      {
        title: 'Risk Management',
        description: 'Advanced analytics for better risk assessment'
      },
      {
        title: 'Compliance',
        description: 'Automatic regulatory compliance checks and updates'
      }
    ]
  },
  {
    icon: Users,
    title: 'For Borrowers',
    features: [
      {
        title: 'Quick Approvals',
        description: 'Get loan decisions in minutes, not days'
      },
      {
        title: 'Transparent Process',
        description: 'Real-time updates and clear progress tracking'
      },
      {
        title: 'Better Rates',
        description: 'Competitive interest rates through smart matching'
      },
      {
        title: 'Digital Experience',
        description: 'Paperless process with digital document signing'
      }
    ]
  }
];

const BenefitsSection = () => {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="py-24 bg-white relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-blue-50 to-transparent opacity-60"/>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-blue-50 to-transparent opacity-60"/>
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
            className="inline-block px-4 py-2 bg-blue-100 rounded-full mb-4"
          >
            <span className="text-blue-600 font-medium">Win-Win Solution</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Benefits for Everyone
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform delivers exceptional value to both lenders and borrowers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                  <benefit.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">
                  {benefit.title}
                </h3>
              </div>
              
              <div className="p-8">
                <div className="space-y-6">
                  {benefit.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + featureIndex * 0.1 }}
                      className="flex items-start space-x-4"
                    >
                      <div className="mt-1">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {feature.title}
                        </h4>
                        <p className="text-gray-600">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ x: 5 }}
                  className="mt-8 flex items-center text-blue-600 font-semibold"
                >
                  Learn more
                  <ArrowRight className="ml-2 h-5 w-5" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default BenefitsSection;