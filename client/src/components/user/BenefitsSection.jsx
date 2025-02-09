import React from 'react';
import { motion } from 'framer-motion';
import { Building, Users, CheckCircle, Shield } from 'lucide-react';

const benefits = [
  {
    icon: Building,
    title: 'For Financial Institutions',
    subtitle: 'Streamline your lending operations',
    features: [
      {
        title: 'Automated Processing',
        description: 'Reduce manual work by 80% with AI-powered automation',
        icon: CheckCircle
      },
      {
        title: 'Cost Reduction',
        description: 'Lower operational costs by up to 60% through digitization',
        icon: CheckCircle
      },
      {
        title: 'Risk Management',
        description: 'Advanced analytics for better risk assessment',
        icon: CheckCircle
      },
      {
        title: 'Compliance',
        description: 'Automatic regulatory compliance checks and updates',
        icon: CheckCircle
      }
    ]
  },
  {
    icon: Users,
    title: 'For Borrowers',
    subtitle: 'Fast and transparent lending',
    features: [
      {
        title: 'Quick Approvals',
        description: 'Get loan decisions in minutes, not days',
        icon: CheckCircle
      },
      {
        title: 'Transparent Process',
        description: 'Real-time updates and clear progress tracking',
        icon: CheckCircle
      },
      {
        title: 'Better Rates',
        description: 'Competitive interest rates through smart matching',
        icon: CheckCircle
      },
      {
        title: 'Digital Experience',
        description: 'Paperless process with digital document signing',
        icon: CheckCircle
      }
    ]
  }
];

const BenefitsSection = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 4px 4px, #e5e7eb 1px, transparent 0)',
          backgroundSize: '48px 48px',
          opacity: 0.2
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
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
            className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full mb-4"
          >
            <Shield className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-blue-600 font-medium">Win-Win Solution</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Benefits for Everyone
            <span className="relative ml-2">
              <span className="relative z-10">Involved</span>
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
            Our platform delivers exceptional value to both lenders and borrowers through
            innovative technology and streamlined processes
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
              className="group relative"
            >
              {/* Card */}
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <benefit.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-white">{benefit.title}</h3>
                      <p className="text-blue-100">{benefit.subtitle}</p>
                    </div>
                  </div>
                </div>
                
                {/* Features List */}
                <div className="p-8">
                  <div className="space-y-6">
                    {benefit.features.map((feature, featureIndex) => (
                      <motion.div
                        key={featureIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + featureIndex * 0.1 }}
                        className="flex items-start space-x-4 group"
                      >
                        <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                          <feature.icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                            {feature.title}
                          </h4>
                          <p className="text-gray-600 group-hover:text-gray-700">
                            {feature.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Stats Banner */}
                  <div className="mt-8 p-4 bg-blue-50 rounded-xl">
                    <div className="grid grid-cols-2 gap-4">
                      {index === 0 ? (
                        <>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">80%</div>
                            <div className="text-sm text-gray-600">Faster Processing</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">60%</div>
                            <div className="text-sm text-gray-600">Cost Reduction</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">5min</div>
                            <div className="text-sm text-gray-600">Application Time</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">24/7</div>
                            <div className="text-sm text-gray-600">Support Available</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;