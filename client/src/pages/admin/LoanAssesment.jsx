import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import {
  Calculator,
  BriefcaseBusiness,
  Building2,
  Wallet,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Scale,
  TrendingUp,
  FileStack,
  Clock,
  User,
} from 'lucide-react';
import { api } from '../../services/api';

const LoanAssessment = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/user/profile');
        const users = response;
        const user = users;
        setUserData(user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const calculateEligibilityMetrics = (application) => {
    if (!application) return null;

    const { income, loan_amnt, loan_percent_income, employment_len, cred_hist_len } = application;

    return {
      incomeStability: Math.min((employment_len / 10) * 100, 100),
      debtServiceRatio: Math.min((loan_amnt / income) * 100, 100),
      creditHistory: Math.min((cred_hist_len / 5) * 100, 100),
      affordabilityScore: Math.max(100 - loan_percent_income, 0),
      overallRisk: application.eligibilityScore || 0,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">User Not Found</h2>
          <p className="text-gray-500 mt-2">The requested loan application could not be found.</p>
        </div>
      </div>
    );
  }

  const metrics = calculateEligibilityMetrics(userData.loanApplication);

  const getStatusColor = (score) => {
    if (score >= 70) return 'text-green-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStatusBg = (score) => {
    if (score >= 70) return 'bg-green-50';
    if (score >= 40) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  const getStatusIcon = (score) => {
    if (score >= 70) return <CheckCircle className="h-6 w-6 text-green-500" />;
    if (score >= 40) return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
    return <XCircle className="h-6 w-6 text-red-500" />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="relative">
              {userData.picture ? (
                <img
                  src={userData.picture}
                  alt={userData.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
              )}
              {userData.kycStatus === 'verified' && (
                <div className="absolute -bottom-1 -right-1">
                  <div className="bg-green-100 p-1 rounded-full">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{userData.name}</h1>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-gray-500">{userData.email}</span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-500">
                  Applied {new Date(userData.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <span
              className={`px-4 py-2 rounded-lg text-sm font-medium ${getStatusBg(
                metrics?.overallRisk
              )} ${getStatusColor(metrics?.overallRisk)}`}
            >
              Risk Score: {metrics?.overallRisk}
            </span>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Approve
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Reject
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Applicant Details */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Applicant Details</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <BriefcaseBusiness className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Occupation</p>
                  <p className="font-medium">{userData.occupation || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Employer</p>
                  <p className="font-medium">{userData.employerName || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Wallet className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Monthly Income</p>
                  <p className="font-medium">
                    ₹{parseInt(userData.monthlyIncome || 0).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Calculator className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Credit Score</p>
                  <p className="font-medium">{userData.creditScore || 'Not available'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Loan Details */}
          {userData.loanApplication && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Loan Details</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Loan Amount</p>
                  <p className="text-xl font-semibold text-gray-900">
                    ₹{userData.loanApplication.loan_amnt?.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Interest Rate</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {userData.loanApplication.loan_int_rate}%
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Loan Purpose</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {userData.loanApplication.loan_intent?.replace('_', ' ')}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Income to Loan Ratio</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {userData.loanApplication.loan_percent_income}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Risk Assessment */}
          {metrics && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Risk Assessment</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    data={[
                      { metric: 'Income Stability', value: metrics.incomeStability },
                      { metric: 'Debt Service', value: metrics.debtServiceRatio },
                      { metric: 'Credit History', value: metrics.creditHistory },
                      { metric: 'Affordability', value: metrics.affordabilityScore },
                    ]}
                  >
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Metrics"
                      dataKey="value"
                      stroke="#2563eb"
                      fill="#2563eb"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Document Verification */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  userData.documents?.every((d) => d.status === 'VERIFIED')
                    ? 'bg-green-100 text-green-600'
                    : 'bg-yellow-100 text-yellow-600'
                }`}
              >
                {userData.documents?.filter((d) => d.status === 'VERIFIED').length || 0} of{' '}
                {userData.documents?.length || 0} Verified
              </span>
            </div>
            <div className="space-y-4">
              {userData.documents?.map((doc, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileStack className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-500">
                          Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        doc.status === 'VERIFIED'
                          ? 'bg-green-100 text-green-600'
                          : doc.status === 'REJECTED'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-yellow-100 text-yellow-600'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Decision Panel */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Decision Notes</h2>
            <textarea
              className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Add your decision notes here..."
            />
            <div className="mt-4 space-y-3">
              <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center">
                <XCircle className="h-5 w-5 mr-2" />
                Reject Loan
              </button>
            </div>
          </div>

          {/* Credit History Analysis */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Credit Analysis</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Credit History Length</p>
                    <p className="font-medium">
                      {userData.loanApplication?.cred_hist_len || 0} years
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Scale className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Employment Duration</p>
                    <p className="font-medium">
                      {userData.loanApplication?.employment_len || 0} years
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium">
                      {new Date(userData.memberSince).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanAssessment;
