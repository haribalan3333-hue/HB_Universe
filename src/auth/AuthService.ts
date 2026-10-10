import { apiClient } from '../api/apiClient';
import { AuthResponse, LoginCredentials, RegisterData, UserAccount } from './authTypes';
import { SessionManager } from './SessionManager';
import { TokenManager } from './TokenManager';

export class AuthService {
  static async register(data: RegisterData): Promise<AuthResponse> {
    const res = await apiClient.post<{ user: UserAccount; token: string; refresh_token?: string }>('/api/auth/register', data);
    if (res.success && res.data) {
      SessionManager.createSession(res.data.user, res.data.token);
      return {
        success: true,
        data: res.data
      };
    }
    return {
      success: false,
      error: res.error || 'Registration failed'
    };
  }

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const res = await apiClient.post<{ user: UserAccount; token: string; refresh_token?: string }>('/api/auth/login', credentials);
    if (res.success && res.data) {
      SessionManager.createSession(res.data.user, res.data.token);
      return {
        success: true,
        data: res.data
      };
    }
    return {
      success: false,
      error: res.error || 'Login failed'
    };
  }

  static async logout(): Promise<void> {
    try {
      await apiClient.post('/api/auth/logout', {});
    } catch (err) {
      console.warn('Logout notification failed on backend:', err);
    } finally {
      SessionManager.clearSession();
    }
  }

  static async getCurrentUser(): Promise<UserAccount | null> {
    const token = TokenManager.getToken();
    if (!token) return null;
    const res = await apiClient.get<UserAccount>('/api/auth/me');
    return res.data || null;
  }

  static async requestPasswordReset(email: string): Promise<{ success: boolean; message: string; devOtp?: string }> {
    const res = await apiClient.post<{ message: string; devOtp?: string }>('/api/auth/forgot-password', { email });
    return {
      success: res.success,
      message: res.data?.message || 'Instructions generated',
      devOtp: res.data?.devOtp
    };
  }

  static async confirmPasswordReset(email: string, otp: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const res = await apiClient.post<{ message: string }>('/api/auth/reset-password', { email, otp, newPassword });
    return {
      success: res.success,
      message: res.data?.message || 'Password updated successfully'
    };
  }
}
