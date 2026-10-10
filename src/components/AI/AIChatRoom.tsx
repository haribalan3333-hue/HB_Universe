import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Trash2, Copy, Check, Sparkles, Mic, Bot } from 'lucide-react';
import { AIMessage, AICharacter, AICoreState } from '../../ai/aiTypes';
import { aiManager } from '../../ai/AIManager';
import { AICoreVisualizer } from './AICoreVisualizer';
import { useUniverseStore } from '../../store/universeStore';
import { audioManager } from '../../audio/audioManager';

interface AIChatRoomProps {
  character: AICharacter;
  onOpenVoice: () => void;
  onExecuteCommand: (command: any) => void;
}

export const AIChatRoom: React.FC<AIChatRoomProps> = ({
  character,
  onOpenVoice,
  onExecuteCommand,
}) => {
  const { addXp, addCoins, showSpeech, soundEnabled } = useUniverseStore();
  const [messages, setMessages] = useState<AIMessage[]>(() => aiManager.loadHistory());
  const [inputVal, setInputVal] = useState('');
  const [coreState, setCoreState] = useState<AICoreState>('IDLE');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    "Tell me about Haribalan's projects",
    "What worlds can I visit in the multiverse?",
    "Take me to Arcade World",
    "Play Pushpawathi AI film",
    "Tell me a gaming tip",
  ];

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, coreState]);

  // Handle Send
  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    if (soundEnabled) audioManager.playClick();

    const userMsg: AIMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text,
      timestamp: Date.now(),
    };

    const nextList = [...messages, userMsg];
    setMessages(nextList);
    setInputVal('');
    setCoreState('THINKING');

    // Reward for first chat
    if (!aiManager.hasClaimedReward('first_chat')) {
      aiManager.markRewardClaimed('first_chat');
      addXp(10);
      addCoins(5);
      showSpeech('🤖 FIRST AI CHAT: +10 XP REWARD!', 3000);
    }

    try {
      const response = await aiManager.sendMessage(text);
      setCoreState('RESPONDING');
      const updated = [...nextList, response];
      setMessages(updated);
      aiManager.saveHistory(updated);

      if (response.xpAwarded) {
        addXp(response.xpAwarded);
      }

      setTimeout(() => {
        setCoreState('IDLE');
      }, 1200);
    } catch {
      setCoreState('ERROR');
      const errorMsg: AIMessage = {
        id: 'err-' + Date.now(),
        sender: 'system',
        text: '⚠️ Communication signal lost. Demo mode recovery active.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      setTimeout(() => setCoreState('IDLE'), 2000);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    if (soundEnabled) audioManager.playClick();
    const reset = aiManager.clearHistory();
    setMessages(reset);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[720px] max-h-[85vh] rounded-3xl bg-slate-950/80 border border-slate-800 p-4 sm:p-6 shadow-2xl backdrop-blur-2xl">
      {/* Left AI Companion Sidebar */}
      <div className="lg:w-1/3 flex flex-col items-center justify-between p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center">
        <div className="w-full flex items-center justify-between">
          <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 font-bold uppercase">
            STATUS: {coreState}
          </span>
          <button
            onClick={handleClear}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* AI Core Nucleus */}
        <div className="my-6">
          <AICoreVisualizer state={coreState} characterColor={character.color} size="md" />
        </div>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-mono text-slate-300">
            <span>{character.avatar}</span>
            <span className="font-bold">{character.name}</span>
          </div>
          <h3 className="text-base font-orbitron font-bold text-white mt-2">
            {character.role}
          </h3>
          <p className="text-xs text-slate-400 font-inter mt-1 leading-relaxed">
            {character.tagline}
          </p>
        </div>

        {/* Voice Trigger Button */}
        <button
          onClick={onOpenVoice}
          className="w-full mt-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/40 font-orbitron text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
        >
          <Mic className="w-4 h-4" />
          <span>START VOICE CHAT</span>
        </button>
      </div>

      {/* Right Chat Terminal */}
      <div className="flex-1 flex flex-col justify-between rounded-2xl bg-slate-900/40 border border-slate-800/80 p-4 min-h-0">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const isSystem = msg.sender === 'system';

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-[10px] font-mono text-slate-500">
                    {isUser ? 'PILOT (YOU)' : isSystem ? 'SYSTEM' : character.name}
                  </span>
                  <span className="text-[9px] font-mono text-slate-600">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div
                  className={`relative max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm font-inter leading-relaxed ${
                    isUser
                      ? 'bg-yellow-400 text-black font-medium shadow-[0_0_20px_rgba(255,229,0,0.25)] rounded-tr-none'
                      : isSystem
                      ? 'bg-red-500/10 border border-red-500/30 text-red-300'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Action Command Button inside Message */}
                  {msg.command && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onExecuteCommand(msg.command)}
                      className="mt-3 w-full py-2 px-3 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 text-white font-orbitron text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{msg.command.label}</span>
                    </motion.button>
                  )}

                  {/* Copy Button */}
                  {!isUser && !isSystem && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="absolute top-2 right-2 opacity-0 hover:opacity-100 group-hover:opacity-100 p-1 text-slate-400 hover:text-white"
                      title="Copy message"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Thinking Indicator */}
          {coreState === 'THINKING' && (
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 p-2">
              <Bot className="w-4 h-4 animate-spin" />
              <span>AI Neural Processor computing response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Chips */}
        <div className="pt-3 pb-2 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-yellow-400/20 border border-slate-700 hover:border-yellow-400 text-[11px] font-mono text-slate-300 hover:text-yellow-300 shrink-0 transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Bottom Input Field */}
        <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder={`Message ${character.name} or type 'take me to arcade'...`}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-yellow-400 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none transition-colors font-inter"
          />

          <button
            onClick={() => handleSend()}
            disabled={!inputVal.trim() || coreState === 'THINKING'}
            className="w-10 h-10 rounded-xl bg-yellow-400 hover:bg-yellow-300 disabled:opacity-30 text-black flex items-center justify-center font-bold shadow-[0_0_15px_rgba(255,229,0,0.4)] transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
