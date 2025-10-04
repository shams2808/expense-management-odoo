import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useExpenses } from '../contexts/ExpensesContext';
import { CheckCircle, XCircle, Eye, Clock, AlertCircle, DollarSign } from 'lucide-react';
import { convertCurrency, formatCurrency } from '../utils/currency';
import toast from 'react-hot-toast';

const ManagerView = () => {
  const { user } = useAuth();
  const { 
    getPendingApprovalsForUser, 
    approveExpense, 
    rejectExpense, 
    convertExpenseAmount, 
    companyCurrency,
    getAllExpenses,
    getUsers,
    updateExpense
  } = useExpenses();
  
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState(new Set());

  useEffect(() => {
    loadPendingApprovals();
  }, []);

  const loadPendingApprovals = async () => {
    try {
      setIsLoading(true);
      console.log('Loading pending approvals for manager:', user.name);
      
      // Get all users to find team members
      const allUsers = getUsers();
      console.log('All users:', allUsers);
      
      const allExpenses = getAllExpenses();
      console.log('All expenses:', allExpenses);
      
      // Find employees who report to this manager
      const teamMembers = allUsers.filter(emp => 
        emp.role === 'employee' && emp.manager === user.name
      );
      console.log('Team members for', user.name, ':', teamMembers);
      
      // Get submitted expenses from team members
      const teamMemberIds = teamMembers.map(member => member.id);
      console.log('Team member IDs:', teamMemberIds);
      
      const pending = allExpenses.filter(expense => 
        expense.status === 'submitted' && 
        teamMemberIds.includes(expense.employeeId)
      );
      console.log('Pending approvals:', pending);
      
      setPendingApprovals(pending);
    } catch (error) {
      console.error('Failed to load pending approvals:', error);
      toast.error('Failed to load pending approvals');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (expenseId) => {
    try {
      setProcessingIds(prev => new Set([...prev, expenseId]));
      
      console.log(`Approving expense: ${expenseId}`);
      
      // Get the expense to update
      const expense = pendingApprovals.find(e => e.id === expenseId);
      if (!expense) {
        console.error('Expense not found in pending approvals');
        return;
      }
      
      // Add approval history entry
      const approvalHistory = [
        ...(expense.approvalHistory || []),
        { approver: user.name, action: 'approved', timestamp: new Date().toISOString() }
      ];
      
      // Update the expense directly using updateExpense
      updateExpense(expenseId, {
        status: 'approved',
        approvedAt: new Date().toISOString(),
        approvalHistory
      });
      
      console.log('Expense approved successfully');
      toast.success('Expense approved successfully');
      
      // Remove from pending list
      setPendingApprovals(prev => prev.filter(expense => expense.id !== expenseId));
    } catch (error) {
      console.error('Failed to approve expense:', error);
      toast.error('Failed to approve expense');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(expenseId);
        return newSet;
      });
    }
  };

  const handleReject = async (expenseId) => {
    try {
      setProcessingIds(prev => new Set([...prev, expenseId]));
      
      console.log(`Rejecting expense: ${expenseId}`);
      
      // Get the expense to update
      const expense = pendingApprovals.find(e => e.id === expenseId);
      if (!expense) {
        console.error('Expense not found in pending approvals');
        return;
      }
      
      // Add approval history entry
      const approvalHistory = [
        ...(expense.approvalHistory || []),
        { approver: user.name, action: 'rejected', timestamp: new Date().toISOString() }
      ];
      
      // Update the expense directly using updateExpense
      updateExpense(expenseId, {
        status: 'rejected',
        approvalHistory
      });
      
      console.log('Expense rejected successfully');
      toast.success('Expense rejected');
      
      // Remove from pending list
      setPendingApprovals(prev => prev.filter(expense => expense.id !== expenseId));
    } catch (error) {
      console.error('Failed to reject expense:', error);
      toast.error('Failed to reject expense');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(expenseId);
        return newSet;
      });
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      submitted: { 
        label: 'Waiting approval', 
        className: 'bg-yellow-100 text-yellow-800',
        icon: Clock
      },
      approved: { 
        label: 'Approved', 
        className: 'bg-green-100 text-green-800',
        icon: CheckCircle
      },
      rejected: { 
        label: 'Rejected', 
        className: 'bg-red-100 text-red-800',
        icon: XCircle
      }
    };

    const config = statusConfig[status] || statusConfig.submitted;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        <IconComponent className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 text-sm">Loading approvals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Approvals to Review</h1>
              <p className="text-gray-600 mt-2">Review and approve expense requests from your team</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign className="w-4 h-4" />
              <span>Amounts shown in {companyCurrency}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{pendingApprovals.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Pending Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    pendingApprovals.reduce((sum, expense) => 
                      sum + convertExpenseAmount(expense), 0
                    ), 
                    companyCurrency
                  )}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ready to Review</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pendingApprovals.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Approvals Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
          </div>
          
          {pendingApprovals.length === 0 ? (
            <div className="p-8 text-center">
              <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pending approvals</h3>
              <p className="text-gray-600">All caught up! No expense requests need your review at the moment.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expense Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingApprovals.map((expense) => {
                    const convertedAmount = convertExpenseAmount(expense);
                    const isProcessing = processingIds.has(expense.id);
                    
                    return (
                      <tr key={expense.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {expense.description}
                            </div>
                            {expense.remarks && (
                              <div className="text-sm text-gray-500">
                                {expense.remarks}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {expense.employeeName || 'Unknown Employee'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {expense.employeeEmail || ''}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {expense.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(expense.expenseDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(convertedAmount, companyCurrency)}
                          </div>
                          {expense.currency !== companyCurrency && (
                            <div className="text-xs text-gray-500">
                              Original: {formatCurrency(expense.amount, expense.currency)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleApprove(expense.id)}
                              disabled={isProcessing}
                              className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(expense.id)}
                              disabled={isProcessing}
                              className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </button>
                            <button
                              className="text-gray-600 hover:text-gray-900 p-1"
                              title="View details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Approval History */}
        {pendingApprovals.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Approval History</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {pendingApprovals.map((expense) => (
                  <div key={expense.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{expense.description}</h4>
                      <span className="text-sm text-gray-500">
                        {formatCurrency(convertExpenseAmount(expense), companyCurrency)}
                      </span>
                    </div>
                    
                    {expense.approvalHistory && expense.approvalHistory.length > 0 ? (
                      <div className="space-y-2">
                        {expense.approvalHistory.map((entry, index) => (
                          <div key={index} className="flex items-center gap-3 text-sm">
                            <div className={`w-2 h-2 rounded-full ${
                              entry.action === 'approved' ? 'bg-green-500' : 'bg-red-500'
                            }`}></div>
                            <span className="text-gray-600">
                              {entry.approver} {entry.action} on {new Date(entry.timestamp).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No approval history yet</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerView;