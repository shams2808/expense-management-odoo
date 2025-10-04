import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LayoutDashboard, House, Settings, Users, FileText, LogIn, LogOut, UserCheck, Receipt, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
  };

  // Navigation items based on user role
  const getNavItems = () => {
    const baseItems = [
      { path: '/', label: 'Home', icon: House },
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ];

    if (!user) return baseItems;

    const roleBasedItems = {
      admin: [
        { path: '/admin/approval-rules', label: 'Approval Rules', icon: Settings },
        { path: '/manager/approvals', label: 'Approvals', icon: UserCheck },
      ],
      manager: [
        { path: '/manager/approvals', label: 'Approvals', icon: UserCheck },
        { path: '/employee/dashboard', label: 'My Expenses', icon: Receipt },
      ],
      employee: [
        { path: '/employee/dashboard', label: 'My Expenses', icon: Receipt },
        { path: '/expense/new', label: 'New Expense', icon: FileText },
      ],
    };

    return [...baseItems, ...(roleBasedItems[user.role] || [])];
  };

  const navItems = getNavItems();

  return (
    <div className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 flex flex-col z-50 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`} style={{width: isCollapsed ? '4rem' : '16rem'}}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <span className="ml-3 text-lg font-semibold text-gray-900">ExpenseFlow</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? <Menu className="w-5 h-5 text-gray-600" /> : <X className="w-5 h-5 text-gray-600" />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <IconComponent 
                    size={20} 
                    className="flex-shrink-0" 
                  />
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="px-3 py-4 border-t border-gray-200">
        {user ? (
          <div className="space-y-3">
            {/* User Info */}
            {!isCollapsed && (
              <div className="px-3 py-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserCheck size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full"
            >
              <LogOut size={20} className="flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">Logout</span>}
            </button>
          </div>
        ) : (
          <Link
            to="/signin"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <LogIn size={20} className="flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Sign In</span>}
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
