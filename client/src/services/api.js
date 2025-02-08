// client/src/services/api.js
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }
  return response.json();
};

export const api = {
  get: async (endpoint) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  },

  post: async (endpoint, data) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  put: async (endpoint, data) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (endpoint) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  },
  // Upload document
  uploadDocument: async (applicationId, documentType, file) => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', documentType);

    const response = await fetch(`${BASE_URL}/loan/${applicationId}/documents`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    });
    return handleResponse(response);
  },

  // Get application documents
  getApplicationDocuments: async (applicationId) => {
    const response = await fetch(`${BASE_URL}/loan/${applicationId}/documents`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  },

  // Verify document (admin only)
  verifyDocument: async (applicationId, documentId, status) => {
    const response = await fetch(`${BASE_URL}/loan/${applicationId}/documents/${documentId}/verify`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },

  // Get document verification status
  getVerificationStatus: async (applicationId) => {
    const response = await fetch(`${BASE_URL}/loan/${applicationId}/status`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  },
  uploadFile: async (endpoint, file, documentType) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    });
    return handleResponse(response);
  }
};