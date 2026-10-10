export interface SkinData {
  id: string;
  name: string;
  category: 'OUTFIT' | 'AURA' | 'ACCESSORY';
  description: string;
  modelPath?: string;
  themeColor: string;
  accentColor: string;
  requiredLevel: number;
  unlocked: boolean;
  previewIcon: string;
}

export interface AuraData {
  id: string;
  name: string;
  description: string;
  color: string;
  secondaryColor: string;
  particleCount: number;
  pulseSpeed: number;
  requiredLevel: number;
  unlocked: boolean;
}

export const CHARACTER_SKINS: SkinData[] = [
  {
    id: 'default',
    name: 'Vanguard Cyber Suit',
    category: 'OUTFIT',
    description: 'Standard-issue multidimensional pilot uniform with reinforced cyber-mesh and neural link collar.',
    themeColor: '#FFE500',
    accentColor: '#00F0FF',
    requiredLevel: 1,
    unlocked: true,
    previewIcon: 'Shield',
  },
  {
    id: 'cyber_commander',
    name: 'Neon Commander Exosuit',
    category: 'OUTFIT',
    description: 'Heavy tactical exosuit with high-frequency neon energy conduits and hardened carbon plating.',
    themeColor: '#00F0FF',
    accentColor: '#A855F7',
    requiredLevel: 5,
    unlocked: true,
    previewIcon: 'Zap',
  },
  {
    id: 'solar_champion',
    name: 'Solar Arena Gold Plate',
    category: 'OUTFIT',
    description: 'Radiant gold ceremonial armor bestowed upon elite commanders of the Challenge Dimension.',
    themeColor: '#F59E0B',
    accentColor: '#10B981',
    requiredLevel: 10,
    unlocked: true,
    previewIcon: 'Award',
  },
  {
    id: 'void_specter',
    name: 'Void Singularity Cloak',
    category: 'OUTFIT',
    description: 'Stealth nano-weave woven from dark matter fragments. Emits low-visibility temporal fog.',
    themeColor: '#818CF8',
    accentColor: '#4F46E5',
    requiredLevel: 20,
    unlocked: false,
    previewIcon: 'Lock',
  },
];

export const CHARACTER_AURAS: AuraData[] = [
  {
    id: 'energy',
    name: 'Ion Pulse Aura',
    description: 'Radiating golden-cyan ion particles that pulse with character vital energy.',
    color: '#FFE500',
    secondaryColor: '#00F0FF',
    particleCount: 24,
    pulseSpeed: 1.5,
    requiredLevel: 1,
    unlocked: true,
  },
  {
    id: 'cyber',
    name: 'Neon Matrix Grid',
    description: 'Concentric geometric cyber rings and scanning data particles.',
    color: '#00F0FF',
    secondaryColor: '#A855F7',
    particleCount: 32,
    pulseSpeed: 2.0,
    requiredLevel: 6,
    unlocked: true,
  },
  {
    id: 'fire',
    name: 'Solar Flare Blaze',
    description: 'Energetic thermal vortex of ascending ember sparks.',
    color: '#EF4444',
    secondaryColor: '#F59E0B',
    particleCount: 36,
    pulseSpeed: 2.5,
    requiredLevel: 12,
    unlocked: true,
  },
  {
    id: 'plasma',
    name: 'Quantum Warp Violet',
    description: 'Violet-indigo spatial distortion particles that react to movement.',
    color: '#A855F7',
    secondaryColor: '#EC4899',
    particleCount: 40,
    pulseSpeed: 3.0,
    requiredLevel: 18,
    unlocked: false,
  },
  {
    id: 'none',
    name: 'Stealth / No Aura',
    description: 'Mute visual aura for low-profile reconnaissance.',
    color: '#64748b',
    secondaryColor: '#334155',
    particleCount: 0,
    pulseSpeed: 0,
    requiredLevel: 1,
    unlocked: true,
  },
];

export const characterConfig = {
  modelPath: '/characters/hb_pilot.png',
  avatarImage: '/images/hb_pilot.png',
  interactionDistance: 2.8,
  walkSpeed: 6.0,
  runSpeed: 10.5,
  hubRadiusLimit: 14.0,
};
