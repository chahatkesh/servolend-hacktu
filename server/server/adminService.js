// server/services/adminService.js
const User = require('../models/User');
const LoanApplication = require('../models/LoanApplication');

class AdminService {
  // Application Management
  async getAllApplications(filters = {}) {
    try {
      let query = {};
      
      // Apply filters
      if (filters.status && filters.status !== 'all') {
        query.status = filters.status;
      }
      
      if (filters.search) {
        query.$or = [
          { applicantName: new RegExp(filters.search, 'i') },
          { _id: new RegExp(filters.search, 'i') }
        ];
      }
      
      if (filters.assignedTo) {
        query.assignedTo = filters.assignedTo;
      }
      
      if (filters.dateRange) {
        query.createdAt = {
          $gte: new Date(filters.dateRange.start),
          $lte: new Date(filters.dateRange.end)
        };
      }

      // Execute query with pagination
      const page = parseInt(filters.page) || 1;
      const limit = parseInt(filters.limit) || 10;
      const skip = (page - 1) * limit;

      const applications = await LoanApplication.find(query)
        .populate('userId', 'name email phone')
        .populate('assignedTo', 'name employeeId')
        .sort(filters.sort || '-createdAt')
        .skip(skip)
        .limit(limit);

      const total = await LoanApplication.countDocuments(query);

      return {
        applications,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          page,
          limit
        }
      };
    } catch (error) {
      throw new Error('Error getting applications: ' + error.message);
    }
  }

  // Analytics and Reports
  async getApplicationStats(timeframe = 'month') {
    try {
      const today = new Date();
      let startDate;

      switch (timeframe) {
        case 'week':
          startDate = new Date(today.setDate(today.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(today.setMonth(today.getMonth() - 1));
          break;
        case 'year':
          startDate = new Date(today.setFullYear(today.getFullYear() - 1));
          break;
        default:
          startDate = new Date(today.setMonth(today.getMonth() - 1));
      }

      const stats = await LoanApplication.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: null,
            totalApplications: { $sum: 1 },
            approvedApplications: {
              $sum: { $cond: [{ $eq: ['$status', 'APPROVED'] }, 1, 0] }
            },
            rejectedApplications: {
              $sum: { $cond: [{ $eq: ['$status', 'REJECTED'] }, 1, 0] }
            },
            pendingApplications: {
              $sum: {
                $cond: [
                  { $in: ['$status', ['SUBMITTED', 'UNDER_REVIEW', 'DOCUMENT_PENDING']] },
                  1,
                  0
                ]
              }
            },
            totalLoanAmount: { $sum: '$loanAmount' },
            averageProcessingTime: { $avg: '$processingTime' }
          }
        }
      ]);

      // Get daily application counts
      const dailyStats = await LoanApplication.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { '_id': 1 }
        }
      ]);

      return {
        summary: stats[0] || {},
        dailyStats
      };
    } catch (error) {
      throw new Error('Error getting application stats: ' + error.message);
    }
  }

  // User Management
  async getLoanOfficerPerformance(officerId, timeframe = 'month') {
    try {
      const officer = await User.findById(officerId);
      if (!officer || officer.role !== 'LOAN_OFFICER') {
        throw new Error('Invalid loan officer ID');
      }

      const today = new Date();
      const startDate = new Date(today.setMonth(today.getMonth() - 1));

      const performance = await LoanApplication.aggregate([
        {
          $match: {
            assignedTo: officer._id,
            updatedAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: null,
            totalProcessed: { $sum: 1 },
            approved: {
              $sum: { $cond: [{ $eq: ['$status', 'APPROVED'] }, 1, 0] }
            },
            rejected: {
              $sum: { $cond: [{ $eq: ['$status', 'REJECTED'] }, 1, 0] }
            },
            averageProcessingTime: { $avg: '$processingTime' }
          }
        }
      ]);

      return {
        officer: {
          name: officer.name,
          employeeId: officer.employeeId,
          metrics: officer.metrics
        },
        recentPerformance: performance[0] || {}
      };
    } catch (error) {
      throw new Error('Error getting officer performance: ' + error.message);
    }
  }

  // Document Verification
  async verifyDocument(applicationId, documentType, status, verifiedBy, rejectionReason = null) {
    try {
      const application = await LoanApplication.findById(applicationId);
      if (!application) {
        throw new Error('Application not found');
      }

      const documentIndex = application.documents.findIndex(doc => doc.type === documentType);
      if (documentIndex === -1) {
        throw new Error('Document not found');
      }

      application.documents[documentIndex].status = status;
      application.documents[documentIndex].verifiedBy = verifiedBy;
      application.documents[documentIndex].verifiedDate = new Date();

      if (rejectionReason) {
        application.documents[documentIndex].rejectionReason = rejectionReason;
      }

      // Update application status based on documents
      if (application.documents.every(doc => doc.status === 'VERIFIED')) {
        application.status = 'UNDER_REVIEW';
      } else if (application.documents.some(doc => doc.status === 'REJECTED')) {
        application.status = 'DOCUMENT_PENDING';
      }

      await application.save();
      return application;
    } catch (error) {
      throw new Error('Error verifying document: ' + error.message);
    }
  }
}

module.exports = new AdminService();