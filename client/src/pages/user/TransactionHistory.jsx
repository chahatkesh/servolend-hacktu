// src/pages/user/TransactionHistory.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  Search, Calendar, ArrowUpRight, ArrowDownLeft, Download, 
  Filter, ChevronDown, ChevronRight, FileText, Sliders, X
} from 'lucide-react';

const mockData = {
  transactions: [
    {
      id: 1,
      type: 'repayment',
      amount: 25000,
      date: '2024-02-15',
      status: 'completed',
      description: 'Monthly EMI Payment',
      reference: 'TXN123456',
      loanId: 'LOAN-001'
    },
    {
      id: 2,
      type: 'disbursement',
      amount: 500000,
      date: '2024-01-01',
      status: 'completed',
      description: 'Loan Disbursement',
      reference: 'TXN123457',
      loanId: 'LOAN-001'
    },
    // Add more mock transactions
  ],
  analytics: {
    inflow: 500000,
    outflow: 75000,
    monthlyData: [
      { month: 'Jan', inflow: 500000, outflow: 25000 },
      { month: 'Feb', inflow: 0, outflow: 25000 },
      { month: 'Mar', inflow: 0, outflow: 25000 },
    ]
  }
};

const COLORS = ['#22c55e', '#ef4444'];

const TransactionHistory = () => {
  const [dateRange, setDateRange] = useState('all');
  const [transactionType, setTransactionType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const TransactionModal = ({ transaction, onClose }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Transaction Details</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between py-3 border-b">
            <span className="text-gray-600">Transaction ID</span>
            <span className="font-medium">{transaction.reference}</span>
          </div>
          <div className="flex justify-between py-3 border-b">
            <span className="text-gray-600">Date</span>
            <span className="font-medium">{transaction.date}</span>
          </div>
          <div className="flex justify-between py-3 border-b">
            <span className="text-gray-600">Amount</span>
            <span className={`font-medium ${
              transaction.type === 'repayment' ? 'text-red-600' : 'text-green-600'
            }`}>
              {transaction.type === 'repayment' ? '-' : '+'} ₹{transaction.amount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between py-3 border-b">
            <span className="text-gray-600">Status</span>
            <span className="px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              {transaction.status}
            </span>
          </div>
          <div className="flex justify-between py-3 border-b">
            <span className="text-gray-600">Loan ID</span>
            <span className="font-medium">{transaction.loanId}</span>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            onClick={() => {/* Download receipt */}}
          >
            Download Receipt
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-600 to-green-700 p-6 rounded-2xl text-white"
        >
          <h3 className="text-lg font-semibold mb-4">Total Inflow</h3>
          <p className="text-3xl font-bold">₹{mockData.analytics.inflow.toLocaleString()}</p>
          <p className="text-green-100 mt-1">Loan disbursements</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-red-600 to-red-700 p-6 rounded-2xl text-white"
        >
          <h3 className="text-lg font-semibold mb-4">Total Outflow</h3>
          <p className="text-3xl font-bold">₹{mockData.analytics.outflow.toLocaleString()}</p>
          <p className="text-red-100 mt-1">EMI payments</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-2xl shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Distribution</h3>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Inflow', value: mockData.analytics.inflow },
                    { name: 'Outflow', value: mockData.analytics.outflow }
                  ]}
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="relative">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">Last 3 Months</option>
                <option value="year">This Year</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            </div>

            <div className="relative">
              <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="repayment">Repayments</option>
                <option value="disbursement">Disbursements</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2.5 border rounded-lg hover:bg-gray-50"
            >
              <Sliders className="h-5 w-5 mr-2" />
              Advanced Filters
            </button>

            <button 
              className="flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="h-5 w-5 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t overflow-hidden"
            >
              {/* Add advanced filter options here */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        </div>
        
        <div className="divide-y">
          {mockData.transactions.map((transaction) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6 hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedTransaction(transaction)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${
                    transaction.type === 'repayment' 
                      ? 'bg-red-100' 
                      : 'bg-green-100'
                  }`}>
                    {transaction.type === 'repayment' ? (
                      <ArrowUpRight className={`h-6 w-6 ${
                        transaction.type === 'repayment' 
                          ? 'text-red-600' 
                          : 'text-green-600'
                      }`} />
                    ) : (
                      <ArrowDownLeft className={`h-6 w-6 ${
                        transaction.type === 'repayment' 
                          ? 'text-red-600' 
                          : 'text-green-600'
                      }`} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-semibold ${
                    transaction.type === 'repayment' 
                      ? 'text-red-600' 
                      : 'text-green-600'
                  }`}>
                    {transaction.type === 'repayment' ? '-' : '+'} ₹{transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Ref: {transaction.reference}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Transaction Detail Modal */}
      <AnimatePresence>
        {selectedTransaction && (
          <TransactionModal 
            transaction={selectedTransaction}
            onClose={() => setSelectedTransaction(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransactionHistory;