// src/components/forms/DocumentUpload.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileText, Check, AlertCircle } from 'lucide-react';

const DocumentUpload = ({ requiredDocs, onUpload }) => {
  const [uploadedDocs, setUploadedDocs] = useState({});
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file) => {
    // In real app, handle file upload to server here
    setUploadedDocs(prev => ({
      ...prev,
      [file.name]: {
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploaded'
      }
    }));
    onUpload && onUpload(file);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <motion.div
        onDragEnter={handleDrag}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}
      >
        <div className="flex flex-col items-center">
          <Upload className="h-12 w-12 text-blue-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Drag and drop your documents
          </h3>
          <p className="text-gray-500 mb-4">or</p>
          <label className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Browse Files
            <input
              type="file"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </label>
        </div>

        {dragActive && (
          <div
            className="absolute inset-0 z-50"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          />
        )}
      </motion.div>

      {/* Required Documents List */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">Required Documents</h3>
        </div>
        <div className="divide-y">
          {requiredDocs.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{doc.name}</p>
                  <p className="text-sm text-gray-500">{doc.description}</p>
                </div>
              </div>
              
              {uploadedDocs[doc.id] ? (
                <div className="flex items-center">
                  <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium flex items-center">
                    <Check className="h-4 w-4 mr-1" />
                    Uploaded
                  </span>
                  <button 
                    onClick={() => setUploadedDocs(prev => {
                      const newDocs = {...prev};
                      delete newDocs[doc.id];
                      return newDocs;
                    })}
                    className="ml-2 p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              ) : (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm font-medium flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Required
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;