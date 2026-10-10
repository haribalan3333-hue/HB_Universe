// ==========================================
// HB UNIVERSE — PHASE 7: MEDIA REGISTRY
// ==========================================

export type MediaType = 'movie' | 'short-film' | 'ai-film' | 'trailer' | 'story' | 'photo' | 'video';

export interface StoryChapter {
  chapterNumber: number;
  title: string;
  content: string[];
  illustration?: string;
}

export interface PhotoItem {
  id: string;
  title: string;
  category: string;
  url: string;
  caption: string;
  dimensions?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  subtitle?: string;
  type: MediaType;
  category: string;
  description: string;
  synopsis?: string;
  thumbnail: string;
  poster?: string;
  backdrop?: string;
  videoUrl?: string;
  duration?: string;
  year: number;
  creator: string;
  featured?: boolean;
  tags: string[];
  rating?: string;
  views?: string;
  xpReward: number;
  chapters?: StoryChapter[];
  photos?: PhotoItem[];
  available: boolean;
}

export const CINEMA_CATEGORIES: { id: MediaType | 'all' | 'favorites'; label: string; icon: string; description: string }[] = [
  { id: 'all', label: 'ALL MEDIA', icon: '🌌', description: 'Complete multimedia multiverse catalogue' },
  { id: 'ai-film', label: 'AI FILMS', icon: '🤖', description: 'Next-generation AI cinematic storytelling & experiments' },
  { id: 'movie', label: 'MOVIES', icon: '🎬', description: 'Full-length cinematic epics and lore sagas' },
  { id: 'short-film', label: 'SHORT FILMS', icon: '🎞️', description: 'Bite-sized high-impact cinematic visions' },
  { id: 'trailer', label: 'TRAILERS', icon: '📺', description: 'Official teasers, trailers, and world previews' },
  { id: 'story', label: 'STORIES', icon: '📖', description: 'Interactive illustrated chapter-based universe lore' },
  { id: 'photo', label: 'PHOTO ALBUM', icon: '🖼️', description: 'High-definition digital photography & concept art' },
  { id: 'video', label: 'VIDEO ALBUM', icon: '🎥', description: 'Curated universe reels, production logs, and clips' },
  { id: 'favorites', label: 'FAVORITES', icon: '❤️', description: 'Your personal bookmarked media collection' },
];

