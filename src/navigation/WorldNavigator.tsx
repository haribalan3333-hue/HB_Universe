import React, { Suspense, lazy } from 'react';
import { useUniverseStore } from '../store/universeStore';
import { WorldBreadcrumb } from './WorldBreadcrumb';
import { ReturnToUniverse } from './ReturnToUniverse';
import { WORLD_REGISTRY } from './WorldRegistry';

const ArcadeWorld = lazy(() => import('../worlds/Arcade/ArcadeWorld').then(m => ({ default: m.ArcadeWorld })));
const CinemaWorld = lazy(() => import('../worlds/Cinema/CinemaWorld').then(m => ({ default: m.CinemaWorld })));
const MusicWorld = lazy(() => import('../worlds/Music/MusicWorld').then(m => ({ default: m.MusicWorld })));
const AIWorld = lazy(() => import('../worlds/AI/AIWorld').then(m => ({ default: m.AIWorld })));
const ChallengeWorld = lazy(() => import('../worlds/Challenge/ChallengeWorld').then(m => ({ default: m.ChallengeWorld })));
const MysteryWorld = lazy(() => import('../worlds/Mystery/MysteryWorld').then(m => ({ default: m.MysteryWorld })));

const WorldLoadingFallback = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
    <div className="w-12 h-12 rounded-2xl bg-yellow-400/20 border border-yellow-400 flex items-center justify-center text-yellow-400 font-orbitron font-black text-xl animate-spin mb-4">
      HB
    </div>
    <h3 className="font-orbitron font-black text-lg text-white">WARPING TO DESTINATION...</h3>
    <p className="text-xs font-mono text-slate-400 mt-1">Streaming quantum world assets</p>
  </div>
);

export const WorldNavigator: React.FC = () => {
  const { currentWorldId } = useUniverseStore();

  if (!currentWorldId) return null;

  const currentWorld = WORLD_REGISTRY[currentWorldId];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <WorldBreadcrumb worldName={currentWorld?.name || currentWorldId} themeColor={currentWorld?.themeColor} />
        <ReturnToUniverse />
      </div>

      <Suspense fallback={<WorldLoadingFallback />}>
        {currentWorldId === 'arcade' && <ArcadeWorld />}
        {currentWorldId === 'cinema' && <CinemaWorld />}
        {currentWorldId === 'music' && <MusicWorld />}
        {currentWorldId === 'ai' && <AIWorld />}
        {currentWorldId === 'challenge' && <ChallengeWorld />}
        {currentWorldId === 'mystery' && <MysteryWorld />}
      </Suspense>
    </div>
  );
};
