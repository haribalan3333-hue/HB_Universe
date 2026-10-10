import { SyncState } from './syncTypes';
import { SyncQueue } from './SyncQueue';
import { SyncService } from './SyncService';
import { SyncConflictResolver } from './SyncConflictResolver';
import { useUniverseStore } from '../store/universeStore';
import { AuthManager } from '../auth/AuthManager';

type SyncListener = (state: SyncState) => void;

export class SyncManager {
  private static currentState: SyncState = SyncState.SYNCED;
  private static listeners: Set<SyncListener> = new Set();
  private static syncInterval: any = null;

  static init(): void {
    window.addEventListener('online', () => this.handleNetworkChange(true));
    window.addEventListener('offline', () => this.handleNetworkChange(false));

    // Periodic background sync every 60 seconds
    if (!this.syncInterval) {
      this.syncInterval = setInterval(() => {
        if (AuthManager.isAuthenticated() && navigator.onLine) {
          this.sync();
        }
      }, 60000);
    }
  }

  static getState(): SyncState {
    return this.currentState;
  }

  static subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    listener(this.currentState);
    return () => this.listeners.delete(listener);
  }

  private static setState(state: SyncState): void {
    this.currentState = state;
    this.listeners.forEach(fn => fn(state));
  }

  private static handleNetworkChange(online: boolean): void {
    if (!online) {
      this.setState(SyncState.OFFLINE);
    } else {
      this.sync();
    }
  }

  static async sync(): Promise<boolean> {
    if (!AuthManager.isAuthenticated()) {
      this.setState(SyncState.SYNCED);
      return true;
    }

    if (!navigator.onLine) {
      this.setState(SyncState.OFFLINE);
      return false;
    }

    this.setState(SyncState.SYNCING);

    try {
      // 1. Flush offline queue first
      const queue = SyncQueue.getQueue();
      if (queue.length > 0) {
        const processedIds = await SyncService.flushEvents(queue);
        if (processedIds.length > 0) {
          SyncQueue.remove(processedIds);
        }
      }

      // 2. Pull server authoritative state
      const cloudData = await SyncService.pull();
      if (cloudData) {
        const currentStore = useUniverseStore.getState();
        const resolved = SyncConflictResolver.resolve(cloudData, currentStore);
        if (resolved.character) {
          useUniverseStore.setState({
            character: resolved.character
          });
        }
        this.setState(SyncState.SYNCED);
        return true;
      }

      this.setState(SyncState.ERROR);
      return false;
    } catch (err) {
      console.warn('Sync failed:', err);
      this.setState(SyncState.ERROR);
      return false;
    }
  }

  static recordProgressionAction(eventType: string, entityId: string = '', score: number = 0): void {
    SyncQueue.enqueue({
      eventType,
      entityId,
      score,
      metadata: { recordedAt: new Date().toISOString() }
    });
    // Trigger sync in background
    if (AuthManager.isAuthenticated() && navigator.onLine) {
      this.sync();
    }
  }
}
