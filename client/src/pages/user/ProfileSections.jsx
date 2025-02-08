// ProfileSections.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Edit2, ChevronRight, CreditCard, FileText, AlertCircle, Mail, Phone } from 'lucide-react';

// PersonalInfoSection Component
export const PersonalInfoSection = ({
  profile,
  isEditing,
  saveLoading,
  handleInputChange,
  handleProfileUpdate,
  setIsEditing,
}) => {
  const getCreditScoreRange = (score) => {
    const numScore = Number(score);
    if (!numScore) return null;
    if (numScore >= 800) return { text: 'Excellent credit', color: 'text-green-600' };
    if (numScore >= 740) return { text: 'Very good credit', color: 'text-emerald-500' };
    if (numScore >= 670) return { text: 'Good credit', color: 'text-blue-500' };
    if (numScore >= 580) return { text: 'Fair credit', color: 'text-yellow-500' };
    if (numScore >= 300) return { text: 'Poor credit', color: 'text-red-500' };
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Personal Information</h2>
        <button
          onClick={() => (isEditing ? handleProfileUpdate() : setIsEditing(true))}
          disabled={saveLoading}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            saveLoading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
          }`}
        >
          {saveLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2" />
          ) : (
            <Edit2 className="h-4 w-4 mr-2" />
          )}
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            name="name"
            value={profile.name || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            value={profile.email || ''}
            disabled
            className="w-full p-3 border rounded-lg bg-gray-50 text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={profile.phone || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <input
            type="text"
            name="address"
            value={profile.address || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
          <input
            type="text"
            name="occupation"
            value={profile.occupation || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Employer Name</label>
          <input
            type="text"
            name="employerName"
            value={profile.employerName || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Income</label>
          <input
            type="text"
            name="monthlyIncome"
            value={profile.monthlyIncome || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Credit Score</label>
          <div className="relative">
            <input
              type="text"
              name="creditScore"
              value={profile.creditScore || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
            />
            {profile.creditScore && getCreditScoreRange(profile.creditScore) && (
              <div
                className={`absolute right-2 bottom-2 text-xs ${
                  getCreditScoreRange(profile.creditScore).color
                }`}
              >
                {getCreditScoreRange(profile.creditScore).text}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// DocumentsSection Component
export const DocumentsSection = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const response = await api.get('/user/profile');
        // Transform the documents data to match our display needs
        const formattedDocs = response.documents.map((doc) => ({
          name: doc.name,
          status: doc.status.toLowerCase(),
          uploadDate: doc.uploadDate,
          rejectionReason: doc.rejectionReason,
        }));
        setDocuments(formattedDocs);
      } catch (err) {
        setError('Failed to load documents');
        console.error('Error fetching documents:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-center items-center h-40 text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Document Verification</h2>
      </div>

      <div className="space-y-4">
        {documents.map((doc, index) => (
          <motion.div
            key={doc.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{doc.name}</p>
                <p className="text-sm text-gray-500">
                  {doc.uploadDate ? new Date(doc.uploadDate).toLocaleDateString() : 'Not uploaded'}
                </p>
                {doc.status === 'rejected' && doc.rejectionReason && (
                  <p className="text-sm text-red-500 mt-1">Reason: {doc.rejectionReason}</p>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  doc.status === 'verified'
                    ? 'bg-green-100 text-green-600'
                    : doc.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-600'
                    : doc.status === 'rejected'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// PreferencesSection Component
export const PreferencesSection = ({
  profile,
  isEditing,
  handleInputChange,
  handleCommunicationPreferenceChange,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      <h2 className="text-xl font-semibold mb-6">Communication Preferences</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Language</label>
          <select
            name="preferredLanguage"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={profile.preferredLanguage || 'English'}
            onChange={handleInputChange}
            disabled={!isEditing}
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Gujarati">Gujarati</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Notification Settings
          </label>
          <div className="space-y-4">
            {[
              { id: 'email', label: 'Email Notifications' },
              { id: 'sms', label: 'SMS Notifications' },
              { id: 'push', label: 'Push Notifications' },
            ].map((item) => (
              <label key={item.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={profile.communicationPreferences?.includes(item.id)}
                  onChange={() => handleCommunicationPreferenceChange(item.id)}
                  disabled={!isEditing}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-3">{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// SidePanel Component
export const SidePanel = ({ profile }) => {
  return (
    <div className="space-y-6">
      {/* Account Status Card */}
      <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
        <div className="space-y-4">
          {/* Member Since */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Member Since</span>
            <span className="font-medium">
              {profile.memberSinceFormatted ||
                new Date(profile.memberSince).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                })}
            </span>
          </div>

          {/* KYC Status */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">KYC Status</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                profile.kycStatus === 'verified'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-yellow-100 text-yellow-600'
              }`}
            >
              {profile.kycStatus === 'verified' ? 'Verified' : 'Pending'}
            </span>
          </div>

          {/* Profile Status */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Profile Status</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                profile.profileStatus === 'complete'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-yellow-100 text-yellow-600'
              }`}
            >
              {profile.profileStatus === 'complete' ? 'Complete' : 'Incomplete'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions Card */}
      <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          {[
            { icon: CreditCard, label: 'Update Bank Details', action: () => {} },
            { icon: FileText, label: 'Download Statements', action: () => {} },
            { icon: AlertCircle, label: 'Report an Issue', action: () => {} },
          ].map((item, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={item.action}
              className="flex items-center justify-between w-full p-3 text-left bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <item.icon className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-gray-700">{item.label}</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Connected Accounts Card */}
      <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Connected Accounts</h3>
        <div className="space-y-4">
          {/* Google Account */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="h-4 w-4 text-blue-600" />
              </div>
              <span className="ml-3 text-gray-700">Google Account</span>
            </div>
            <span className="text-green-600 text-sm font-medium">Connected</span>
          </div>

          {/* Mobile Number */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Phone className="h-4 w-4 text-blue-600" />
              </div>
              <span className="ml-3 text-gray-700">Mobile Number</span>
            </div>
            <span className="text-green-600 text-sm font-medium">Verified</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default {
  PersonalInfoSection,
  DocumentsSection,
  PreferencesSection,
  SidePanel,
};
