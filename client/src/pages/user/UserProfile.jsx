import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Camera,
  Edit2,
  Mail,
  Phone,
  MapPin,
  Shield,
  Key,
  Bell,
  ChevronRight,
  Lock,
  User,
  CreditCard,
  FileText,
  AlertCircle,
  UploadCloud,
  Building,
  DollarSign,
  X,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  getProfile,
  updateProfile,
  updateDocument,
  uploadDocument as uploadDocumentApi,
  updateCommunicationPreferences,
} from '../../services/auth';
import {
  PersonalInfoSection,
  DocumentsSection,
  PreferencesSection,
  SecuritySection,
  SidePanel,
} from './ProfileSections';

// Alert Component
const Alert = ({ variant = 'success', message, onClose }) => {
  const colors = {
    success: 'bg-green-50 border-green-200 text-green-700',
    error: 'bg-red-50 border-red-200 text-red-700',
  };

  return (
    <div
      className={`flex items-center justify-between px-4 py-3 rounded-lg border ${colors[variant]}`}
    >
      <div className="flex items-center">
        {variant === 'success' ? (
          <CheckCircle className="h-5 w-5 mr-2" />
        ) : (
          <AlertCircle className="h-5 w-5 mr-2" />
        )}
        <p>{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="ml-4 hover:opacity-70 transition-opacity">
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

// Profile Header Section
const ProfileHeader = ({ profile, handleLogout, handleImageUpload, imageLoading }) => {
  const fileInputRef = React.useRef(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-8 mb-8 text-white relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
        <svg viewBox="0 0 100 100" className="h-full">
          <pattern
            id="pattern-circles"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="10" cy="10" r="2" fill="currentColor"></circle>
          </pattern>
          <rect x="0" y="0" width="100" height="100" fill="url(#pattern-circles)"></rect>
        </svg>
      </div>

      <div className="flex items-center space-x-8">
        <div className="relative">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-24 h-24 rounded-2xl bg-white/20 flex items-center justify-center overflow-hidden border-4 border-white/30"
          >
            {imageLoading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-white"></div>
            ) : profile.picture ? (
              <img src={profile.picture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="h-12 w-12 text-white" />
            )}
          </motion.div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-2 bg-white rounded-full text-blue-600 shadow-lg hover:bg-blue-50 transition-colors"
            disabled={imageLoading}
          >
            <Camera className="h-4 w-4" />
          </button>
        </div>

        <div>
          <h1 className="text-3xl font-bold">{profile.name}</h1>
          <p className="text-blue-100 mt-1">{profile.email}</p>
          <div className="flex items-center mt-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
                profile.kycStatus === 'verified'
                  ? 'bg-green-500 text-white'
                  : 'bg-yellow-500 text-white'
              }`}
            >
              <Shield className="h-4 w-4 mr-1" />
              {profile.kycStatus === 'verified' ? 'KYC Verified' : 'KYC Pending'}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="ml-auto px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
        >
          Logout
        </button>
      </div>
    </motion.div>
  );
};

// Main UserProfile Component
const UserProfile = () => {
  const { handleLogout, updateUserData } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      setProfile(data);
      updateUserData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch profile');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    if (e) e.preventDefault();

    try {
      setSaveLoading(true);
      setError(null);

      if (!profile.name?.trim()) {
        throw new Error('Name is required');
      }

      const updatedData = {
        name: profile.name.trim(),
        phone: profile.phone?.trim() || '',
        address: profile.address?.trim() || '',
        occupation: profile.occupation?.trim() || '',
        employerName: profile.employerName?.trim() || '',
        monthlyIncome: profile.monthlyIncome?.trim() || '',
        preferredLanguage: profile.preferredLanguage || 'English',
        communicationPreferences: profile.communicationPreferences || [],
      };

      const response = await updateProfile(updatedData);
      setProfile(response);
      updateUserData(response);
      setIsEditing(false);
      showSuccessMessage('Profile updated successfully');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCommunicationPreferenceChange = async (preference) => {
    try {
      const currentPrefs = profile.communicationPreferences || [];
      const updatedPrefs = currentPrefs.includes(preference)
        ? currentPrefs.filter((p) => p !== preference)
        : [...currentPrefs, preference];

      const updatedData = {
        preferredLanguage: profile.preferredLanguage,
        communicationPreferences: updatedPrefs,
      };

      const response = await updateCommunicationPreferences(updatedData);
      setProfile((prev) => ({
        ...prev,
        communicationPreferences: updatedPrefs,
      }));
      updateUserData(response);
      showSuccessMessage('Preferences updated successfully');
    } catch (err) {
      setError(err.message || 'Failed to update preferences');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImageLoading(true);
      setError(null);

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size should not exceed 5MB');
      }

      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        throw new Error('Only JPG and PNG images are allowed');
      }

      // Here you would normally have an API endpoint to handle image upload
      // For now, we'll just simulate it with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showSuccessMessage('Profile picture updated successfully');
    } catch (err) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setImageLoading(false);
    }
  };

  const handleDocumentUpload = async (file, documentType) => {
    try {
      setError(null);

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size should not exceed 5MB');
      }

      const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        throw new Error('Only PDF, JPG, and PNG files are allowed');
      }

      const response = await uploadDocumentApi(file, documentType);
      setProfile(response);
      updateUserData(response);
      showSuccessMessage('Document uploaded successfully');
    } catch (err) {
      setError(err.message || 'Failed to upload document');
    }
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Bell },
  ];

  return (
    <div className="max-w-7xl mx-auto p-8">
      {error && (
        <div className="mb-4">
          <Alert variant="error" message={error} onClose={() => setError(null)} />
        </div>
      )}

      {successMessage && (
        <div className="mb-4">
          <Alert variant="success" message={successMessage} onClose={() => setSuccessMessage('')} />
        </div>
      )}

      <ProfileHeader
        profile={profile}
        handleLogout={handleLogout}
        handleImageUpload={handleImageUpload}
        imageLoading={imageLoading}
      />

      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => {
              if (isEditing) {
                if (
                  window.confirm('You have unsaved changes. Are you sure you want to switch tabs?')
                ) {
                  setIsEditing(false);
                  setActiveTab(tab.id);
                }
              } else {
                setActiveTab(tab.id);
              }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center px-6 py-3 rounded-xl transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="h-5 w-5 mr-2" />
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Content Sections */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'personal' && (
            <PersonalInfoSection
              profile={profile}
              isEditing={isEditing}
              saveLoading={saveLoading}
              handleInputChange={handleInputChange}
              handleProfileUpdate={handleProfileUpdate}
              setIsEditing={setIsEditing}
            />
          )}

          {activeTab === 'documents' && (
            <DocumentsSection profile={profile} handleDocumentUpload={handleDocumentUpload} />
          )}

          {activeTab === 'security' && <SecuritySection />}

          {activeTab === 'preferences' && (
            <PreferencesSection
              profile={profile}
              isEditing={isEditing}
              handleInputChange={handleInputChange}
              handleCommunicationPreferenceChange={handleCommunicationPreferenceChange}
            />
          )}
        </div>

        {/* Side Panel */}
        <div className="lg:col-span-1">
          <SidePanel profile={profile} />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
