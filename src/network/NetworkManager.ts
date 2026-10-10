import { NetworkState } from './networkTypes';
import { SyncManager } from '../sync/SyncManager';

type NetworkListener = (state: NetworkState) => void;

export class NetworkManager {
  private static currentState: NetworkState = navigator.onLine ? 'ONLINE' : 'OFFLINE';
  private static listeners: Set<NetworkListener> = new Set();

  static init(): void {
    window.addEventListener('online', () => {
      this.setState('RECONNECTING');
      setTimeout(() => {
        this.setState('ONLINE');
        SyncManager.sync();
      }, 1000);
    });

    window.addEventListener('offline', () => {
      this.setState('OFFLINE');
    });
  }

  static getState(): NetworkState {
    return this.currentState;
  }

  static subscribe(listener: NetworkListener): () => void {
    this.listeners.add(listener);
    listener(this.currentState);
    return () => this.listeners.delete(listener);
  }

  private static setState(state: NetworkState): void {
    this.currentState = state;
    this.listeners.forEach(fn => fn(state));
  }
}
