import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '@shared/schema';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: (options?: LogoutOptions) => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface LogoutOptions {
  clearAllData?: boolean;
  redirectTo?: string;
  showNotification?: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = user !== null;

  useEffect(() => {
    // Check for existing session
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('safeyatra_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          
          // Validate stored user data
          if (userData && userData.id && userData.role) {
            setUser(userData);
          } else {
            // Invalid user data, clear it
            localStorage.removeItem('safeyatra_user');
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear corrupted data
        localStorage.removeItem('safeyatra_user');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback((userData: User) => {
    try {
      setUser(userData);
      localStorage.setItem('safeyatra_user', JSON.stringify(userData));
      
      // Dispatch login event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: userData }));
      }
    } catch (error) {
      console.error('Error during login:', error);
      throw new Error('Failed to save user session');
    }
  }, []);

  const logout = useCallback(async (options: LogoutOptions = {}) => {
    const {
      clearAllData = true,
      redirectTo,
      showNotification = true
    } = options;

    try {
      // Set loading state if needed
      setIsLoading(true);

      // Clear user state immediately
      setUser(null);
      
      // Clear authentication data
      localStorage.removeItem('safeyatra_user');
      
      if (clearAllData) {
        // Clear all SafeYatra related data
        const safeyatraKeys = [
          'pilgrimResponses',
          'commandResponses',
          'userPreferences',
          'emergencyContacts',
          'lastKnownLocation'
        ];
        
        safeyatraKeys.forEach(key => {
          localStorage.removeItem(key);
        });
        
        // Clear any keys that start with safeyatra_ or similar patterns
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (
            key.startsWith('safeyatra_') || 
            key.startsWith('pilgrim_') || 
            key.startsWith('command_') ||
            key.startsWith('auth_') ||
            key.startsWith('session_')
          )) {
            keysToRemove.push(key);
          }
        }
        
        keysToRemove.forEach(key => {
          localStorage.removeItem(key);
        });
        
        // Clear sessionStorage
        sessionStorage.clear();
      }
      
      // Clear any ongoing intervals or timeouts
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('clearAllTimers'));
        
        // Notify all components about logout
        window.dispatchEvent(new CustomEvent('userLoggedOut', { 
          detail: { clearAllData, timestamp: new Date().toISOString() } 
        }));
      }
      
      // Optional: Make API call to invalidate server session
      try {
        // Uncomment when you have a logout API endpoint
        // await fetch('/api/auth/logout', { 
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   credentials: 'include'
        // });
      } catch (apiError) {
        console.warn('Failed to notify server about logout:', apiError);
        // Don't throw error here as local logout should still work
      }
      
      // Optional: Redirect
      if (redirectTo && typeof window !== 'undefined') {
        // Small delay to ensure state is updated
        setTimeout(() => {
          // If using React Router, you might want to use navigate() instead
          window.location.href = redirectTo;
        }, 100);
      }
      
      if (showNotification) {
        console.log('User logged out successfully');
        
        // You can also dispatch a toast notification here if you have a toast system
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('showToast', {
            detail: {
              title: 'Logged Out',
              message: 'You have been successfully logged out.',
              type: 'success'
            }
          }));
        }
      }
      
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if there's an error, ensure user is logged out locally
      setUser(null);
      localStorage.removeItem('safeyatra_user');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-logout on storage changes (multi-tab support)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'safeyatra_user' && e.newValue === null) {
        // User was logged out in another tab
        setUser(null);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('userLoggedOut', { 
            detail: { reason: 'storage_change' } 
          }));
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  // Auto-logout on inactivity (security feature)
  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;
    
    const resetTimer = () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
      
      // Auto-logout after 30 minutes of inactivity (configurable)
      if (user) {
        inactivityTimer = setTimeout(() => {
          logout({ 
            clearAllData: true, 
            showNotification: true,
            redirectTo: '/' // Redirect to home page on inactivity logout
          });
        }, 30 * 60 * 1000); // 30 minutes
      }
    };

    const handleActivity = () => {
      resetTimer();
    };

    // Listen for user activity
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    if (user && typeof document !== 'undefined') {
      activityEvents.forEach(event => {
        document.addEventListener(event, handleActivity, { passive: true });
      });
      resetTimer();
    }

    return () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
      if (typeof document !== 'undefined') {
        activityEvents.forEach(event => {
          document.removeEventListener(event, handleActivity);
        });
      }
    };
  }, [user, logout]);

  // Handle page visibility change (optional security feature)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && user) {
        // Page is now hidden, you could start a shorter timer here
        // or perform other security actions
        console.log('Page is now hidden');
      } else if (!document.hidden && user) {
        // Page is now visible again
        console.log('Page is now visible');
      }
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  }, [user]);

  const contextValue: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Export additional utilities
export const clearAllUserData = () => {
  // Utility function to clear all user data (can be used in emergency situations)
  if (typeof window !== 'undefined') {
    localStorage.clear();
    sessionStorage.clear();
    
    // Reload page to ensure clean state
    window.location.reload();
  }
};

export const isUserSessionValid = (): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    
    const storedUser = localStorage.getItem('safeyatra_user');
    if (!storedUser) return false;
    
    const userData = JSON.parse(storedUser);
    return userData && userData.id && userData.role;
  } catch {
    return false;
  }
};

// Additional utility to get current user from localStorage
export const getCurrentUser = (): User | null => {
  try {
    if (typeof window === 'undefined') return null;
    
    const storedUser = localStorage.getItem('safeyatra_user');
    if (!storedUser) return null;
    
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
};

// Utility to check if user has specific role
export const hasRole = (requiredRole: string): boolean => {
  const user = getCurrentUser();
  return user?.role === requiredRole;
};

// Utility to check if user is admin
export const isAdmin = (): boolean => {
  return hasRole('admin') || hasRole('administrator') || hasRole('command');
};

// Utility to check if user is pilgrim
export const isPilgrim = (): boolean => {
  return hasRole('pilgrim') || hasRole('user');
};