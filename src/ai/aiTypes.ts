// ==========================================
// HB UNIVERSE — AI LAYER TYPE DEFINITIONS
// ==========================================

export type AICoreState = 'IDLE' | 'THINKING' | 'RESPONDING' | 'LISTENING' | 'ERROR' | 'OFFLINE';

export type AICommandType =
  | 'NAVIGATE'
  | 'OPEN_GAME'
  | 'PLAY_MEDIA'
  | 'PLAY_MUSIC'
  | 'SHOW_PROFILE'
  | 'SHOW_STATUS';

export interface AICommand {
  type: AICommandType;
  destination?: string;
  gameId?: string;
  mediaId?: string;
  trackId?: string;
  label: string;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: number;
  characterId?: string;
  command?: AICommand;
  confidence?: number;
  xpAwarded?: number;
}

export interface AICharacter {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  tagline: string;
  specialty: string;
  greeting: string;
  systemPrompt: string;
}

export interface StoryPrompt {
  genre: string;
  theme: string;
  characters: string;
  length: 'short' | 'medium' | 'epic';
  tone: string;
}

export interface GeneratedStory {
  title: string;
  summary: string;
  chapters: { title: string; content: string }[];
  tags: string[];
  xpReward: number;
}

export interface GeneratedIdea {
  title: string;
  type: string;
  description: string;
  valueProposition: string;
  technologies: string[];
  difficulty: 'EASY' | 'INTERMEDIATE' | 'ADVANCED';
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizData {
  topic: string;
  difficulty: string;
  questions: QuizQuestion[];
  xpReward: number;
}

export interface RiddleData {
  id: string;
  riddle: string;
  hint: string;
  answer: string;
  explanation: string;
}

export interface JokeData {
  setup: string;
  punchline: string;
  tag: string;
}
