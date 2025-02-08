import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Check, X, AlertTriangle, Download, 
  Upload, Search, Eye, Clock, CheckCircle, Loader 
} from 'lucide-react';
import { api } from '../../services/api';

const DocumentVerification = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      const response = await api.get(`/api/loan/${id}`);
      setApplication(response.data);
    } catch (error) {
      setError('Failed to fetch application details');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyDocument = async (docId, status) => {
    try {
      await api.put(`/api/loan/${id}/documents/${docId}/verify`, { status });
      await fetchApplication();
    } catch (error) {
      setError('Failed to verify document');
      console.error('Error:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'VERIFIED':
        return 'text-green-600 bg-green-100';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      case 'REJECTED':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const DocumentCard = ({ doc }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{doc.type}</h3>
            <p className="text-sm text-gray-500">
              Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(doc.status)}`}>
          {doc.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setSelectedDoc(doc)}
          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Eye className="h-5 w-5 mr-2" />
          View Document
        </button>
        <button
          onClick={() => window.open(doc.path, '_blank')}
          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Download className="h-5 w-5 mr-2" />
          Download
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <button
          onClick={() => handleVerifyDocument(doc._id, 'VERIFIED')}
          className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Check className="h-5 w-5 mr-2" />
          Verify
        </button>
        <button
          onClick={() => handleVerifyDocument(doc._id, 'REJECTED')}
          className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          <X className="h-5 w-5 mr-2" />
          Reject
        </button>
      </div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-xl">
        <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
        <p className="text-center text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Document Verification
        </h1>
        <p className="text-gray-500 mt-1">
          Application #{id}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {application?.documents.map((doc) => (
          <DocumentCard key={doc._id} doc={doc} />
        ))}
      </div>

      {/* Document Preview Modal */}
      <AnimatePresence>
        {selectedDoc && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
               onClick={() => setSelectedDoc(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4"
              onClick={e => e.stopPropagation()}
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

              <div className="aspect-video bg-gray-100 rounded-lg mb-6">
                {selectedDoc.type.includes('pdf') ? (
                  <iframe
                    src={selectedDoc.path}
                    className="w-full h-full rounded-lg"
                    title="PDF Document"
                  />
                ) : (
                  <img
                    src={selectedDoc.path}
                    alt="Document Preview"
                    className="w-full h-full object-contain rounded-lg"
                  />
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    handleVerifyDocument(selectedDoc._id, 'VERIFIED');
                    setSelectedDoc(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Mark as Verified
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DocumentVerification;