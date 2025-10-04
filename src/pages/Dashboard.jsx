import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Receipt, UserCheck, Settings, FileText, DollarSign, Clock, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Redirect based on user role
      switch (user.role) {
        case 'admin':
          navigate('/admin/approval-rules');
          break;
        case 'manager':
          navigate('/manager/approvals');
          break;
        case 'employee':
          navigate('/employee/dashboard');
          break;
        default:
          navigate('/employee/dashboard');
      }
    }
  }, [user, navigate]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-6">
          <Receipt className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to ExpenseFlow
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Redirecting you to your personalized workspace...
        </p>
        
        <div className="flex items-center justify-center gap-4">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 text-sm">Loading your dashboard</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;