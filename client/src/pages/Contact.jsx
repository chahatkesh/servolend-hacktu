import React, { useState } from 'react';
import { 
  MessageSquare,
  Send,
  CheckCircle,
  Loader2,
  Mail,
  Phone,
  Clock,
  MapPin,
  Globe,
  ArrowRight,
  Facebook,
  Twitter,
  Linkedin,
  Instagram
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    phone: '',
    company: ''
  });
  const [status, setStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('support');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    // Simulate form submission
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '', phone: '', company: '' });
      setTimeout(() => setStatus(null), 3000);
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const contactMethods = [
    {
      icon: MessageSquare,
      title: 'Customer Support',
      value: '+1 (800) 123-4567',
      details: '24/7 Dedicated Support',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Globe,
      title: 'Global Offices',
      value: 'New York | London | Tokyo',
      details: 'Visit our offices',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      value: 'Mon-Fri: 9AM - 6PM',
      details: 'EST Time Zone',
      color: 'bg-green-100 text-green-600'
    }
  ];

  const departments = [
    { id: 'support', label: 'Customer Support' },
    { id: 'sales', label: 'Sales Inquiry' },
    { id: 'partnership', label: 'Partnership' },
    { id: 'press', label: 'Press & Media' }
  ];

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', color: 'hover:bg-blue-600' },
    { icon: Twitter, label: 'Twitter', color: 'hover:bg-blue-400' },
    { icon: Linkedin, label: 'LinkedIn', color: 'hover:bg-blue-700' },
    { icon: Instagram, label: 'Instagram', color: 'hover:bg-pink-600' }
  ];

  const locations = [
    {
      city: 'New York',
      address: '123 Business Avenue, Manhattan',
      zip: 'NY 10001',
      country: 'United States'
    },
    {
      city: 'London',
      address: '456 Corporate Street, Westminster',
      zip: 'SW1A 1AA',
      country: 'United Kingdom'
    },
    {
      city: 'Tokyo',
      address: '789 Tech Plaza, Shibuya',
      zip: '150-0002',
      country: 'Japan'
    }
  ];

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <span className="inline-block px-4 py-2 bg-blue-500/30 rounded-full text-sm mb-6">
              We're here to help
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Let's Start a Conversation
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Our team is ready to assist you with any questions or concerns
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-12">
        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactMethods.map((method, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className={`w-12 h-12 ${method.color} rounded-lg flex items-center justify-center mb-4`}>
                <method.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h3>
              <p className="text-gray-900 mb-1">{method.value}</p>
              <p className="text-gray-500">{method.details}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              {/* Department Selection */}
              <div className="flex flex-wrap gap-2 mb-8">
                {departments.map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => setActiveTab(dept.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === dept.id
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {dept.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your company name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className={`w-full flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium transition-colors ${
                    status === 'sending' ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {status === 'sending' ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>

                {status === 'success' && (
                  <div className="flex items-center text-green-600 bg-green-50 p-4 rounded-lg">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Message sent successfully!
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Side Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Office Locations */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Our Offices</h3>
              <div className="space-y-6">
                {locations.map((location, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <MapPin className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{location.city}</h4>
                      <p className="text-gray-600">{location.address}</p>
                      <p className="text-gray-600">{location.zip}</p>
                      <p className="text-gray-600">{location.country}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Connect With Us</h3>
              <p className="text-gray-600 mb-6">Follow us on social media for updates and news</p>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <button
                    key={index}
                    className={`p-3 bg-white rounded-lg text-gray-600 ${social.color} hover:text-white transition-colors shadow-sm hover:shadow-md`}
                    aria-label={social.label}
                  >
                    <social.icon className="h-6 w-6" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Contact;