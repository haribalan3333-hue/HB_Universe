import React, { useState } from 'react';
import { Navigation, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useUniverseStore } from '../../store/universeStore';

export const DesktopControlsHelp: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { setCustomizerOpen, setProfileModalOpen } = useUniverseStore();

  return (
    <div className="hidden md:block fixed bottom-6 left-6 z-30 select-none">
      <div className="bg-slate-950/90 border border-yellow-400/40 rounded-2xl p-3 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] transition-all">
        {/* Header */}
        <div
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-between gap-3 cursor-pointer pb-1"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-yellow-400/20 text-yellow-400 flex items-center justify-center">
              <Navigation className="w-3.5 h-3.5" />
            </div>
            <span className="font-orbitron font-bold text-xs text-white">PILOT CONTROLS</span>
          </div>

          <button className="text-slate-400 hover:text-white">
            {collapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {!collapsed && (
          <div className="mt-2 space-y-1.5 text-[11px] font-mono text-slate-300 border-t border-slate-800 pt-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">MOVE</span>
              <span className="text-yellow-400 font-bold">W A S D / ARROWS</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">RUN SPRINT</span>
              <span className="text-cyan-400 font-bold">HOLD SHIFT</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">INTERACT</span>
              <span className="text-emerald-400 font-bold">PRESS E</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">CELEBRATE</span>
              <span className="text-purple-400 font-bold">SPACEBAR</span>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => setCustomizerOpen(true)}
                className="flex-1 py-1 rounded bg-yellow-400/10 hover:bg-yellow-400/20 border border-yellow-400/30 text-yellow-400 text-[10px] font-bold text-center transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                CUSTOMIZE
              </button>
              <button
                onClick={() => setProfileModalOpen(true)}
                className="flex-1 py-1 rounded bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/30 text-cyan-300 text-[10px] font-bold text-center transition-all cursor-pointer"
              >
                DOSSIER
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
