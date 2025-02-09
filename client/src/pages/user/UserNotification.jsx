import React, { useState, useEffect } from 'react';
import { Bell, AlertCircle, FileText, User, CreditCard } from 'lucide-react';
import { api } from '../../services/api';

const UserNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userData = await api.get('/user/profile');
      generateNotifications(userData);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNotifications = (userData) => {
    const newNotifications = [];
    const currentDate = new Date();

    // Profile Status Notifications
    if (userData.profileStatus === 'pending') {
      newNotifications.push({
        id: 'profile-incomplete',
        type: 'profile',
        title: 'Complete Your Profile',
        message: 'Please complete your profile to access all features.',
        timestamp: currentDate,
        status: 'warning',
        icon: User,
      });
    }

    // KYC Status Notifications
    if (userData.kycStatus === 'pending') {
      newNotifications.push({
        id: 'kyc-pending',
        type: 'kyc',
        title: 'KYC Verification Pending',
        message: 'Your KYC verification is pending. Please submit required documents.',
        timestamp: currentDate,
        status: 'warning',
        icon: User,
      });
    } else if (userData.kycStatus === 'rejected') {
      newNotifications.push({
        id: 'kyc-rejected',
        type: 'kyc',
        title: 'KYC Verification Failed',
        message: 'Your KYC verification was rejected. Please resubmit with correct documents.',
        timestamp: currentDate,
        status: 'error',
        icon: AlertCircle,
      });
    }

    // Document Notifications
    if (userData.documents && userData.documents.length > 0) {
      userData.documents.forEach((doc) => {
        if (doc.status === 'REJECTED') {
          newNotifications.push({
            id: `doc-${doc.name}`,
            type: 'document',
            title: 'Document Rejected',
            message: `Your ${doc.name} was rejected. Reason: ${doc.rejectionReason}`,
            timestamp: doc.uploadDate,
            status: 'error',
            icon: FileText,
          });
        } else if (doc.status === 'VERIFIED') {
          newNotifications.push({
            id: `doc-${doc.name}`,
            type: 'document',
            title: 'Document Verified',
            message: `Your ${doc.name} has been successfully verified.`,
            timestamp: doc.uploadDate,
            status: 'success',
            icon: FileText,
          });
        }
      });
    }

    // Loan Application Notifications
    if (userData.loanApplication) {
      const loan = userData.loanApplication;

      if (loan.status === 'submitted') {
        newNotifications.push({
          id: 'loan-submitted',
          type: 'loan',
          title: 'Loan Application Submitted',
          message: `Your ${loan.loan_intent.toLowerCase()} loan application for ₹${
            loan.loan_amnt
          } is under review.`,
          timestamp: loan.lastUpdated,
          status: 'info',
          icon: CreditCard,
        });
      } else if (loan.status === 'approved') {
        newNotifications.push({
          id: 'loan-approved',
          type: 'loan',
          title: 'Loan Application Approved',
          message: `Congratulations! Your loan application has been approved with ${loan.loan_int_rate}% interest rate.`,
          timestamp: loan.lastUpdated,
          status: 'success',
          icon: CreditCard,
        });
      } else if (loan.status === 'rejected') {
        newNotifications.push({
          id: 'loan-rejected',
          type: 'loan',
          title: 'Loan Application Status',
          message: 'Your loan application was not approved at this time.',
          timestamp: loan.lastUpdated,
          status: 'error',
          icon: CreditCard,
        });
      }
    }

    // Sort notifications by timestamp (most recent first)
    newNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setNotifications(newNotifications);
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Bell className="w-6 h-6 text-gray-600" />
        <h1 className="text-2xl font-semibold text-gray-800">Notifications</h1>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => {
          const Icon = notification.icon;
          return (
            <div
              key={notification.id}
              className={`rounded-lg border p-4 ${getStatusStyles(
                notification.status
              )} transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold mb-1">{notification.title}</p>
                  <p className="text-sm opacity-90">{notification.message}</p>
                  <p className="text-sm mt-2 opacity-75">{formatDate(notification.timestamp)}</p>
                </div>
              </div>
            </div>
          );
        })}

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No notifications at this time</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserNotification;
