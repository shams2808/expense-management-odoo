import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Users, Settings, UserCheck, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useExpenses } from '../contexts/ExpensesContext';
import toast from 'react-hot-toast';

const AdminApprovalRules = () => {
  const { user } = useAuth();
  const { addApprovalRule, getUsers, getApprovalRules } = useExpenses();
  
  const [users, setUsers] = useState([]);
  const [approvalRules, setApprovalRules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  
  const [formData, setFormData] = useState({
    userId: '',
    description: '',
    managerId: '',
    approvers: [],
    isManagerApprover: false,
    isSequential: false,
    minimumApprovalPercentage: 50,
    isActive: true
  });

  const [newApprover, setNewApprover] = useState({
    name: '',
    email: '',
    role: 'manager'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [usersData, rulesData] = await Promise.all([
        getUsers(),
        getApprovalRules()
      ]);
      setUsers(usersData);
      setApprovalRules(rulesData);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddApprover = () => {
    if (!newApprover.name || !newApprover.email) {
      toast.error('Please fill in approver name and email');
      return;
    }

    const approver = {
      id: Date.now(),
      name: newApprover.name,
      email: newApprover.email,
      role: newApprover.role,
      isRequired: false
    };

    setFormData(prev => ({
      ...prev,
      approvers: [...prev.approvers, approver]
    }));

    setNewApprover({ name: '', email: '', role: 'manager' });
    toast.success('Approver added');
  };

  const handleRemoveApprover = (approverId) => {
    setFormData(prev => ({
      ...prev,
      approvers: prev.approvers.filter(approver => approver.id !== approverId)
    }));
  };

  const handleToggleRequired = (approverId) => {
    setFormData(prev => ({
      ...prev,
      approvers: prev.approvers.map(approver =>
        approver.id === approverId
          ? { ...approver, isRequired: !approver.isRequired }
          : approver
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.userId || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const ruleData = {
        ...formData,
        id: editingRule ? editingRule.id : Date.now(),
        createdAt: editingRule ? editingRule.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await addApprovalRule(ruleData);
      
      if (editingRule) {
        toast.success('Approval rule updated successfully');
      } else {
        toast.success('Approval rule created successfully');
      }
      
      setShowForm(false);
      setEditingRule(null);
      setFormData({
        userId: '',
        description: '',
        managerId: '',
        approvers: [],
        isManagerApprover: false,
        isSequential: false,
        minimumApprovalPercentage: 50,
        isActive: true
      });
      
      loadData();
    } catch (error) {
      console.error('Failed to save approval rule:', error);
      toast.error('Failed to save approval rule');
    }
  };

  const handleEdit = (rule) => {
    setEditingRule(rule);
    setFormData({
      userId: rule.userId,
      description: rule.description,
      managerId: rule.managerId,
      approvers: rule.approvers || [],
      isManagerApprover: rule.isManagerApprover || false,
      isSequential: rule.isSequential || false,
      minimumApprovalPercentage: rule.minimumApprovalPercentage || 50,
      isActive: rule.isActive !== false
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingRule(null);
    setFormData({
      userId: '',
      description: '',
      managerId: '',
      approvers: [],
      isManagerApprover: false,
      isSequential: false,
      minimumApprovalPercentage: 50,
      isActive: true
    });
  };

  const selectedUser = users.find(u => u.id === formData.userId);
  const managers = users.filter(u => u.role === 'manager');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 text-sm">Loading approval rules...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Approval Rules</h1>
              <p className="text-gray-600 mt-2">Configure expense approval workflows for your organization</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Rule
            </button>
          </div>
        </div>

        {/* Rules List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Existing Rules</h2>
          </div>
          
          {approvalRules.length === 0 ? (
            <div className="p-8 text-center">
              <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No approval rules configured</h3>
              <p className="text-gray-600 mb-4">Create your first approval rule to get started</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Rule
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {approvalRules.map((rule) => {
                const user = users.find(u => u.id === rule.userId);
                return (
                  <div key={rule.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {user ? user.name : 'Unknown User'}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            rule.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {rule.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{rule.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Manager:</span>
                            <span className="ml-2 text-gray-600">
                              {rule.managerId ? users.find(u => u.id === rule.managerId)?.name : 'Not assigned'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Approvers:</span>
                            <span className="ml-2 text-gray-600">
                              {rule.approvers?.length || 0} assigned
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Sequence:</span>
                            <span className="ml-2 text-gray-600">
                              {rule.isSequential ? 'Sequential' : 'Parallel'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Min Approval:</span>
                            <span className="ml-2 text-gray-600">
                              {rule.minimumApprovalPercentage}%
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleEdit(rule)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingRule ? 'Edit Approval Rule' : 'Create New Approval Rule'}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* User Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="userId"
                    value={formData.userId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a user</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rule Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="e.g., Approval rule for miscellaneous expenses"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Manager Assignment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manager
                  </label>
                  <select
                    name="managerId"
                    value={formData.managerId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a manager</option>
                    {managers.map(manager => (
                      <option key={manager.id} value={manager.id}>
                        {manager.name} ({manager.email})
                      </option>
                    ))}
                  </select>
                  {selectedUser && (
                    <p className="text-sm text-gray-500 mt-1">
                      Default manager: {selectedUser.manager || 'Not assigned'}
                    </p>
                  )}
                </div>

                {/* Manager as Approver Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isManagerApprover"
                    name="isManagerApprover"
                    checked={formData.isManagerApprover}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isManagerApprover" className="ml-2 text-sm text-gray-700">
                    Is manager an approver?
                  </label>
                </div>

                {/* Approvers List */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Approvers
                  </label>
                  
                  {/* Add New Approver */}
                  <div className="border border-gray-200 rounded-lg p-4 mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Approver</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Name"
                        value={newApprover.name}
                        onChange={(e) => setNewApprover(prev => ({ ...prev, name: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={newApprover.email}
                        onChange={(e) => setNewApprover(prev => ({ ...prev, email: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddApprover}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Approvers List */}
                  {formData.approvers.length > 0 && (
                    <div className="space-y-2">
                      {formData.approvers.map((approver) => (
                        <div key={approver.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <UserCheck className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">{approver.name}</p>
                              <p className="text-sm text-gray-600">{approver.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={approver.isRequired}
                                onChange={() => handleToggleRequired(approver.id)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">Required</span>
                            </label>
                            <button
                              type="button"
                              onClick={() => handleRemoveApprover(approver.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Approvers Sequence Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isSequential"
                    name="isSequential"
                    checked={formData.isSequential}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isSequential" className="ml-2 text-sm text-gray-700">
                    Approvers Sequence (Sequential approval)
                  </label>
                </div>

                {/* Minimum Approval Percentage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Approval Percentage
                  </label>
                  <input
                    type="number"
                    name="minimumApprovalPercentage"
                    value={formData.minimumApprovalPercentage}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Percentage of approvers required to approve the expense
                  </p>
                </div>

                {/* Active Status */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                    Active
                  </label>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {editingRule ? 'Update Rule' : 'Create Rule'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApprovalRules;