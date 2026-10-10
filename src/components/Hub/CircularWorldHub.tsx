import React from 'react';
import { CharacterPedestal } from '../Character/CharacterPedestal';
import { WorldPortal } from '../Portal/WorldPortal';
import { WorldInfoCard } from './WorldInfoCard';
import { WORLDS_DATA } from '../../data/worlds';
import { useUniverseStore } from '../../store/universeStore';

export const CircularWorldHub: React.FC = () => {
  const { hoveredWorld, selectedWorld } = useUniverseStore();

  const mystery = WORLDS_DATA.find((w) => w.id === 'mystery')!;
  const cinema = WORLDS_DATA.find((w) => w.id === 'cinema')!;
  const ai = WORLDS_DATA.find((w) => w.id === 'ai')!;
  const arcade = WORLDS_DATA.find((w) => w.id === 'arcade')!;
  const music = WORLDS_DATA.find((w) => w.id === 'music')!;
  const challenge = WORLDS_DATA.find((w) => w.id === 'challenge')!;

  const activeInspection = hoveredWorld || selectedWorld || arcade;

  return (
    <div className="relative w-full py-4 sm:py-8 flex flex-col items-center">
      <div className="relative w-full max-w-6xl mx-auto hidden md:block min-h-[720px] select-none">
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 1000 720"
          fill="none"
        >
          <defs>
            <linearGradient id="yellowBeam" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE500" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFE500" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="cyanBeam" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="redBeam" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF2A55" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FF2A55" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="purpleBeam" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A855F7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#A855F7" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="emeraldBeam" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="dimBeam" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818CF8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          <line x1="500" y1="360" x2="500" y2="110" stroke="url(#dimBeam)" strokeWidth="2" strokeDasharray="6 6" />
          <line x1="500" y1="360" x2="220" y2="190" stroke="url(#redBeam)" strokeWidth="2.5" strokeOpacity="0.6" />
          <line x1="500" y1="360" x2="780" y2="190" stroke="url(#yellowBeam)" strokeWidth="2.5" strokeOpacity="0.7" />
          <line x1="500" y1="360" x2="220" y2="530" stroke="url(#cyanBeam)" strokeWidth="2.5" strokeOpacity="0.7" />
          <line x1="500" y1="360" x2="780" y2="530" stroke="url(#purpleBeam)" strokeWidth="2.5" strokeOpacity="0.7" />
          <line x1="500" y1="360" x2="500" y2="590" stroke="url(#emeraldBeam)" strokeWidth="2.5" strokeOpacity="0.7" />

          <circle cx="500" cy="360" r="280" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" strokeDasharray="4 8" />
          <circle cx="500" cy="360" r="170" stroke="rgba(255, 229, 0, 0.1)" strokeWidth="1" />
        </svg>

        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-72 z-20">
          <WorldPortal world={mystery} />
        </div>

        <div className="absolute top-24 left-4 lg:left-12 w-72 z-20">
          <WorldPortal world={cinema} />
        </div>

        <div className="absolute top-24 right-4 lg:right-12 w-72 z-20">
          <WorldPortal world={ai} />
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
          <CharacterPedestal />
        </div>

        <div className="absolute bottom-20 left-4 lg:left-12 w-72 z-20">
          <WorldPortal world={arcade} />
        </div>

        <div className="absolute bottom-20 right-4 lg:right-12 w-72 z-20">
          <WorldPortal world={music} />
        </div>

        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-72 z-20">
          <WorldPortal world={challenge} />
        </div>
      </div>

      <div className="md:hidden w-full space-y-6">
        <CharacterPedestal />
        <div className="space-y-4">
          <div className="text-xs font-orbitron font-bold text-yellow-400 tracking-wider text-center uppercase">
            ✦ Dimensional Worlds Stream ✦
          </div>
          {WORLDS_DATA.map((world) => (
            <WorldPortal key={world.id} world={world} />
          ))}
        </div>
      </div>

      <div className="w-full flex justify-center mt-12 sm:mt-16 z-30">
        <WorldInfoCard world={activeInspection} />
      </div>
    </div>
  );
};
