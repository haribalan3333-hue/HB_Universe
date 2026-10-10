import {
  AIMessage,
  AICharacter,
  AICommand,
  GeneratedStory,
  GeneratedIdea,
  QuizData,
  RiddleData,
  JokeData,
  StoryPrompt,
} from './aiTypes';
import { HB_PROFILE_DATA } from '../data/hbKnowledge';

export class DemoAIProvider {
  /**
   * Process natural language chat message and return intelligent response + command
   */
  async processChat(userText: string, character: AICharacter): Promise<AIMessage> {
    const q = userText.trim().toLowerCase();
    let reply = '';
    let command: AICommand | undefined = undefined;

    // 1. Navigation / Action Commands
    if (q.includes('arcade') || q.includes('go to arcade') || q.includes('open arcade') || q.includes('play games')) {
      reply = "Opening Arcade World! You can compete in XO Arena, Snake, Void Racer, Runner, Memory, and Reaction Trials.";
      command = { type: 'NAVIGATE', destination: 'arcade', label: 'ENTER ARCADE WORLD' };
    } else if (q.includes('cinema') || q.includes('watch movie') || q.includes('open cinema') || q.includes('films')) {
      reply = "Accessing Cinema World! The featured AI Historical Film 'Pushpawathi' and 4K lore epics are ready for streaming.";
      command = { type: 'NAVIGATE', destination: 'cinema', label: 'ENTER CINEMA WORLD' };
    } else if (q.includes('music') || q.includes('sound') || q.includes('songs') || q.includes('playlist')) {
      reply = "Switching to Music World! Immerse yourself in cyberpunk synthwave, ambient space lo-fi, and active audio visualizers.";
      command = { type: 'NAVIGATE', destination: 'music', label: 'ENTER MUSIC WORLD' };
    } else if (q.includes('profile') || q.includes('stats') || q.includes('my level') || q.includes('coins')) {
      reply = "Fetching your Universe Navigator profile and statistics.";
      command = { type: 'SHOW_PROFILE', label: 'VIEW PILOT PROFILE' };
    } else if (q.includes('pushpawathi')) {
      reply = "'Pushpawathi: The Untold Story of Sri Lankan Women' is Haribalan's featured AI-crafted historical drama (13:20, 4K). Opening Cinema World for you now!";
      command = { type: 'NAVIGATE', destination: 'cinema', label: 'WATCH PUSHPAWATHI' };
    } else if (q.includes('snake')) {
      reply = "Neon Snake 2099 is online! Preparing your grid run in Arcade World.";
      command = { type: 'NAVIGATE', destination: 'arcade', gameId: 'snake', label: 'PLAY SNAKE' };
    } else if (q.includes('racing') || q.includes('void racer')) {
      reply = "Void Racer 3D is powered up. 3-lane neon highway at 140+ KM/H awaiting your pilot input.";
      command = { type: 'NAVIGATE', destination: 'arcade', gameId: 'racing', label: 'PLAY RACING' };
    } else if (q.includes('runner')) {
      reply = "Cyber Grid Runner is active. Jump over obstacle barriers and collect cosmic credits.";
      command = { type: 'NAVIGATE', destination: 'arcade', gameId: 'runner', label: 'PLAY RUNNER' };
    } else if (q.includes('xo') || q.includes('tic tac toe')) {
      reply = "XO Arena is ready. Minimax algorithm initialized for hard AI mode.";
      command = { type: 'NAVIGATE', destination: 'arcade', gameId: 'xo', label: 'PLAY XO ARENA' };
    }
    // 2. Haribalan S. Portfolio & Knowledge
    else if (q.includes('haribala') || q.includes('who is hb') || q.includes('about hb') || q.includes('creator')) {
      reply = HB_PROFILE_DATA.name + " is a " + HB_PROFILE_DATA.title + ". He holds a " + HB_PROFILE_DATA.education.degree + " from " + HB_PROFILE_DATA.education.institution + " with a " + HB_PROFILE_DATA.education.cgpa + " CGPA. His key projects include the Voice Control Mini Forklift, CNN Image Classification, Diabetes Prediction ML, and this HB UNIVERSE platform!";
    } else if (q.includes('project') || q.includes('portfolio') || q.includes('forklift') || q.includes('cnn')) {
      reply = "Haribalan's landmark engineering projects include:\n1. 🚜 Voice Control Mini Forklift (Autonomous warehouse materials handling)\n2. 🏎️ Voice Controlled Robotic Vehicle (Sub-200ms acoustic command rover)\n3. 🧠 CNN Image Classification (Deep convolutional neural network)\n4. 🏥 Diabetes Prediction ML (Clinical diagnostic platform)\n5. 🌌 HB UNIVERSE (3D Interactive Multiverse).";
    } else if (q.includes('education') || q.includes('college') || q.includes('cgpa') || q.includes('degree')) {
      reply = "Haribalan S. earned his " + HB_PROFILE_DATA.education.degree + " at " + HB_PROFILE_DATA.education.institution + " with an outstanding academic record of " + HB_PROFILE_DATA.education.cgpa + " CGPA.";
    } else if (q.includes('skills') || q.includes('tech stack') || q.includes('python')) {
      reply = "Core Technical Stack:\n• Programming: " + HB_PROFILE_DATA.skills.programming.join(', ') + "\n• AI/ML: " + HB_PROFILE_DATA.skills.aiMl.join(', ') + "\n• Robotics: " + HB_PROFILE_DATA.skills.roboticsMechanical.join(', ') + "\n• Web 3D: " + HB_PROFILE_DATA.skills.webCreative.join(', ');
    }
    // 3. Universe Worlds Lore
    else if (q.includes('world') || q.includes('dimensions') || q.includes('what can i do')) {
      reply = "HB UNIVERSE encompasses 6 multidimensional sectors:\n1. 🌌 Universe Hub (Central 3D space city & avatar plaza)\n2. 🎬 Cinema World (AI films, Pushpawathi, 3D Virtual Theater)\n3. 🕹️ Arcade World (6 playable mini-games with local high scores)\n4. 🤖 AI World (Neural chat, story/idea labs, voice AI)\n5. 🎵 Music World (Cyberpunk synth tracks & spectrum visualizer)\n6. ⚡ Challenge World (Tactical quizzes and dimensional trials).";
    }
    // 4. Character Personality Nuance
    else if (character.id === 'vortex-gamer') {
      reply = "Tip from VORTEX-7: In Snake, hugging the perimeter gives you 40% higher survivability. In Reaction Trials, focus on the center retinal point for sub-200ms taps!";
    } else if (character.id === 'aura-story') {
      reply = "A story is not just code—it is an echo of resilience across time. In Pushpawathi, the strength of generations becomes a lighthouse for the future.";
    } else if (character.id === 'titan-engineer') {
      reply = "Mechanical precision meets neural logic. Whether optimizing PID motor controllers for the robotic forklift or tuning CNN convolutional kernels, efficiency is paramount.";
    } else if (character.id === 'cipher-mystery') {
      reply = "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I? (Ask me for a riddle in the Entertainment Hub!)";
    } else {
      reply = "Understood, Pilot! As " + character.name + ", I am processing your query across the multiverse data grid. You can ask me to navigate to any world, explain Haribalan's robotics and ML projects, generate a story, or test your reflexes in the Arcade!";
    }

    return {
      id: 'msg-' + Date.now(),
      sender: 'ai',
      text: reply,
      timestamp: Date.now(),
      characterId: character.id,
      command,
      confidence: 0.98,
      xpAwarded: 5,
    };
  }

