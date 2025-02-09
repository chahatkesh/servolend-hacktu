import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ChevronRight,
  ChevronLeft,
  IndianRupee,
  Briefcase,
  Home,
  Clock,
  User,
  CreditCard,
} from 'lucide-react';

// Circular Progress Chart Component
const CircularProgressChart = ({ percentage }) => {
  const normalizedPercentage = Math.min(100, Math.max(0, parseFloat(percentage)));
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalizedPercentage / 100) * circumference;

  const getColor = (percent) => {
    if (percent >= 90) return '#4ade80'; // green
    if (percent >= 50) return '#3b82f6'; // blue
    return '#f87171'; // red
  };

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="96" cy="96" r={radius} stroke="#e5e7eb" strokeWidth="12" fill="none" />
        <circle
          cx="96"
          cy="96"
          r={radius}
          stroke={getColor(normalizedPercentage)}
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-bold text-gray-700">{normalizedPercentage.toFixed(1)}%</span>
      </div>
    </div>
  );
};

const LoanEligibilityForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const MAX_LOAN_AMOUNT = Number.MAX_SAFE_INTEGER;
  const MIN_AGE = 18;

  const [formData, setFormData] = useState({
    age: '',
    income: '',
    ownership: 'RENT',
    employment_len: '',
    loan_intent: 'PERSONAL',
    loan_amnt: '',
    loan_int_rate: '',
    loan_percent_income: '',
    cred_hist_len: '',
  });

  // Fetch existing loan application data
  useEffect(() => {
    const fetchLoanApplication = async () => {
      try {
        const response = await fetch('/api/user/loan-application', {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          if (data && Object.keys(data).length > 0) {
            setFormData((prevData) => ({
              ...prevData,
              ...data,
            }));

            if (data.eligibilityScore !== undefined) {
              setResult({
                prob_eligible: data.eligibilityScore / 100,
                prob_not_eligible: 1 - data.eligibilityScore / 100,
              });
            }
          }
        }
      } catch (error) {
        console.error('Error fetching loan application:', error);
        setError('Failed to load existing application data');
      }
    };

    fetchLoanApplication();
  }, []);

  const calculateLoanPercentIncome = () => {
    const loanAmount = parseFloat(formData.loan_amnt);
    const income = parseFloat(formData.income);
    return (loanAmount / income).toFixed(2);
  };

  const validateForm = () => {
    const errors = {};

    if (formData.loan_amnt && Number(formData.loan_amnt) > MAX_LOAN_AMOUNT) {
      errors.loan_amnt = 'Loan amount exceeds maximum limit';
    }

    if (formData.age && Number(formData.age) < MIN_AGE) {
      errors.age = 'Must be at least 18 years old';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const saveLoanApplication = async (data) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/user/loan-application', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save application data');
      }
    } catch (error) {
      console.error('Error saving application:', error);
      setError('Failed to save application data');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const calculatedPercentIncome = calculateLoanPercentIncome();
      const requestData = {
        ...formData,
        loan_percent_income: calculatedPercentIncome,
      };

      const eligibilityResponse = await fetch('https://deploy-api-17es.onrender.com/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (!eligibilityResponse.ok) {
        throw new Error('Failed to check eligibility');
      }

      const eligibilityData = await eligibilityResponse.json();
      setResult(eligibilityData);

      await saveLoanApplication({
        ...requestData,
        status: 'submitted',
        eligibilityScore: eligibilityData.prob_eligible * 100,
      });

      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Loan Amount</label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="number"
              name="loan_amnt"
              value={formData.loan_amnt}
              onChange={handleInputChange}
              className={`pl-10 w-full p-3 border ${
                validationErrors.loan_amnt ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter loan amount"
            />
          </div>
          {validationErrors.loan_amnt && (
            <p className="text-sm text-red-500 mt-1">{validationErrors.loan_amnt}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Interest Rate (%)</label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="number"
              step="0.01"
              name="loan_int_rate"
              value={formData.loan_int_rate}
              onChange={handleInputChange}
              className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter interest rate"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Age</label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className={`pl-10 w-full p-3 border ${
                validationErrors.age ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter your age"
            />
          </div>
          {validationErrors.age && (
            <p className="text-sm text-red-500 mt-1">{validationErrors.age}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Annual Income</label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="number"
              name="income"
              value={formData.income}
              onChange={handleInputChange}
              className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter annual income"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Employment Length (years)
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="number"
              name="employment_len"
              value={formData.employment_len}
              onChange={handleInputChange}
              className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Years of employment"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Credit History Length (years)
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="number"
              name="cred_hist_len"
              value={formData.cred_hist_len}
              onChange={handleInputChange}
              className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Years of credit history"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Home Ownership</label>
          <div className="relative">
            <Home className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              name="ownership"
              value={formData.ownership}
              onChange={handleInputChange}
              className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="RENT">Rent</option>
              <option value="MORTGAGE">Mortgage</option>
              <option value="OWN">Own</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Loan Purpose</label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              name="loan_intent"
              value={formData.loan_intent}
              onChange={handleInputChange}
              className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="EDUCATION">Education</option>
              <option value="PERSONAL">Personal</option>
              <option value="MEDICAL">Medical</option>
              <option value="VENTURE">Venture</option>
              <option value="DEBT_CONSOLIDATION">Debt Consolidation</option>
              <option value="HOME_IMPROVEMENT">Home Improvement</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEligibilityResult = () => {
    if (!result) return null;

    const eligibilityScore = result['prob_not_eligible']
      ? (parseFloat(result['prob_eligible']) * 100).toFixed(2)
      : 0;

    if (isNaN(eligibilityScore)) {
      return (
        <div className="bg-white rounded-xl p-6">
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">
            Error processing eligibility result. Please try again.
          </div>
        </div>
      );
    }

    const eligibilityScoreNum = parseFloat(eligibilityScore);
    const isHighlyEligible = eligibilityScoreNum >= 90;
    const isEligible = eligibilityScoreNum >= 50;

    return (
      <div className="bg-white rounded-xl p-6">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2">
            <CircularProgressChart percentage={eligibilityScore} />
          </div>

          <div className="w-full md:w-1/2 space-y-6">
            <div
              className={`p-6 rounded-lg ${
                isHighlyEligible ? 'bg-green-50' : isEligible ? 'bg-blue-50' : 'bg-red-50'
              }`}
            >
              <h3
                className={`text-lg font-semibold ${
                  isHighlyEligible
                    ? 'text-green-800'
                    : isEligible
                    ? 'text-blue-800'
                    : 'text-red-800'
                }`}
              >
                {isHighlyEligible
                  ? '✨ Congratulations! You are eligible for the loan.'
                  : isEligible
                  ? 'You meet the eligibility criteria for the loan.'
                  : 'Unfortunately, you do not meet the eligibility criteria at this time.'}
              </h3>
              <p className="mt-2 text-gray-600">Your eligibility score is {eligibilityScore}%</p>
            </div>

            <button
              onClick={() => navigate(isEligible ? '/user/verification' : '/user/analysis')}
              className={`w-full py-3 px-4 cursor-pointer rounded-lg text-white transition-colors ${
                isEligible ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {isEligible ? 'Proceed Further' : 'View Detailed Analysis'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Handle step changes with auto-save
  const handleStepChange = async (newStep) => {
    if (step < newStep) {
      // Validate before proceeding to next step
      if (!validateForm()) {
        return;
      }
      await saveLoanApplication({
        ...formData,
        status: 'draft',
      });
    }
    setStep(newStep);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Check Loan Eligibility</h1>
        <p className="mt-2 text-gray-600">
          Fill in your details to check if you qualify for a loan
        </p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center">
          {[1, 2, 3].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`flex items-center ${stepNumber === 3 ? '' : 'flex-1'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {stepNumber}
              </div>
              {stepNumber !== 3 && (
                <div
                  className={`h-1 flex-1 mx-2 ${step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderEligibilityResult()}

        <div className="mt-8 flex justify-between">
          {step > 1 && (
            <button
              onClick={() => handleStepChange(step - 1)}
              className="flex cursor-pointer items-center px-6 py-3 text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              Previous
            </button>
          )}

          {step < 3 && (
            <button
              onClick={() => {
                if (step === 2) {
                  handleSubmit();
                } else {
                  handleStepChange(step + 1);
                }
              }}
              disabled={isLoading || isSaving}
              className={`flex items-center cursor-pointer px-6 py-3 rounded-lg ml-auto ${
                isLoading || isSaving
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isLoading || isSaving ? (
                <div className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {isSaving ? 'Saving...' : 'Processing...'}
                </div>
              ) : (
                <>
                  Continue
                  <ChevronRight className="h-5 w-5 ml-2" />
                </>
              )}
            </button>
          )}
        </div>

        {error && <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}
      </div>

      {/* Tooltips and Helpful Information */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900">Loan Amount</h4>
          <p className="mt-1 text-sm text-blue-700">
            The amount you wish to borrow. Consider your repayment capacity and monthly income.
          </p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-semibold text-green-900">Credit History</h4>
          <p className="mt-1 text-sm text-green-700">
            A longer credit history with good payment records increases your chances of approval.
          </p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <h4 className="font-semibold text-purple-900">Interest Rate</h4>
          <p className="mt-1 text-sm text-purple-700">
            Current market rates typically range between 8% to 15%. Lower rates for better credit
            scores.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoanEligibilityForm;
