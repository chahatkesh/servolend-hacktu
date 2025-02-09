import { useState, useCallback } from 'react';
import { ArrowRight, ArrowLeft, Calculator, IndianRupee, PieChart, Info } from 'lucide-react';

const TaxCalculator = () => {
  // Enhanced state to include regime selection
  const [selectedRegime, setSelectedRegime] = useState('new');
  const [step, setStep] = useState(1);
  const [basicDetails, setBasicDetails] = useState({
    age: '',
    financialYear: '2025-26',
  });

  const [incomeDetails, setIncomeDetails] = useState({
    salary: 0,
    hra: 0,
    lta: 0,
    professionalTax: 0,
    interestIncome: 0,
    rentalIncome: 0,
    homeLoanInterest: 0,
  });

  const [deductions, setDeductions] = useState({
    section80C: 0,
    section80D: 0,
    section80G: 0,
    section80EEA: 0,
    otherDeductions: 0,
  });

  // Calculate total deductions for old regime with caps
  const calculateTotalDeductions = useCallback(() => {
    const totalSection80C = Math.min(deductions.section80C, 150000);
    const totalSection80D = Math.min(deductions.section80D, 100000);
    const totalSection80EEA = Math.min(deductions.section80EEA, 150000);
    const totalOtherDeductions = deductions.section80G + deductions.otherDeductions;

    // Cap total deductions at 350000
    return Math.min(
      totalSection80C + totalSection80D + totalSection80EEA + totalOtherDeductions,
      350000
    );
  }, [deductions]);

  // Calculate taxable income for both regimes
  const calculateTaxableIncome = useCallback(
    (regime) => {
      const totalIncome =
        incomeDetails.salary +
        incomeDetails.hra +
        incomeDetails.lta +
        incomeDetails.interestIncome +
        incomeDetails.rentalIncome;

      if (regime === 'new') {
        const standardDeduction = 75000;
        return Math.max(0, totalIncome - standardDeduction - incomeDetails.professionalTax);
      } else {
        const standardDeduction = 50000;
        const totalDeductions = calculateTotalDeductions();
        return Math.max(
          0,
          totalIncome - standardDeduction - incomeDetails.professionalTax - totalDeductions
        );
      }
    },
    [incomeDetails, calculateTotalDeductions]
  );

  // Calculate tax for new regime
  const calculateNewRegimeTax = useCallback((income) => {
    const slabs = [
      { limit: 400000, rate: 0 },
      { limit: 800000, rate: 0.05 },
      { limit: 1200000, rate: 0.1 },
      { limit: 1600000, rate: 0.15 },
      { limit: 2000000, rate: 0.2 },
      { limit: 2400000, rate: 0.25 },
      { limit: Infinity, rate: 0.3 },
    ];

    return calculateSlabwiseTax(income, slabs);
  }, []);

  // Calculate tax for old regime
  const calculateOldRegimeTax = useCallback((income) => {
    const slabs = [
      { limit: 300000, rate: 0 },
      { limit: 600000, rate: 0.05 },
      { limit: 900000, rate: 0.1 },
      { limit: 1200000, rate: 0.15 },
      { limit: 1500000, rate: 0.2 },
      { limit: Infinity, rate: 0.3 },
    ];

    return calculateSlabwiseTax(income, slabs);
  }, []);

  // Common function to calculate slabwise tax
  const calculateSlabwiseTax = (income, slabs) => {
    let remainingIncome = income;
    let tax = 0;
    let previousLimit = 0;
    const breakdown = [];

    for (const slab of slabs) {
      const slabIncome = Math.min(Math.max(0, remainingIncome), slab.limit - previousLimit);
      const slabTax = slabIncome * slab.rate;

      if (slabIncome > 0) {
        breakdown.push({
          range: `${formatCurrency(previousLimit)} to ${
            slab.limit === Infinity ? 'Above' : formatCurrency(slab.limit)
          }`,
          income: slabIncome,
          rate: slab.rate * 100,
          tax: slabTax,
        });
      }

      tax += slabTax;
      remainingIncome -= slabIncome;
      previousLimit = slab.limit;

      if (remainingIncome <= 0) break;
    }

    // Apply rebate under section 87A
    let taxAfterRebate = income <= 1275000 ? 0 : tax;
    const cess = taxAfterRebate * 0.04;
    const totalTax = taxAfterRebate + cess;

    return {
      basicTax: tax,
      rebate: tax - taxAfterRebate,
      cess,
      totalTax,
      breakdown,
    };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate tax for both regimes and determine savings
  const calculateTaxComparison = useCallback(() => {
    const newRegimeIncome = calculateTaxableIncome('new');
    const oldRegimeIncome = calculateTaxableIncome('old');

    const newRegimeTax = calculateNewRegimeTax(newRegimeIncome);
    const oldRegimeTax = calculateOldRegimeTax(oldRegimeIncome);

    const savings = Math.abs(newRegimeTax.totalTax - oldRegimeTax.totalTax);
    const recommendedRegime = newRegimeTax.totalTax < oldRegimeTax.totalTax ? 'new' : 'old';

    return {
      newRegime: {
        taxableIncome: newRegimeIncome,
        ...newRegimeTax,
      },
      oldRegime: {
        taxableIncome: oldRegimeIncome,
        ...oldRegimeTax,
      },
      savings,
      recommendedRegime,
    };
  }, [calculateTaxableIncome, calculateNewRegimeTax, calculateOldRegimeTax]);

  const RegimeComparison = () => {
    const comparison = calculateTaxComparison();

    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
        <h3 className="text-xl font-semibold mb-6">Tax Regime Comparison</h3>
        <div className="grid grid-cols-2 gap-8">
          {/* New Regime Column */}
          <div className="space-y-4">
            <h4 className="font-medium text-lg">New Regime</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">
                Taxable Income: {formatCurrency(comparison.newRegime.taxableIncome)}
              </p>
              <p className="text-gray-600">
                Total Tax: {formatCurrency(comparison.newRegime.totalTax)}
              </p>
              <p className="text-sm text-gray-500 mt-2">Standard Deduction: ₹75,000</p>
            </div>
          </div>

          {/* Old Regime Column */}
          <div className="space-y-4">
            <h4 className="font-medium text-lg">Old Regime</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">
                Taxable Income: {formatCurrency(comparison.oldRegime.taxableIncome)}
              </p>
              <p className="text-gray-600">
                Total Tax: {formatCurrency(comparison.oldRegime.totalTax)}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Total Deductions: {formatCurrency(calculateTotalDeductions())}
              </p>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-lg text-blue-800">Recommendation</h4>
          <p className="text-blue-600 mt-2">
            The {comparison.recommendedRegime} regime is better for you. You save{' '}
            {formatCurrency(comparison.savings)} by choosing this regime.
          </p>
        </div>
      </div>
    );
  };

  // Rest of the component remains similar, with modified steps to include regime selection
  const steps = ['Basic Details', 'Income Details', 'Deductions', 'Tax Summary'];

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calculator className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold">Basic Details</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  value={basicDetails.age}
                  onChange={(e) => setBasicDetails({ ...basicDetails, age: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your age"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Financial Year</label>
                <select
                  value={basicDetails.financialYear}
                  onChange={(e) =>
                    setBasicDetails({ ...basicDetails, financialYear: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="2025-26">2025-26</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <IndianRupee className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold">Income Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(incomeDetails).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">₹</span>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) =>
                        setIncomeDetails({ ...incomeDetails, [key]: Number(e.target.value) })
                      }
                      className="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter amount"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold">
                Deductions
                {selectedRegime === 'new' && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    (Only applicable for old regime)
                  </span>
                )}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(deductions).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">₹</span>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) =>
                        setDeductions({ ...deductions, [key]: Number(e.target.value) })
                      }
                      className="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter amount"
                      disabled={selectedRegime === 'new'}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        const comparison = calculateTaxComparison();
        const currentRegime = selectedRegime === 'new';
        const selectedRegimeTax =
          selectedRegime === 'new' ? comparison.newRegime : comparison.oldRegime;

        return (
          <div className="space-y-8">
            {/* Current Regime Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <Calculator className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-semibold">
                  Tax Summary ({selectedRegime === 'new' ? 'New' : 'Old'} Regime)
                </h2>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="text-gray-600">Gross Total Income</span>
                      <span className="text-lg font-medium">
                        {formatCurrency(
                          incomeDetails.salary +
                            incomeDetails.hra +
                            incomeDetails.lta +
                            incomeDetails.interestIncome +
                            incomeDetails.rentalIncome
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="text-gray-600">
                        Standard Deduction
                        <span className="text-sm text-gray-500 ml-2">
                          ({selectedRegime === 'new' ? '₹75,000' : '₹50,000'})
                        </span>
                      </span>
                      <span className="text-lg font-medium">
                        {formatCurrency(selectedRegime === 'new' ? 75000 : 50000)}
                      </span>
                    </div>

                    {selectedRegime === 'old' && (
                      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                        <span className="text-gray-600">Chapter VI-A Deductions</span>
                        <span className="text-lg font-medium">
                          {formatCurrency(calculateTotalDeductions())}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="text-gray-600">Professional Tax</span>
                      <span className="text-lg font-medium">
                        {formatCurrency(incomeDetails.professionalTax)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="text-gray-600">Net Taxable Income</span>
                      <span className="text-lg font-medium">
                        {formatCurrency(selectedRegimeTax.taxableIncome)}
                      </span>
                    </div>

                    <div className="space-y-2 pt-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Basic Tax</span>
                        <span>{formatCurrency(selectedRegimeTax.basicTax)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Less: 87A Rebate</span>
                        <span className="text-red-600">
                          -{formatCurrency(selectedRegimeTax.rebate)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Health & Education Cess (4%)</span>
                        <span>{formatCurrency(selectedRegimeTax.cess)}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg mt-4">
                      <span className="text-blue-800 font-medium">Final Tax Payable</span>
                      <span className="text-2xl font-bold text-blue-800">
                        {formatCurrency(selectedRegimeTax.totalTax)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Slab-wise Breakdown */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-medium mb-4 text-gray-800">Tax Calculation Breakdown</h3>
                  <div className="space-y-3">
                    {selectedRegimeTax.breakdown.map((slab, index) => (
                      <div key={index} className="grid grid-cols-4 text-sm gap-4">
                        <span className="text-gray-600">{slab.range}</span>
                        <span>{formatCurrency(slab.income)}</span>
                        <span>{slab.rate}%</span>
                        <span className="text-right">{formatCurrency(slab.tax)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes and Info */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-medium mb-4 text-gray-800">Important Notes</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• Health & Education Cess of 4% is applicable on the tax amount</p>
                    <p>
                      • Standard Deduction of {selectedRegime === 'new' ? '₹75,000' : '₹50,000'} is
                      applied
                    </p>
                    <p>• Tax rebate under Section 87A up to ₹12,75,000</p>
                    {selectedRegime === 'old' && (
                      <>
                        <p>• Maximum deduction under Section 80C: ₹1,50,000</p>
                        <p>• Maximum deduction under Section 80D: ₹1,00,000</p>
                        <p>• Maximum deduction under Section 80EEA: ₹1,50,000</p>
                        <p>• Total Chapter VI-A deductions capped at ₹3,50,000</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Regime Comparison */}
            <RegimeComparison />
          </div>
        );
    }
  };

  const StepIndicator = () => (
    <div className="mb-8">
      <div className="flex justify-between mb-4">
        {steps.map((stepName, index) => (
          <div key={index} className="flex flex-col items-center relative">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                index + 1 === step
                  ? 'bg-blue-500 text-white'
                  : index + 1 < step
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              {index + 1}
            </div>
            <span className="text-sm mt-2 text-gray-600">{stepName}</span>
            {index < steps.length - 1 && (
              <div
                className={`absolute top-5 left-full w-full h-0.5 -mx-2 ${
                  index + 1 < step ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-700 mb-2">Income Tax Calculator 2025-26</h1>
        <p className="text-gray-600">
          Compare and calculate your income tax under both old and new tax regimes
        </p>
      </div>

      <StepIndicator />
      {renderStep()}

      <div className="mt-8 flex justify-between">
        <button
          onClick={() => setStep((prev) => Math.max(1, prev - 1))}
          disabled={step === 1}
          className="px-6 py-3 flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Previous
        </button>
        <button
          onClick={() => setStep((prev) => Math.min(4, prev + 1))}
          disabled={step === 4}
          className="px-6 py-3 flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 transition-colors"
        >
          {step === 3 ? 'Calculate' : 'Next'} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TaxCalculator;
