// src/pages/admin/DocumentVerification.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { 
  FileText, Check, X, AlertTriangle, Download, 
  Upload, Search, Eye, Clock, CheckCircle 
} from 'lucide-react';

const mockDocuments = [
  {
    id: 1,
    name: 'PAN Card',
    type: 'identity',
    status: 'pending',
    uploadedAt: '2024-02-08T10:30:00',
    issueDate: '2020-01-15',
    expiryDate: null,
    verificationChecks: [
      { id: 1, name: 'Document Format', status: 'passed' },
      { id: 2, name: 'Data Extraction', status: 'passed' },
      { id: 3, name: 'Authenticity Check', status: 'pending' }
    ]
  },
  {
    id: 2,
    name: 'Aadhar Card',
    type: 'identity',
    status: 'verified',
    uploadedAt: '2024-02-08T10:30:00',
    issueDate: '2019-05-20',
    expiryDate: null,
    verificationChecks: [
      { id: 1, name: 'Document Format', status: 'passed' },
      { id: 2, name: 'Data Extraction', status: 'passed' },
      { id: 3, name: 'Authenticity Check', status: 'passed' }
    ]
  },
  {
    id: 3,
    name: 'Bank Statements',
    type: 'financial',
    status: 'pending',
    uploadedAt: '2024-02-08T10:30:00',
    issueDate: '2024-01-01',
    expiryDate: '2024-01-31',
    verificationChecks: [
      { id: 1, name: 'Document Format', status: 'passed' },
      { id: 2, name: 'Data Extraction', status: 'pending' },
      { id: 3, name: 'Transaction Analysis', status: 'pending' }
    ]
  }
];

const DocumentVerification = () => {
  const { id } = useParams();
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      case 'passed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed':
        return <Check className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <X className="h-5 w-5 text-red-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Document Verification
            </h1>
            <p className="text-gray-500 mt-1">
              Application #{id}
            </p>
          </div>
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Request Additional Documents
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Documents</option>
          <option value="pending">Pending Verification</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockDocuments.map((doc) => (
          <motion.div
            key={doc.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{doc.name}</h3>
                  <p className="text-sm text-gray-500">{doc.type}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(doc.status)}`}>
                {doc.status}
              </span>
            </div>

            <div className="space-y-4">
              {doc.verificationChecks.map((check) => (
                <div
                  key={check.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-700">{check.name}</span>
                  {getStatusIcon(check.status)}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <button
                onClick={() => setSelectedDoc(doc)}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Eye className="h-5 w-5 mr-2" />
                View Document
              </button>
              <button className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <CheckCircle className="h-5 w-5 mr-2" />
                Verify
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Document Preview Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Document Preview
              </h3>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Document preview content would go here */}
            <div className="aspect-video bg-gray-100 rounded-lg mb-6 flex items-center justify-center">
              <p className="text-gray-500">Document Preview</p>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Mark as Verified
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Verification History */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Verification History</h2>
        <div className="space-y-4">
          {[
            {
              id: 1,
              action: 'Document Verified',
              document: 'Aadhar Card',
              verifiedBy: 'Sarah Johnson',
              timestamp: '2024-02-09T14:30:00',
              notes: 'All verification checks passed.'
            },
            {
              id: 2,
              action: 'Additional Document Requested',
              document: 'Bank Statements',
              verifiedBy: 'Mike Wilson',
              timestamp: '2024-02-09T11:15:00',
              notes: 'Latest 3 months statements required.'
            }
          ].map((event) => (
            <div key={event.id} className="p-4 bg-gray-50 rounded-xl">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{event.action}</h4>
                  <p className="text-sm text-gray-500">{event.document}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(event.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">{event.verifiedBy}</span> - {event.notes}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="fixed bottom-8 right-8">
        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-green-600 text-white rounded-xl shadow-lg hover:bg-green-700 flex items-center"
          >
            <Check className="h-5 w-5 mr-2" />
            Verify All
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 flex items-center"
          >
            <Upload className="h-5 w-5 mr-2" />
            Upload More
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default DocumentVerification;