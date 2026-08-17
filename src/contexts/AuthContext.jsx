import React, { createContext, useContext, useState } from 'react';

// Simulated secure hashing (In production, use bcrypt on backend)
const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString();
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (password) => {
    // In a real app, send the password to backend securely.
    // For this simulation, we verify against a hashed dummy value.
    const hashedInput = simpleHash(password);
    const expectedHash = simpleHash('secureweather2026'); 
    
    if (hashedInput === expectedHash) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
