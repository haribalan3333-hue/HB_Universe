import React, { useState } from 'react';
import { Heart, Zap, Sparkles, Shield } from 'lucide-react';
import { useUniverseStore } from '../../store/universeStore';
import { XPBar } from './XPBar';
import { audioManager } from '../../audio/audioManager';
import { triggerLevelUpEffect } from '../../animations/particles';

export const CharacterPanel: React.FC = () => {
  const { character, addXp, addCoins } = useUniverseStore();
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const handleTrainCharacter = () => {
    audioManager.playClick();
    addXp(120);
    addCoins(50);
    triggerLevelUpEffect();
    setActionFeedback('+120 XP & +50 COINS GAINED!');
    setTimeout(() => setActionFeedback(null), 2500);
  };

  return (
    <div className="relative w-full rounded-2xl bg-slate-900/80 border border-white/[0.08] backdrop-blur-xl p-5 sm:p-6 overflow-hidden shadow-glass-panel group select-none">
      {/* Background Cyber Grid Accent */}
      <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none" />

      {/* Ambient Neon Glow */}
      <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-yellow-500/10 blur-[60px] pointer-events-none group-hover:bg-yellow-500/20 transition-all duration-500" />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
        {/* Character Visual Avatar with Uploaded Image */}
        <div
          onMouseEnter={() => audioManager.playHover()}
          className="relative w-32 h-32 sm:w-36 sm:h-36 flex-shrink-0 flex items-center justify-center rounded-2xl p-1 bg-gradient-to-tr from-yellow-400 via-purple-500 to-cyan-400 shadow-[0_0_25px_rgba(255,229,0,0.25)] group-hover:border-yellow-400/70 transition-all duration-300"
        >
          <div className="w-full h-full rounded-xl overflow-hidden bg-slate-950 border border-yellow-400">
            <img
              src="/images/hb_pilot.png"
              alt="HB Pilot Commander"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute -top-2 -left-2 px-2.5 py-0.5 rounded-lg bg-yellow-400 text-black font-orbitron font-extrabold text-[10px] shadow-neon-yellow-sm">
            LV {character.level}
          </div>

          <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-mono text-[9px]">
            3D READY
          </div>
        </div>

        {/* Character Details & Progression */}
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-orbitron font-black text-xl sm:text-2xl text-white tracking-wide">
                  {character.name}
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-white/[0.06] text-gray-300 text-xs font-mono">
                  {character.rank}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-inter">{character.title} • Quantum Pilot Core</p>
            </div>

            <button
              onClick={handleTrainCharacter}
              onMouseEnter={() => audioManager.playHover()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-yellow-400/10 border border-yellow-400/30 hover:bg-yellow-400 hover:text-black text-yellow-400 text-xs font-orbitron font-bold transition-all duration-200 self-start sm:self-auto cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>SIMULATE MISSION</span>
            </button>
          </div>

          {actionFeedback && (
            <div className="text-xs font-bold text-yellow-400 font-orbitron animate-pulse mb-2">
              ⚡ {actionFeedback}
            </div>
          )}

          <div className="mb-4">
            <XPBar current={character.xp} max={character.maxXp} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
                <Heart className="w-4 h-4 fill-red-500/20" />
              </div>
              <div>
                <div className="text-[10px] text-gray-400 font-mono">HEALTH</div>
                <div className="font-orbitron font-bold text-xs text-white">{character.health}/{character.maxHealth}</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="p-1.5 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                <Zap className="w-4 h-4 fill-yellow-500/20" />
              </div>
              <div>
                <div className="text-[10px] text-gray-400 font-mono">ENERGY</div>
                <div className="font-orbitron font-bold text-xs text-white">{character.energy}/{character.maxEnergy}</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-yellow-400 border border-yellow-500/20">
                <span className="text-sm">🪙</span>
              </div>
              <div>
                <div className="text-[10px] text-gray-400 font-mono">COINS</div>
                <div className="font-orbitron font-bold text-xs text-yellow-400">{character.coins}</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-gray-400 font-mono">POWER</div>
                <div className="font-orbitron font-bold text-xs text-cyan-300">{character.stats.power} PTS</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
