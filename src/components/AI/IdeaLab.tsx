import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Cpu, Bot, Rocket, Shield } from 'lucide-react';
import { GeneratedIdea } from '../../ai/aiTypes';
import { demoAIProvider } from '../../ai/DemoAIProvider';
import { useUniverseStore } from '../../store/universeStore';
import { audioManager } from '../../audio/audioManager';

export const IdeaLab: React.FC = () => {
  const { addXp, showSpeech, soundEnabled } = useUniverseStore();
  const [selectedCategory, setSelectedCategory] = useState('ai');
  const [idea, setIdea] = useState<GeneratedIdea>(() => demoAIProvider.generateIdea('ai'));

  const handleGenerate = (cat: string) => {
    if (soundEnabled) audioManager.playClick();
    setSelectedCategory(cat);
    const nextIdea = demoAIProvider.generateIdea(cat);
    setIdea(nextIdea);
    addXp(10);
    showSpeech('💡 NEW IDEA SYNTHESIZED: +10 XP!', 2500);
  };

  const categories = [
    { id: 'ai', label: 'AI & VISION', icon: <Bot className="w-4 h-4" /> },
    { id: 'robotics', label: 'ROBOTICS & MECH', icon: <Cpu className="w-4 h-4" /> },
    { id: 'game', label: '3D GAMES', icon: <Rocket className="w-4 h-4" /> },
    { id: 'mechanical', label: 'ENERGY SYSTEMS', icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-widest">
              INNOVATION ENGINE
            </span>
            <h3 className="text-lg font-orbitron font-bold text-white">
              AI Idea & Project Synthesizer
            </h3>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => handleGenerate(c.id)}
            className={`px-4 py-2 rounded-xl font-orbitron text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              selectedCategory === c.id
                ? 'bg-amber-400 text-black shadow-[0_0_20px_rgba(251,191,36,0.5)]'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {c.icon}
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      {/* Idea Card */}
      <motion.div
        key={idea.title}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-amber-500/30 space-y-6 shadow-2xl backdrop-blur-xl"
      >
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 font-orbitron text-xs font-bold uppercase">
            {idea.type}
          </span>
          <span className="text-xs font-mono text-slate-400">DIFFICULTY: {idea.difficulty}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black font-orbitron text-white">
          {idea.title}
        </h2>

        <p className="text-sm sm:text-base font-inter text-slate-300 leading-relaxed">
          {idea.description}
        </p>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">VALUE PROPOSITION</span>
          <p className="text-xs sm:text-sm font-inter text-slate-200 mt-1">{idea.valueProposition}</p>
        </div>

        {/* Tech Stack */}
        <div>
          <span className="text-xs font-mono text-slate-400 uppercase">RECOMMENDED TECH STACK</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {idea.technologies.map((t) => (
              <span key={t} className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300">
                {t}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
