import { LocalProgressionData } from './LocalProgressDetector';

export class MigrationValidator {
  static validate(data: LocalProgressionData): boolean {
    if (typeof data.level !== 'number' || data.level < 1 || data.level > 100) return false;
    if (typeof data.xp !== 'number' || data.xp < 0 || data.xp > 10000000) return false;
    if (typeof data.coins !== 'number' || data.coins < 0 || data.coins > 10000000) return false;
    if (!Array.isArray(data.achievements)) return false;
    return true;
  }
}
