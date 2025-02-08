// src/pages/user/LoanApplication.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, Briefcase, Building, AlertCircle,
  ChevronRight, ChevronLeft
} from 'lucide-react';
import EMICalculator from '../../components/forms/EMICalculator';
import DocumentUpload from '../../components/forms/DocumentUpload';

const LoanApplication = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    loanType: '',
    loanAmount: '',
    duration: '',
    purpose: '',
    employment: {
      type: '',
      company: '',
      salary: '',
      experience: ''
    },
    documents: []
  });

  const loanTypes = [
    { 
      id: 'personal', 
      title: 'Personal Loan', 
      rate: '10.5%', 
      maxAmount: '₹15,00,000',
      icon: CreditCard,
      description: 'For personal expenses, travel, or emergencies'
    },
    { 
      id: 'business', 
      title: 'Business Loan', 
      rate: '12%', 
      maxAmount: '₹50,00,000',
      icon: Briefcase,
      description: 'For business expansion or working capital'
    },
    { 
      id: 'education', 
      title: 'Education Loan', 
      rate: '8.5%', 
      maxAmount: '₹25,00,000',
      icon: Building,
      description: 'For higher education and skill development'
    }
  ];

  const requiredDocuments = [
    {
      id: 'identity',
      name: 'Identity Proof',
      description: 'PAN Card or Aadhar Card'
    },
    {
      id: 'address',
      name: 'Address Proof',
      description: 'Utility bill or Passport'
    },
    {
      id: 'income',
      name: 'Income Proof',
      description: 'Last 3 months salary slips'
    },
    {
      id: 'bank',
      name: 'Bank Statements',
      description: 'Last 6 months bank statements'
    }
  ];

  const steps = [
    { number: 1, title: 'Loan Details' },
    { number: 2, title: 'Personal Info' },
    { number: 3, title: 'Documents' },
    { number: 4, title: 'Review' }
  ];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else {
      // Handle form submission
      console.log('Form submitted:', formData);
    }
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-12">
        <div className="flex justify-between relative">
          {steps.map((s, i) => (
            <div key={s.number} className="flex-1 relative">
              <motion.div 
                className={`flex flex-col items-center ${i !== steps.length - 1 ? 'relative' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 
                  ${step > s.number ? 'bg-green-600' : 
                    step === s.number ? 'bg-blue-600' : 'bg-gray-200'} 
                  text-white font-medium`}
                >
                  {s.number}
                </div>
                <div className="text-sm font-medium text-gray-900">{s.title}</div>
              </motion.div>
              {i !== steps.length - 1 && (
                <div className={`absolute top-5 left-1/2 w-full h-0.5 
                  ${step > s.number ? 'bg-green-600' : 'bg-gray-200'}`} 
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Steps */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          {step === 1 && (
            <div className="space-y-8">
              {/* Loan Types */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {loanTypes.map(type => (
                  <motion.div
                    key={type.id}
                    whileHover={{ scale: 1.02 }}
                    className={`border-2 rounded-xl p-6 cursor-pointer transition-colors ${
                      formData.loanType === type.id 
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-200'
                    }`}
                    onClick={() => setFormData({ ...formData, loanType: type.id })}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`p-2 rounded-lg ${
                        formData.loanType === type.id 
                          ? 'bg-blue-200'
                          : 'bg-gray-100'
                      }`}>
                        <type.icon className={`h-6 w-6 ${
                          formData.loanType === type.id 
                            ? 'text-blue-600'
                            :'text-gray-600'
                        }`} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{type.title}</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">{type.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Interest Rate</span>
                        <span className="text-gray-900 font-medium">{type.rate}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Max Amount</span>
                        <span className="text-gray-900 font-medium">{type.maxAmount}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Loan Details */}
              {formData.loanType && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loan Amount
                      </label>
                      <div className="relative rounded-lg">
                        <input
                          type="text"
                          value={formData.loanAmount}
                          onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
                          className="w-full pl-8 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter amount"
                        />
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">₹</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loan Duration
                      </label>
                      <select
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select duration</option>
                        <option value="12">12 months</option>
                        <option value="24">24 months</option>
                        <option value="36">36 months</option>
                        <option value="48">48 months</option>
                        <option value="60">60 months</option>
                      </select>
                    </div>
                  </div>

                  {/* EMI Calculator */}
                  {formData.loanAmount && formData.duration && (
                    <EMICalculator
                      loanAmount={formData.loanAmount}
                      duration={formData.duration}
                      interestRate={parseFloat(loanTypes.find(t => t.id === formData.loanType).rate)}
                    />
                  )}
                </motion.div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Employment Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employment Type
                  </label>
                  <select
                    value={formData.employment.type}
                    onChange={(e) => setFormData({
                      ...formData,
                      employment: { ...formData.employment, type: e.target.value }
                    })}
                    className="w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select type</option>
                    <option value="salaried">Salaried</option>
                    <option value="self-employed">Self Employed</option>
                    <option value="business">Business Owner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.employment.company}
                    onChange={(e) => setFormData({
                      ...formData,
                      employment: { ...formData.employment, company: e.target.value }
                    })}
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Income
                  </label>
                  <input
                    type="text"
                    value={formData.employment.salary}
                    onChange={(e) => setFormData({
                      ...formData,
                      employment: { ...formData.employment, salary: e.target.value }
                    })}
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter monthly income"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Experience
                  </label>
                  <input
                    type="text"
                    value={formData.employment.experience}
                    onChange={(e) => setFormData({
                      ...formData,
                      employment: { ...formData.employment, experience: e.target.value }
                    })}
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Years of experience"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <DocumentUpload 
              requiredDocs={requiredDocuments}
              onUpload={(doc) => setFormData({
                ...formData,
                documents: [...formData.documents, doc]
              })}
            />
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Review Application</h3>
              {/* Add review summary here */}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <button
                onClick={handlePrevious}
                className="flex items-center px-6 py-3 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                Previous
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ml-auto"
            >
              {step === 4 ? 'Submit Application' : 'Continue'}
              <ChevronRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LoanApplication;