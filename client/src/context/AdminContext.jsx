// client/src/context/AdminContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    sort: '-createdAt'
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadApplications();
  }, [filters]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        status: filters.status,
        search: filters.search,
        sort: filters.sort
      });
      
      const response = await api.get(`/admin/applications?${queryParams}`);
      setApplications(response.data);
    } catch (err) {
      console.error('Load applications error:', err);
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId, status, note, rejectionReason) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.put(`/admin/applications/${applicationId}/status`, {
        status,
        note,
        rejectionReason
      });
      
      setApplications(prevApps => 
        prevApps.map(app => 
          app._id === applicationId ? response.data : app
        )
      );
      
      return response.data;
    } catch (err) {
      console.error('Update status error:', err);
      setError('Failed to update application status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const assignApplication = async (applicationId, assignedTo) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.put(`/admin/applications/${applicationId}/assign`, {
        assignedTo
      });
      
      setApplications(prevApps => 
        prevApps.map(app => 
          app._id === applicationId ? response.data : app
        )
      );
      
      return response.data;
    } catch (err) {
      console.error('Assign application error:', err);
      setError('Failed to assign application');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getApplicationById = async (applicationId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/admin/applications/${applicationId}`);
      return response.data;
    } catch (err) {
      console.error('Get application error:', err);
      setError('Failed to load application details');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const value = {
    applications,
    loading,
    error,
    filters,
    updateFilters,
    updateApplicationStatus,
    assignApplication,
    getApplicationById,
    refreshApplications: loadApplications
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};