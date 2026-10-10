import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Shield, CheckCircle2, Cloud, Download, Lock, Unlock, Activity as ActivityIcon } from 'lucide-react';
import { useUniverseStore } from '../store/universeStore';
import { ACHIEVEMENTS_REGISTRY } from '../achievements/AchievementRegistry';
import { CHARACTER_LORE } from '../data/character';
import { pageVariants } from '../animations/transitions';
import { getRankForLevel, getNextRank } from '../progression/RankManager';
import { loadStreakState } from '../progression/StreakManager';
import { calculateLevelProgress } from '../data/progression';
import { useAuth } from '../auth/AuthManager';
import { userApi } from '../api/userApi';
import { syncApi } from '../api/syncApi';

export const ProfilePage: React.FC = () => {
  const { character } = useUniverseStore();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [exporting, setExporting] = useState(false);

  const rank = getRankForLevel(character.level);
  const nextRank = getNextRank(character.level);
  const streak = loadStreakState();
  const levelPercent = calculateLevelProgress(character.xp, character.maxXp);

  useEffect(() => {
    if (isAuthenticated) {
      userApi.getActivity().then(res => {
        if (res.success && res.data) {
          setActivities(res.data);
        }
      });
    }
  }, [isAuthenticated]);

  const handleExportData = async () => {
    setExporting(true);
    try {
      const res = await syncApi.exportUserData();
      if (res.success && res.data) {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(res.data, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute('download', `hb_universe_dossier_${user?.username || 'pilot'}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
      }
    } catch (err) {
      console.warn('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  const stats = [
    { label: 'CURRENT LEVEL', value: `LV ${character.level}`, icon: '⚡' },
    { label: 'RANK TIER', value: rank.tier, icon: '🏆' },
    { label: 'COINS VAULT', value: `🪙 ${character.coins.toLocaleString()}`, icon: '💰' },
    { label: 'ACTIVITY STREAK', value: `${streak.currentStreak} DAYS`, icon: '🔥' },
    { label: 'RECORD STREAK', value: `${streak.longestStreak} DAYS`, icon: '⭐' },
    { label: 'MYSTERY ACCESS', value: character.level >= 20 ? 'UNLOCKED' : 'LOCKED (LV 20)', icon: '🔑' },
  ];

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-8 max-w-5xl mx-auto select-none pb-16"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-orbitron font-black text-3xl sm:text-4xl text-white mb-1">
            NAVIGATOR <span className="text-yellow-400">DOSSIER</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-inter">
            Phase 12 Cloud-Backed Identity, Authoritative Progression & Activity Feed.
          </p>
        </div>

        {/* Cloud Account Status Bar */}
        <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-2.5 px-4 backdrop-blur-xl">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400 text-cyan-400 flex items-center justify-center font-bold">
                {user.avatar || '🚀'}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-orbitron text-xs font-bold text-white">{user.display_name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 font-mono font-bold flex items-center gap-0.5">
                    <Cloud className="w-2.5 h-2.5" /> CLOUD SYNCED
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-400">@{user.username}</div>
              </div>
              <button
                onClick={logout}
                className="ml-2 text-xs text-red-400 hover:text-red-300 font-mono underline"
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="text-xs text-slate-400 font-mono">
                <span className="text-amber-400 font-bold">GUEST MODE</span> (Local Storage)
              </div>
              <button
                onClick={() => openAuthModal('login')}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs font-orbitron font-black hover:scale-105 transition-transform"
              >
                LINK HB ID
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Profile Header Box */}
      <div className="rounded-3xl bg-slate-950 border border-yellow-400/40 p-6 sm:p-8 relative overflow-hidden shadow-[0_0_80px_rgba(255,229,0,0.15)] backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
          <div className="relative w-28 h-28 rounded-2xl p-1 bg-gradient-to-tr from-yellow-400 via-purple-500 to-cyan-400 shadow-[0_0_30px_rgba(255,229,0,0.4)] shrink-0">
            <div className="w-full h-full rounded-xl overflow-hidden bg-slate-950 border border-yellow-400">
              <img
                src="/images/hb_pilot.png"
                alt="HB Pilot Commander"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/hb_logo.png';
                }}
              />
            </div>
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h2 className="font-orbitron font-black text-2xl text-white">{character.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-yellow-400 text-black text-xs font-bold font-mono">
                LV {character.level}
              </span>
              <span
                style={{ backgroundColor: `${rank.color}25`, color: rank.color, borderColor: `${rank.color}60` }}
                className="px-2.5 py-0.5 rounded-full text-xs font-bold font-orbitron border"
              >
                {rank.badge}
              </span>
            </div>
            <p className="text-xs text-yellow-400 font-mono mb-1">{CHARACTER_LORE.codename} • {CHARACTER_LORE.classType}</p>
            <p className="text-xs text-slate-400 font-inter italic">&quot;{CHARACTER_LORE.quote}&quot;</p>

            <div className="mt-4">
              <div className="flex justify-between text-[11px] font-mono text-slate-300 mb-1">
                <span>XP PROGRESS: {character.xp} / {character.maxXp} XP</span>
                <span>{levelPercent}%</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-gradient-to-r from-yellow-400 to-amber-500" style={{ width: `${levelPercent}%` }} />
              </div>
              {nextRank && (
                <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                  Next Rank: {nextRank.title} ({nextRank.badge}) at Level {nextRank.minLevel}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 6 Grid Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {stats.map((st, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <span className="text-lg">{st.icon}</span>
              <p className="text-[10px] font-mono text-slate-400 mt-1">{st.label}</p>
              <p className="font-orbitron font-bold text-xs text-white mt-0.5">{st.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Feed & Data Export Action */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2 rounded-3xl bg-slate-950 border border-slate-800 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-orbitron font-bold text-lg text-white flex items-center gap-2">
              <ActivityIcon className="w-5 h-5 text-cyan-400" />
              <span>RECENT CLOUD ACTIVITY</span>
            </h3>
            <span className="text-xs font-mono text-slate-500">LIVE FEED</span>
          </div>

          <div className="space-y-3">
            {activities.length > 0 ? (
              activities.slice(0, 5).map((act, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">⚡</span>
                    <div>
                      <div className="font-orbitron font-bold text-xs text-white">{act.type}</div>
                      <div className="text-[11px] font-inter text-slate-400">{act.entityId || 'Multiverse Action'}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    {act.createdAt ? new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-slate-500 font-mono">
                No recent cloud activities logged. Play games or complete challenges to populate feed.
              </div>
            )}
          </div>
        </div>

        {/* Data & Privacy Controls */}
        <div className="rounded-3xl bg-slate-950 border border-slate-800 p-6 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <h3 className="font-orbitron font-bold text-lg text-white mb-2">CLOUD DATA MANAGEMENT</h3>
            <p className="text-xs text-slate-400 font-inter mb-6">
              Export your full authenticated universe dossier or adjust public leaderboard visibility.
            </p>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isPrivate ? <Lock className="w-4 h-4 text-amber-400" /> : <Unlock className="w-4 h-4 text-emerald-400" />}
                  <span className="font-orbitron text-xs font-bold text-white">LEADERBOARD PRIVACY</span>
                </div>
                <button
                  onClick={() => setIsPrivate(!isPrivate)}
                  className="px-2.5 py-1 rounded bg-slate-800 text-[10px] font-mono text-slate-300 hover:text-white"
                >
                  {isPrivate ? 'PRIVATE' : 'PUBLIC'}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleExportData}
            disabled={exporting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-orbitron font-black text-xs hover:scale-105 transition-transform flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{exporting ? 'EXPORTING...' : 'EXPORT DOSSIER (JSON)'}</span>
          </button>
        </div>
      </div>

      {/* Global Achievements Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-orbitron font-bold text-xl text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-yellow-400" />
            <span>MULTIVERSE ACHIEVEMENTS</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {ACHIEVEMENTS_REGISTRY.filter((a) => a.unlocked).length} / {ACHIEVEMENTS_REGISTRY.length} UNLOCKED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ACHIEVEMENTS_REGISTRY.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl bg-slate-900/80 border flex items-start gap-3.5 backdrop-blur-xl transition-all ${
                ach.unlocked ? 'border-yellow-400/40 shadow-lg' : 'border-slate-800 opacity-60'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 shrink-0">
                <Award className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-orbitron font-bold text-sm text-white truncate">{ach.title}</h4>
                  {ach.unlocked ? (
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 shrink-0 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> UNLOCKED
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-500 shrink-0">
                      {ach.progress}/{ach.maxProgress}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 font-inter mt-1 leading-relaxed">
                  {ach.description}
                </p>

                <div className="text-[10px] font-mono text-yellow-400 mt-2 flex items-center gap-2">
                  <span>+{ach.xpReward} XP</span>
                  <span>•</span>
                  <span>🪙 +{ach.coinReward} COINS</span>
                  <span className="ml-auto text-[9px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase font-bold">
                    {ach.rarity}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
