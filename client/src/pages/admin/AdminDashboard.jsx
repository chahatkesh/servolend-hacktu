import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  IndianRupee,
  FileText,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  AlertCircle,
  UserCheck,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import _ from 'lodash';

const AdminDashboard = () => {
  const { admin } = useAdminAuth();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('week');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersResponse, applicationsResponse] = await Promise.all([
          fetch('/api/user/list').then((res) => res.json()),
          fetch('/api/user/applications').then((res) => res.json()),
        ]);

        setUsers(usersResponse);
        setApplications(applicationsResponse);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Set up polling every 5 minutes
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  // Calculate statistics
  const stats = {
    totalUsers: users.length,
    verifiedUsers: users.filter((u) => u.kycStatus === 'verified').length,
    pendingApplications: applications.filter((a) => a.loanApplication?.status === 'submitted')
      .length,
    totalLoanAmount: applications.reduce(
      (sum, app) => sum + (app.loanApplication?.loan_amnt || 0),
      0
    ),
    highRiskCases: applications.filter((a) => a.loanApplication?.eligibilityScore < 40).length,
  };

  // Prepare trend data
  const getTrendData = () => {
    const grouped = _.groupBy(applications, (app) => {
      const date = new Date(app.createdAt);
      return timeframe === 'week'
        ? date.toLocaleDateString('en-US', { weekday: 'short' })
        : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    return Object.entries(grouped).map(([date, apps]) => ({
      date,
      applications: apps.length,
      approved: apps.filter((a) => a.loanApplication?.status === 'approved').length,
      amount: apps.reduce((sum, a) => sum + (a.loanApplication?.loan_amnt || 0), 0),
    }));
  };

  // Calculate risk distribution
  const riskData = applications.reduce(
    (acc, app) => {
      const score = app.loanApplication?.eligibilityScore || 0;
      if (score >= 70) acc.lowRisk++;
      else if (score >= 40) acc.mediumRisk++;
      else acc.highRisk++;
      return acc;
    },
    { lowRisk: 0, mediumRisk: 0, highRisk: 0 }
  );

  // Calculate loan purpose distribution
  const loanPurposeData = _.chain(applications)
    .groupBy('loanApplication.loan_intent')
    .map((value, key) => ({
      purpose: key,
      count: value.length,
    }))
    .value();

  const COLORS = ['#4CAF50', '#FFC107', '#F44336'];
  const PURPOSE_COLORS = ['#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', '#F97316'];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {admin?.name}</h1>
            <p className="text-gray-500 mt-1">Here's your loan portfolio overview</p>
          </div>
          <div className="flex space-x-4">
            <button className="px-4 cursor-pointer py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Download Report
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <motion.div whileHover={{ scale: 1.02 }} className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">{stats.totalUsers}</h3>
          <p className="text-gray-500">Total Users</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">{stats.verifiedUsers}</h3>
          <p className="text-gray-500">Verified Users</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">{stats.pendingApplications}</h3>
          <p className="text-gray-500">Pending Applications</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-purple-100 rounded-lg">
              <IndianRupee className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">
            ₹{(stats.totalLoanAmount / 10000000).toFixed(1)}Cr
          </h3>
          <p className="text-gray-500">Total Loan Amount</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">{stats.highRiskCases}</h3>
          <p className="text-gray-500">High Risk Cases</p>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Trends */}
        <motion.div whileHover={{ scale: 1.01 }} className="bg-white p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getTrendData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="applications"
                  stroke="#2563eb"
                  strokeWidth={2}
                  name="New Applications"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="approved"
                  stroke="#16a34a"
                  strokeWidth={2}
                  name="Approved"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="amount"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Loan Amount (₹)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Risk Distribution */}
        <motion.div whileHover={{ scale: 1.01 }} className="bg-white p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={[
                    { name: 'Low Risk', value: riskData.lowRisk },
                    { name: 'Medium Risk', value: riskData.mediumRisk },
                    { name: 'High Risk', value: riskData.highRisk },
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
                <Tooltip />
                <Legend />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Loan Purpose Distribution */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white p-6 rounded-2xl shadow-sm col-span-2"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Purpose Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={loanPurposeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="purpose" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Applications">
                  {loanPurposeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PURPOSE_COLORS[index % PURPOSE_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Applications List */}
      <div className="bg-white rounded-2xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
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
                <option value="submitted">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y">
          {applications
            .filter((app) => {
              if (filter === 'all') return true;
              return app.loanApplication?.status === filter;
            })
            .filter(
              (app) =>
                app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.email?.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .slice(0, 5)
            .map((application) => (
              <motion.div
                key={application._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      {application.picture ? (
                        <img
                          src={application.picture}
                          alt={application.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-lg">
                            {application.name?.charAt(0)}
                          </span>
                        </div>
                      )}
                      {application.kycStatus === 'verified' && (
                        <div className="absolute -bottom-1 -right-1">
                          <div className="bg-green-100 p-1 rounded-full ring-2 ring-white">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <Link
                        to={`/admin/applications/${application._id}`}
                        className="text-lg font-medium text-gray-900 hover:text-blue-600"
                      >
                        {application.name}
                      </Link>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-sm text-gray-500">
                          Applied {new Date(application.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-gray-500">
                          ₹{application.loanApplication?.loan_amnt?.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500 capitalize">
                          {application.loanApplication?.loan_intent
                            ?.toLowerCase()
                            ?.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-sm">
                      {application.loanApplication?.eligibilityScore && (
                        <span
                          className={`px-3 py-1 rounded-full font-medium ${
                            application.loanApplication.eligibilityScore >= 70
                              ? 'bg-green-100 text-green-600'
                              : application.loanApplication.eligibilityScore >= 40
                              ? 'bg-yellow-100 text-yellow-600'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          Score: {application.loanApplication.eligibilityScore}
                        </span>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        application.loanApplication?.status === 'approved'
                          ? 'bg-green-100 text-green-600'
                          : application.loanApplication?.status === 'rejected'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-yellow-100 text-yellow-600'
                      }`}
                    >
                      {application.loanApplication?.status || 'pending'}
                    </span>
                  </div>
                </div>

                {/* Document Status */}
                {application.documents?.length > 0 && (
                  <div className="mt-4 ml-16">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {application.documents.filter((d) => d.status === 'VERIFIED').length} of{' '}
                        {application.documents.length} documents verified
                      </span>
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{
                            width: `${
                              (application.documents.filter((d) => d.status === 'VERIFIED').length /
                                application.documents.length) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
        </div>

        {/* Empty State */}
        {applications.length === 0 && !loading && (
          <div className="p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-50 flex items-center justify-center rounded-full mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-gray-900 font-medium mb-1">No applications found</h3>
            <p className="text-gray-500">Applications will appear here once users start applying</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading applications...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-red-50 flex items-center justify-center rounded-full mb-4">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="text-red-900 font-medium mb-1">Failed to load applications</h3>
            <p className="text-red-500">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
