import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, RefreshCw, Eye } from 'lucide-react';
import { leaderboardApi, LeaderboardPlayer } from '../api/leaderboardApi';
import { PublicProfileModal } from '../components/Rank/PublicProfileModal';
import { useUniverseStore } from '../store/universeStore';
import { pageVariants } from '../animations/transitions';

export const RankPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'GLOBAL' | 'WEEKLY' | 'MONTHLY'>('GLOBAL');
  const [page, setPage] = useState(1);
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [myRank, setMyRank] = useState<LeaderboardPlayer | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<LeaderboardPlayer | null>(null);
  const { character } = useUniverseStore();

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const [boardRes, rankRes] = await Promise.all([
        leaderboardApi.getLeaderboard(activeTab, page, 10),
        leaderboardApi.getMyRank()
      ]);

      if (boardRes.success && boardRes.data) {
        setPlayers(boardRes.data.entries || []);
        setTotalPlayers(boardRes.data.total || 0);
      } else {
        // Fallback default mocked seed for offline standalone showcase
        setPlayers([
          { rank: 1, user_id: '1', username: 'quantum_pilot', display_name: 'Commander Nova', avatar: '🌌', level: 42, xp: 42000, total_xp: 1245000, coins: 89000, rank_tier: 'LEGEND', streak: 45 },
          { rank: 2, user_id: '2', username: 'cyber_voyager', display_name: 'Aero Vanguard', avatar: '⚡', level: 38, xp: 38000, total_xp: 980000, coins: 64000, rank_tier: 'MASTER', streak: 30 },
          { rank: 3, user_id: '3', username: 'stellar_knight', display_name: 'Sol Sovereign', avatar: '👑', level: 35, xp: 35000, total_xp: 850000, coins: 52000, rank_tier: 'MASTER', streak: 28 },
          { rank: 4, user_id: '4', username: 'astro_haribalan', display_name: 'Haribalan S.', avatar: '🚀', level: character.level, xp: character.xp, total_xp: character.xp, coins: character.coins, rank_tier: 'CHALLENGER', streak: 7 },
        ]);
        setTotalPlayers(4);
      }

      if (rankRes.success && rankRes.data) {
        setMyRank(rankRes.data);
      }
    } catch (err) {
      console.warn('Failed to load leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, [activeTab, page]);

  const totalPages = Math.max(1, Math.ceil(totalPlayers / 10));

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6 max-w-5xl mx-auto select-none pb-16"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-orbitron font-black text-3xl sm:text-4xl text-white mb-1">
            GLOBAL <span className="text-yellow-400">LEADERBOARD</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-inter">
            Real-time server-authoritative rankings across all HB Universe pilots.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-2xl">
          {(['GLOBAL', 'WEEKLY', 'MONTHLY'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setPage(1);
              }}
              className={`px-4 py-1.5 rounded-xl font-orbitron font-black text-xs transition-all ${
                activeTab === tab
                  ? 'bg-yellow-400 text-black shadow-[0_0_15px_rgba(255,229,0,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Your Live Position Card */}
      <div className="rounded-2xl bg-gradient-to-r from-yellow-400/15 via-purple-500/10 to-cyan-400/15 border border-yellow-400/40 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-400 text-black font-orbitron font-black text-xl flex items-center justify-center shadow-lg shrink-0">
            {myRank?.rank ? `#${myRank.rank}` : '#--'}
          </div>
          <div>
            <div className="text-[10px] font-mono text-yellow-400 font-bold uppercase tracking-wider">YOUR LIVE CLOUD RANK</div>
            <div className="font-orbitron font-black text-lg text-white">
              {character.name} <span className="text-xs text-slate-400 font-normal">(@you)</span>
            </div>
            <div className="text-xs font-mono text-slate-300">
              Level {character.level} • {character.xp.toLocaleString()} XP • 🪙 {character.coins.toLocaleString()}
            </div>
          </div>
        </div>

        <button
          onClick={loadLeaderboard}
          className="self-start sm:self-center px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white font-mono text-xs flex items-center gap-2 hover:bg-slate-800"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> REFRESH
        </button>
      </div>

      {/* Ranked Players List */}
      <div className="rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden backdrop-blur-xl shadow-2xl">
        <div className="grid grid-cols-12 px-6 py-3.5 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
          <div className="col-span-2 sm:col-span-1">Rank</div>
          <div className="col-span-6 sm:col-span-5">Pilot Dossier</div>
          <div className="hidden sm:block sm:col-span-2 text-center">Rank Tier</div>
          <div className="col-span-4 sm:col-span-2 text-right">Total XP</div>
          <div className="hidden sm:block sm:col-span-2 text-right">Action</div>
        </div>

        <div className="divide-y divide-slate-900">
          {players.map((p, idx) => {
            const isTop3 = p.rank <= 3;
            const badgeIcon = p.rank === 1 ? '🥇' : p.rank === 2 ? '🥈' : p.rank === 3 ? '🥉' : `#${p.rank}`;
            const isCurrent = p.username === 'astro_haribalan' || (myRank && p.user_id === myRank.user_id);

            return (
              <div
                key={idx}
                className={`grid grid-cols-12 px-6 py-4 items-center transition-colors hover:bg-slate-900/50 ${
                  isCurrent ? 'bg-yellow-400/5 border-l-4 border-yellow-400' : ''
                }`}
              >
                {/* Rank Number / Medal */}
                <div className="col-span-2 sm:col-span-1 font-orbitron font-black text-sm">
                  {isTop3 ? (
                    <span className="text-xl">{badgeIcon}</span>
                  ) : (
                    <span className="text-slate-400">{badgeIcon}</span>
                  )}
                </div>

                {/* Pilot Identity */}
                <div className="col-span-6 sm:col-span-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-lg shrink-0">
                    {p.avatar || '🚀'}
                  </div>
                  <div className="min-w-0">
                    <div className="font-orbitron font-bold text-sm text-white truncate flex items-center gap-2">
                      <span>{p.display_name}</span>
                      {isCurrent && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-yellow-400 text-black font-bold">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      LV {p.level} • @{p.username}
                    </div>
                  </div>
                </div>

                {/* Rank Tier */}
                <div className="hidden sm:block sm:col-span-2 text-center">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-[10px] font-orbitron font-bold">
                    {p.rank_tier || 'CHALLENGER'}
                  </span>
                </div>

                {/* Total XP */}
                <div className="col-span-4 sm:col-span-2 text-right">
                  <div className="font-orbitron font-bold text-sm text-yellow-400">
                    {(p.total_xp || p.xp).toLocaleString()}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">XP ACCUMULATED</div>
                </div>

                {/* Public View Action */}
                <div className="hidden sm:block sm:col-span-2 text-right">
                  <button
                    onClick={() => setSelectedPlayer(p)}
                    className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 ml-auto hover:bg-slate-800 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> DOSSIER
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <div>
            Showing Page <span className="text-white font-bold">{page}</span> of{' '}
            <span className="text-white font-bold">{totalPages}</span> ({totalPlayers} Pilots)
          </div>

          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Public Profile Dossier Modal */}
      <PublicProfileModal
        player={selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
      />
    </motion.div>
  );
};
