// ==========================================
// HB UNIVERSE — CHALLENGE REGISTRY DATA
// ==========================================

export type ChallengeCategory = 'QUIZ' | 'PUZZLE' | 'REACTION' | 'CODING' | 'ENGINEERING';
export type ChallengeDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'ELITE';

export interface ChallengeQuestion {
  id: number;
  prompt: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint?: string;
}

export interface ChallengeItem {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  timeLimitSeconds: number;
  xpReward: number;
  coinReward: number;
  icon: string;
  color: string;
  unlockedAtLevel: number;
  questions: ChallengeQuestion[];
}

export const CHALLENGE_REGISTRY: ChallengeItem[] = [
  // 1. QUIZ ARENA
  {
    id: 'quiz-ai-foundations',
    title: 'AI & Machine Learning Matrix',
    description: 'Test your understanding of deep learning, neural networks, and computer vision architectures.',
    category: 'QUIZ',
    difficulty: 'MEDIUM',
    timeLimitSeconds: 60,
    xpReward: 60,
    coinReward: 40,
    icon: 'Brain',
    color: '#00F0FF',
    unlockedAtLevel: 1,
    questions: [
      {
        id: 1,
        prompt: 'In Convolutional Neural Networks (CNN), what is the main purpose of Max Pooling?',
        options: [
          'Reduce spatial dimensions while retaining critical features',
          'Increase the learning rate',
          'Generate voice commands',
          'Reset model weights to zero',
        ],
        correctIndex: 0,
        explanation: 'Max Pooling downsamples feature maps by taking the maximum value in each sub-region, reducing computational complexity.',
        hint: 'Think about downsampling spatial dimensions.',
      },
      {
        id: 2,
        prompt: 'Which loss function is standard for multi-class classification tasks?',
        options: ['Categorical Cross-Entropy', 'Mean Squared Error', 'Binary Cross-Entropy', 'Hinge Loss'],
        correctIndex: 0,
        explanation: 'Categorical Cross-Entropy evaluates softmax probability distributions across multiple mutually exclusive classes.',
      },
      {
        id: 3,
        prompt: 'What was the clinical prediction goal of Haribalan’s Diabetes Prediction ML project?',
        options: [
          'Early-stage risk prediction using patient clinical biomarkers',
          'Autonomous surgery simulation',
          'Hospital floor scheduling',
          'Dietary recipe generation',
        ],
        correctIndex: 0,
        explanation: 'Diabetes Prediction ML utilizes ensemble models on clinical indicators to assess early onset risk.',
      },
    ],
  },
  {
    id: 'quiz-multiverse-lore',
    title: 'HB Universe Lore & Dimensions',
    description: 'Verify your pilot mastery over the 6 dimension sectors and historical productions.',
    category: 'QUIZ',
    difficulty: 'EASY',
    timeLimitSeconds: 45,
    xpReward: 40,
    coinReward: 25,
    icon: 'Globe',
    color: '#FFE500',
    unlockedAtLevel: 1,
    questions: [
      {
        id: 1,
        prompt: 'What is the title of the featured 4K AI historical drama in Cinema World?',
        options: ['Pushpawathi', 'Genesis Anomaly', 'Echoes of Solaris', 'Vortex 2099'],
        correctIndex: 0,
        explanation: 'Pushpawathi: The Untold Story of Sri Lankan Women is the flagship AI historical drama.',
      },
      {
        id: 2,
        prompt: 'At what player level does the Mystery World portal unlock?',
        options: ['Level 20', 'Level 10', 'Level 5', 'Level 50'],
        correctIndex: 0,
        explanation: 'Level 20 is the threshold required to activate the Mystery Void gateway.',
      },
      {
        id: 3,
        prompt: 'How many playable mini-games are in Arcade World?',
        options: ['6 Games', '4 Games', '8 Games', '3 Games'],
        correctIndex: 0,
        explanation: 'Arcade World contains XO, Snake, Racing, Runner, Memory, and Reaction Trials.',
      },
    ],
  },

  // 2. CODING ARENA
  {
    id: 'coding-python-logic',
    title: 'Python Syntax & Algorithm Debug',
    description: 'Predict code outputs, identify syntax errors, and analyze algorithmic time complexity.',
    category: 'CODING',
    difficulty: 'MEDIUM',
    timeLimitSeconds: 60,
    xpReward: 75,
    coinReward: 50,
    icon: 'Code2',
    color: '#10B981',
    unlockedAtLevel: 5,
    questions: [
      {
        id: 1,
        prompt: 'What is the output of the following Python list comprehension?',
        codeSnippet: 'nums = [1, 2, 3, 4, 5]\nres = [x * 2 for x in nums if x % 2 != 0]\nprint(res)',
        options: ['[2, 6, 10]', '[4, 8]', '[2, 4, 6, 8, 10]', '[1, 3, 5]'],
        correctIndex: 0,
        explanation: 'The filter selects odd numbers (1, 3, 5) and multiplies each by 2, producing [2, 6, 10].',
        hint: 'Check the modulo condition first.',
      },
      {
        id: 2,
        prompt: 'What is the average time complexity of looking up a key in a Python dictionary (hash map)?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
        correctIndex: 0,
        explanation: 'Python dictionaries utilize hash tables, providing average O(1) constant-time key lookups.',
      },
      {
        id: 3,
        prompt: 'Which keyword in Python is used to create a generator function?',
        options: ['yield', 'return', 'async', 'lambda'],
        correctIndex: 0,
        explanation: 'The yield keyword pauses function execution and returns an iterable generator value.',
      },
    ],
  },

  // 3. ENGINEERING ARENA (Mechanical & Robotics)
  {
    id: 'eng-mechanics-robotics',
    title: 'Mechanical Systems & Robotics Design',
    description: 'Demonstrate expertise in gears, kinematics, robotics sensors, and automation actuators.',
    category: 'ENGINEERING',
    difficulty: 'HARD',
    timeLimitSeconds: 60,
    xpReward: 90,
    coinReward: 60,
    icon: 'Wrench',
    color: '#FF2A55',
    unlockedAtLevel: 8,
    questions: [
      {
        id: 1,
        prompt: 'Which mechanical component is used to transmit rotary motion between two non-parallel, intersecting shafts?',
        options: ['Bevel Gear', 'Spur Gear', 'Helical Gear', 'Leaf Spring'],
        correctIndex: 0,
        explanation: 'Bevel gears feature conical tooth surfaces designed to transmit motion between intersecting shafts (usually at 90 degrees).',
        hint: 'Conical gear profile.',
      },
      {
        id: 2,
        prompt: 'In Haribalan’s Voice Control Mini Forklift, what actuator mechanism converts rotational motor torque into linear vertical lift?',
        options: ['Lead Screw / Rack & Pinion', 'Centrifugal Clutch', 'Flywheel', 'Pneumatic Diaphragm'],
        correctIndex: 0,
        explanation: 'Lead screws or rack-and-pinion mechanisms transform rotational servo torque into precise vertical lifting motion.',
      },
      {
        id: 3,
        prompt: 'What is the primary function of an H-Bridge circuit in mobile robotics?',
        options: [
          'Allow DC motors to run in both forward and reverse directions',
          'Measure acoustic speech decibels',
          'Filter AC current into DC',
          'Amplify radio signals',
        ],
        correctIndex: 0,
        explanation: 'An H-Bridge allows voltage polarity across a DC motor to be flipped, enabling forward/reverse motor control.',
      },
    ],
  },

  // 4. PUZZLE ARENA
  {
    id: 'puzzle-pattern-matrix',
    title: 'Quantum Sequence & Logic Patterns',
    description: 'Solve sequence deductions and numerical matrix puzzles under countdown pressure.',
    category: 'PUZZLE',
    difficulty: 'MEDIUM',
    timeLimitSeconds: 50,
    xpReward: 65,
    coinReward: 45,
    icon: 'Sparkles',
    color: '#A855F7',
    unlockedAtLevel: 3,
    questions: [
      {
        id: 1,
        prompt: 'Identify the next number in the quantum sequence: 2, 6, 12, 20, 30, ?',
        options: ['42', '38', '40', '46'],
        correctIndex: 0,
        explanation: 'The difference increases by 2 each step (+4, +6, +8, +10, +12). 30 + 12 = 42 (or n * (n + 1)).',
        hint: 'Look at the difference between consecutive numbers.',
      },
      {
        id: 2,
        prompt: 'If ALL VANGUARDS are PILOTS, and SOME PILOTS are EXPLORERS, which statement MUST be true?',
        options: [
          'Some pilots are vanguards',
          'All explorers are vanguards',
          'No pilots are vanguards',
          'All pilots are explorers',
        ],
        correctIndex: 0,
        explanation: 'Since all vanguards belong to the set of pilots, those pilots are vanguards.',
      },
    ],
  },

  // 5. REACTION ARENA
  {
    id: 'reaction-speed-trial',
    title: 'Sub-Millisecond Reflex Arena',
    description: 'High-speed cognitive reflex testing. Tap immediately when the signal shifts to hyper-glow.',
    category: 'REACTION',
    difficulty: 'HARD',
    timeLimitSeconds: 30,
    xpReward: 80,
    coinReward: 50,
    icon: 'Zap',
    color: '#EF4444',
    unlockedAtLevel: 1,
    questions: [],
  },
];

export function getChallengeById(id: string): ChallengeItem | undefined {
  return CHALLENGE_REGISTRY.find((c) => c.id === id);
}

export function getChallengesByCategory(cat: ChallengeCategory | 'ALL'): ChallengeItem[] {
  if (cat === 'ALL') return CHALLENGE_REGISTRY;
  return CHALLENGE_REGISTRY.filter((c) => c.category === cat);
}

export function getDailyChallengeForDate(dateStr: string): ChallengeItem {
  // Deterministic hash based on date string e.g. "2026-10-04"
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % CHALLENGE_REGISTRY.length;
  return CHALLENGE_REGISTRY[index];
}
