import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Receipt, Plus, Upload, Search, Filter, Eye, Edit, Trash2, DollarSign, Calendar, FileText, Clock, CheckCircle, XCircle, AlertCircle, TrendingUp, Users, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isUploading, setIsUploading] = useState(false);

  // Mock data for expenses
  useEffect(() => {
    const mockExpenses = [
      {
        id: 1,
        description: 'Office Supplies',
        category: 'Supplies',
        amount: 150.00,
        currency: 'USD',
        date: '2024-01-15',
        status: 'approved',
        paidBy: 'Company Card',
        remarks: 'Monthly office supplies order'
      },
      {
        id: 2,
        description: 'Client Lunch',
        category: 'Meals',
        amount: 75.50,
        currency: 'USD',
        date: '2024-01-14',
        status: 'submitted',
        paidBy: 'Personal Card',
        remarks: 'Business lunch with potential client'
      },
      {
        id: 3,
        description: 'Software License',
        category: 'Software',
        amount: 500.00,
        currency: 'USD',
        date: '2024-01-13',
        status: 'draft',
        paidBy: 'Company Card',
        remarks: 'Annual subscription renewal'
      },
      {
        id: 4,
        description: 'Travel - Flight',
        category: 'Travel',
        amount: 320.00,
        currency: 'USD',
        date: '2024-01-12',
        status: 'approved',
        paidBy: 'Company Card',
        remarks: 'Business trip to New York'
      },
      {
        id: 5,
        description: 'Team Dinner',
        category: 'Meals',
        amount: 200.00,
        currency: 'USD',
        date: '2024-01-11',
        status: 'rejected',
        paidBy: 'Personal Card',
        remarks: 'Team building dinner'
      }
    ];
    setExpenses(mockExpenses);
  }, []);

  const handleUploadReceipt = async (file) => {
    setIsUploading(true);
    try {
      // Simulate OCR processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create new expense from receipt
      const newExpense = {
        id: Date.now(),
        description: 'Receipt Upload',
        category: 'Other',
        amount: 0.00,
        currency: 'USD',
        date: new Date().toISOString().split('T')[0],
        status: 'draft',
        paidBy: 'Personal Card',
        remarks: 'Uploaded from receipt'
      };
      
      setExpenses(prev => [newExpense, ...prev]);
      toast.success('Receipt processed successfully!');
    } catch (error) {
      toast.error('Failed to process receipt');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitExpense = (id) => {
    setExpenses(prev => prev.map(exp => 
      exp.id === id ? { ...exp, status: 'submitted' } : exp
    ));
    toast.success('Expense submitted for approval');
  };

  const handleDeleteExpense = (id) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
    toast.success('Expense deleted');
  };

  const handleViewExpense = (id) => {
    toast.info('View expense details');
  };

  const handleEditExpense = (id) => {
    toast.info('Edit expense');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'draft':
        return <FileText className="w-4 h-4" />;
      case 'submitted':
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
      case 'draft':
        return 'bg-blue-100 text-blue-800';
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = !searchQuery || 
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || expense.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: expenses.length,
    draft: expenses.filter(e => e.status === 'draft').length,
    submitted: expenses.filter(e => e.status === 'submitted').length,
    approved: expenses.filter(e => e.status === 'approved').length,
    totalAmount: expenses.reduce((sum, e) => sum + e.amount, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Expense Management</h1>
          <p className="mt-2 text-gray-600">Track and manage your business expenses</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Receipt className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Expenses</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Draft</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.draft}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.submitted}</p>
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
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Amount</p>
                <p className="text-2xl font-semibold text-gray-900">${stats.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <label className="flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
            <Upload className="w-5 h-5" />
            {isUploading ? 'Processing...' : 'Upload Receipt'}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files[0] && handleUploadReceipt(e.target.files[0])}
              className="hidden"
              disabled={isUploading}
            />
          </label>
          
          <Link
            to="/expense/new"
            className="flex items-center justify-center gap-3 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Expense
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search expenses..."
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
                  <option value="draft">Draft</option>
                  <option value="submitted">Submitted</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{expense.description}</p>
                        {expense.remarks && (
                          <p className="text-sm text-gray-500">{expense.remarks}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {expense.currency} {expense.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
                        {getStatusIcon(expense.status)}
                        {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewExpense(expense.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {expense.status === 'draft' && (
                          <>
                            <button
                              onClick={() => handleEditExpense(expense.id)}
                              className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit expense"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleSubmitExpense(expense.id)}
                              className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Submit
                            </button>
                          </>
                        )}
                        
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete expense"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredExpenses.length === 0 && (
          <div className="text-center py-12">
            <Receipt className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No expenses found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating a new expense.'
              }
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <div className="mt-6">
                <Link
                  to="/expense/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Expense
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;