// src/pages/user/DocumentVerification.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, Upload, Check, AlertTriangle, 
  X, Clock, Shield, ArrowRight, Info 
} from 'lucide-react';
import { api } from '../../services/api';

const DocumentVerification = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const requiredDocuments = [
    {
      type: 'PAN_CARD',
      title: 'PAN Card',
      description: 'Clear copy of your PAN card (front side)',
      format: '.jpg, .jpeg, .png, .pdf',
      maxSize: '5MB'
    },
    {
      type: 'AADHAR_CARD',
      title: 'Aadhar Card',
      description: 'Both front and back side in a single file',
      format: '.jpg, .jpeg, .png, .pdf',
      maxSize: '5MB'
    },
    {
      type: 'INCOME_PROOF',
      title: 'Income Proof',
      description: 'Last 3 months salary slips or Form 16',
      format: '.pdf',
      maxSize: '10MB'
    },
    {
      type: 'BANK_STATEMENT',
      title: 'Bank Statement',
      description: 'Last 6 months bank statement in PDF format',
      format: '.pdf',
      maxSize: '10MB'
    }
  ];

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/user/profile');
      // Extract documents from user profile
      const userDocs = response.documents?.reduce((acc, doc) => {
        acc[doc.name] = {
          status: doc.status,
          uploadedAt: doc.uploadDate,
          rejectionReason: doc.rejectionReason
        };
        return acc;
      }, {}) || {};
      setDocuments(userDocs);
    } catch (err) {
      console.error('Error loading documents:', err);
      setError('Failed to load document status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (docType, file) => {
    if (!file) return;

    // Validate file size
    const maxSize = docType.includes('BANK_STATEMENT') ? 10 : 5;
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit`);
      return;
    }

    // Validate file type
    const validTypes = docType.includes('PDF_ONLY') 
      ? ['application/pdf']
      : ['application/pdf', 'image/jpeg', 'image/png'];
    
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload in the correct format.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', docType);

      await api.post('/api/user/documents/upload', formData);
      
      setSuccessMessage('Document uploaded successfully');
      await loadDocuments();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload document. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getDocumentStatus = (docType) => {
    return documents[docType]?.status || 'NOT_UPLOADED';
  };

  const allDocumentsVerified = requiredDocuments.every(
    doc => getDocumentStatus(doc.type) === 'VERIFIED'
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'VERIFIED':
        return <Check className="h-5 w-5 text-green-600" />;
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'REJECTED':
        return <X className="h-5 w-5 text-red-600" />;
      default:
        return <Upload className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Document Verification</h1>
            <p className="mt-1 text-gray-500">
              Upload all required documents to proceed with your loan application
            </p>
          </div>
          <Shield className="h-12 w-12 text-blue-600" />
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Overall Progress
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Object.values(documents).filter(d => d.status === 'VERIFIED').length}/
              {requiredDocuments.length} Verified
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 rounded-full h-2.5 transition-all duration-500"
              style={{ 
                width: `${(Object.values(documents).filter(d => d.status === 'VERIFIED').length / 
                  requiredDocuments.length) * 100}%` 
              }}
            />
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200"
        >
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
            <p className="text-red-800">{error}</p>
          </div>
        </motion.div>
      )}

      {successMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200"
        >
          <div className="flex">
            <Check className="h-5 w-5 text-green-400 mr-3" />
            <p className="text-green-800">{successMessage}</p>
          </div>
        </motion.div>
      )}

      {/* Document Upload Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requiredDocuments.map((doc) => {
          const status = getDocumentStatus(doc.type);
          
          return (
            <motion.div
              key={doc.type}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">{doc.title}</h3>
                      <p className="text-sm text-gray-500">{doc.description}</p>
                    </div>
                  </div>
                  {status !== 'NOT_UPLOADED' && (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getStatusColor(status)}`}>
                      {getStatusIcon(status)}
                      <span className="ml-2">{status.replace('_', ' ')}</span>
                    </span>
                  )}
                </div>

                <div className="mt-4">
                  <div className="text-xs text-gray-500 mb-2">
                    <span className="font-medium">Accepted formats:</span> {doc.format}
                  </div>
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Maximum size:</span> {doc.maxSize}
                  </div>
                </div>

                <label className="mt-4 block">
                  <input
                    type="file"
                    accept={doc.format}
                    onChange={(e) => handleFileUpload(doc.type, e.target.files[0])}
                    className="hidden"
                  />
                  <div className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer">
                    <Upload className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-600">
                      {status === 'REJECTED' ? 'Upload new document' : 'Click to upload'}
                    </span>
                  </div>
                </label>

                {status === 'REJECTED' && documents[doc.type]?.rejectionReason && (
                  <div className="mt-3 p-3 bg-red-50 rounded-lg">
                    <div className="flex">
                      <Info className="h-5 w-5 text-red-400 mr-2" />
                      <p className="text-sm text-red-700">
                        {documents[doc.type].rejectionReason}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Action Button */}
      {allDocumentsVerified && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 flex justify-center"
        >
          <button
            onClick={() => navigate('/user/dashboard')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Return to Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default DocumentVerification;