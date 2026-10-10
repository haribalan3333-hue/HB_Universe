import { AIMessage, AICharacter, AICoreState } from './aiTypes';
import { demoAIProvider } from './DemoAIProvider';
import { AI_CHARACTERS, getCharacterById } from './AICharacters';

const AI_HISTORY_KEY = 'HB_UNIVERSE_AI_HISTORY_V9';
const AI_REWARDS_KEY = 'HB_UNIVERSE_AI_REWARDS_V9';

export class AIManager {
  private activeCharacter: AICharacter = AI_CHARACTERS[0];
  private coreState: AICoreState = 'IDLE';

  getCharacter(): AICharacter {
    return this.activeCharacter;
  }

  setCharacter(characterId: string) {
    this.activeCharacter = getCharacterById(characterId);
  }

  getCoreState(): AICoreState {
    return this.coreState;
  }

  setCoreState(state: AICoreState) {
    this.coreState = state;
  }

  loadHistory(): AIMessage[] {
    try {
      const raw = localStorage.getItem(AI_HISTORY_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return [
      {
        id: 'init-msg',
        sender: 'ai',
        text: this.activeCharacter.greeting,
        timestamp: Date.now(),
        characterId: this.activeCharacter.id,
      },
    ];
  }

  saveHistory(messages: AIMessage[]) {
    try {
      // Limit to last 30 messages to keep local storage clean
      const trimmed = messages.slice(-30);
      localStorage.setItem(AI_HISTORY_KEY, JSON.stringify(trimmed));
    } catch {
      // ignore
    }
  }

  clearHistory(): AIMessage[] {
    const initial: AIMessage[] = [
      {
        id: 'init-' + Date.now(),
        sender: 'ai',
        text: this.activeCharacter.greeting,
        timestamp: Date.now(),
        characterId: this.activeCharacter.id,
      },
    ];
    try {
      localStorage.setItem(AI_HISTORY_KEY, JSON.stringify(initial));
    } catch {
      // ignore
    }
    return initial;
  }

  hasClaimedReward(actionKey: string): boolean {
    try {
      const raw = localStorage.getItem(AI_REWARDS_KEY);
      const list: string[] = raw ? JSON.parse(raw) : [];
      return list.includes(actionKey);
    } catch {
      return false;
    }
  }

  markRewardClaimed(actionKey: string) {
    try {
      const raw = localStorage.getItem(AI_REWARDS_KEY);
      const list: string[] = raw ? JSON.parse(raw) : [];
      if (!list.includes(actionKey)) {
        list.push(actionKey);
        localStorage.setItem(AI_REWARDS_KEY, JSON.stringify(list));
      }
    } catch {
      // ignore
    }
  }

  async sendMessage(userText: string): Promise<AIMessage> {
    this.coreState = 'THINKING';
    const response = await demoAIProvider.processChat(userText, this.activeCharacter);
    this.coreState = 'RESPONDING';
    return response;
  }
}

export const aiManager = new AIManager();
