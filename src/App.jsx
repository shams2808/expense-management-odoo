import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ExpensesProvider } from './contexts/ExpensesContext';
import Sidebar from './components/Sidebar';
import { Toaster } from 'react-hot-toast';

// Lazy load all page components for code splitting
const LandingPage = lazy(() => import('./pages/LandingPage'));
const SignIn = lazy(() => import('./pages/SignIn'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminApprovalRules = lazy(() => import('./pages/AdminApprovalRules'));
const EmployeeDashboard = lazy(() => import('./pages/EmployeeDashboard'));
const ManagerView = lazy(() => import('./pages/ManagerView'));
const NewExpense = lazy(() => import('./pages/NewExpense'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="text-gray-600 text-sm">Loading...</p>
    </div>
  </div>
);

// Protected Route component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Public Route component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <ExpensesProvider>
        <Router>
          <div className="flex min-h-screen bg-gray-50" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>
            <Sidebar />
            <div className="flex-1 ml-16">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/signin" element={<PublicRoute><SignIn /></PublicRoute>} />
                  <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
                  
                  {/* Protected Routes */}
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/admin/approval-rules" element={<ProtectedRoute requiredRole="admin"><AdminApprovalRules /></ProtectedRoute>} />
                  <Route path="/employee/dashboard" element={<ProtectedRoute requiredRole="employee"><EmployeeDashboard /></ProtectedRoute>} />
                  <Route path="/manager/approvals" element={<ProtectedRoute requiredRole="manager"><ManagerView /></ProtectedRoute>} />
                  <Route path="/expense/new" element={<ProtectedRoute><NewExpense /></ProtectedRoute>} />
                </Routes>
              </Suspense>
            </div>
          </div>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1f2937',
                color: '#fff',
                border: '1px solid #374151',
              },
            }}
          />
        </Router>
      </ExpensesProvider>
    </AuthProvider>
  );
}

export default App;