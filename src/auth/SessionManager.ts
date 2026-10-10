import { UserAccount, Session } from './authTypes';
import { TokenManager } from './TokenManager';

const SESSION_KEY = 'HB_UNIVERSE_SESSION_V11';

export class SessionManager {
  static createSession(user: UserAccount, token: string): Session {
    const session: Session = {
      token,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
      user
    };
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      TokenManager.setToken(token);
    } catch (err) {
      console.warn('Failed to save session:', err);
    }
    return session;
  }

  static getActiveSession(): Session | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const session: Session = JSON.parse(raw);
      if (session.expiresAt < Date.now()) {
        this.clearSession();
        return null;
      }
      return session;
    } catch {
      return null;
    }
  }

  static clearSession(): void {
    try {
      localStorage.removeItem(SESSION_KEY);
      TokenManager.clearTokens();
    } catch (err) {
      console.warn('Failed to clear session:', err);
    }
  }
}
