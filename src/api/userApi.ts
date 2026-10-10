import { apiClient } from './apiClient';
import { UserAccount } from '../auth/authTypes';

export interface UserActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

export const userApi = {
  getProfile: () => apiClient.get<UserAccount>('/api/users/me'),
  updateProfile: (data: { display_name?: string; username?: string; avatar?: string }) => apiClient.patch<UserAccount>('/api/users/me', data),
  deleteAccount: () => apiClient.delete<{ message: string }>('/api/users/me'),
  getActivity: () => apiClient.get<UserActivity[]>('/api/users/me/activity')
};
