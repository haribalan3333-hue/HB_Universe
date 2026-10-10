import React from 'react';
import { X, Award, Flame, Zap } from 'lucide-react';
import { LeaderboardPlayer } from '../../api/leaderboardApi';

interface PublicProfileModalProps {
  player: LeaderboardPlayer | null;
  onClose: () => void;
}

export const PublicProfileModal: React.FC<PublicProfileModalProps> = ({ player, onClose }) => {
  if (!player) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl select-none">
      <div className="w-full max-w-lg bg-slate-950 border border-yellow-400/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(255,229,0,0.2)] text-white relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-5 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-yellow-400 via-purple-500 to-cyan-400 p-1 shadow-[0_0_30px_rgba(255,229,0,0.3)]">
            <div className="w-full h-full rounded-xl bg-slate-950 flex items-center justify-center text-3xl">
              {player.avatar || '🚀'}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-orbitron font-black text-2xl text-white">{player.display_name}</h2>
              <span className="px-2 py-0.5 rounded bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 text-xs font-mono font-bold">
                #{player.rank}
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400">@{player.username}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-orbitron font-bold border border-cyan-500/40">
                {player.rank_tier}
              </span>
              <span className="text-xs font-mono text-yellow-400 font-bold">
                LV {player.level}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
            <div className="text-[10px] font-mono text-slate-400 uppercase">Total XP</div>
            <div className="font-orbitron font-bold text-sm text-white">
              {(player.total_xp || player.xp).toLocaleString()}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            <Award className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <div className="text-[10px] font-mono text-slate-400 uppercase">Coins Vault</div>
            <div className="font-orbitron font-bold text-sm text-yellow-400">
              🪙 {player.coins.toLocaleString()}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            <Flame className="w-5 h-5 text-rose-400 mx-auto mb-1" />
            <div className="text-[10px] font-mono text-slate-400 uppercase">Streak</div>
            <div className="font-orbitron font-bold text-sm text-white">
              {player.streak || 1} DAYS
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-xs font-inter text-slate-400 mb-5">
          Verified pilot in the HB UNIVERSE Global Network. All statistics and rankings are authenticated server-side.
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-orbitron font-black text-xs hover:bg-slate-800 transition-colors"
        >
          CLOSE DOSSIER
        </button>
      </div>
    </div>
  );
};
