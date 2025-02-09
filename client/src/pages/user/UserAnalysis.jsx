import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Bot, AlertTriangle, TrendingUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { api } from '../../services/api';
import Loader from '../../components/layout/Loader';

const UserAnalysis = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [parsedSections, setParsedSections] = useState([]);

  const parseAnalysisMessage = (message) => {
    const sections = [];
    const lines = message.split('\n\n');
    
    lines.forEach((line, index) => {
      if (line.includes('*Key Rejection Factors & Recommendations:')) {
        return;
      }
      
      if (line.startsWith('*')) {
        return;
      }

      if (line.match(/^\d+\./)) {
        const [title, ...descriptionParts] = line.split(':');
        let description = descriptionParts.join(':').trim();
        
        // Clean up markdown formatting in description
        description = description.replace(/\*\*/g, '');
        description = description.replace(/\*/g, '');
        
        const number = title.split('.')[0].trim();
        const titleText = title.split('.')[1].trim().replace(/^\*\*/, '').replace(/\*$/, '');
        
        sections.push({
          id: number,
          title: titleText,
          description: description,
          type: description.toLowerCase().includes('warning') ? 'warning' : 'info'
        });
      } else if (line.startsWith('⚠')) {
        sections.push({
          id: 'summary',
          title: 'Summary',
          description: line.replace('⚠', '').trim(),
          type: 'warning'
        });
      }
    });

    return sections;
  };

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await api.get('/user/profile');
        const userData = response;

        if (!userData) {
          setError('No loan application data found');
          setLoading(false);
          return;
        }

        const analysisPayload = {
          name: userData.name,
          age: userData.loanApplication.age,
          income: userData.loanApplication.income,
          ownership: userData.loanApplication.ownership,
          employment_len: userData.loanApplication.employment_len,
          loan_intent: userData.loanApplication.loan_intent,
          loan_amnt: userData.loanApplication.loan_amnt,
          loan_int_rate: userData.loanApplication.loan_int_rate,
          loan_percent_income: userData.loanApplication.loan_percent_income,
          cred_hist_len: userData.loanApplication.cred_hist_len,
          creditScore: userData.creditScore,
        };

        const analysisResponse = await fetch('https://servolend-analysis.onrender.com/analyse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(analysisPayload),
        });

        if (!analysisResponse.ok) {
          throw new Error('Failed to fetch analysis');
        }

        const analysisData = await analysisResponse.json();
        setAnalysis(analysisData);
        
        if (analysisData.message) {
          const sections = parseAnalysisMessage(analysisData.message);
          setParsedSections(sections);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  const getCardStyle = (type) => {
    switch (type) {
      case 'warning':
        return 'border-l-4 border-yellow-500';
      case 'info':
        return 'border-l-4 border-blue-500';
      default:
        return '';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-red-50 rounded-lg"
      >
        <div className="flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <p className="font-medium">Error: {error}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-3xl mx-auto px-4 sm:px-6 py-6"
    >
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-semibold mb-6">Loan Application Analysis</h2>

        <div className="space-y-4">
          {parsedSections.map((section) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-lg shadow-sm p-4 ${getCardStyle(section.type)}`}
            >
              <div className="flex gap-3">
                <div className="mt-1">
                  {getIcon(section.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{section.title}</h3>
                  <div className="mt-1 text-gray-600">
                    {section.description}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-6 pt-6 border-t"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
            {' '}
            <Bot className="w-4 h-4" />
            Generated by ServoLend AI
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UserAnalysis;