// ==========================================
// HB UNIVERSE — HARIBALAN S. KNOWLEDGE BASE
// ==========================================

export interface HBProfile {
  name: string;
  title: string;
  education: {
    degree: string;
    institution: string;
    cgpa: string;
    status: string;
  };
  skills: {
    programming: string[];
    aiMl: string[];
    roboticsMechanical: string[];
    webCreative: string[];
  };
  projects: {
    id: string;
    name: string;
    category: string;
    description: string;
    technologies: string[];
    highlight: string;
  }[];
  interests: string[];
  vision: string;
}

export const HB_PROFILE_DATA: HBProfile = {
  name: 'Haribalan S.',
  title: 'AI/ML Engineer • Robotics & Automation Innovator • Creator of HB UNIVERSE',
  education: {
    degree: 'B.E. Mechanical Engineering',
    institution: 'Sri Shakthi Institute of Engineering and Technology',
    cgpa: '8.5 / 10.0',
    status: 'Graduated / Active Specialist',
  },
  skills: {
    programming: ['Python', 'TypeScript', 'JavaScript', 'C++', 'SQL'],
    aiMl: ['Deep Learning', 'CNN Image Classification', 'Scikit-Learn', 'PyTorch', 'TensorFlow', 'LLM Architectures', 'Computer Vision'],
    roboticsMechanical: ['Automation Systems', 'Microcontroller Interfacing', 'CAD/CAM Modeling', 'Voice Control Robotics', 'Embedded Sensors'],
    webCreative: ['React', 'Three.js / React Three Fiber', 'Tailwind CSS', 'Vite', 'Node.js', 'Interactive 3D Environments'],
  },
  projects: [
    {
      id: 'hb-universe',
      name: 'HB UNIVERSE',
      category: 'Interactive 3D Multiverse Platform',
      description: 'A revolutionary 3D virtual entertainment universe featuring world portals, 6 arcade mini-games, a 4K cinema dimension with AI films (Pushpawathi), music visualizers, and an intelligent AI guide system.',
      technologies: ['React', 'Three.js', 'TypeScript', 'Zustand', 'Web Audio API', 'Framer Motion'],
      highlight: 'Built as a cohesive multi-dimensional operating environment with high-octane performance and character avatar integration.',
    },
    {
      id: 'voice-forklift',
      name: 'Voice Control Mini Forklift',
      category: 'Robotics & Industrial Automation',
      description: 'An autonomous voice-guided warehouse mini-forklift designed for contactless materials handling in manufacturing and logistics sectors.',
      technologies: ['Embedded Microcontrollers', 'Voice Recognition Module', 'Motor Drivers', 'Mechanical Actuators'],
      highlight: 'Engineered custom lifting gears and acoustic noise filtering for warehouse ambient noise resilience.',
    },
    {
      id: 'voice-vehicle',
      name: 'Voice Controlled Robotic Vehicle',
      category: 'Autonomous Mobile Robotics',
      description: 'A real-time obstacle-avoiding smart rover that interprets complex navigational voice commands and navigates hazardous terrains.',
      technologies: ['Arduino/ESP32', 'Ultrasonic Sensors', 'Speech Processing', 'H-Bridge Controllers'],
      highlight: 'Achieved sub-200ms acoustic command execution latency with fail-safe collision braking.',
    },
    {
      id: 'cnn-classification',
      name: 'CNN Image Classification',
      category: 'Computer Vision & Deep Learning',
      description: 'Multi-layer Convolutional Neural Network architecture achieving high accuracy benchmarks in complex visual object categorization.',
      technologies: ['Python', 'TensorFlow/Keras', 'Data Augmentation', 'OpenCV'],
      highlight: 'Trained on multi-class datasets with customized dropout and batch normalization layers.',
    },
    {
      id: 'diabetes-prediction',
      name: 'Diabetes Prediction ML',
      category: 'Healthcare Machine Learning',
      description: 'Diagnostic machine learning platform utilizing ensemble models to predict early-stage diabetic risk from clinical health metrics.',
      technologies: ['Python', 'Scikit-Learn', 'Pandas', 'Flask API', 'Statistical Analysis'],
      highlight: 'High precision and recall metrics optimized for preventive healthcare screening.',
    },
  ],
  interests: [
    'Artificial Intelligence & Cognitive Agents',
    'Robotics & Industrial Autonomous Mechatronics',
    'Interactive 3D Metaverse Experiences',
    'Cinematic AI Storytelling & Generative Media',
    'Mechanical Automation & High-Precision Engineering',
  ],
  vision: 'To pioneer the convergence of physical robotics, deep neural AI, and interactive 3D virtual universes into unified human-centric experiences.',
};
