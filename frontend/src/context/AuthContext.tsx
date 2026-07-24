import React, { createContext, useContext, useEffect, useState } from 'react';
import { storage } from '../lib/storage';
import { authService } from '../services/api';
import { LoginCredentials, RegisterCredentials, User } from '../types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (credentials: RegisterCredentials) => Promise<User>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = storage.getAccessToken();
      const cachedUser = storage.getUser<User>();

      if (token) {
        if (cachedUser) {
          setUser(cachedUser);
          setIsLoading(false);
        } else {
          try {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
            storage.setUser(currentUser);
          } catch {
            storage.clearAll();
            setUser(null);
          } finally {
            setIsLoading(false);
          }
        }
      } else {
        setIsLoading(false);
      }
    };

    initAuth();

    // Event listener for global 401 unauthorized triggers from Axios interceptor
    const handleUnauthorized = () => {
      setUser(null);
      storage.clearAll();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const clearError = () => setError(null);

  const login = async (credentials: LoginCredentials): Promise<User> => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      
      // Store tokens
      if (response.tokens?.accessToken) {
        storage.setAccessToken(response.tokens.accessToken);
        if (response.tokens.refreshToken) {
          storage.setRefreshToken(response.tokens.refreshToken);
        }
      }

      // Store user
      const loggedUser = response.user;
      setUser(loggedUser);
      storage.setUser(loggedUser);
      return loggedUser;
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err && (err as { response?: { data?: { message?: string } } }).response?.data?.message
          ? (err as { response?: { data?: { message?: string } } }).response!.data!.message!
          : 'Failed to log in. Please check your credentials.';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<User> => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await authService.register(credentials);
      
      if (response.tokens?.accessToken) {
        storage.setAccessToken(response.tokens.accessToken);
        if (response.tokens.refreshToken) {
          storage.setRefreshToken(response.tokens.refreshToken);
        }
      }

      const newUser = response.user;
      setUser(newUser);
      storage.setUser(newUser);
      return newUser;
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err && (err as { response?: { data?: { message?: string } } }).response?.data?.message
          ? (err as { response?: { data?: { message?: string } } }).response!.data!.message!
          : 'Registration failed. Please try again.';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch {
      // Ignore network errors on logout and perform client cleanup
    } finally {
      setUser(null);
      storage.clearAll();
      setIsLoading(false);
    }
  };

  const updateUser = (updatedFields: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updatedFields };
      setUser(updatedUser);
      storage.setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        clearError,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
