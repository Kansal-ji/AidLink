import { useState, useEffect } from 'react';
import { User } from '../types';
import { authAPI } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('aidlink_token');
      if (token) {
        const response = await authAPI.getProfile();
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('aidlink_token');
      localStorage.removeItem('aidlink_user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData: User, token?: string) => {
    setUser(userData);
    if (token) {
      localStorage.setItem('aidlink_token', token);
    }
    localStorage.setItem('aidlink_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aidlink_token');
    localStorage.removeItem('aidlink_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('aidlink_user', JSON.stringify(updatedUser));
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };
};