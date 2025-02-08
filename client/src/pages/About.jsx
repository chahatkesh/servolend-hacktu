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

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(30deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.1)_100%)] bg-[length:5px_5px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Transforming Loan Origination
              <br />
              for the Digital Age
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-blue-100 max-w-3xl mx-auto"
            >
              ServoLend is revolutionizing the lending industry with AI-powered solutions
              that make loan processing faster, smarter, and more secure.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm text-center"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose ServoLend</h2>
            <p className="text-xl text-gray-600">Experience the future of lending with our comprehensive platform</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 p-6 rounded-xl"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Find answers to common questions about our platform</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 transition-transform ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
    <Footer />
    </>
  );
};

export default About;