  /**
   * Generate interactive story based on user parameters
   */
  generateStory(prompt: StoryPrompt): GeneratedStory {
    const title = "The Chrono Fracture of " + (prompt.theme || 'Neo-Solaris');
    const summary = "An epic " + prompt.tone.toLowerCase() + " " + prompt.genre.toLowerCase() + " journey featuring " + (prompt.characters || 'HB Pilot and AI Companion') + " traversing the shifting boundaries of time.";

    const chapters = [
      {
        title: 'Chapter 1: The Quantum Resonator',
        content: "The atmospheric sensors over the " + prompt.theme + " sector flared violently. " + (prompt.characters || 'The traveler') + " stood at the edge of the gravity dock, watching violet lightning arc across the horizon. A new dimensional tear had opened.",
      },
      {
        title: 'Chapter 2: The Silent Protocol',
        content: 'Deep inside the ancient neural vault, the algorithms whispered in sync with the pulsar frequency. With every calculated step, the risk of dimensional collapse grew closer. "We must align the phase gates," the comms crackled.',
      },
      {
        title: 'Chapter 3: Dawn Over the Starlight Spire',
        content: 'As the primary energy prism locked into alignment, a blinding sapphire beam pierced the storm clouds. The rift stabilized, securing the legacy of the multiverse for generations to come.',
      },
    ];

    return {
      title,
      summary,
      chapters,
      tags: [prompt.genre, prompt.tone, 'AI Generated', 'Multiverse Lore'],
      xpReward: 15,
    };
  }

