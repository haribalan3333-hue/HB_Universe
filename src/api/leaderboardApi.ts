import { apiClient } from './apiClient';

export interface LeaderboardPlayer {
  rank: number;
  user_id: string;
  username: string;
  display_name: string;
  avatar: string;
  level: number;
  xp: number;
  total_xp: number;
  coins: number;
  rank_tier: string;
  streak: number;
}

export interface LeaderboardResponse {
  entries: LeaderboardPlayer[];
  page: number;
  limit: number;
  total: number;
  type: string;
}

export const leaderboardApi = {
  getLeaderboard: (type: 'GLOBAL' | 'WEEKLY' | 'MONTHLY' = 'GLOBAL', page: number = 1, limit: number = 20) =>
    apiClient.get<LeaderboardResponse>(`/api/leaderboard?type=${type}&page=${page}&limit=${limit}`),
  getMyRank: () => apiClient.get<LeaderboardPlayer>('/api/leaderboard/me'),
  getUserProfile: (username: string) => apiClient.get<LeaderboardPlayer>(`/api/leaderboard/user/${username}`)
};
