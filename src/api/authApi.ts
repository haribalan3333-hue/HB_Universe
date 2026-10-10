import { apiClient } from './apiClient';
import { AuthResponse, LoginCredentials, RegisterData, UserAccount } from '../auth/authTypes';

export const authApi = {
  register: (data: RegisterData) => apiClient.post<AuthResponse>('/api/auth/register', data),
  login: (credentials: LoginCredentials) => apiClient.post<AuthResponse>('/api/auth/login', credentials),
  logout: () => apiClient.post<{ message: string }>('/api/auth/logout', {}),
  getMe: () => apiClient.get<UserAccount>('/api/auth/me'),
  forgotPassword: (email: string) => apiClient.post<{ message: string; devOtp?: string }>('/api/auth/forgot-password', { email }),
  resetPassword: (data: { email: string; otp: string; newPassword: string }) => apiClient.post<{ message: string }>('/api/auth/reset-password', data),
  health: () => apiClient.get<{ status: string; service: string }>('/api/health')
};
