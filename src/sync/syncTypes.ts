export enum SyncState {
  SYNCED = 'SYNCED',
  SYNCING = 'SYNCING',
  OFFLINE = 'OFFLINE',
  ERROR = 'ERROR',
  CONFLICT = 'CONFLICT'
}

export interface QueuedSyncEvent {
  eventId: string;
  eventType: string;
  entityId?: string;
  score?: number;
  metadata?: Record<string, any>;
  timestamp: number;
  retryCount: number;
}

export interface CloudProgression {
  level: number;
  xp: number;
  coins: number;
  rank: string;
  currentStreak: number;
  longestStreak: number;
  totalXp: number;
}

export interface CloudUser {
  id: string;
  username: string;
  display_name: string;
  avatar: string;
  is_private?: boolean;
}

export interface CloudPullPayload {
  user: CloudUser | null;
  progression: CloudProgression | null;
  stats: Record<string, number>;
  achievements: string[];
  settings: Record<string, any>;
  avatarCustomization: Record<string, any>;
  favorites: Record<string, any>;
  recentActivities: Array<{
    id: string;
    type: string;
    entityId: string;
    metadata: Record<string, any>;
    createdAt: string;
  }>;
}
