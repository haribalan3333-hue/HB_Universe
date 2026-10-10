import { create } from 'zustand';
import {
  CharacterState,
  TabType,
  WorldData,
  CameraMode,
  QualityMode,
  CharacterAnimationState,
  WorldTransitionState,
} from '../types';
import { getXpForLevel } from '../data/progression';
import { WORLD_REGISTRY } from '../navigation/WorldRegistry';
import { audioManager } from '../audio/audioManager';

interface UniverseStore {
  hasEntered: boolean;
  currentTab: TabType;
  selectedWorld: WorldData | null;
  hoveredWorld: WorldData | null;
  focusedWorld: WorldData | null;
  nearbyPortal: WorldData | null;
  isWorldModalOpen: boolean;
  worldMapOpen: boolean;
  settingsOpen: boolean;
  customizerOpen: boolean;
  profileModalOpen: boolean;

  // Phase 5 Portal Travel & Navigation State
  currentWorldId: string | null; // null = Universe Hub, 'arcade', 'cinema', etc.
  destinationWorldId: string | null;
  worldTransitionState: WorldTransitionState;
  travelProgress: number;
  travelMessage: string;
  isTraveling: boolean;

  // 3D Scene & Character Controls
  use3DScene: boolean;
  cameraMode: CameraMode;
  qualityMode: QualityMode;
  sceneLoaded: boolean;

  // Real-time 3D Character Transform
  characterPosition: [number, number, number];
  characterRotation: number;
  characterAnimation: CharacterAnimationState;
  joystickVector: { x: number; y: number };
  isMoving: boolean;
  isRunning: boolean;

  // Character Speech & Reactions
  speechBubble: { text: string; id: number } | null;

  soundEnabled: boolean;
  musicEnabled: boolean;
  effectsEnabled: boolean;
  reducedMotion: boolean;
  isWarping: boolean;

  character: CharacterState;
  unlockedWorlds: string[];

  // Actions
  enterUniverse: () => void;
  setCurrentTab: (tab: TabType) => void;
  setSelectedWorld: (world: WorldData | null) => void;
  setHoveredWorld: (world: WorldData | null) => void;
  setFocusedWorld: (world: WorldData | null) => void;
  setNearbyPortal: (portal: WorldData | null) => void;
  openWorldModal: (world: WorldData) => void;
  closeWorldModal: () => void;
  setWorldMapOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  setCustomizerOpen: (open: boolean) => void;
  setProfileModalOpen: (open: boolean) => void;

  // Phase 5 Portal Travel Actions
  initiatePortalTravel: (worldId: string) => void;
  startWorldTransition: (world: WorldData) => void;
  completeWorldTransition: () => void;
  exitWorldView: () => void;
  transitionActive: boolean;
  transitioningWorld: WorldData | null;
  cancelTravel: () => void;
  returnToUniverseHub: () => void;
  setTravelProgress: (progress: number) => void;
  setTravelMessage: (message: string) => void;

  setCameraMode: (mode: CameraMode) => void;
  setQualityMode: (mode: QualityMode) => void;
  setSceneLoaded: (loaded: boolean) => void;
  toggle3DScene: () => void;
  setUse3DScene: (use3D: boolean) => void;

  // Character Movement Actions
  setCharacterPosition: (pos: [number, number, number]) => void;
  setCharacterRotation: (rot: number) => void;
  setCharacterAnimation: (anim: CharacterAnimationState) => void;
  setJoystickVector: (vec: { x: number; y: number }) => void;
  setIsRunning: (running: boolean) => void;
  showSpeech: (text: string, durationMs?: number) => void;

  // Customization & Progression Actions
  setSkin: (skinId: string) => void;
  setAura: (auraId: string) => void;
  addXp: (amount: number) => void;
  removeXp: (amount: number) => void;
  addCoins: (amount: number) => void;
  removeCoins: (amount: number) => void;
  restoreHealth: (amount: number) => void;
  reduceHealth: (amount: number) => void;
  restoreEnergy: (amount: number) => void;
  reduceEnergy: (amount: number) => void;

