export type TabType = 'home' | 'worlds' | 'play' | 'rank' | 'profile';

export type CameraMode =
  | 'DEFAULT'
  | 'CHARACTER_FOCUS'
  | 'WORLD_FOCUS'
  | 'PORTAL_APPROACH'
  | 'PORTAL_ENTRY'
  | 'WORLD_ARRIVAL'
  | 'WORLD_EXIT'
  | 'MAP_VIEW'
  | 'RETURN_HOME';

export type QualityMode = 'HIGH' | 'MEDIUM' | 'LOW' | 'AUTO';

export type CharacterAnimationState =
  | 'IDLE'
  | 'WALK'
  | 'RUN'
  | 'INTERACT'
  | 'CELEBRATE'
  | 'DAMAGE'
  | 'VICTORY'
  | 'LOCKED'
  | 'PORTAL_ENTER';

export type WorldTransitionState =
  | 'IDLE'
  | 'NEAR_PORTAL'
  | 'PORTAL_ACTIVATING'
  | 'CAMERA_TRAVEL'
  | 'LOADING_WORLD'
  | 'WORLD_ENTERING'
  | 'WORLD_ACTIVE'
  | 'WORLD_EXITING'
  | 'RETURNING_TO_UNIVERSE';

export interface WorldData {
  image?: string;
  id: string;
  name: string;
  subtitle: string;
  category: string;
  description: string;
  iconName: string;
  badge: string;
  themeColor: string;
  accentColor: string;
  borderGlow: string;
  features: string[];
  stats: {
    playersCount: string;
    popularity: number;
    completion: string;
    availableCount: string;
    rewardXp: number;
    rewardCoins: number;
  };
  position: {
    slot: 'top' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'bottom';
    angle: number;
  };
  locked: boolean;
  requiredLevel: number;
  loreSnippet: string;
}

export interface GameData {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  badge: string;
  rating: number;
  xpReward: number;
  coinReward: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
  status: 'ONLINE' | 'BETA' | 'SOON';
}

export interface AchievementData {
  id: string;
  title: string;
  description: string;
  category: string;
  rewardXp: number;
  rewardCoins: number;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

export interface CharacterState {
  name: string;
  title: string;
  level: number;
  xp: number;
  maxXp: number;
  coins: number;
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  rank: string;
  avatarUrl?: string;
  selectedSkin: string;
  selectedAura: string;
  stats: {
    power: number;
    agility: number;
    intelligence: number;
    endurance: number;
  };
}
