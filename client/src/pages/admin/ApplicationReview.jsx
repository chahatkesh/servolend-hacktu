import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Mail, Download, X, Eye, Search } from 'lucide-react';
import { api } from '../../services/api';

const DocumentModal = ({ isOpen, onClose, documents, onUpdateStatus, applicationId }) => {
  if (!isOpen) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-green-100 text-green-600';
      case 'REJECTED':
        return 'bg-red-100 text-red-600';
      case 'REQUIRED':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-yellow-100 text-yellow-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Document Review</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.name} className="p-4 bg-gray-50 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{doc.name}</h3>
                    <p className="text-sm text-gray-500">
                      Uploaded on {new Date(doc.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    doc.status
                  )}`}
                >
                  {doc.status}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex space-x-2">
                  <button
                    onClick={() => window.open(`/api/user/documents/${doc.name}`, '_blank')}
                    className="flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </button>
                  <button
                    onClick={() =>
                      window.open(`/api/user/documents/${doc.name}/download`, '_blank')
                    }
                    className="flex items-center px-3 py-1 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </button>
                </div>
                <select
                  value={doc.status}
                  onChange={(e) => onUpdateStatus(doc.name, e.target.value)}
                  className="px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PENDING">Pending</option>
                  <option value="VERIFIED">Verify</option>
                  <option value="REJECTED">Reject</option>
                  <option value="REQUIRED">Required</option>
                </select>
              </div>

              {doc.status === 'REJECTED' && (
                <div className="pt-3 border-t">
                  <textarea
                    placeholder="Enter rejection reason..."
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="2"
                    value={doc.rejectionReason || ''}
                    onChange={(e) => onUpdateStatus(doc.name, 'REJECTED', e.target.value)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const ApplicationReview = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('submitted');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/applications');
      setApplications(response);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDocument = async (docName, status, rejectionReason = '') => {
    try {
      await api.put('/user/documents', {
        documentName: docName,
        status,
        rejectionReason,
      });

      // Update local state
      const updatedApps = applications.map((app) => {
        if (app._id === selectedApp._id) {
          return {
            ...app,
            documents: app.documents.map((doc) => {
              if (doc.name === docName) {
                return { ...doc, status, rejectionReason };
              }
              return doc;
            }),
          };
        }
        return app;
      });

      setApplications(updatedApps);
      setSelectedApp(updatedApps.find((app) => app._id === selectedApp._id));
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-600';
      case 'rejected':
        return 'bg-red-100 text-red-600';
      case 'submitted':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-yellow-100 text-yellow-600';
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'all') return matchesSearch;
    return matchesSearch && app.loanApplication?.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Loan Applications</h1>
            <p className="text-gray-500 mt-1">Total {filteredApplications.length} applications</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search applications..."
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-2xl shadow-sm divide-y">
        {filteredApplications.map((app) => (
          <motion.div
            key={app._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 hover:bg-gray-50"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {app.picture ? (
                    <img
                      src={app.picture}
                      alt={app.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-lg">
                        {app.name?.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{app.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Mail className="w-4 h-4" />
                    <span>{app.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {app.loanApplication && (
                  <>
                    <div className="text-sm">
                      <span className="text-gray-500">Amount:</span>
                      <span className="ml-2 font-medium">
                        ₹{app.loanApplication.loan_amnt?.toLocaleString()}
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        app.loanApplication.status
                      )}`}
                    >
                      {app.loanApplication.status}
                    </span>
                  </>
                )}
                <button
                  onClick={() => {
                    setSelectedApp(app);
                    setIsModalOpen(true);
                  }}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                >
                  Review Documents ({app.documents?.length || 0})
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <DocumentModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedApp(null);
            }}
            documents={selectedApp?.documents || []}
            onUpdateStatus={handleUpdateDocument}
            applicationId={selectedApp?._id}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ApplicationReview;
