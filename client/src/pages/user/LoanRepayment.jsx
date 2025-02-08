// src/pages/user/LoanRepayment.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Calendar, DollarSign, AlertCircle, ArrowRight, PieChart as PieIcon, TrendingUp, Wallet, Landmark } from 'lucide-react';

const mockData = {
  loans: [
    {
      id: 1,
      type: 'Personal Loan',
      amount: 500000,
      paid: 150000,
      interest: 50000,
      remaining: 300000,
      nextPayment: '2024-03-15',
      emi: 25000,
      status: 'active'
    }
  ],
  paymentHistory: [
    { month: 'Jan', principal: 17000, interest: 8000 },
    { month: 'Feb', principal: 17200, interest: 7800 },
    { month: 'Mar', principal: 17400, interest: 7600 },
    { month: 'Apr', principal: 17600, interest: 7400 },
    { month: 'May', principal: 17800, interest: 7200 }
  ],
  upcomingPayments: [
    { id: 1, date: '2024-03-15', amount: 25000, status: 'upcoming' },
    { id: 2, date: '2024-04-15', amount: 25000, status: 'upcoming' }
  ]
};

const COLORS = ['#2563eb', '#60a5fa', '#e5e7eb'];

const LoanRepayment = () => {
  const [selectedLoan, setSelectedLoan] = useState(mockData.loans[0]);
  const [paymentMethod, setPaymentMethod] = useState('');

  const PaymentMethodCard = ({ icon: Icon, title, description, value }) => (
    <div 
      className={`p-4 border rounded-xl cursor-pointer transition-all ${
        paymentMethod === value 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-blue-200'
      }`}
      onClick={() => setPaymentMethod(value)}
    >
      <div className="flex items-center space-x-3 mb-2">
        <div className={`p-2 rounded-lg ${
          paymentMethod === value ? 'bg-blue-200' : 'bg-gray-100'
        }`}>
          <Icon className={`h-5 w-5 ${
            paymentMethod === value ? 'text-blue-600' : 'text-gray-600'
          }`} />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl text-white"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white/10 rounded-xl">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
              Due Soon
            </span>
          </div>
          <p className="text-blue-100">Next Payment</p>
          <p className="text-3xl font-bold mb-1">₹{selectedLoan.emi.toLocaleString()}</p>
          <p className="text-blue-100">Due on {selectedLoan.nextPayment}</p>
          <button className="w-full mt-4 bg-white text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
            Pay Now
          </button>
        </motion.div>

        {/* Loan Progress */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-2xl shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Progress</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={[
                    { name: 'Principal Paid', value: selectedLoan.paid },
                    { name: 'Interest Paid', value: selectedLoan.interest },
                    { name: 'Remaining', value: selectedLoan.remaining }
                  ]}
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
          <div className="grid grid-cols-3 gap-2 text-center mt-4">
            {[
              { label: 'Principal Paid', value: selectedLoan.paid },
              { label: 'Interest Paid', value: selectedLoan.interest },
              { label: 'Remaining', value: selectedLoan.remaining }
            ].map((item, index) => (
              <div key={item.label} className="p-2 rounded-lg bg-gray-50">
                <div className="text-sm font-medium text-gray-900">{item.label}</div>
                <div className="text-sm text-gray-500">₹{(item.value / 1000).toFixed(0)}K</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Payment Trend */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-2xl shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Trend</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData.paymentHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="principal" stroke="#2563eb" strokeWidth={2} />
                <Line type="monotone" dataKey="interest" stroke="#60a5fa" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
          <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
            Add New Method <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PaymentMethodCard
            icon={Landmark}
            title="Auto Debit"
            description="Automatically debit from your bank account"
            value="auto-debit"
          />
          <PaymentMethodCard
            icon={Wallet}
            title="UPI Payment"
            description="Pay using any UPI app"
            value="upi"
          />
          <PaymentMethodCard
            icon={DollarSign}
            title="Net Banking"
            description="Pay using internet banking"
            value="netbanking"
          />
        </div>
      </div>

      {/* Upcoming Payments */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Upcoming Payments</h3>
        <div className="space-y-4">
          {mockData.upcomingPayments.map(payment => (
            <motion.div
              key={payment.id}
              whileHover={{ scale: 1.01 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Due on {payment.date}</p>
                  <p className="text-sm text-gray-500">EMI Payment</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">₹{payment.amount.toLocaleString()}</p>
                <button className="mt-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Schedule Payment
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoanRepayment;