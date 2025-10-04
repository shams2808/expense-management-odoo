import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, DollarSign, User, Calendar, FileText, AlertCircle, TrendingUp, Filter, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const ManagerView = () => {
  const [approvals, setApprovals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock data for approvals
  useEffect(() => {
    const mockApprovals = [
      {
        id: 1,
        subject: 'Client Lunch',
        owner: 'John Doe',
        category: 'Meals',
        status: 'pending',
        amount: 75.50,
        currency: 'USD',
        companyCurrency: 'INR',
        convertedAmount: 6200,
        date: '2024-01-15',
        description: 'Business lunch with potential client ABC Corp',
        submittedDate: '2024-01-15T10:30:00Z'
      },
      {
        id: 2,
        subject: 'Software Subscription',
        owner: 'Jane Smith',
        category: 'Software',
        status: 'pending',
        amount: 120.00,
        currency: 'EUR',
        companyCurrency: 'INR',
        convertedAmount: 10500,
        date: '2024-01-14',
        description: 'Annual subscription for project management tool',
        submittedDate: '2024-01-14T14:20:00Z'
      },
      {
        id: 3,
        subject: 'Travel - Flight',
        owner: 'Mike Johnson',
        category: 'Travel',
        status: 'pending',
        amount: 320.00,
        currency: 'USD',
        companyCurrency: 'INR',
        convertedAmount: 26400,
        date: '2024-01-13',
        description: 'Business trip to New York for client meeting',
        submittedDate: '2024-01-13T09:15:00Z'
      },
      {
        id: 4,
        subject: 'Office Supplies',
        owner: 'Sarah Wilson',
        category: 'Supplies',
        status: 'approved',
        amount: 150.00,
        currency: 'USD',
        companyCurrency: 'INR',
        convertedAmount: 12300,
        date: '2024-01-12',
        description: 'Monthly office supplies order',
        submittedDate: '2024-01-12T16:45:00Z',
        approvedDate: '2024-01-12T17:30:00Z'
      },
      {
        id: 5,
        subject: 'Team Dinner',
        owner: 'David Brown',
        category: 'Meals',
        status: 'rejected',
        amount: 200.00,
        currency: 'USD',
        companyCurrency: 'INR',
        convertedAmount: 16400,
        date: '2024-01-11',
        description: 'Team building dinner',
        submittedDate: '2024-01-11T19:00:00Z',
        rejectedDate: '2024-01-12T10:15:00Z',
        rejectionReason: 'Exceeds meal allowance limit'
      }
    ];
    setApprovals(mockApprovals);
  }, []);

  const handleApprove = async (id) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setApprovals(prev => prev.map(approval => 
        approval.id === id 
          ? { 
              ...approval, 
              status: 'approved', 
              approvedDate: new Date().toISOString() 
            } 
          : approval
      ));
      
      toast.success('Expense approved successfully!');
    } catch (error) {
      toast.error('Failed to approve expense');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (id) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setApprovals(prev => prev.map(approval => 
        approval.id === id 
          ? { 
              ...approval, 
              status: 'rejected', 
              rejectedDate: new Date().toISOString(),
              rejectionReason: 'Please provide additional documentation'
            } 
          : approval
      ));
      
      toast.success('Expense rejected');
    } catch (error) {
      toast.error('Failed to reject expense');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApprovals = approvals.filter(approval => {
    const matchesSearch = !searchQuery || 
      approval.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      approval.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      approval.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || approval.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: approvals.length,
    pending: approvals.filter(a => a.status === 'pending').length,
    approved: approvals.filter(a => a.status === 'approved').length,
    rejected: approvals.filter(a => a.status === 'rejected').length,
    totalAmount: approvals.reduce((sum, a) => sum + a.convertedAmount, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Approval Dashboard</h1>
          <p className="mt-2 text-gray-600">Review and approve expense requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Requests</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Approved</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.approved}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Rejected</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.rejected}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Amount</p>
                <p className="text-2xl font-semibold text-gray-900">₹{stats.totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search approvals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex items-center gap-4">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Approvals Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApprovals.map((approval) => (
                  <tr key={approval.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{approval.subject}</p>
                        <p className="text-sm text-gray-500">{approval.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{approval.owner}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                        {approval.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          ₹{approval.convertedAmount.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {approval.currency} {approval.amount.toFixed(2)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(approval.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(approval.status)}`}>
                        {getStatusIcon(approval.status)}
                        {approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {approval.status === 'pending' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApprove(approval.id)}
                            disabled={isProcessing}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(approval.id)}
                            disabled={isProcessing}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">
                          {approval.status === 'approved' && approval.approvedDate && (
                            <p>Approved on {new Date(approval.approvedDate).toLocaleDateString()}</p>
                          )}
                          {approval.status === 'rejected' && approval.rejectedDate && (
                            <div>
                              <p>Rejected on {new Date(approval.rejectedDate).toLocaleDateString()}</p>
                              {approval.rejectionReason && (
                                <p className="text-xs text-red-600 mt-1">{approval.rejectionReason}</p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredApprovals.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No approvals found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'No expense requests are currently pending your approval.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerView;