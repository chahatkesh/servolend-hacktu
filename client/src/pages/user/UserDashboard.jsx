import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Calendar,
  TrendingUp,
  DollarSign,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { api } from '../../services/api';

const UserDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const profileData = await api.get('/user/profile');
        const loanData = await api.get('/user/loan-application');
        setDashboardData({ ...profileData, loanApplication: loanData });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getRiskLevel = (eligibilityScore) => {
    if (eligibilityScore >= 90) return { level: 'Low Risk', color: 'text-green-500' };
    if (eligibilityScore >= 60) return { level: 'Medium Risk', color: 'text-yellow-500' };
    return { level: 'High Risk', color: 'text-red-500' };
  };

  const getDocumentStats = (documents = []) => {
    const total = documents.length;
    const verified = documents.filter((doc) => doc.status === 'VERIFIED').length;
    const pending = documents.filter((doc) => doc.status === 'PENDING').length;
    const rejected = documents.filter((doc) => doc.status === 'REJECTED').length;
    return { total, verified, pending, rejected };
  };

  const StatCard = ({ icon: Icon, label, value, subValue, color }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className={`bg-white p-6 rounded-2xl shadow-lg border border-gray-100`}
    >
      <div className="flex justify-between items-start">
        <div className={`p-3 ${color} rounded-xl`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      <div className="mt-4">
        <h4 className="text-gray-600 text-sm">{label}</h4>
        <p className="text-gray-900 text-2xl font-bold mt-1">{value}</p>
        {subValue && <p className="text-sm text-gray-500 mt-1">{subValue}</p>}
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const documentStats = getDocumentStats(dashboardData?.documents);
  const riskLevel = getRiskLevel(dashboardData?.loanApplication?.eligibilityScore.toFixed(2) || 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={TrendingUp}
          label="Eligibility Score"
          value={`${dashboardData?.loanApplication?.eligibilityScore.toFixed(2) || 0}%`}
          subValue="Predicted by ServoLend"
          color="bg-blue-500"
        />
        <StatCard
          icon={AlertTriangle}
          label="Risk Level"
          value={riskLevel.level}
          color="bg-purple-500"
        />
        <StatCard
          icon={CreditCard}
          label="Credit Score"
          value={dashboardData?.creditScore || 'N/A'}
          color="bg-green-500"
        />
        <StatCard
          icon={DollarSign}
          label="Loan Amount"
          value={`₹${(dashboardData?.loanApplication?.loan_amnt || 0).toLocaleString()}`}
          color="bg-orange-500"
        />
      </div>

      {/* Document Status */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Document Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl">
            <FileText className="h-6 w-6 text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">Total Documents</p>
              <p className="text-xl font-bold text-gray-900">{documentStats.total}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-green-50 p-4 rounded-xl">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Verified</p>
              <p className="text-xl font-bold text-green-600">{documentStats.verified}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-yellow-50 p-4 rounded-xl">
            <Clock className="h-6 w-6 text-yellow-600" />
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-xl font-bold text-yellow-600">{documentStats.pending}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-red-50 p-4 rounded-xl">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-xl font-bold text-red-600">{documentStats.rejected}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Application Status */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Application Status</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`p-2 rounded-lg ${
                  dashboardData?.loanApplication?.status === 'approved'
                    ? 'bg-green-100 text-green-600'
                    : dashboardData?.loanApplication?.status === 'rejected'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-yellow-100 text-yellow-600'
                }`}
              >
                <Calendar size={18} />
              </div>
              <div>
                <p className="font-medium text-gray-900">Loan Application Status</p>
                <p className="text-sm text-gray-500">
                  Last updated:{' '}
                  {new Date(dashboardData?.loanApplication?.lastUpdated).toLocaleDateString()}
                </p>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                dashboardData?.loanApplication?.status === 'approved'
                  ? 'bg-green-100 text-green-600'
                  : dashboardData?.loanApplication?.status === 'rejected'
                  ? 'bg-red-100 text-red-600'
                  : 'bg-yellow-100 text-yellow-600'
              }`}
            >
              {dashboardData?.loanApplication?.status?.toUpperCase() || 'PENDING'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
