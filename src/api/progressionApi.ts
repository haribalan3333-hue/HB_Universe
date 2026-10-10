import { apiClient } from './apiClient';
import { ProgressionEventPayload } from '../auth/authTypes';

export interface ServerProgression {
  level: number;
  xp: number;
  xpNeeded: number;
  coins: number;
  rank: string;
  currentStreak: number;
  achievements: string[];
}

export const progressionApi = {
  getProgression: () => apiClient.get<ServerProgression>('/api/progression/me'),
  sendEvent: (payload: ProgressionEventPayload) => apiClient.post<ServerProgression>('/api/progression/event', payload),
  migrateLocal: (data: any) => apiClient.post<ServerProgression>('/api/progression/migrate', data)
};
