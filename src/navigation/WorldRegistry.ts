import { WorldData } from '../types';
import { WORLDS_DATA } from '../data/worlds';

export interface WorldRegistryItem extends WorldData {
  route: string;
  tagline: string;
  spawnPoint: [number, number, number];
  skyColor: string;
  fogDensity: number;
  portalInteractionDistance: number;
  loadingMessages: string[];
}

export const WORLD_REGISTRY: Record<string, WorldRegistryItem> = {
  arcade: {
    ...WORLDS_DATA.find((w) => w.id === 'arcade')!,
    route: '/worlds/arcade',
    tagline: 'PLAY • COMPETE • WIN',
    spawnPoint: [0, 0, 0],
    skyColor: '#030712',
    fogDensity: 0.02,
    portalInteractionDistance: 3.5,
    loadingMessages: [
      'Synchronizing 3D Retro Cyber Grids...',
      'Calibrating Quantum Arcade Engines...',
      'Loading Mini-Game Modules & Leaderboards...',
      'Entering Arcade Dimension...',
    ],
  },
  cinema: {
    ...WORLDS_DATA.find((w) => w.id === 'cinema')!,
    route: '/worlds/cinema',
    tagline: 'ENTER THE STORY',
    spawnPoint: [0, 0, 0],
    skyColor: '#0a0505',
    fogDensity: 0.025,
    portalInteractionDistance: 3.5,
    loadingMessages: [
      'Opening Dimensional Screening Rooms...',
      'Buffering 4K Cinematic Streams...',
      'Projecting Holographic Theater Gateways...',
      'Entering Cinema Dimension...',
    ],
  },
  music: {
    ...WORLDS_DATA.find((w) => w.id === 'music')!,
    route: '/worlds/music',
    tagline: 'FEEL THE SOUND',
    spawnPoint: [0, 0, 0],
    skyColor: '#0d0517',
    fogDensity: 0.02,
    portalInteractionDistance: 3.5,
    loadingMessages: [
      'Tuning Synthwave Frequencies...',
      'Synthesizing Web Audio Equalizer...',
      'Energizing Spatial Resonance Stage...',
      'Entering Music Dimension...',
    ],
  },
  ai: {
    ...WORLDS_DATA.find((w) => w.id === 'ai')!,
    route: '/worlds/ai',
    tagline: 'INTERACT • CREATE • DISCOVER',
    spawnPoint: [0, 0, 0],
    skyColor: '#030a17',
    fogDensity: 0.02,
    portalInteractionDistance: 3.5,
    loadingMessages: [
      'Connecting to Neural Companion Core...',
      'Loading Matrix Context Vectors...',
      'Booting Holographic AI Labs...',
      'Entering AI Dimension...',
    ],
  },
  challenge: {
    ...WORLDS_DATA.find((w) => w.id === 'challenge')!,
    route: '/worlds/challenge',
    tagline: 'PROVE YOURSELF',
    spawnPoint: [0, 0, 0],
    skyColor: '#02120d',
    fogDensity: 0.02,
    portalInteractionDistance: 3.5,
    loadingMessages: [
      'Initializing Galactic Arena Ring...',
      'Fetching Seasonal Bounty Contracts...',
      'Calibrating Reflex Trial Spires...',
      'Entering Challenge Dimension...',
    ],
  },
  mystery: {
    ...WORLDS_DATA.find((w) => w.id === 'mystery')!,
    route: '/worlds/mystery',
    tagline: 'NOT EVERYTHING SHOULD BE DISCOVERED',
    spawnPoint: [0, 0, 0],
    skyColor: '#020208',
    fogDensity: 0.06,
    portalInteractionDistance: 4.0,
    loadingMessages: [
      'Detecting Gravitational Anomaly...',
      'Verifying Level 20 Clearance...',
      'Piercing Event Horizon Shroud...',
      'Entering Mystery Dimension...',
    ],
  },
};

export function getWorldRegistryItem(id: string): WorldRegistryItem | undefined {
  return WORLD_REGISTRY[id];
}
