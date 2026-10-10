import React from 'react';
import { Html } from '@react-three/drei';
import { Zap, Heart, Sparkles } from 'lucide-react';
import { useUniverseStore } from '../../store/universeStore';
import { CharacterSpeechBubble } from './CharacterSpeechBubble';

export const HBCharacterHUD: React.FC = () => {
  const { character, speechBubble, nearbyPortal, setCustomizerOpen, setProfileModalOpen } = useUniverseStore();
  const xpPercent = Math.min(100, Math.round((character.xp / character.maxXp) * 100));

  return (
    <group>
      {/* Speech Bubble if active */}
      {speechBubble && <CharacterSpeechBubble text={speechBubble.text} />}

      {/* Proximity Interaction Prompt [ E ] INTERACT */}
      {nearbyPortal && !speechBubble && (
        <Html position={[0, 3.3, 0]} center distanceFactor={14}>
          <div className="flex flex-col items-center select-none animate-pulse whitespace-nowrap">
            <div
              className="px-3.5 py-1.5 rounded-2xl bg-slate-900/95 border-2 text-white font-black text-xs shadow-2xl flex items-center gap-2 cursor-pointer"
              style={{ borderColor: nearbyPortal.themeColor }}
            >
              <kbd className="px-1.5 py-0.5 rounded bg-yellow-400 text-black font-mono font-bold text-[11px] shadow">
                E
              </kbd>
              <span>ENTER {nearbyPortal.name}</span>
            </div>
          </div>
        </Html>
      )}

      {/* Floating 3D Character Status Pill */}
      <Html position={[0, 2.5, 0]} center distanceFactor={16}>
        <div
          onClick={() => setProfileModalOpen(true)}
          className="flex flex-col items-center select-none whitespace-nowrap cursor-pointer group"
          title="Click to view Pilot Dossier"
        >
          <div className="px-3 py-1 rounded-full bg-slate-900/90 border border-yellow-400/80 text-yellow-400 font-black text-[11px] tracking-wider shadow-[0_0_15px_rgba(255,229,0,0.5)] flex items-center gap-1.5 backdrop-blur-md group-hover:scale-105 transition-transform">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-ping" />
            <span>HB PILOT • LV {character.level}</span>
            <span className="text-[9px] text-cyan-300 font-mono">({xpPercent}%)</span>
          </div>

          {/* Mini Vitals */}
          <div className="flex items-center gap-2 mt-1 px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-800 text-[9px] font-mono text-slate-300">
            <span className="flex items-center gap-0.5 text-red-400">
              <Heart className="w-2.5 h-2.5 fill-red-400/40" />
              {character.health}
            </span>
            <span className="flex items-center gap-0.5 text-yellow-400">
              <Zap className="w-2.5 h-2.5 fill-yellow-400/40" />
              {character.energy}
            </span>
            <span
              onClick={(e) => {
                e.stopPropagation();
                setCustomizerOpen(true);
              }}
              className="text-cyan-400 hover:text-white underline ml-1 cursor-pointer flex items-center gap-0.5"
            >
              <Sparkles className="w-2.5 h-2.5" />
              CUSTOMIZE
            </span>
          </div>
        </div>
      </Html>
    </group>
  );
};