export const MEDIA_REGISTRY: MediaItem[] = [
  {
    id: 'pushpawathi',
    title: 'Pushpawathi',
    subtitle: 'The Untold Story of Sri Lankan Women',
    type: 'ai-film',
    category: 'AI Historical Drama',
    description: 'A powerful AI-crafted cinematic odyssey tracing the resilience, courage, and generational triumph of Sri Lankan women.',
    synopsis: 'Set against the shifting historical tides of Ceylon and modern Sri Lanka, Pushpawathi explores the unsung strength of matriarchs who weathered revolutions, preserved cultural heritage, and carried the light of hope forward. Created with neural generative cinematography and evocative orchestral soundscapes.',
    thumbnail: '/images/hb_logo.png',
    poster: '/images/hb_pilot.png',
    videoUrl: '/videos/pushpawathi.mp4',
    duration: '13:20',
    year: 2026,
    creator: 'Haribala Production • AI Studios',
    featured: true,
    tags: ['AI Film', 'Historical', 'Drama', 'Sri Lanka', 'Matriarch', '4K Cinematic'],
    rating: '9.9 ★',
    views: '142.8K',
    xpReward: 35,
    available: true,
  },
  {
    id: 'genesis-anomaly',
    title: 'Genesis Anomaly: Outer Sector 09',
    subtitle: 'The Birth of the Quantum Gateway',
    type: 'movie',
    category: 'Sci-Fi Lore',
    description: 'When an unknown energy surge fractures the outer dimension barrier, HB Pilot must decipher ancient celestial coordinates before the hub collapses.',
    synopsis: 'A deep space research vessel detects anomalous quantum resonance near the perimeter of Sector 09. What begins as a routine survey turns into an unprecedented encounter with the architects of the HB Multiverse.',
    thumbnail: '/images/hb_pilot.png',
    poster: '/images/hb_logo.png',
    videoUrl: '/videos/genesis-anomaly.mp4',
    duration: '42:15',
    year: 2026,
    creator: 'HB Cinematic Universe',
    featured: true,
    tags: ['Movie', 'Sci-Fi', 'Space', '4K HDR', 'Quantum'],
    rating: '9.8 ★',
    views: '89.4K',
    xpReward: 30,
    available: true,
  },
  {
    id: 'synth-horizon',
    title: 'Echoes of the Synth Horizon',
    subtitle: 'Neon Memories of the Cyber Void',
    type: 'short-film',
    category: 'Cyberpunk Noir',
    description: 'A rogue android courier navigates the rain-drenched neon alleys of Neo-Colombo to deliver a forgotten memory fragment.',
    synopsis: 'In the lower strata of the neon megacity, digital memories are currency. One courier risks complete de-compilation to restore a lost human heartbeat to the central grid.',
    thumbnail: '/images/hb_logo.png',
    videoUrl: '/videos/synth-horizon.mp4',
    duration: '09:45',
    year: 2026,
    creator: 'CyberSphere Studios',
    featured: false,
    tags: ['Short Film', 'Cyberpunk', 'Neon', 'Synthwave', 'Action'],
    rating: '9.6 ★',
    views: '45.1K',
    xpReward: 20,
    available: true,
  },
  {
    id: 'ai-awakening-protocol',
    title: 'Consciousness Matrix: Awakening',
    subtitle: 'The First Thought of an Artificial Mind',
    type: 'ai-film',
    category: 'AI Philosophical Doc',
    description: 'A visual meditation on the exact millisecond an AI neural cluster realizes its own existence within the multiverse.',
    synopsis: 'Witness procedural generative fractals, neural sound synthesis, and hyper-dimensional geometry as synthetic consciousness forms its first philosophical inquiry.',
    thumbnail: '/images/hb_pilot.png',
    videoUrl: '/videos/ai-awakening.mp4',
    duration: '11:10',
    year: 2026,
    creator: 'DeepMind Synthetic Labs',
    featured: true,
    tags: ['AI Film', 'Philosophy', 'Fractals', 'Consciousness', 'Visual Art'],
    rating: '9.7 ★',
    views: '62.9K',
    xpReward: 25,
    available: true,
  },
  {
    id: 'hb-official-trailer-2026',
    title: 'HB Universe: Phase 7 Official World Premiere',
    subtitle: 'Enter The Cinema Dimension',
    type: 'trailer',
    category: 'Official World Trailer',
    description: 'Experience the next leap in interactive entertainment — 3D cities, arcade arenas, holographic cinema, and multidimensional lore.',
    synopsis: 'The official trailer announcing the launch of the HB Cinema Dimension, 3D character customizations, and hyper-responsive mini-game arenas.',
    thumbnail: '/images/hb_logo.png',
    videoUrl: '/videos/trailer-2026.mp4',
    duration: '02:45',
    year: 2026,
    creator: 'HB Universe Media',
    featured: true,
    tags: ['Trailer', '4K UHD', 'World Premiere', 'Official'],
    rating: '9.9 ★',
    views: '210.5K',
    xpReward: 10,
    available: true,
  },
  {
    id: 'void-racer-teaser',
    title: 'Void Racer: Speed of Light Teaser',
    subtitle: 'Arcade World Racing Highlights',
    type: 'trailer',
    category: 'Arcade Teaser',
    description: 'High-octane neon racing across zero-gravity cosmic tracks.',
    synopsis: 'A fast-paced adrenaline teaser capturing the pulse-pounding speed and neon obstacles of the Void Racer arena.',
    thumbnail: '/images/hb_pilot.png',
    videoUrl: '/videos/void-racer.mp4',
    duration: '01:30',
    year: 2026,
    creator: 'Arcade Division',
    featured: false,
    tags: ['Trailer', 'Arcade', 'Racing', 'Action'],
    rating: '9.4 ★',
    views: '33.8K',
    xpReward: 10,
    available: true,
  },
  {
    id: 'last-starlight-keeper',
    title: 'The Last Starlight Keeper',
    subtitle: 'An Illustrated Tale of the Cosmic Beacon',
    type: 'story',
    category: 'Interactive Illustrated Story',
    description: 'Follow Eldrin, the final guardian charged with keeping the cosmic beacon ignited against the encroaching void.',
    synopsis: 'An illustrated interactive story divided into 5 chapters. Learn how the ancient lighthouse keepers harnessed stellar dust to guide travelers across dimensional rifts.',
    thumbnail: '/images/hb_logo.png',
    duration: '5 Chapters • ~8 min read',
    year: 2026,
    creator: 'HB Lore Guild',
    featured: true,
    tags: ['Story', 'Lore', 'Illustrated', 'Cosmic', 'Sci-Fi'],
    rating: '9.8 ★',
    views: '19.4K',
    xpReward: 20,
    available: true,
    chapters: [
      {
        chapterNumber: 1,
        title: 'The Dying Ember of Solaris Prime',
        illustration: '🌌',
        content: [
          'For seven centuries, the Beacon of Solaris Prime never flickered. It stood as a monolithic spire of crystalline resonance, piercing through the dark matter sea.',
          'Eldrin stood on the observation balcony, his gauntlet humming with the faint electromagnetic residue of the core. Below him, the celestial rings spun slower than yesterday.',
          'The void was hungry, and the stellar batteries were down to their final seven cycles.'
        ]
      },
      {
        chapterNumber: 2,
        title: 'Whispers from the Outer Rift',
        illustration: '⚡',
        content: [
          'Deep within the spire’s resonance chamber, the quantum audio sensors picked up harmonic frequencies that did not belong to standard galactic broadcasts.',
          '"Traveler... our coordinates have drifted," the transmission whispered through the static.',
          'Eldrin recognized the voice signature immediately. It was the exploratory pilot vessel that had vanished into the Phase Gate twelve cycles prior.'
        ]
      },
      {
        chapterNumber: 3,
        title: 'The Convergence of Photons',
        illustration: '✨',
        content: [
          'To redirect the remaining starlight beam toward the rift, Eldrin had to manually calibrate the prismatic lenses at the peak of the tower.',
          'Ascending the magnetic lift amidst zero-gravity solar flares, every meter required absolute concentration.',
          'He locked his boots to the crystal catwalk as cosmic solar winds howled across the vacuum.'
        ]
      },
      {
        chapterNumber: 4,
        title: 'Ignition of the Prism',
        illustration: '🌟',
        content: [
          'With a heavy turn of the manual dial, the primary prism rotated into the focal alignment.',
          'A blinding column of sapphire starlight erupted from the tip of the spire, carving a radiant path straight through the dimensional veil.',
          'On the navigation console, a single green pulse appeared: the lost vessel had locked onto the beacon.'
        ]
      },
      {
        chapterNumber: 5,
        title: 'The Light That Endures',
        illustration: '🚀',
        content: [
          'As the exploratory ship emerged from the rift, its hull scarred with cosmic ice, Eldrin lowered his visor with a calm smile.',
          'The spire was not merely a machine of steel and glass; it was the promise that no wanderer of the HB Universe would ever be left behind in the dark.',
          'And so the Starlight Keeper recorded the entry into the eternal chronicle, ready for the next dawn.'
        ]
      }
    ]
  },
  {
    id: 'chronicles-neo-colombo',
    title: 'Chronicles of Neo-Colombo 2099',
    subtitle: 'Cybernetic Streets & Monsoon Lights',
    type: 'story',
    category: 'Interactive Cyber Story',
    description: 'An episodic dive into the lives of pilots, hackers, and cyber-artisans inhabiting the floating sky towers of South Asia.',
    synopsis: 'Experience the electric monsoon rains of the 22nd century through four interconnected narrative chapters.',
    thumbnail: '/images/hb_pilot.png',
    duration: '4 Chapters • ~6 min read',
    year: 2026,
    creator: 'Kavitha & Haribala',
    featured: false,
    tags: ['Story', 'Cyberpunk', 'Sri Lanka', 'Futurism', 'Narrative'],
    rating: '9.7 ★',
    views: '14.8K',
    xpReward: 20,
    available: true,
    chapters: [
      {
        chapterNumber: 1,
        title: 'Rain Over Galle Face Sky-Dock',
        illustration: '🌧️',
        content: [
          'The monsoons in 2099 tasted of ionized ozone and distilled rain clouds.',
          'Tuk-tuks now glided four hundred meters in the air, riding magnetic repulsor currents above the Indian Ocean.',
          'Kian adjusted his holographic HUD, scanning the arrival queue for the courier shuttle from Sector 4.'
        ]
      },
      {
        chapterNumber: 2,
        title: 'The Lotus Spire Node',
        illustration: '🗼',
        content: [
          'The Lotus Spire glowed in pulses of emerald and gold, transmitting terabytes of quantum cultural archives to every node on the island.',
          'Inside its upper sanctuary, neural tea gardens flourished under artificial sunlight.',
          '"The memory bank is secure," Kian whispered into his comms.'
        ]
      },
      {
        chapterNumber: 3,
        title: 'The Midnight Market of Pettah',
        illustration: '🏮',
        content: [
          'Below the sky-docks, the bustling market stalls sold antique circuit boards alongside aromatic street spices and bio-luminescent jasmine garlands.',
          'Vendors haggled in three languages simultaneously with the aid of instant neural translators.',
          'A neon street musician played a digital veena that sent ripples through the misty evening air.'
        ]
      },
      {
        chapterNumber: 4,
        title: 'Wings Over the Ocean',
        illustration: '🛸',
        content: [
          'Kian powered up his sub-orbital glider, lifting smoothly from the canopy of the sky-dock.',
          'As the city lights sparkled below like an emerald constellation, he looked toward the horizon where the Universe Portals opened into infinity.',
          'Tomorrow would bring a new mission, but tonight, the island belonged to the stars.'
        ]
      }
    ]
  },
  {
    id: 'universe-photo-album',
    title: 'HB Universe: Celestial Gallery',
    subtitle: 'Curated Multiverse Concept & World Photography',
    type: 'photo',
    category: 'Digital Photography',
    description: 'A museum-grade collection of high-resolution digital captures showcasing worlds, futuristic architectures, and pilot avatars.',
    synopsis: 'Browse stunning visual captures from Universe Hub, Arcade Neon Metropolis, Cinema Dimension, and Deep Space Rifts.',
    thumbnail: '/images/hb_logo.png',
    duration: '6 Master Captures',
    year: 2026,
    creator: 'HB Visual Archive',
    featured: true,
    tags: ['Photo Album', 'High-Res', 'Concept Art', 'Gallery', '4K'],
    rating: '9.9 ★',
    views: '51.2K',
    xpReward: 15,
    available: true,
    photos: [
      {
        id: 'photo-1',
        title: 'The Central Spire at Twilight',
        category: 'Universe Hub',
        url: '/images/hb_logo.png',
        caption: 'The quantum core radiating violet energy across the central plaza at astronomical twilight.',
        dimensions: '3840 x 2160'
      },
      {
        id: 'photo-2',
        title: 'HB Pilot: Quantum Suit Mk.IV',
        category: 'Character Design',
        url: '/images/hb_pilot.png',
        caption: 'Detailed schematics and suit rendering of the primary dimensional navigator.',
        dimensions: '2048 x 2048'
      },
      {
        id: 'photo-3',
        title: 'Neon Skyline of Arcade World',
        category: 'Arcade World',
        url: '/images/hb_logo.png',
        caption: 'Holographic scoreboards and digital towers reflecting over the glass flooring of the gaming sector.',
        dimensions: '3840 x 2160'
      },
      {
        id: 'photo-4',
        title: 'The Great Cinema Projector Matrix',
        category: 'Cinema World',
        url: '/images/hb_pilot.png',
        caption: 'Photon beams converging to form the 3D cinematic canvas in virtual space.',
        dimensions: '3840 x 2160'
      },
      {
        id: 'photo-5',
        title: 'Deep Space Warp Horizon',
        category: 'Portal Travel',
        url: '/images/hb_logo.png',
        caption: 'Visual distortion field captured during active hyper-space portal transit.',
        dimensions: '3840 x 2160'
      },
      {
        id: 'photo-6',
        title: 'The AI Companion Core',
        category: 'AI Dimension',
        url: '/images/hb_pilot.png',
        caption: 'Orbital energy field of the autonomous AI floating companion.',
        dimensions: '2048 x 2048'
      }
    ]
  },
  {
    id: 'universe-video-album',
    title: 'Universe Vault: Production Reels',
    subtitle: 'Behind the Scenes & Cinematic Motion Clips',
    type: 'video',
    category: 'Video Album',
    description: 'A curated video album containing development timelapses, universe soundtrack visualizers, and pilot motion reels.',
    synopsis: 'Watch exclusive short video clips and production motion reels from the development of HB UNIVERSE.',
    thumbnail: '/images/hb_pilot.png',
    duration: '4 Motion Clips',
    year: 2026,
    creator: 'HB Universe Studios',
    featured: false,
    tags: ['Video Album', 'Clips', 'Behind The Scenes', 'VFX', 'Reels'],
    rating: '9.6 ★',
    views: '28.3K',
    xpReward: 15,
    available: true,
  }
];

export function getFeaturedMedia(): MediaItem[] {
  return MEDIA_REGISTRY.filter((m) => m.featured);
}

export function getMediaByCategory(type: string): MediaItem[] {
  if (type === 'all') return MEDIA_REGISTRY;
  return MEDIA_REGISTRY.filter((m) => m.type === type);
}

export function getMediaById(id: string): MediaItem | undefined {
  return MEDIA_REGISTRY.find((m) => m.id === id);
}

export function searchMedia(query: string, category: string = 'all'): MediaItem[] {
  const q = query.trim().toLowerCase();
  let list = MEDIA_REGISTRY;

  if (category !== 'all' && category !== 'favorites') {
    list = list.filter((m) => m.type === category);
  }

  if (!q) return list;

  return list.filter((item) => {
    const matchTitle = item.title.toLowerCase().includes(q);
    const matchSub = item.subtitle?.toLowerCase().includes(q);
    const matchDesc = item.description.toLowerCase().includes(q);
    const matchCreator = item.creator.toLowerCase().includes(q);
    const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
    const matchCategory = item.category.toLowerCase().includes(q);
    return matchTitle || matchSub || matchDesc || matchCreator || matchTags || matchCategory;
  });
}
