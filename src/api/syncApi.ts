import { apiClient } from './apiClient';
import { CloudPullPayload } from '../sync/syncTypes';

export const syncApi = {
  pullState: () => apiClient.get<CloudPullPayload>('/api/sync/pull'),
  pushSettings: (settings: Record<string, any>) => apiClient.post('/api/sync/push', { settings }),
  exportUserData: () => apiClient.get<CloudPullPayload>('/api/users/me/export')
};
