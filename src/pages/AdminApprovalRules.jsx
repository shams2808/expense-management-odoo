import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X, Users, Settings, UserCheck, Clock, DollarSign, AlertCircle, Edit, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminApprovalRules = () => {
  const [rules, setRules] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Mock data for approval rules
  useEffect(() => {
    const mockRules = [
      {
        id: 1,
        user: 'John Doe',
        description: 'Approval rule for miscellaneous expenses under $500',
        manager: 'Sarah Wilson',
        approvers: [
          { name: 'Mike Johnson', required: true },
          { name: 'Lisa Chen', required: false }
        ],
        isManagerApprover: true,
        approversSequence: true,
        minApprovalPercentage: 100,
        status: 'active',
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-15T14:30:00Z'
      },
      {
        id: 2,
        user: 'Jane Smith',
        description: 'Approval rule for travel expenses',
        manager: 'David Brown',
        approvers: [
          { name: 'Alex Rodriguez', required: true },
          { name: 'Emma Davis', required: true }
        ],
        isManagerApprover: false,
        approversSequence: false,
        minApprovalPercentage: 100,
        status: 'active',
        createdAt: '2024-01-12T09:15:00Z',
        updatedAt: '2024-01-12T09:15:00Z'
      }
    ];
    setRules(mockRules);
  }, []);

  const handleAddRule = () => {
    const newRule = {
      id: Date.now(),
      user: '',
      description: '',
      manager: '',
      approvers: [],
      isManagerApprover: false,
      approversSequence: false,
      minApprovalPercentage: 50,
      status: 'draft'
    };
    setRules(prev => [newRule, ...prev]);
    setIsEditing(newRule.id);
  };

  const handleDeleteRule = async (id) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      setRules(prev => prev.filter(rule => rule.id !== id));
      toast.success('Rule deleted successfully');
    }
  };

  const handleRuleChange = (id, field, value) => {
    setRules(prev => prev.map(rule => 
      rule.id === id ? { ...rule, [field]: value } : rule
    ));
  };

  const handleAddApprover = (ruleId) => {
    setRules(prev => prev.map(rule =>
      rule.id === ruleId
        ? { ...rule, approvers: [...rule.approvers, { name: '', required: false }] }
        : rule
    ));
  };

  const handleApproverChange = (ruleId, index, field, value) => {
    setRules(prev => prev.map(rule =>
      rule.id === ruleId
        ? {
            ...rule,
            approvers: rule.approvers.map((approver, i) =>
              i === index ? { ...approver, [field]: value } : approver
            ),
          }
        : rule
    ));
  };

  const handleRemoveApprover = (ruleId, index) => {
    setRules(prev => prev.map(rule =>
      rule.id === ruleId
        ? { ...rule, approvers: rule.approvers.filter((_, i) => i !== index) }
        : rule
    ));
  };

  const handleSaveRule = async (id) => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRules(prev => prev.map(rule => 
        rule.id === id 
          ? { 
              ...rule, 
              status: 'active',
              updatedAt: new Date().toISOString()
            } 
          : rule
      ));
      
      setIsEditing(null);
      toast.success('Rule saved successfully');
    } catch (error) {
      toast.error('Failed to save rule');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditRule = (id) => {
    setIsEditing(id);
  };

  const handleCancelEdit = (id) => {
    if (rules.find(rule => rule.id === id)?.status === 'draft') {
      setRules(prev => prev.filter(rule => rule.id !== id));
    }
    setIsEditing(null);
  };

  const stats = {
    total: rules.length,
    active: rules.filter(r => r.status === 'active').length,
    draft: rules.filter(r => r.status === 'draft').length,
    users: [...new Set(rules.map(r => r.user))].length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Approval Rules Management</h1>
          <p className="mt-2 text-gray-600">Configure expense approval workflows for your organization</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Settings className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Rules</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Rules</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Edit className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Draft Rules</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.draft}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Users Covered</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.users}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Rule Button */}
        <div className="mb-6">
          <button
            onClick={handleAddRule}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Rule
          </button>
        </div>

        {/* Rules List */}
        <div className="space-y-6">
          {rules.map((rule) => (
            <div key={rule.id} className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {rule.user || 'New Rule'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {rule.description || 'No description provided'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rule.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {rule.status}
                    </span>
                    {isEditing !== rule.id && (
                      <button
                        onClick={() => handleEditRule(rule.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit Rule"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteRule(rule.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Rule"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {isEditing === rule.id ? (
                  <div className="space-y-6">
                    {/* User Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          User
                        </label>
                        <input
                          type="text"
                          value={rule.user}
                          onChange={(e) => handleRuleChange(rule.id, 'user', e.target.value)}
                          placeholder="Enter user name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Manager
                        </label>
                        <select
                          value={rule.manager}
                          onChange={(e) => handleRuleChange(rule.id, 'manager', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Manager</option>
                          <option value="Sarah Wilson">Sarah Wilson</option>
                          <option value="David Brown">David Brown</option>
                          <option value="Mike Johnson">Mike Johnson</option>
                        </select>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={rule.description}
                        onChange={(e) => handleRuleChange(rule.id, 'description', e.target.value)}
                        placeholder="Describe the approval rule"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Manager as Approver */}
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={rule.isManagerApprover}
                          onChange={(e) => handleRuleChange(rule.id, 'isManagerApprover', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Is manager an approver?
                        </span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        If checked, the approval request will go to the user's manager first.
                      </p>
                    </div>

                    {/* Approvers */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-700">Approvers</h4>
                        <button
                          onClick={() => handleAddApprover(rule.id)}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          + Add Approver
                        </button>
                      </div>
                      <div className="space-y-3">
                        {rule.approvers.map((approver, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <input
                              type="text"
                              value={approver.name}
                              onChange={(e) => handleApproverChange(rule.id, index, 'name', e.target.value)}
                              placeholder="Approver name"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={approver.required}
                                onChange={(e) => handleApproverChange(rule.id, index, 'required', e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">Required</span>
                            </label>
                            <button
                              onClick={() => handleRemoveApprover(rule.id, index)}
                              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Approvers Sequence */}
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={rule.approversSequence}
                          onChange={(e) => handleRuleChange(rule.id, 'approversSequence', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Approvers Sequence
                        </span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        {rule.approversSequence
                          ? 'Approval requests are sent sequentially in the order listed.'
                          : 'Approval requests are sent to all approvers in parallel.'}
                      </p>
                    </div>

                    {/* Minimum Approval Percentage */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Approval Percentage
                      </label>
                      <input
                        type="number"
                        value={rule.minApprovalPercentage}
                        onChange={(e) => handleRuleChange(rule.id, 'minApprovalPercentage', parseInt(e.target.value))}
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleSaveRule(rule.id)}
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Saving...' : 'Save Rule'}
                      </button>
                      <button
                        onClick={() => handleCancelEdit(rule.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Manager</p>
                      <p className="text-sm text-gray-900">{rule.manager || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Approvers</p>
                      <p className="text-sm text-gray-900">{rule.approvers.length} approvers</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Sequence</p>
                      <p className="text-sm text-gray-900">
                        {rule.approversSequence ? 'Sequential' : 'Parallel'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Min. Approval</p>
                      <p className="text-sm text-gray-900">{rule.minApprovalPercentage}%</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {rules.length === 0 && (
          <div className="text-center py-12">
            <Settings className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No approval rules</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first approval rule.
            </p>
            <div className="mt-6">
              <button
                onClick={handleAddRule}
                className="inline-flex items-center gap-2 px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add New Rule
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApprovalRules;