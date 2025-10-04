import { createContext, useContext, useState, useEffect } from 'react';
import { convertCurrency } from '../utils/currency';

const ExpensesContext = createContext();

export const useExpenses = () => {
  const context = useContext(ExpensesContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpensesProvider');
  }
  return context;
};

export const ExpensesProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [approvalRules, setApprovalRules] = useState([]);
  const [companyCurrency, setCompanyCurrency] = useState('USD');

  // Load data from localStorage on mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    const savedRules = localStorage.getItem('approvalRules');
    const savedCurrency = localStorage.getItem('companyCurrency');

    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
    if (savedRules) {
      setApprovalRules(JSON.parse(savedRules));
    }
    if (savedCurrency) {
      setCompanyCurrency(savedCurrency);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('approvalRules', JSON.stringify(approvalRules));
  }, [approvalRules]);

  useEffect(() => {
    localStorage.setItem('companyCurrency', companyCurrency);
  }, [companyCurrency]);

  // Expense management functions
  const createExpense = (expenseData) => {
    const newExpense = {
      id: Date.now(),
      ...expenseData,
      status: 'draft',
      submittedAt: null,
      approvedAt: null,
      approvers: [],
      approvalHistory: [],
      createdAt: new Date().toISOString()
    };
    setExpenses(prev => [newExpense, ...prev]);
    return newExpense;
  };

  const updateExpense = (expenseId, updates) => {
    setExpenses(prev => prev.map(expense => 
      expense.id === expenseId ? { ...expense, ...updates } : expense
    ));
  };

  const deleteExpense = (expenseId) => {
    setExpenses(prev => prev.filter(expense => expense.id !== expenseId));
  };

  const submitExpense = (expenseId) => {
    const expense = expenses.find(e => e.id === expenseId);
    if (!expense) return;

    // Apply approval rules
    const rule = approvalRules.find(r => r.userId === expense.employeeId);
    if (rule) {
      const approvers = rule.approvers.map(approver => ({
        ...approver,
        status: 'pending'
      }));
      
      updateExpense(expenseId, {
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        approvers
      });
    } else {
      updateExpense(expenseId, {
        status: 'submitted',
        submittedAt: new Date().toISOString()
      });
    }
  };

  const approveExpense = (expenseId, approverName) => {
    const expense = expenses.find(e => e.id === expenseId);
    if (!expense) return;

    const updatedApprovers = expense.approvers.map(approver => 
      approver.name === approverName 
        ? { ...approver, status: 'approved' }
        : approver
    );

    const approvalHistory = [
      ...expense.approvalHistory,
      { approver: approverName, action: 'approved', timestamp: new Date().toISOString() }
    ];

    // Check if all required approvers have approved
    const allRequiredApproved = updatedApprovers
      .filter(approver => approver.required)
      .every(approver => approver.status === 'approved');

    updateExpense(expenseId, {
      approvers: updatedApprovers,
      approvalHistory,
      status: allRequiredApproved ? 'approved' : 'submitted',
      approvedAt: allRequiredApproved ? new Date().toISOString() : null
    });
  };

  const rejectExpense = (expenseId, approverName) => {
    const expense = expenses.find(e => e.id === expenseId);
    if (!expense) return;

    const updatedApprovers = expense.approvers.map(approver => 
      approver.name === approverName 
        ? { ...approver, status: 'rejected' }
        : approver
    );

    const approvalHistory = [
      ...expense.approvalHistory,
      { approver: approverName, action: 'rejected', timestamp: new Date().toISOString() }
    ];

    updateExpense(expenseId, {
      approvers: updatedApprovers,
      approvalHistory,
      status: 'rejected'
    });
  };

  // Approval rules management
  const createApprovalRule = (ruleData) => {
    const newRule = {
      id: Date.now(),
      ...ruleData,
      createdAt: new Date().toISOString()
    };
    setApprovalRules(prev => [...prev, newRule]);
    return newRule;
  };

  const updateApprovalRule = (ruleId, updates) => {
    setApprovalRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, ...updates } : rule
    ));
  };

  const deleteApprovalRule = (ruleId) => {
    setApprovalRules(prev => prev.filter(rule => rule.id !== ruleId));
  };

  // Currency conversion
  const convertExpenseAmount = (expense) => {
    if (expense.currency === companyCurrency) {
      return expense.amount;
    }
    return convertCurrency(expense.amount, expense.currency, companyCurrency);
  };

  // Get expenses for a specific user
  const getExpensesForUser = (userId) => {
    return expenses.filter(expense => expense.employeeId === userId);
  };

  // Get pending approvals for a specific approver
  const getPendingApprovalsForUser = (approverName) => {
    return expenses.filter(expense => 
      expense.status === 'submitted' && 
      expense.approvers.some(approver => approver.name === approverName && approver.status === 'pending')
    );
  };

  // Get all expenses (for admin)
  const getAllExpenses = () => {
    return expenses;
  };

  // Get expenses by status
  const getExpensesByStatus = (status) => {
    return expenses.filter(expense => expense.status === status);
  };

  // Get approval rules for a specific user
  const getApprovalRuleForUser = (userId) => {
    return approvalRules.find(rule => rule.userId === userId);
  };

  // Get all approval rules (for admin)
  const getAllApprovalRules = () => {
    return approvalRules;
  };

  // Statistics
  const getExpenseStats = () => {
    const totalExpenses = expenses.length;
    const totalAmount = expenses.reduce((sum, expense) => sum + convertExpenseAmount(expense), 0);
    const approvedAmount = expenses
      .filter(expense => expense.status === 'approved')
      .reduce((sum, expense) => sum + convertExpenseAmount(expense), 0);
    const pendingAmount = expenses
      .filter(expense => expense.status === 'submitted')
      .reduce((sum, expense) => sum + convertExpenseAmount(expense), 0);
    const draftAmount = expenses
      .filter(expense => expense.status === 'draft')
      .reduce((sum, expense) => sum + convertExpenseAmount(expense), 0);

    return {
      totalExpenses,
      totalAmount,
      approvedAmount,
      pendingAmount,
      draftAmount,
      approvedCount: expenses.filter(e => e.status === 'approved').length,
      pendingCount: expenses.filter(e => e.status === 'submitted').length,
      draftCount: expenses.filter(e => e.status === 'draft').length,
      rejectedCount: expenses.filter(e => e.status === 'rejected').length
    };
  };

  const value = {
    // State
    expenses,
    approvalRules,
    companyCurrency,
    
    // Expense functions
    createExpense,
    updateExpense,
    deleteExpense,
    submitExpense,
    approveExpense,
    rejectExpense,
    
    // Approval rules functions
    createApprovalRule,
    updateApprovalRule,
    deleteApprovalRule,
    
    // Utility functions
    convertExpenseAmount,
    getExpensesForUser,
    getPendingApprovalsForUser,
    getAllExpenses,
    getExpensesByStatus,
    getApprovalRuleForUser,
    getAllApprovalRules,
    getExpenseStats,
    
    // Settings
    setCompanyCurrency
  };

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
};
