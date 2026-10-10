import { useContext } from 'react';
import { AuthContext, AuthContextType } from './AuthContext';
import { UserAccount } from './authTypes';
import { SessionManager } from './SessionManager';
import { TokenManager } from './TokenManager';

export class AuthManager {
  static getStoredUser(): UserAccount | null {
    const session = SessionManager.getActiveSession();
    return session ? session.user : null;
  }

  static getStoredToken(): string | null {
    return TokenManager.getToken();
  }

  static isAuthenticated(): boolean {
    return TokenManager.hasValidToken();
  }

  static saveSession(user: UserAccount, token: string): void {
    SessionManager.createSession(user, token);
  }

  static clearSession(): void {
    SessionManager.clearSession();
  }

  static logout(): void {
    SessionManager.clearSession();
  }
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    const session = SessionManager.getActiveSession();
    return {
      isAuthenticated: !!session,
      user: session ? session.user : null,
      token: session ? session.token : null,
      session: session,
      isGuest: !session,
      offlineMode: false,
      authLoading: false,
      authError: null,
      login: async () => false,
      register: async () => false,
      logout: async () => {},
      updateUser: () => {},
      openAuthModal: () => {},
      closeAuthModal: () => {},
      isAuthModalOpen: false,
      authModalMode: 'login',
      setAuthModalMode: () => {}
    };
  }
  return context;
};
