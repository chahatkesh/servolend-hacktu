// src/pages/admin/ApplicationReview.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { 
  FileText, User, Building, Phone, Mail, 
  Calendar, DollarSign, CheckCircle, XCircle,
  AlertTriangle, MessageCircle, Clock, Download,
  Shield, CreditCard, Briefcase, Home, ChevronRight
} from 'lucide-react';

// Mock data - replace with API call
const mockApplication = {
  id: 'APP001',
  applicant: {
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+91 98765 43210',
    address: '123 Main St, Mumbai, Maharashtra',
    occupation: 'Software Engineer',
    employer: 'Tech Corp India'
  },
  loan: {
    type: 'personal',
    amount: 500000,
    tenure: 36,
    purpose: 'Home Renovation',
    monthlyIncome: 85000,
    emi: 16500,
    interestRate: 10.5,
    status: 'under_review',
    submittedAt: '2024-02-08',
    lastUpdated: '2024-02-09'
  },
  documents: [
    { id: 1, name: 'PAN Card', status: 'verified', type: 'identity' },
    { id: 2, name: 'Aadhar Card', status: 'verified', type: 'identity' },
    { id: 3, name: 'Bank Statements', status: 'pending', type: 'financial' },
    { id: 4, name: 'Salary Slips', status: 'pending', type: 'financial' }
  ],
  creditScore: 750,
  riskAssessment: {
    score: 75,
    level: 'medium',
    factors: [
      'Good credit history',
      'Stable employment',
      'High debt-to-income ratio'
    ]
  },
  notes: [
    {
      id: 1,
      author: 'Sarah Johnson',
      content: 'Employment verification completed. All documents authentic.',
      timestamp: '2024-02-09T10:30:00'
    }
  ]
};

const ApplicationReview = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [note, setNote] = useState('');

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'assessment', label: 'Risk Assessment', icon: Shield },
    { id: 'history', label: 'History', icon: Clock }
  ];

  const addNote = () => {
    if (!note.trim()) return;
    // Add note logic here
    setNote('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900">
                Application #{mockApplication.id}
              </h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(mockApplication.loan.status)}`}>
                {mockApplication.loan.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-gray-500 mt-1">
              Submitted on {new Date(mockApplication.loan.submittedAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Approve
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Reject
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Request Info
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-6 py-3 rounded-xl transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="h-5 w-5 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Applicant Details */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Applicant Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">{mockApplication.applicant.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{mockApplication.applicant.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{mockApplication.applicant.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Building className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Employer</p>
                      <p className="font-medium">{mockApplication.applicant.employer}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loan Details */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Loan Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Loan Amount</p>
                      <p className="font-medium">₹{mockApplication.loan.amount.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Tenure</p>
                      <p className="font-medium">{mockApplication.loan.tenure} months</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">EMI</p>
                      <p className="font-medium">₹{mockApplication.loan.emi.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'documents' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Document Verification
              </h2>
              <div className="space-y-4">
                {mockApplication.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-500">{doc.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(doc.status)}`}>
                        {doc.status}
                      </span>
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <Download className="h-5 w-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'assessment' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Risk Assessment
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <p className="text-gray-500">Risk Score</p>
                      <span className="text-2xl font-bold text-blue-600">
                        {mockApplication.riskAssessment.score}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <p className="text-gray-500">Risk Level</p>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(mockApplication.riskAssessment.level)}`}>
                        {mockApplication.riskAssessment.level}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <p className="text-gray-500">Credit Score</p>
                      <span className="text-2xl font-bold text-green-600">
                        {mockApplication.creditScore}
                      </span>
                    </div>
                  </div>
                </div>

                <h3 className="font-medium text-gray-900 mb-4">Risk Factors</h3>
                <ul className="space-y-2">
                  {mockApplication.riskAssessment.factors.map((factor, index) => (
                    <li key={index} className="flex items-center space-x-2 text-gray-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Notes Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
            <div className="space-y-4">
              <div className="space-y-4">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note..."
                  className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
                <button
                  onClick={addNote}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Note
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {mockApplication.notes.map((note) => (
                  <div key={note.id} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{note.author}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(note.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-600">{note.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="flex items-center justify-between w-full p-3 text-left bg-gray-50 rounded-xl hover:bg-gray-100">
                <div className="flex items-center">
                  <MessageCircle className="h-5 w-5 text-blue-600 mr-3" />
                  <span>Contact Applicant</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
              <button className="flex items-center justify-between w-full p-3 text-left bg-gray-50 rounded-xl hover:bg-gray-100">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-600 mr-3" />
                  <span>Download Documents</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
              <button className="flex items-center justify-between w-full p-3 text-left bg-gray-50 rounded-xl hover:bg-gray-100">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-blue-600 mr-3" />
                  <span>Verify Documents</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Application Timeline */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
            <div className="space-y-6">
              <div className="relative pl-8 pb-6 border-l-2 border-blue-200">
                <div className="absolute left-0 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Application Submitted</p>
                  <p className="text-sm text-gray-500">
                    {new Date(mockApplication.loan.submittedAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="relative pl-8 pb-6 border-l-2 border-blue-200">
                <div className="absolute left-0 transform -translate-x-1/2 w-4 h-4 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Document Verification</p>
                  <p className="text-sm text-gray-500">In Progress</p>
                </div>
              </div>
              <div className="relative pl-8">
                <div className="absolute left-0 transform -translate-x-1/2 w-4 h-4 bg-gray-300 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Final Decision</p>
                  <p className="text-sm text-gray-500">Pending</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationReview;