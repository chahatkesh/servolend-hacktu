import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { 
  FileText, CheckCircle, AlertTriangle, DollarSign, 
  TrendingUp, Check, X, AlertCircle, CreditCard,
  Briefcase, Building, Scale, ChevronRight
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const mockAssessmentData = {
  applicant: {
    id: 'APP001',
    name: 'John Smith',
    creditScore: 750,
    monthlyIncome: 85000,
    employmentType: 'Salaried',
    employmentDuration: '5 years',
    existingEMIs: 15000
  },
  loanRequest: {
    amount: 500000,
    tenure: 36,
    purpose: 'Home Renovation',
    proposedEMI: 16500,
    interestRate: 10.5
  },
  creditHistory: {
    activeLoans: 1,
    pastDefaults: 0,
    creditUtilization: 35,
    paymentHistory: [
      { month: 'Jan', score: 98 },
      { month: 'Feb', score: 97 },
      { month: 'Mar', score: 99 },
      { month: 'Apr', score: 98 },
      { month: 'May', score: 100 }
    ]
  },
  riskMetrics: {
    debtServiceRatio: 0.45,
    loanToIncomeRatio: 0.65,
    creditUtilization: 0.35,
    employmentStability: 0.85,
    paymentBehavior: 0.95
  },
  assessmentFactors: [
    { factor: 'Credit Score', score: 85 },
    { factor: 'Income Stability', score: 90 },
    { factor: 'Debt Burden', score: 75 },
    { factor: 'Payment History', score: 95 },
    { factor: 'Employment', score: 88 }
  ]
};

const LoanAssesment = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [showRiskDetails, setShowRiskDetails] = useState(false);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const calculateOverallRisk = () => {
    const average = mockAssessmentData.assessmentFactors.reduce(
      (acc, curr) => acc + curr.score, 0
    ) / mockAssessmentData.assessmentFactors.length;
    
    if (average >= 80) return { level: 'Low', color: 'text-green-600' };
    if (average >= 60) return { level: 'Medium', color: 'text-yellow-600' };
    return { level: 'High', color: 'text-red-600' };
  };

  const risk = calculateOverallRisk();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Loan Assessment
            </h1>
            <p className="text-gray-500 mt-1">
              Application #{mockAssessmentData.applicant.id}
            </p>
          </div>
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Approve Loan
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Reject Application
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Applicant Overview */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Applicant Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Monthly Income</p>
                  <p className="font-medium">₹{mockAssessmentData.applicant.monthlyIncome.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Credit Score</p>
                  <p className="font-medium">{mockAssessmentData.applicant.creditScore}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Employment Type</p>
                  <p className="font-medium">{mockAssessmentData.applicant.employmentType}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Employment Duration</p>
                  <p className="font-medium">{mockAssessmentData.applicant.employmentDuration}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Risk Assessment
              </h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                risk.level === 'Low' ? 'bg-green-100 text-green-600' :
                risk.level === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                'bg-red-100 text-red-600'
              }`}>
                {risk.level} Risk
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Risk Metrics */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Key Risk Indicators</h3>
                <div className="space-y-4">
                  {Object.entries(mockAssessmentData.riskMetrics).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">
                        {key.split(/(?=[A-Z])/).join(' ')}
                      </span>
                      <span className={`font-medium ${value >= 0.8 ? 'text-green-600' : value >= 0.6 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {(value * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Radar Chart */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={mockAssessmentData.assessmentFactors}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="factor" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Assessment"
                      dataKey="score"
                      stroke="#2563eb"
                      fill="#2563eb"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Credit History */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Credit History
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">Active Loans</p>
                <p className="text-xl font-semibold text-gray-900">
                  {mockAssessmentData.creditHistory.activeLoans}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">Past Defaults</p>
                <p className="text-xl font-semibold text-gray-900">
                  {mockAssessmentData.creditHistory.pastDefaults}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">Credit Utilization</p>
                <p className="text-xl font-semibold text-gray-900">
                  {mockAssessmentData.creditHistory.creditUtilization}%
                </p>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockAssessmentData.creditHistory.paymentHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#2563eb"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* EMI Analysis */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              EMI Analysis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Proposed EMI</p>
                  <p className="text-xl font-semibold text-gray-900">
                    ₹{mockAssessmentData.loanRequest.proposedEMI.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Existing EMIs</p>
                  <p className="text-xl font-semibold text-gray-900">
                    ₹{mockAssessmentData.applicant.existingEMIs.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Total EMI Burden</p>
                  <p className="text-xl font-semibold text-gray-900">
                    ₹{(mockAssessmentData.loanRequest.proposedEMI + mockAssessmentData.applicant.existingEMIs).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-medium text-gray-900">EMI to Income Ratio</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    (mockAssessmentData.loanRequest.proposedEMI / mockAssessmentData.applicant.monthlyIncome) <= 0.5
                      ? 'bg-green-100 text-green-600'
                      : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {((mockAssessmentData.loanRequest.proposedEMI / mockAssessmentData.applicant.monthlyIncome) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                    <div
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
                      style={{ width: `${(mockAssessmentData.loanRequest.proposedEMI / mockAssessmentData.applicant.monthlyIncome) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Decision Panel */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Loan Decision
            </h3>
            <div className="space-y-4">
              <textarea
                className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Add decision notes..."
              />
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Approve Application
                </button>
                <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center">
                  <X className="h-5 w-5 mr-2" />
                  Reject Application
                </button>
                <button className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Request Additional Information
                </button>
              </div>
            </div>
          </div>

          {/* Key Recommendations */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Key Recommendations
            </h3>
            <div className="space-y-3">
              {[
                {
                  type: 'positive',
                  text: 'Strong credit history with consistent payments'
                },
                {
                  type: 'warning',
                  text: 'High EMI to income ratio - consider longer tenure'
                },
                {
                  type: 'positive',
                  text: 'Stable employment with good duration'
                }
              ].map((rec, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg flex items-start space-x-3 ${
                    rec.type === 'positive' ? 'bg-green-50' : 'bg-yellow-50'
                  }`}
                >
                  {rec.type === 'positive' ? (
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  )}
                  <span className={rec.type === 'positive' ? 'text-green-700' : 'text-yellow-700'}>
                    {rec.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 text-left bg-gray-50 rounded-xl hover:bg-gray-100">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-600 mr-3" />
                  <span>Download Report</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 text-left bg-gray-50 rounded-xl hover:bg-gray-100">
                <div className="flex items-center">
                  <Scale className="h-5 w-5 text-blue-600 mr-3" />
                  <span>Adjust Risk Model</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanAssesment;