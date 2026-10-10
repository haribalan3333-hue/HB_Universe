import { apiClient } from './apiClient';

export interface ServerAchievement {
  id: string;
  name: string;
  unlockedAt: string;
}

export const achievementApi = {
  getAchievements: () => apiClient.get<ServerAchievement[]>('/api/achievements'),
  unlockAchievement: (achievementId: string) => apiClient.post<{ message: string; unlocked: boolean }>('/api/achievements/unlock', { achievementId })
};
