import { apiClient } from '../api/apiClient';
import { CloudPullPayload, QueuedSyncEvent } from './syncTypes';

export class SyncService {
  static async pull(): Promise<CloudPullPayload | null> {
    const res = await apiClient.get<CloudPullPayload>('/api/sync/pull');
    return res.data || null;
  }

  static async pushSettings(settings: Record<string, any>, avatar?: Record<string, any>): Promise<boolean> {
    const res = await apiClient.post('/api/sync/push', {
      settings,
      avatarCustomization: avatar
    });
    return res.success;
  }

  static async flushEvents(events: QueuedSyncEvent[]): Promise<string[]> {
    if (events.length === 0) return [];
    try {
      const res = await apiClient.post<{ status: string; events: Array<{ eventId: string; status: string }> }>(
        '/api/sync/events',
        { events }
      );
      if (res.success && res.data?.events) {
        return res.data.events.map(e => e.eventId);
      }
      return [];
    } catch (err) {
      console.warn('Batch event flush failed:', err);
      return [];
    }
  }
}