  /**
   * Generate innovative tech / project idea
   */
  generateIdea(category: string): GeneratedIdea {
    const ideas: Record<string, GeneratedIdea> = {
      ai: {
        title: 'Autonomous Spatial Perception Drone Matrix',
        type: 'AI & Computer Vision',
        description: 'A fleet of lightweight micro-drones utilizing on-device CNN inference and depth estimation to map hazardous industrial disaster zones in real time.',
        valueProposition: 'Eliminates human entry risk in structural collapses and chemical leaks with sub-second 3D point-cloud generation.',
        technologies: ['Python', 'YOLOv8 / TensorRT', 'ROS 2', 'Edge TPU', 'Spatial Mesh SLAM'],
        difficulty: 'ADVANCED',
      },
      robotics: {
        title: 'Acoustic-Guided Warehouse Automated Guided Cart (AGC)',
        type: 'Robotics & Automation',
        description: 'Industrial material handling robot utilizing dual beamforming microphones to follow verbal picking orders and avoid warehouse obstacles.',
        valueProposition: 'Increases warehouse picking efficiency by 35% without requiring complex centralized optical track installations.',
        technologies: ['Embedded C++', 'STM32 / ESP32', 'Speech Synthesis', 'LiDAR SLAM', 'Brushless DC Drives'],
        difficulty: 'INTERMEDIATE',
      },
      game: {
        title: 'Quantum Phase Shifter: 3D Dimension Runner',
        type: 'Web 3D Gaming',
        description: 'A browser-based high-speed runner where the player switches between 3 parallel dimensional frequencies to solve real-time obstacle physics.',
        valueProposition: 'Zero-install instant-play gaming engine with dynamic Three.js visual shaders and leaderboard sync.',
        technologies: ['Three.js', 'React', 'Web Audio API', 'TypeScript', 'GLSL Shaders'],
        difficulty: 'INTERMEDIATE',
      },
      mechanical: {
        title: 'Variable-Geometry Solar Thermal Stirling Engine',
        type: 'Mechanical Energy Systems',
        description: 'High-efficiency concentrated solar Stirling power generator with automated parabolic mirror tracking and phase-change thermal storage.',
        valueProposition: 'Achieves 28% thermal-to-electric conversion efficiency for off-grid rural power applications.',
        technologies: ['Thermodynamics Simulation', 'CAD SolidWorks', 'PLC Solar Tracking', 'Fluid Dynamics'],
        difficulty: 'ADVANCED',
      },
    };

    return ideas[category.toLowerCase()] || ideas.ai;
  }

