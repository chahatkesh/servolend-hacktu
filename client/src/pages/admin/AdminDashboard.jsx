// src/pages/admin/AdminDashboard.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { 
  FileText, Users, AlertTriangle, CheckCircle, 
  Clock, Filter, Search, ArrowRight, PieChart,
  TrendingUp, AlertCircle
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart as RePieChart, 
  Pie, Cell 
} from 'recharts';

// Mock data - replace with actual API calls
const mockApplications = [
  {
    id: 'APP001',
    applicantName: 'John Smith',
    loanAmount: 500000,
    status: 'pending_review',
    type: 'personal',
    submittedAt: '2024-02-08',
    risk: 'medium'
  },
  {
    id: 'APP002',
    applicantName: 'Sarah Johnson',
    loanAmount: 750000,
    status: 'under_verification',
    type: 'business',
    submittedAt: '2024-02-07',
    risk: 'low'
  },
  // Add more mock applications
];

const trendData = [
  { name: 'Jan', applications: 65, approvals: 45 },
  { name: 'Feb', applications: 78, approvals: 52 },
  { name: 'Mar', applications: 90, approvals: 60 },
];

const COLORS = ['#4CAF50', '#FFC107', '#F44336'];

const AdminDashboard = () => {
  const { admin } = useAdminAuth();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_verification':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-600';
      case 'medium':
        return 'bg-yellow-100 text-yellow-600';
      case 'high':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {admin?.name}
            </h1>
            <p className="text-gray-500 mt-1">
              Here's what's happening with loan applications today
            </p>
          </div>
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
              Generate Report
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              New Application
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-2xl shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm text-green-600">+12.5%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">125</h3>
          <p className="text-gray-500">Pending Applications</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-2xl shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm text-green-600">+8.2%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">85</h3>
          <p className="text-gray-500">Approved Today</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-2xl shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <span className="text-sm text-red-600">-2.4%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">45</h3>
          <p className="text-gray-500">Under Review</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-2xl shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <span className="text-sm text-yellow-600">+5.1%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">12</h3>
          <p className="text-gray-500">High Risk Cases</p>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white p-6 rounded-2xl shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Application Trends
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="applications" 
                  stroke="#2563eb" 
                  strokeWidth={2} 
                />
                <Line 
                  type="monotone" 
                  dataKey="approvals" 
                  stroke="#16a34a" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white p-6 rounded-2xl shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Risk Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={[
                    { name: 'Low Risk', value: 60 },
                    { name: 'Medium Risk', value: 30 },
                    { name: 'High Risk', value: 10 }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-2xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Applications
            </h3>
            <div className="flex space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search applications..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending Review</option>
                <option value="verification">Under Verification</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y">
          {mockApplications.map((application) => (
            <motion.div
              key={application.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6 hover:bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <Link 
                      to={`/admin/applications/${application.id}`}
                      className="text-lg font-medium text-gray-900 hover:text-blue-600"
                    >
                      {application.applicantName}
                    </Link>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-sm text-gray-500">
                        {application.id}
                      </span>
                      <span className="text-sm text-gray-500">
                        ₹{application.loanAmount.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500">
                        {application.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskBadge(application.risk)}`}>
                    {application.risk} risk
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                    {application.status.replace('_', ' ')}
                  </span>
                  <Link
                    to={`/admin/applications/${application.id}`}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;