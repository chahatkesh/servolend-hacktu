import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, Shield, Eye, Globe, Moon, Sun, 
  Smartphone, Mail, Lock, LogOut, ChevronRight,
  CreditCard, Wallet, Gift, HelpCircle
} from 'lucide-react';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false
  });

  const settingsSections = [
    {
      title: 'Account Settings',
      items: [
        {
          icon: Shield,
          title: 'Security',
          description: 'Password, 2FA, and security settings',
          path: '/settings/security'
        },
        {
          icon: Bell,
          title: 'Notifications',
          description: 'Manage your notification preferences',
          path: '/settings/notifications'
        },
        {
          icon: Globe,
          title: 'Language',
          description: 'Change your preferred language',
          path: '/settings/language'
        }
      ]
    },
    {
      title: 'Payment Settings',
      items: [
        {
          icon: CreditCard,
          title: 'Payment Methods',
          description: 'Manage your payment options',
          path: '/settings/payment'
        },
        {
          icon: Wallet,
          title: 'Auto-Pay Settings',
          description: 'Configure automatic payments',
          path: '/settings/autopay'
        }
      ]
    },
    {
      title: 'Other Settings',
      items: [
        {
          icon: Gift,
          title: 'Rewards & Benefits',
          description: 'View your rewards and benefits',
          path: '/settings/rewards'
        },
        {
          icon: HelpCircle,
          title: 'Help & Support',
          description: 'Get help with your account',
          path: '/settings/help'
        }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
      </div>

      {/* Quick Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-2xl shadow-sm"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Moon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium">Dark Mode</h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-2xl shadow-sm"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium">Notifications</h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={notifications.push}
                onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-2xl shadow-sm"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium">Privacy Mode</h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </motion.div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-8">
        {settingsSections.map((section, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">{section.title}</h3>
            <div className="space-y-4">
              {section.items.map((item, itemIndex) => (
                <motion.div
                  key={itemIndex}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <item.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {/* Danger Zone */}
        <div className="bg-red-50 rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-red-600 mb-6">Danger Zone</h3>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-between w-full p-4 bg-white rounded-xl border border-red-200 hover:bg-red-50"
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <LogOut className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-red-600">Deactivate Account</p>
                <p className="text-sm text-red-500">Temporarily disable your account</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-red-400" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Settings;