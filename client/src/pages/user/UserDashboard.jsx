// src/pages/user/UserDashboard.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CreditCard, Calendar, TrendingUp, DollarSign } from 'lucide-react';

const mockData = {
  activeLoans: [
    { month: 'Jan', amount: 400000, forecast: 420000 },
    { month: 'Feb', amount: 380000, forecast: 390000 },
    { month: 'Mar', amount: 360000, forecast: 370000 },
    { month: 'Apr', amount: 340000, forecast: 350000 },
    { month: 'May', amount: 320000, forecast: 330000 },
  ],
  recentTransactions: [
    { id: 1, type: 'repayment', amount: 25000, date: '2024-02-15', status: 'completed' },
    { id: 2, type: 'disbursement', amount: 500000, date: '2024-01-01', status: 'completed' },
  ]
};

const UserDashboard = () => {
  const [selectedMetric, setSelectedMetric] = useState('amount');

  const StatCard = ({ icon: Icon, label, value, trend, color }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className={`bg-gradient-to-br ${color} p-6 rounded-2xl shadow-lg`}
    >
      <div className="flex justify-between items-start">
        <div className="p-3 bg-white/10 rounded-xl">
          <Icon className="h-6 w-6 text-white" />
        </div>
        {trend && (
          <span className={`text-sm ${trend > 0 ? 'text-green-300' : 'text-red-300'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <h4 className="text-white/80 text-sm">{label}</h4>
        <p className="text-white text-2xl font-bold mt-1">{value}</p>
      </div>
    </motion.div>
  );

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={CreditCard}
          label="Active Loans"
          value="₹4.2M"
          trend={2.5}
          color="from-blue-500 to-blue-600"
        />
        <StatCard 
          icon={Calendar}
          label="Next Payment"
          value="₹25,000"
          color="from-purple-500 to-purple-600"
        />
        <StatCard 
          icon={TrendingUp}
          label="Credit Score"
          value="785"
          trend={5.2}
          color="from-green-500 to-green-600"
        />
        <StatCard 
          icon={DollarSign}
          label="Total Savings"
          value="₹1.8L"
          trend={-1.2}
          color="from-orange-500 to-orange-600"
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Loan Overview</h3>
            <div className="flex space-x-2">
              {['amount', 'forecast'].map(metric => (
                <button
                  key={metric}
                  onClick={() => setSelectedMetric(metric)}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    selectedMetric === metric
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {metric.charAt(0).toUpperCase() + metric.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData.activeLoans}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke="#2563eb"
                  strokeWidth={2}
                  fill="url(#colorAmount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {mockData.recentTransactions.map(transaction => (
              <motion.div
                key={transaction.id}
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    transaction.type === 'repayment' 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {transaction.type === 'repayment' ? <CreditCard size={18} /> : <DollarSign size={18} />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {transaction.type === 'repayment' ? 'Loan Payment' : 'Loan Disbursement'}
                    </p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${
                    transaction.type === 'repayment' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {transaction.type === 'repayment' ? '-' : '+'} ₹{transaction.amount.toLocaleString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserDashboard;