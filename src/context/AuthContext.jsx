import React, { createContext, useState, useEffect, useContext } from 'react';
import { Preferences } from '@capacitor/preferences';

export const AuthContext = createContext();

// Restored missing hook used by ProtectedRoute and other components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session on app boot
  useEffect(() => {
    const loadSession = async () => {
      try {
        const { value: token } = await Preferences.get({ key: 'token' });
        const { value: userData } = await Preferences.get({ key: 'user' });
        
        if (token && userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Failed to load session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSession();
  }, []);

  const login = async (token, userData) => {
    await Preferences.set({ key: 'token', value: token });
    await Preferences.set({ key: 'user', value: JSON.stringify(userData) });
    setUser(userData);
  };

  const logout = async () => {
    await Preferences.remove({ key: 'token' });
    await Preferences.remove({ key: 'user' });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
