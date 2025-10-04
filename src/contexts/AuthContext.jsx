import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Simulate API call - replace with actual authentication
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const userData = await response.json();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      // For demo purposes, use mock data
      const mockUsers = [
        { id: 1, email: 'admin@company.com', password: 'admin123', role: 'admin', name: 'Admin User', company: 'Demo Company', country: 'US' },
        { id: 2, email: 'employee@company.com', password: 'emp123', role: 'employee', name: 'John Employee', manager: 'Manager User' },
        { id: 3, email: 'manager@company.com', password: 'mgr123', role: 'manager', name: 'Manager User', employees: [2] },
      ];

      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      if (foundUser) {
        const { password, ...userData } = foundUser;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      }
      return { success: false, error: 'Invalid credentials' };
    }
  };

  const register = async (userData) => {
    try {
      // Simulate API call - replace with actual registration
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const newUser = await response.json();
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      return { success: true };
    } catch (error) {
      // For demo purposes, create mock user
      const newUser = {
        id: Date.now(),
        ...userData,
        role: userData.role || 'employee',
      };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      return { success: true };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
