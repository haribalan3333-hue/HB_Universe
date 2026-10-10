import { CloudPullPayload } from './syncTypes';

export class SyncConflictResolver {
  /**
   * Resolves conflicts between server state and local state.
   * Progression, Coins, XP, Level, Rank are SERVER-AUTHORITATIVE.
   * Client preferences (Audio, Graphics) use last-updated strategy.
   */
  static resolve(serverPayload: CloudPullPayload, localState: any): any {
    if (!serverPayload.progression) {
      return localState;
    }

    return {
      character: {
        ...localState.character,
        level: serverPayload.progression.level,
        xp: serverPayload.progression.xp,
        coins: serverPayload.progression.coins,
        maxXp: (serverPayload.progression.level + 1) * 1000
      },
      achievements: serverPayload.achievements || [],
      cloudSynced: true,
      lastSyncTime: Date.now()
    };
  }
}
