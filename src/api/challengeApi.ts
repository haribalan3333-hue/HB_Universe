import { apiClient } from './apiClient';

export interface DailyChallengeInfo {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  coinReward: number;
  expiresAt: string;
}

export const challengeApi = {
  getDailyChallenge: () => apiClient.get<DailyChallengeInfo>('/api/challenges/daily'),
  completeChallenge: (data: { challengeId: string; score: number; time: number; answers?: any[] }) =>
    apiClient.post<{ xpEarned: number; coinsEarned: number; status: string }>('/api/challenges/complete', data)
};
