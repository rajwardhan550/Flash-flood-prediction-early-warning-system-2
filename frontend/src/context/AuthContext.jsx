import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for an existing token on mount
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (token && role) {
      setUser({ token, role });
    }
    
    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    // Placeholder for actual API authentication
    // Assuming a successful login returns a token and a role (e.g., 'authority' or 'admin')
    const mockSession = { token: 'demo-jwt-token', role: 'authority' };
    
    localStorage.setItem('token', mockSession.token);
    localStorage.setItem('role', mockSession.role);
    setUser(mockSession);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};