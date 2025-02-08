import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search,
  Mail,
  Phone,
  Check,
  AlertCircle,
  Building,
  Briefcase,
  Users,
  Filter,
} from 'lucide-react';
import { api } from '../../services/api';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await api.getAllUsers();
        setUsers(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const getKycStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-600/10';
      case 'rejected':
        return 'bg-red-50 text-red-600 ring-1 ring-red-600/10';
      default:
        return 'bg-amber-50 text-amber-600 ring-1 ring-amber-600/10';
    }
  };

  const getProfileStatusColor = (status) => {
    return status === 'complete'
      ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-600/10'
      : 'bg-amber-50 text-amber-600 ring-1 ring-amber-600/10';
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'all') return matchesSearch;
    if (filter === 'verified') return matchesSearch && user.kycStatus === 'verified';
    if (filter === 'pending') return matchesSearch && user.kycStatus === 'pending';
    if (filter === 'rejected') return matchesSearch && user.kycStatus === 'rejected';
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 text-red-600 p-6 rounded-xl flex items-center shadow-sm">
          <AlertCircle className="h-6 w-6 mr-3" />
          <span className="font-medium">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Users Directory</h1>
              <p className="text-gray-500 mt-1">
                Managing {filteredUsers.length} users in the system
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                className="pl-10 pr-4 py-2.5 w-full min-w-[300px] border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white transition-shadow min-w-[200px]"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Users</option>
                <option value="verified">Verified Only</option>
                <option value="pending">Pending KYC</option>
                <option value="rejected">Rejected KYC</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-50 flex items-center justify-center rounded-full mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-gray-900 font-medium mb-1">No users found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {user.picture ? (
                      <img
                        src={user.picture}
                        alt={user.name}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-sm"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center ring-2 ring-white shadow-sm">
                        <span className="text-blue-600 font-semibold text-lg">
                          {user.name?.charAt(0)}
                        </span>
                      </div>
                    )}
                    {user.kycStatus === 'verified' && (
                      <div className="absolute -bottom-1 -right-1">
                        <div className="bg-emerald-100 rounded-full p-1.5 ring-2 ring-white">
                          <Check className="w-3 h-3 text-emerald-600" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 mt-1">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Mail className="w-4 h-4" />
                        <span>{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Phone className="w-4 h-4" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-medium ${getProfileStatusColor(
                      user.profileStatus
                    )}`}
                  >
                    Profile {user.profileStatus}
                  </span>
                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-medium ${getKycStatusColor(
                      user.kycStatus
                    )}`}
                  >
                    KYC {user.kycStatus}
                  </span>
                </div>
              </div>

              {/* Additional User Information */}
              {(user.occupation || user.employerName || user.loanApplication) && (
                <div className="mt-4 ml-16">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {user.occupation && (
                        <div className="flex items-center space-x-2">
                          <Briefcase className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{user.occupation}</span>
                        </div>
                      )}
                      {user.employerName && (
                        <div className="flex items-center space-x-2">
                          <Building className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{user.employerName}</span>
                        </div>
                      )}
                      {user.loanApplication && (
                        <div className="text-sm text-gray-600">
                          Loan Status:{' '}
                          <span className="font-medium capitalize">
                            {user.loanApplication.status}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserList;
