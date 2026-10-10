const TOKEN_KEY = 'HB_UNIVERSE_AUTH_TOKEN_V11';
const REFRESH_TOKEN_KEY = 'HB_UNIVERSE_REFRESH_TOKEN_V11';

export class TokenManager {
  static getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  static setToken(token: string): void {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (err) {
      console.warn('Failed to store auth token:', err);
    }
  }

  static getRefreshToken(): string | null {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  static setRefreshToken(token: string): void {
    try {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    } catch (err) {
      console.warn('Failed to store refresh token:', err);
    }
  }

  static clearTokens(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (err) {
      console.warn('Failed to clear tokens:', err);
    }
  }

  static hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      // Decode JWT payload without verifying signature on client
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      const payload = JSON.parse(atob(parts[1]));
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        return false; // Expired
      }
      return true;
    } catch {
      return false;
    }
  }
}
