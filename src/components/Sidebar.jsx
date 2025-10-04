import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { House, Users, FileText, LogIn, LogOut, UserCheck, Receipt, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Sidebar is expanded when hovered
  const isExpanded = isHovered;

  // Navigation items based on user role
  const getNavItems = () => {
    const baseItems = [
      { path: '/', label: 'Home', icon: House },
    ];

    if (!user) return baseItems;

    const roleBasedItems = {
      admin: [
        { path: '/admin/approval-rules', label: 'Approval Rules', icon: Settings },
        { path: '/manager/approvals', label: 'Manage Users', icon: UserCheck },
      ],
      manager: [
        { path: '/manager/approvals', label: 'Approvals', icon: UserCheck },
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
    <div 
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 flex flex-col z-50 transition-all duration-300 ${isExpanded ? 'w-64' : 'w-16'}`} 
      style={{width: isExpanded ? '16rem' : '4rem'}}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-gray-200">
        {isExpanded && (
          <div className="flex items-center w-full">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <span className="ml-3 text-lg font-semibold text-gray-900 text-center flex-1">ExpenseFlow</span>
          </div>
        )}
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
                  {isExpanded && (
                    <span className="font-medium text-center flex-1">{item.label}</span>
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
            {isExpanded && (
              <div className="px-3 py-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserCheck size={16} className="text-blue-600" />
                  </div>
                  <div className="text-center flex-1">
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
              {isExpanded && <span className="font-medium text-center flex-1">Logout</span>}
            </button>
          </div>
        ) : (
          <Link
            to="/signin"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <LogIn size={20} className="flex-shrink-0" />
            {isExpanded && <span className="font-medium text-center flex-1">Sign In</span>}
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
