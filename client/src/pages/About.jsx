import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  CheckCircle, 
  Users, 
  Rocket, 
  Shield,
  Building,
  FileText,
  ChevronDown
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const About = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const stats = [
    { value: '500+', label: 'Financial Institutions', icon: Building },
    { value: '₹10B+', label: 'Loans Processed', icon: FileText },
    { value: '99.9%', label: 'Success Rate', icon: CheckCircle },
    { value: '50,000+', label: 'Happy Customers', icon: Users }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Bank-grade security protocols and compliance with all regulatory requirements'
    },
    {
      icon: Rocket,
      title: 'Fast Processing',
      description: 'AI-powered assessment enabling loan decisions in minutes, not days'
    },
    {
      icon: Users,
      title: 'Customer Focus',
      description: 'Dedicated support team and seamless digital experience'
    },
    {
      icon: Award,
      title: 'Industry Leading',
      description: 'Recognized for innovation in digital lending solutions'
    }
  ];

  const faqs = [
    {
      question: 'How does ServoLend ensure data security?',
      answer: 'We employ bank-grade encryption, regular security audits, and strict access controls to protect sensitive financial data. Our platform complies with GDPR, CCPA, and other relevant regulations.'
    },
    {
      question: 'What makes ServoLend different from traditional lending platforms?',
      answer: 'ServoLend combines AI-powered assessment, automated document verification, and seamless integration capabilities to provide faster decisions while maintaining high security standards.'
    },
    {
      question: 'How long does the loan approval process take?',
      answer: 'With our automated assessment system, most applications receive initial decisions within minutes. The complete process, including document verification, typically takes 24-48 hours.'
    },
    {
      question: 'What types of financial institutions can use ServoLend?',
      answer: 'ServoLend is designed for banks, NBFCs, credit unions, and other lending institutions. Our platform is scalable and customizable to meet diverse requirements.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-blue-600 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(30deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.1)_100%)] bg-[length:5px_5px]" />
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="text-center">
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-6xl font-bold mb-8 leading-tight"
            >
              Transforming Loan Origination
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">
                for the Digital Age
              </span>
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed"
            >
              ServoLend is revolutionizing the lending industry with AI-powered solutions
              that make loan processing faster, smarter, and more secure.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 -mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-4xl font-bold text-gray-900 mb-3">{stat.value}</h3>
                <p className="text-gray-600 text-lg">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose ServoLend</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Experience the future of lending with our comprehensive platform</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-gray-50 p-8 rounded-2xl hover:bg-blue-50 transition-colors duration-300"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Find answers to common questions about our platform</p>
          </motion.div>

          <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="font-semibold text-xl text-gray-900">{faq.question}</span>
                  <ChevronDown
                    className={`h-6 w-6 text-blue-600 transition-transform duration-200 ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <motion.div 
                  initial={false}
                  animate={{
                    height: expandedFaq === index ? 'auto' : 0,
                    opacity: expandedFaq === index ? 1 : 0
                  }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-8 pb-6">
                    <p className="text-gray-600 text-lg leading-relaxed">{faq.answer}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
    <Footer />
    </>
  );
};

export default About;