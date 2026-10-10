import React from 'react';
import { ArrowLeft, Sparkles, Gamepad2, Tv, Music, Bot, Trophy, Lock } from 'lucide-react';
import { WorldData } from '../../types';
import { useUniverseStore } from '../../store/universeStore';
import { audioManager } from '../../audio/audioManager';

interface WorldPlaceholderProps {
  world: WorldData;
  onBack?: () => void;
}

export const WorldPlaceholder: React.FC<WorldPlaceholderProps> = ({
  world,
  onBack,
}) => {
  const { soundEnabled, character, exitWorldView } = useUniverseStore();

  const handleReturn = () => {
    if (soundEnabled) audioManager.playClick();
    if (onBack) {
      onBack();
    } else {
      exitWorldView();
    }
  };

  const renderIcon = () => {
    switch (world.iconName) {
      case 'Gamepad2':
        return <Gamepad2 className="w-12 h-12 text-cyan-400" />;
      case 'Film':
        return <Tv className="w-12 h-12 text-red-400" />;
      case 'Headphones':
        return <Music className="w-12 h-12 text-purple-400" />;
      case 'Bot':
        return <Bot className="w-12 h-12 text-yellow-400" />;
      case 'Trophy':
        return <Trophy className="w-12 h-12 text-emerald-400" />;
      default:
        return <Sparkles className="w-12 h-12 text-indigo-400" />;
    }
  };

  const renderWorldSpecificContent = () => {
    switch (world.id) {
      case 'arcade':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30">
              <Gamepad2 className="w-8 h-8 text-cyan-400 mb-2" />
              <h4 className="font-bold text-white">Retro Grid Runner</h4>
              <p className="text-xs text-slate-400 mt-1">High-speed neon obstacle navigation module.</p>
              <div className="mt-3 text-[10px] font-mono text-cyan-300">STATUS: INITIALIZING ENGINE</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-purple-500/30">
              <Gamepad2 className="w-8 h-8 text-purple-400 mb-2" />
              <h4 className="font-bold text-white">Cyber Snake 2099</h4>
              <p className="text-xs text-slate-400 mt-1">Multi-axis quantum food collection simulation.</p>
              <div className="mt-3 text-[10px] font-mono text-purple-300">STATUS: READY FOR COMPILATION</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30">
              <Gamepad2 className="w-8 h-8 text-emerald-400 mb-2" />
              <h4 className="font-bold text-white">Tic-Tac-Toe Arena</h4>
              <p className="text-xs text-slate-400 mt-1">Player vs HB AI strategic matrix.</p>
              <div className="mt-3 text-[10px] font-mono text-emerald-300">STATUS: LOAD BALANCED</div>
            </div>
          </div>
        );

      case 'cinema':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-red-500/30">
              <Tv className="w-8 h-8 text-red-400 mb-2" />
              <h4 className="font-bold text-white">HB Dimension Shorts (4K)</h4>
              <p className="text-xs text-slate-400 mt-1">Episodic sci-fi universe storytelling & trailers.</p>
              <span className="inline-block mt-3 px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] font-mono">
                CINEMA STREAM BUFFER READY
              </span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/30">
              <Tv className="w-8 h-8 text-amber-400 mb-2" />
              <h4 className="font-bold text-white">Community Showcase Reel</h4>
              <p className="text-xs text-slate-400 mt-1">Top rated universe highlights from galactic players.</p>
              <span className="inline-block mt-3 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono">
                PRODUCER DECK ONLINE
              </span>
            </div>
          </div>
        );

      case 'music':
        return (
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-purple-500/30 my-6">
            <div className="flex items-center gap-3 mb-3">
              <Music className="w-8 h-8 text-purple-400" />
              <div>
                <h4 className="font-bold text-white">HB Cyber-Audio Synth Waveform</h4>
                <p className="text-xs text-slate-400">Real-time Web Audio procedural equalizer & universe soundtrack.</p>
              </div>
            </div>
            <div className="flex items-end gap-1.5 h-16 pt-2">
              {[40, 65, 30, 85, 95, 60, 45, 80, 100, 50, 75, 90, 35, 70, 85, 60].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-purple-600 to-cyan-400 rounded-t-sm animate-pulse"
                  style={{ height: h + '%', animationDelay: (i * 0.1) + 's' }}
                />
              ))}
            </div>
          </div>
        );

      case 'ai':
        return (
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-blue-500/30 my-6">
            <div className="flex items-center gap-3 mb-3">
              <Bot className="w-8 h-8 text-blue-400" />
              <div>
                <h4 className="font-bold text-white">HB Neural Companion Core</h4>
                <p className="text-xs text-slate-400">Contextual interactive companion for lore queries & tactics.</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 font-mono text-xs text-yellow-300">
              [HB_AI_CORE]: &quot;Greetings Traveler. Dimensional gateway initialized. Awaiting Phase 3 interactive prompt streaming.&quot;
            </div>
          </div>
        );

      case 'challenge':
        return (
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-amber-500/30 my-6">
            <div className="flex items-center gap-3 mb-3">
              <Trophy className="w-8 h-8 text-amber-400" />
              <div>
                <h4 className="font-bold text-white">Galactic Arena Bounties</h4>
                <p className="text-xs text-slate-400">Timed tournaments, XP multi-combos, and universal leaderboard.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 text-center text-xs font-mono">
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                <div className="text-slate-400 text-[10px]">CURRENT RANK</div>
                <div className="text-amber-400 font-bold mt-1">#42 BRONZE</div>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                <div className="text-slate-400 text-[10px]">DAILY BOUNTIES</div>
                <div className="text-emerald-400 font-bold mt-1">3/5 CLAIMED</div>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                <div className="text-slate-400 text-[10px]">SEASON ENDS</div>
                <div className="text-cyan-400 font-bold mt-1">14 DAYS</div>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                <div className="text-slate-400 text-[10px]">JACKPOT POOL</div>
                <div className="text-purple-400 font-bold mt-1">50,000 XP</div>
              </div>
            </div>
          </div>
        );

      case 'mystery':
        return (
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-700/50 my-6 text-center">
            <Lock className="w-10 h-10 text-slate-500 mx-auto mb-2" />
            <h4 className="font-bold text-white">Void Singularity Dimension</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              An ominous gravitational disturbance detected in outer sector 09. High level clearance required.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 md:p-8 max-w-4xl mx-auto">
      {/* Return Button */}
      <div className="w-full flex items-center justify-between mb-8">
        <button
          onClick={handleReturn}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-yellow-400 text-slate-300 hover:text-white text-sm font-semibold transition-all cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          RETURN TO UNIVERSE HUB
        </button>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <span>PLAYER LV {character.level}</span>
          <span className="text-yellow-400">XP {character.xp}</span>
        </div>
      </div>

      {/* Main World Hero Card */}
      <div
        className="relative w-full rounded-3xl p-8 md:p-12 border bg-slate-950/80 backdrop-blur-xl shadow-2xl overflow-hidden"
        style={{
          borderColor: world.themeColor + '50',
          boxShadow: '0 0 80px ' + world.themeColor + '15',
        }}
      >
        {/* Ambient Top Flare */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: world.themeColor }}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div
            className="w-24 h-24 md:w-32 md:h-32 rounded-3xl flex items-center justify-center border-2 shadow-2xl flex-shrink-0"
            style={{
              backgroundColor: world.themeColor + '15',
              borderColor: world.themeColor,
              boxShadow: '0 0 35px ' + world.themeColor + '40',
            }}
          >
            {renderIcon()}
          </div>

          <div className="text-center md:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
              <span
                className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase border"
                style={{
                  backgroundColor: world.themeColor + '20',
                  borderColor: world.themeColor + '60',
                  color: world.themeColor,
                }}
              >
                DIMENSION PROTOCOL ONLINE
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                SECTOR 0{world.features.length}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white tracking-wider">
              {world.name}
            </h1>
            <p className="text-slate-300 text-sm md:text-base mt-2 max-w-xl">
              {world.loreSnippet}
            </p>
          </div>
        </div>

        {/* Dynamic Sector Preview Content */}
        {renderWorldSpecificContent()}

        {/* World Capabilities Badges */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {world.features.map((feat) => (
              <span
                key={feat}
                className="text-xs px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-yellow-400" />
                {feat}
              </span>
            ))}
          </div>

          <button
            onClick={handleReturn}
            className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-black transition-all transform hover:scale-105 cursor-pointer shadow-lg flex items-center gap-2"
            style={{
              backgroundColor: world.themeColor,
              boxShadow: '0 0 25px ' + world.themeColor + '80',
            }}
          >
            RETURN TO HUB
          </button>
        </div>
      </div>
    </div>
  );
};
