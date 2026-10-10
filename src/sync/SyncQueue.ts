import { QueuedSyncEvent } from './syncTypes';

const QUEUE_KEY = 'HB_UNIVERSE_SYNC_QUEUE_V12';

export class SyncQueue {
  static getQueue(): QueuedSyncEvent[] {
    try {
      const raw = localStorage.getItem(QUEUE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  static enqueue(event: Omit<QueuedSyncEvent, 'eventId' | 'timestamp' | 'retryCount'>): QueuedSyncEvent {
    const queue = this.getQueue();
    const newEvent: QueuedSyncEvent = {
      ...event,
      eventId: 'ev-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now(),
      timestamp: Date.now(),
      retryCount: 0
    };
    // Avoid exact duplicate events within 5 seconds
    const isDuplicate = queue.some(
      q => q.eventType === newEvent.eventType && q.entityId === newEvent.entityId && (Date.now() - q.timestamp < 5000)
    );
    if (!isDuplicate) {
      queue.push(newEvent);
      this.saveQueue(queue);
    }
    return newEvent;
  }

  static remove(eventIds: string[]): void {
    const queue = this.getQueue().filter(q => !eventIds.includes(q.eventId));
    this.saveQueue(queue);
  }

  static clear(): void {
    try {
      localStorage.removeItem(QUEUE_KEY);
    } catch (err) {
      console.warn('Failed to clear sync queue:', err);
    }
  }

  private static saveQueue(queue: QueuedSyncEvent[]): void {
    try {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    } catch (err) {
      console.warn('Failed to save sync queue:', err);
    }
  }
}
