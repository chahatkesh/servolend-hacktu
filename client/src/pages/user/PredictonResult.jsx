import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Check, X, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const PredictionResult = ({ predictionData, isLoading, error }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Analyzing application...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!predictionData) return null;

  const data = [
    { 
      name: 'Eligible', 
      value: parseFloat(predictionData['prob of eligible']) * 100 
    },
    { 
      name: 'Not Eligible', 
      value: parseFloat(predictionData['prob of not eligible']) * 100 
    }
  ];

  const COLORS = ['#4ade80', '#f87171'];

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const isHighlyEligible = data[0].value > 75;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Eligibility Analysis</h3>
      
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="w-full md:w-1/2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                onMouseEnter={onPieEnter}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index]} 
                    stroke={activeIndex === index ? '#1e293b' : 'transparent'}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `${value.toFixed(1)}%`}
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  padding: '0.5rem'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full md:w-1/2 space-y-4">
          <div className={`p-4 rounded-lg ${
            isHighlyEligible ? 'bg-green-50' : 'bg-yellow-50'
          }`}>
            <div className="flex items-center">
              {isHighlyEligible ? (
                <Check className="h-5 w-5 text-green-600 mr-2" />
              ) : (
                <X className="h-5 w-5 text-yellow-600 mr-2" />
              )}
              <h4 className={`font-medium ${
                isHighlyEligible ? 'text-green-800' : 'text-yellow-800'
              }`}>
                {isHighlyEligible ? 'High Approval Chance' : 'Moderate Approval Chance'}
              </h4>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Based on our analysis, you have a {data[0].value.toFixed(1)}% chance of loan approval.
            </p>
          </div>

          <div className="space-y-2">
            {data.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium">{item.value.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionResult;