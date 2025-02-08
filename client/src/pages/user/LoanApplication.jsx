import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, Briefcase, Building, 
  ChevronRight, ChevronLeft, 
} from 'lucide-react';

const LoanApplication = () => {
  const [step, setStep] = useState(1);
  const [predictionData, setPredictionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    age: '',
    income: '',
    ownership: 'RENT',
    employment_len: '',
    loan_intent: 'PERSONAL',
    loan_amnt: '',
    loan_int_rate: '',
    loan_percent_income: '',
    cred_hist_len: ''
  });

  const calculateLoanPercentIncome = (loanAmount, income) => {
    return ((parseFloat(loanAmount) / parseFloat(income)) * 100).toFixed(2);
  };

  const handlePrediction = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://deploy-api-17es.onrender.com/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          age: parseInt(formData.age),
          income: parseInt(formData.income),
          ownership: formData.ownership,
          employment_len: parseFloat(formData.employment_len),
          loan_intent: formData.loan_intent,
          loan_amnt: parseInt(formData.loan_amnt),
          loan_int_rate: parseFloat(formData.loan_int_rate),
          loan_percent_income: parseFloat(formData.loan_percent_income),
          cred_hist_len: parseInt(formData.cred_hist_len)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }

      const data = await response.json();
      setPredictionData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (step === 2) {
      const loanPercentIncome = calculateLoanPercentIncome(
        formData.loan_amnt, 
        formData.income
      );
      setFormData(prev => ({
        ...prev,
        loan_percent_income: loanPercentIncome
      }));
      await handlePrediction();
    }
    
    if (step < 4) setStep(step + 1);
    else {
      console.log('Form submitted:', formData);
    }
  };

  const PredictionResult = ({ predictionData, isLoading, error }) => {
    if (isLoading) return <div className="text-gray-600">Calculating eligibility...</div>;
    if (error) return <div className="text-red-600">Error: {error}</div>;
    if (!predictionData) return null;

    const eligibilityProb = parseFloat(predictionData['prob of eligible']);
    const isEligible = eligibilityProb > 0.7;

    return (
      <div className={`p-6 rounded-lg ${isEligible ? 'bg-green-50' : 'bg-red-50'}`}>
        <h4 className="text-lg font-semibold mb-4">
          {isEligible ? 'Congratulations!' : 'We apologize,'}
        </h4>
        <p className={`text-lg ${isEligible ? 'text-green-700' : 'text-red-700'}`}>
          {isEligible 
            ? 'You are eligible for this loan!' 
            : 'You are not eligible for this loan at this time.'}
        </p>
        <p className="mt-2 text-gray-600">
          Eligibility Score: {(eligibilityProb * 100).toFixed(1)}%
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`flex items-center ${
                stepNumber === 4 ? '' : 'flex-1'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= stepNumber
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {stepNumber}
              </div>
              {stepNumber !== 4 && (
                <div
                  className={`h-1 flex-1 mx-2 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Amount
                  </label>
                  <input
                    type="number"
                    value={formData.loan_amnt}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      loan_amnt: e.target.value 
                    })}
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter loan amount"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interest Rate
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.loan_int_rate}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      loan_int_rate: e.target.value 
                    })}
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter interest rate"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Personal Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      age: e.target.value 
                    })}
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your age"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Income
                  </label>
                  <input
                    type="number"
                    value={formData.income}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      income: e.target.value 
                    })}
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter annual income"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employment Length (years)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.employment_len}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      employment_len: e.target.value 
                    })}
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Years of employment"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Credit History Length (years)
                  </label>
                  <input
                    type="number"
                    value={formData.cred_hist_len}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      cred_hist_len: e.target.value 
                    })}
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Years of credit history"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Home Ownership
                  </label>
                  <select
                    value={formData.ownership}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      ownership: e.target.value 
                    })}
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="RENT">Rent</option>
                    <option value="OWN">Own</option>
                    <option value="MORTGAGE">Mortgage</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Intent
                  </label>
                  <select
                    value={formData.loan_intent}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      loan_intent: e.target.value 
                    })}
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PERSONAL">Personal</option>
                    <option value="EDUCATION">Education</option>
                    <option value="MEDICAL">Medical</option>
                    <option value="VENTURE">Venture</option>
                    <option value="HOME_IMPROVEMENT">Home Improvement</option>
                    <option value="DEBT_CONSOLIDATION">Debt Consolidation</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && predictionData && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Eligibility Results</h3>
              <PredictionResult 
                predictionData={predictionData}
                isLoading={isLoading}
                error={error}
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Review Application</h3>
              
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Loan Details</h4>
                    <div className="mt-2 space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Amount:</span> ₹{formData.loan_amnt}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Interest Rate:</span> {formData.loan_int_rate}%
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Purpose:</span> {formData.loan_intent}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Personal Details</h4>
                    <div className="mt-2 space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Age:</span> {formData.age}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Income:</span> ₹{formData.income}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Employment Length:</span> {formData.employment_len} years
                      </p>
                    </div>
                  </div>
                </div>

                {predictionData && (
                  <div className="mt-6">
                    <PredictionResult 
                      predictionData={predictionData}
                      isLoading={false}
                      error={null}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center px-6 py-3 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                Previous
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={isLoading}
              className={`flex items-center px-6 py-3 rounded-lg ml-auto ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⌛</span>
                  Processing...
                </>
              ) : (
                <>
                  {step === 4 ? 'Submit Application' : 'Continue'}
                  <ChevronRight className="h-5 w-5 ml-2" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LoanApplication;