  /**
   * Generate interactive quiz
   */
  generateQuiz(topic: string): QuizData {
    return {
      topic: topic || 'HB Multiverse & Artificial Intelligence',
      difficulty: 'INTERMEDIATE',
      xpReward: 20,
      questions: [
        {
          id: 1,
          question: 'What is the primary educational background of Haribalan S., creator of HB Universe?',
          options: [
            'B.E. Mechanical Engineering (Sri Shakthi Inst. of Eng. & Tech)',
            'B.Sc. Astrophysics (Oxford University)',
            'B.Tech Aerospace (MIT)',
            'Diploma in Graphic Design',
          ],
          correctIndex: 0,
          explanation: 'Haribalan S. graduated with B.E. Mechanical Engineering from Sri Shakthi Institute of Engineering and Technology with an 8.5 CGPA.',
        },
        {
          id: 2,
          question: 'Which machine learning project by Haribalan focused on clinical diagnostic risk prediction?',
          options: [
            'Voice Control Mini Forklift',
            'Diabetes Prediction ML',
            'CNN Image Classification',
            'Void Racer',
          ],
          correctIndex: 1,
          explanation: 'Diabetes Prediction ML utilized clinical ensemble models to predict early-stage diabetic risk.',
        },
        {
          id: 3,
          question: 'What algorithm is used in HB Universe XO Arena for the Hard AI mode?',
          options: [
            'Random Guessing',
            'Minimax Decision Algorithm',
            'Bubble Sort',
            'Linear Search',
          ],
          correctIndex: 1,
          explanation: 'The Hard AI in XO Arena utilizes the Minimax decision algorithm to calculate unbeatable optimal moves.',
        },
        {
          id: 4,
          question: 'What is the title of the featured AI historical drama in Cinema World?',
          options: [
            'Genesis Anomaly',
            'Pushpawathi: The Untold Story of Sri Lankan Women',
            'Neon Cyber Void',
            'Solaris Beacon',
          ],
          correctIndex: 1,
          explanation: 'Pushpawathi is the flagship 13:20 4K AI historical drama exploring the strength of Sri Lankan matriarchs.',
        },
        {
          id: 5,
          question: 'In Convolutional Neural Networks (CNN), what is the primary function of a Convolutional Layer?',
          options: [
            'Extract visual feature maps such as edges, textures, and shapes',
            'Convert audio to text',
            'Store user passwords',
            'Render 3D polygons',
          ],
          correctIndex: 0,
          explanation: 'Convolutional layers apply filter kernels across input images to extract spatial feature maps.',
        },
      ],
    };
  }

  /**
   * Generate interactive riddle
   */
  generateRiddle(): RiddleData {
    const riddles: RiddleData[] = [
      {
        id: 'riddle-1',
        riddle: 'I have no voice, yet I speak to thousand worlds. I have no eyes, yet I show you distant stars. What am I?',
        hint: 'You are looking through one right now in this universe.',
        answer: 'A Holographic Screen / Portal Display',
        explanation: 'Holographic screens and digital displays project stories and imagery across dimensions without physical eyes or vocal cords.',
      },
      {
        id: 'riddle-2',
        riddle: 'The more you feed me data, the smarter I become. If you starve me of inputs, I can do nothing. What am I?',
        hint: 'The core technology powering AI World.',
        answer: 'A Neural Network / Artificial Intelligence Model',
        explanation: 'Machine learning and deep neural networks require training datasets to learn patterns and generate predictions.',
      },
      {
        id: 'riddle-3',
        riddle: 'I turn words into motion without touching a steering wheel. Haribalan built me to lift heavy cargo. What am I?',
        hint: 'One of Haribalan’s key robotics projects.',
        answer: 'The Voice Controlled Mini Forklift',
        explanation: 'Haribalan engineered the Voice Controlled Mini Forklift to perform warehouse logistics purely via acoustic speech commands.',
      },
    ];
    return riddles[Math.floor(Math.random() * riddles.length)];
  }

  /**
   * Generate joke
   */
  generateJoke(): JokeData {
    const jokes: JokeData[] = [
      {
        setup: 'Why did the robot go on a diet?',
        punchline: 'Because it had too many bytes!',
        tag: 'Robotics Humor',
      },
      {
        setup: 'Why do programmers prefer dark mode in HB Universe?',
        punchline: 'Because light attracts bugs, but dark mode attracts stars!',
        tag: 'Dev Humor',
      },
      {
        setup: 'How does an AI pilot make tea?',
        punchline: 'With high-precision quantum boiling algorithms and neural chamomile!',
        tag: 'Sci-Fi Humor',
      },
      {
        setup: 'Why was the Convolutional Neural Network so good at hide and seek?',
        punchline: 'Because it always detected the hidden features!',
        tag: 'AI/ML Humor',
      },
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }
}

export const demoAIProvider = new DemoAIProvider();