  toggleSound: () => void;
  toggleMusic: () => void;
  toggleEffects: () => void;
  toggleReducedMotion: () => void;
  setWarping: (warping: boolean) => void;
}

const STORAGE_KEY = 'HB_UNIVERSE_CHARACTER_V5';

function loadStoredCharacter(): Partial<CharacterState> | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function saveCharacter(char: CharacterState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(char));
  } catch {
    // ignore
  }
}

const initialSaved = loadStoredCharacter();

export const useUniverseStore = create<UniverseStore>((set, get) => ({
  hasEntered: false,
  currentTab: 'home',
  selectedWorld: null,
  hoveredWorld: null,
  focusedWorld: null,
  nearbyPortal: null,
  isWorldModalOpen: false,
  worldMapOpen: false,
  settingsOpen: false,
  customizerOpen: false,
  profileModalOpen: false,

  currentWorldId: null,
  destinationWorldId: null,
  worldTransitionState: 'IDLE',
  travelProgress: 0,
  travelMessage: 'Opening dimensional gateway...',
  isTraveling: false,
  transitionActive: false,
  transitioningWorld: null,

  use3DScene: true,
  cameraMode: 'DEFAULT',
  qualityMode: 'AUTO',
  sceneLoaded: false,

  characterPosition: [0, 0, 0],
  characterRotation: 0,
  characterAnimation: 'IDLE',
  joystickVector: { x: 0, y: 0 },
  isMoving: false,
  isRunning: false,
  speechBubble: null,

  soundEnabled: true,
  musicEnabled: false,
  effectsEnabled: true,
  reducedMotion: false,
  isWarping: false,

  character: {
    name: 'HB PILOT',
    title: 'Universe Pioneer',
    level: initialSaved?.level || 12,
    xp: initialSaved?.xp || 720,
    maxXp: initialSaved?.maxXp || 1000,
    coins: initialSaved?.coins || 2450,
    health: initialSaved?.health || 100,
    maxHealth: 100,
    energy: initialSaved?.energy || 85,
    maxEnergy: 100,
    rank: '#42 Vanguard',
    avatarUrl: '/images/hb_pilot.png',
    selectedSkin: initialSaved?.selectedSkin || 'default',
    selectedAura: initialSaved?.selectedAura || 'energy',
    stats: {
      power: 88,
      agility: 92,
      intelligence: 95,
      endurance: 80,
    },
  },

  unlockedWorlds: ['arcade', 'cinema', 'music', 'ai', 'challenge'],

  enterUniverse: () => set({ hasEntered: true }),

  setCurrentTab: (tab: TabType) => set({ currentTab: tab, currentWorldId: null }),

  setSelectedWorld: (world: WorldData | null) => set({ selectedWorld: world }),

  setHoveredWorld: (world: WorldData | null) => set({ hoveredWorld: world }),

  setFocusedWorld: (world: WorldData | null) => set({ focusedWorld: world }),

  setNearbyPortal: (portal: WorldData | null) => set({ nearbyPortal: portal }),

  openWorldModal: (world: WorldData) => set({ selectedWorld: world, isWorldModalOpen: true }),

  closeWorldModal: () => set({ isWorldModalOpen: false, selectedWorld: null }),

  setWorldMapOpen: (open: boolean) => {
    set({
      worldMapOpen: open,
      cameraMode: open ? 'MAP_VIEW' : 'DEFAULT',
    });
  },

  setSettingsOpen: (open: boolean) => set({ settingsOpen: open }),

  setCustomizerOpen: (open: boolean) => set({ customizerOpen: open }),

  setProfileModalOpen: (open: boolean) => set({ profileModalOpen: open }),

  // Phase 5 World Portal Travel State Machine
  startWorldTransition: (world: WorldData) => {
    get().initiatePortalTravel(world.id);
  },
  completeWorldTransition: () => {
    // handled by travel state machine
  },
  exitWorldView: () => {
    get().returnToUniverseHub();
  },
  initiatePortalTravel: (worldId: string) => {
    const { isTraveling, unlockedWorlds, soundEnabled, showSpeech } = get();
    if (isTraveling) return; // Prevent duplicate triggers

    const reg = WORLD_REGISTRY[worldId];
    if (!reg) return;

    if (!unlockedWorlds.includes(worldId) && reg.locked) {
      if (soundEnabled) audioManager.playLockedWorld();
      showSpeech('🔒 ACCESS RESTRICTED • REQ LEVEL ' + reg.requiredLevel, 2500);
      return;
    }

    if (soundEnabled) audioManager.playPortalOpen();

    set({
      isTraveling: true,
      destinationWorldId: worldId,
      worldTransitionState: 'PORTAL_ACTIVATING',
      cameraMode: 'PORTAL_APPROACH',
      characterAnimation: 'PORTAL_ENTER',
      travelProgress: 0,
      travelMessage: reg.loadingMessages[0] || 'Opening dimensional gateway...',
      isWorldModalOpen: false,
      worldMapOpen: false,
    });

    // Step 2: Camera flies into portal
    setTimeout(() => {
      set({
        worldTransitionState: 'CAMERA_TRAVEL',
        cameraMode: 'PORTAL_ENTRY',
      });
      if (soundEnabled) audioManager.playWarp();
    }, 400);

    // Step 3: Loading Screen with animated progress
    setTimeout(() => {
      set({
        worldTransitionState: 'LOADING_WORLD',
      });

      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        const msgIdx = Math.min(
          reg.loadingMessages.length - 1,
          Math.floor((progress / 100) * reg.loadingMessages.length)
        );
        set({
          travelProgress: Math.min(100, progress),
          travelMessage: reg.loadingMessages[msgIdx] || 'Loading environment...',
        });

        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            set({
              worldTransitionState: 'WORLD_ACTIVE',
              currentWorldId: worldId,
              destinationWorldId: null,
              isTraveling: false,
              cameraMode: 'DEFAULT',
              characterAnimation: 'IDLE',
              characterPosition: reg.spawnPoint,
              travelProgress: 100,
            });
          }, 300);
        }
      }, 70);
    }, 900);
  },

  cancelTravel: () => {
    set({
      isTraveling: false,
      destinationWorldId: null,
      worldTransitionState: 'IDLE',
      cameraMode: 'DEFAULT',
      characterAnimation: 'IDLE',
    });
  },

  returnToUniverseHub: () => {
    const { isTraveling, soundEnabled, character } = get();
    if (isTraveling) return;

    if (soundEnabled) audioManager.playPortalOpen();
    saveCharacter(character); // Save all state

    set({
      isTraveling: true,
      worldTransitionState: 'RETURNING_TO_UNIVERSE',
      travelProgress: 0,
      travelMessage: 'Returning to Universe Hub...',
    });

    let progress = 0;
    const interval = setInterval(() => {
      progress += 15;
      set({ travelProgress: Math.min(100, progress) });

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          set({
            currentWorldId: null,
            destinationWorldId: null,
            worldTransitionState: 'IDLE',
            isTraveling: false,
            cameraMode: 'DEFAULT',
            characterAnimation: 'IDLE',
            characterPosition: [0, 0, 0], // Central spawn point
          });
        }, 200);
      }
    }, 60);
  },

  setTravelProgress: (progress: number) => set({ travelProgress: progress }),
  setTravelMessage: (message: string) => set({ travelMessage: message }),

  setCameraMode: (mode: CameraMode) => set({ cameraMode: mode }),
  setQualityMode: (mode: QualityMode) => set({ qualityMode: mode }),
  setSceneLoaded: (loaded: boolean) => set({ sceneLoaded: loaded }),
  toggle3DScene: () => set((state) => ({ use3DScene: !state.use3DScene })),
  setUse3DScene: (use3D: boolean) => set({ use3DScene: use3D }),

  setCharacterPosition: (pos: [number, number, number]) => set({ characterPosition: pos }),
  setCharacterRotation: (rot: number) => set({ characterRotation: rot }),
  setCharacterAnimation: (anim: CharacterAnimationState) => set({ characterAnimation: anim }),
  setJoystickVector: (vec: { x: number; y: number }) => set({ joystickVector: vec }),
  setIsRunning: (running: boolean) => set({ isRunning: running }),

  showSpeech: (text: string, durationMs = 3000) => {
    const id = Date.now();
    set({ speechBubble: { text, id } });
    setTimeout(() => {
      const current = get().speechBubble;
      if (current && current.id === id) {
        set({ speechBubble: null });
      }
    }, durationMs);
  },

  setSkin: (skinId: string) => {
    const { character } = get();
    const updated = { ...character, selectedSkin: skinId };
    set({ character: updated });
    saveCharacter(updated);
  },

  setAura: (auraId: string) => {
    const { character } = get();
    const updated = { ...character, selectedAura: auraId };
    set({ character: updated });
    saveCharacter(updated);
  },

  addXp: (amount: number) => {
    const { character, unlockedWorlds, showSpeech } = get();
    let newXp = character.xp + amount;
    let newLevel = character.level;
    let newMaxXp = character.maxXp;
    let updatedUnlocked = [...unlockedWorlds];
    let leveledUp = false;

    while (newXp >= newMaxXp) {
      newXp -= newMaxXp;
      newLevel += 1;
      newMaxXp = getXpForLevel(newLevel);
      leveledUp = true;

      if (newLevel >= 20 && !updatedUnlocked.includes('mystery')) {
        updatedUnlocked.push('mystery');
      }
    }

    if (leveledUp) {
      showSpeech('✨ LEVEL UP! NOW LEVEL ' + newLevel + ' ✨', 4000);
      set({ characterAnimation: 'CELEBRATE' });
      setTimeout(() => {
        set({ characterAnimation: 'IDLE' });
      }, 2500);
    }

    const updatedChar = {
      ...character,
      level: newLevel,
      xp: newXp,
      maxXp: newMaxXp,
    };

    set({
      character: updatedChar,
      unlockedWorlds: updatedUnlocked,
    });
    saveCharacter(updatedChar);
  },

  removeXp: (amount: number) => {
    const { character } = get();
    const updated = { ...character, xp: Math.max(0, character.xp - amount) };
    set({ character: updated });
    saveCharacter(updated);
  },

  addCoins: (amount: number) => {
    const { character } = get();
    const updated = { ...character, coins: character.coins + amount };
    set({ character: updated });
    saveCharacter(updated);
  },

  removeCoins: (amount: number) => {
    const { character } = get();
    const updated = { ...character, coins: Math.max(0, character.coins - amount) };
    set({ character: updated });
    saveCharacter(updated);
  },

  restoreHealth: (amount: number) => {
    const { character } = get();
    const updated = {
      ...character,
      health: Math.min(character.maxHealth, character.health + amount),
    };
    set({ character: updated });
    saveCharacter(updated);
  },

  reduceHealth: (amount: number) => {
    const { character } = get();
    const updated = {
      ...character,
      health: Math.max(0, character.health - amount),
    };
    set({ character: updated });
    saveCharacter(updated);
  },

  restoreEnergy: (amount: number) => {
    const { character } = get();
    const updated = {
      ...character,
      energy: Math.min(character.maxEnergy, character.energy + amount),
    };
    set({ character: updated });
    saveCharacter(updated);
  },

  reduceEnergy: (amount: number) => {
    const { character } = get();
    const updated = {
      ...character,
      energy: Math.max(0, character.energy - amount),
    };
    set({ character: updated });
    saveCharacter(updated);
  },

  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  toggleMusic: () => set((state) => ({ musicEnabled: !state.musicEnabled })),
  toggleEffects: () => set((state) => ({ effectsEnabled: !state.effectsEnabled })),
  toggleReducedMotion: () => set((state) => ({ reducedMotion: !state.reducedMotion })),
  setWarping: (isWarping: boolean) => set({ isWarping }),
}));
