// src/components/forms/EMICalculator.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, DollarSign, Calendar } from 'lucide-react';

const EMICalculator = ({ loanAmount, duration, interestRate, onCalculate }) => {
  const calculateEMI = () => {
    const principal = parseFloat(loanAmount);
    const ratePerMonth = (parseFloat(interestRate) / 12) / 100;
    const months = parseInt(duration);
    
    const emi = principal * ratePerMonth * Math.pow(1 + ratePerMonth, months) / (Math.pow(1 + ratePerMonth, months) - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - principal;
    
    return {
      monthlyEMI: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment)
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-blue-50 p-6 rounded-xl"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Calculator className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">EMI Calculator</h3>
      </div>

      {loanAmount && duration && interestRate && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-500">Monthly EMI</p>
            <p className="text-2xl font-bold text-blue-600">
              ₹{calculateEMI().monthlyEMI.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Interest</p>
            <p className="text-2xl font-bold text-blue-600">
              ₹{calculateEMI().totalInterest.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Payment</p>
            <p className="text-2xl font-bold text-blue-600">
              ₹{calculateEMI().totalPayment.toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default EMICalculator;