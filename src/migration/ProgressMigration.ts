import { LocalProgressDetector } from './LocalProgressDetector';
import { progressionApi } from '../api/progressionApi';

export class ProgressMigration {
  static async migrate(): Promise<boolean> {
    const local = LocalProgressDetector.detect();
    if (!local || !local.hasLocalData) return false;

    try {
      const res = await progressionApi.migrateLocal(local);
      if (res.success) {
        LocalProgressDetector.markMigrated();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Migration failed:', err);
      return false;
    }
  }

  static dismiss(): void {
    LocalProgressDetector.markMigrated();
  }
}
