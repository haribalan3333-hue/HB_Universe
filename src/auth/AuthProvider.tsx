import React, { useState, useEffect, ReactNode } from 'react';
import { AuthContext, AuthContextType } from './AuthContext';
import { AuthState, LoginCredentials, RegisterData, UserAccount } from './authTypes';
import { AuthService } from './AuthService';
import { SessionManager } from './SessionManager';
import { AuthModal } from '../components/Auth/AuthModal';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const session = SessionManager.getActiveSession();
    return {
      isAuthenticated: !!session,
      user: session ? session.user : null,
      token: session ? session.token : null,
      session: session,
      isGuest: !session,
      offlineMode: false,
      authLoading: false,
      authError: null
    };
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot'>('login');

  useEffect(() => {
    const session = SessionManager.getActiveSession();
    if (session) {
      AuthService.getCurrentUser().then(user => {
        if (user) {
          setAuthState(prev => ({ ...prev, user, isAuthenticated: true, isGuest: false }));
        }
      });
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, authLoading: true, authError: null }));
    const res = await AuthService.login(credentials);
    if (res.success && res.data) {
      const session = SessionManager.createSession(res.data.user, res.data.token);
      setAuthState({
        isAuthenticated: true,
        user: res.data.user,
        token: res.data.token,
        session: session,
        isGuest: false,
        offlineMode: false,
        authLoading: false,
        authError: null
      });
      setIsAuthModalOpen(false);
      return true;
    } else {
      setAuthState(prev => ({
        ...prev,
        authLoading: false,
        authError: typeof res.error === 'string' ? res.error : res.error?.message || 'Login failed'
      }));
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, authLoading: true, authError: null }));
    const res = await AuthService.register(data);
    if (res.success && res.data) {
      const session = SessionManager.createSession(res.data.user, res.data.token);
      setAuthState({
        isAuthenticated: true,
        user: res.data.user,
        token: res.data.token,
        session: session,
        isGuest: false,
        offlineMode: false,
        authLoading: false,
        authError: null
      });
      setIsAuthModalOpen(false);
      return true;
    } else {
      setAuthState(prev => ({
        ...prev,
        authLoading: false,
        authError: typeof res.error === 'string' ? res.error : res.error?.message || 'Registration failed'
      }));
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    await AuthService.logout();
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      session: null,
      isGuest: true,
      offlineMode: false,
      authLoading: false,
      authError: null
    });
  };

  const updateUser = (updates: Partial<UserAccount>) => {
    setAuthState(prev => {
      if (!prev.user) return prev;
      const newUser = { ...prev.user, ...updates };
      return { ...prev, user: newUser };
    });
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const contextValue: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    updateUser,
    openAuthModal,
    closeAuthModal,
    isAuthModalOpen,
    authModalMode,
    setAuthModalMode
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
      {isAuthModalOpen && (
        <AuthModal
          onClose={closeAuthModal}
          onSuccess={closeAuthModal}
        />
      )}
    </AuthContext.Provider>
  );
};
