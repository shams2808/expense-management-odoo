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

    // Always initialize with mock expenses for demonstration
    // Comment out the if condition to force mock data
    // if (savedExpenses) {
    //   setExpenses(JSON.parse(savedExpenses));
    // } else {
      // Initialize with mock expenses for demonstration
      const mockExpenses = [
        {
          id: 1,
          description: 'Client Dinner - Tech Conference',
          category: 'Meals',
          amount: 125.50,
          currency: 'USD',
          expenseDate: '2024-10-01',
          paidBy: 'Company Card',
          remarks: 'Dinner with potential client at tech conference',
          employeeId: 1,
          employeeName: 'John Employee',
          employeeEmail: 'john@company.com',
          status: 'submitted',
          submittedAt: '2024-10-02T10:30:00.000Z',
          createdAt: '2024-10-01T15:30:00.000Z'
        },
        {
          id: 2,
          description: 'Office Supplies - Stationery',
          category: 'Office Supplies',
          amount: 89.99,
          currency: 'USD',
          expenseDate: '2024-10-02',
          paidBy: 'Personal Card',
          remarks: 'Pens, notebooks, and office supplies for team',
          employeeId: 4,
          employeeName: 'Jane Smith',
          employeeEmail: 'jane@company.com',
          status: 'submitted',
          submittedAt: '2024-10-03T09:15:00.000Z',
          createdAt: '2024-10-02T14:20:00.000Z'
        },
        {
          id: 3,
          description: 'Uber Ride - Client Meeting',
          category: 'Travel',
          amount: 24.75,
          currency: 'USD',
          expenseDate: '2024-10-03',
          paidBy: 'Company Card',
          remarks: 'Transportation to downtown client meeting',
          employeeId: 1,
          employeeName: 'John Employee',
          employeeEmail: 'john@company.com',
          status: 'submitted',
          submittedAt: '2024-10-03T16:45:00.000Z',
          createdAt: '2024-10-03T11:30:00.000Z'
        },
        {
          id: 4,
          description: 'Software License - Adobe Creative Suite',
          category: 'Software',
          amount: 299.00,
          currency: 'USD',
          expenseDate: '2024-10-01',
          paidBy: 'Company Card',
          remarks: 'Annual subscription for design team',
          employeeId: 4,
          employeeName: 'Jane Smith',
          employeeEmail: 'jane@company.com',
          status: 'submitted',
          submittedAt: '2024-10-02T11:20:00.000Z',
          createdAt: '2024-10-01T10:00:00.000Z'
        },
        {
          id: 5,
          description: 'Team Lunch - Project Celebration',
          category: 'Meals',
          amount: 156.80,
          currency: 'USD',
          expenseDate: '2024-09-30',
          paidBy: 'Company Card',
          remarks: 'Celebrating successful project completion',
          employeeId: 1,
          employeeName: 'John Employee',
          employeeEmail: 'john@company.com',
          status: 'submitted',
          submittedAt: '2024-10-01T08:30:00.000Z',
          createdAt: '2024-09-30T13:00:00.000Z'
        },
        {
          id: 6,
          description: 'Coffee Meeting - Client Discussion',
          category: 'Meals',
          amount: 45.20,
          currency: 'USD',
          expenseDate: '2024-09-28',
          paidBy: 'Company Card',
          remarks: 'Coffee meeting with potential client',
          employeeId: 4,
          employeeName: 'Jane Smith',
          employeeEmail: 'jane@company.com',
          status: 'approved',
          submittedAt: '2024-09-29T10:00:00.000Z',
          approvedAt: '2024-09-29T14:30:00.000Z',
          createdAt: '2024-09-28T16:00:00.000Z',
          approvalHistory: [
            { approver: 'Manager User', action: 'approved', timestamp: '2024-09-29T14:30:00.000Z' }
          ]
        },
        {
          id: 7,
          description: 'Expensive Dinner - Personal',
          category: 'Meals',
          amount: 450.00,
          currency: 'USD',
          expenseDate: '2024-09-25',
          paidBy: 'Personal Card',
          remarks: 'Personal dinner with family',
          employeeId: 1,
          employeeName: 'John Employee',
          employeeEmail: 'john@company.com',
          status: 'rejected',
          submittedAt: '2024-09-26T09:00:00.000Z',
          createdAt: '2024-09-25T19:00:00.000Z',
          approvalHistory: [
            { approver: 'Manager User', action: 'rejected', timestamp: '2024-09-26T11:15:00.000Z' }
          ]
        }
      ];
      setExpenses(mockExpenses);
    // }
    
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
    console.log('updateExpense called with ID:', expenseId, 'updates:', updates);
    setExpenses(prev => {
      const updated = prev.map(expense => 
        expense.id === expenseId ? { ...expense, ...updates } : expense
      );
      console.log('Updated expenses:', updated);
      return updated;
    });
  };

  const deleteExpense = (expenseId) => {
    setExpenses(prev => prev.filter(expense => expense.id !== expenseId));
  };

  const submitExpense = (expenseId) => {
    try {
      console.log('submitExpense called with ID:', expenseId);
      console.log('Current expenses:', expenses);
      
      const expense = expenses.find(e => e.id === expenseId);
      if (!expense) {
        console.error('Expense not found:', expenseId);
        return;
      }

      console.log('Submitting expense:', expense);

      // Apply approval rules
      const rule = approvalRules.find(r => r.userId === expense.employeeId);
      if (rule) {
        console.log('Found approval rule:', rule);
        const approvers = rule.approvers.map(approver => ({
          ...approver,
          status: 'pending'
        }));
        
        console.log('Updating expense with approvers');
        updateExpense(expenseId, {
          status: 'submitted',
          submittedAt: new Date().toISOString(),
          approvers
        });
      } else {
        console.log('No approval rule found, submitting without approvers');
        updateExpense(expenseId, {
          status: 'submitted',
          submittedAt: new Date().toISOString()
        });
      }
      
      console.log('Expense submitted successfully');
    } catch (error) {
      console.error('Error submitting expense:', error);
      throw error;
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
  const addApprovalRule = (ruleData) => {
    const newRule = {
      id: Date.now(),
      ...ruleData,
      createdAt: new Date().toISOString()
    };
    setApprovalRules(prev => [...prev, newRule]);
    return newRule;
  };

  const createApprovalRule = addApprovalRule;

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
    console.log('getExpensesForUser called with userId:', userId);
    console.log('All expenses:', expenses);
    const userExpenses = expenses.filter(expense => expense.employeeId === userId);
    console.log('Filtered expenses for user:', userExpenses);
    return userExpenses;
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

  const getApprovalRules = getAllApprovalRules;

  // User management state
  const [users, setUsers] = useState([]);

  // Load users from localStorage on mount
  useEffect(() => {
    const savedUsers = localStorage.getItem('users');
    // Always initialize with default users for demonstration
    // if (savedUsers) {
    //   setUsers(JSON.parse(savedUsers));
    // } else {
      // Initialize with default users
      const defaultUsers = [
        { id: 1, name: 'John Employee', email: 'john@company.com', role: 'employee', manager: 'Manager User', department: 'Sales', phone: '+1-555-0101', isActive: true, createdAt: new Date().toISOString() },
        { id: 2, name: 'Manager User', email: 'manager@company.com', role: 'manager', department: 'Management', phone: '+1-555-0102', isActive: true, createdAt: new Date().toISOString() },
        { id: 3, name: 'Admin User', email: 'admin@company.com', role: 'admin', department: 'IT', phone: '+1-555-0103', isActive: true, createdAt: new Date().toISOString() },
        { id: 4, name: 'Jane Smith', email: 'jane@company.com', role: 'employee', manager: 'Manager User', department: 'Marketing', phone: '+1-555-0104', isActive: true, createdAt: new Date().toISOString() },
        { id: 5, name: 'Bob Johnson', email: 'bob@company.com', role: 'manager', department: 'Operations', phone: '+1-555-0105', isActive: true, createdAt: new Date().toISOString() }
      ];
      setUsers(defaultUsers);
    // }
  }, []);

  // Save users to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  // User management functions
  const addUser = (userData) => {
    const newUser = {
      ...userData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const updateUser = (userData) => {
    setUsers(prev => prev.map(user => 
      user.id === userData.id ? { ...user, ...userData, updatedAt: new Date().toISOString() } : user
    ));
  };

  const deleteUser = (userId) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const getUsers = () => {
    return users;
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
    users,
    
    // Expense functions
    createExpense,
    updateExpense,
    deleteExpense,
    submitExpense,
    approveExpense,
    rejectExpense,
    
    // Approval rules functions
    addApprovalRule,
    createApprovalRule,
    updateApprovalRule,
    deleteApprovalRule,
    getApprovalRules,
    
    // User management functions
    addUser,
    updateUser,
    deleteUser,
    getUsers,
    
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
