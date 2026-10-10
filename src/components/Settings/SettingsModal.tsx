import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Volume2, VolumeX, Sparkles, Eye, ShieldCheck, Box } from 'lucide-react';
import { useUniverseStore } from '../../store/universeStore';
import { audioManager } from '../../audio/audioManager';
import { QualityMode } from '../../types';

export const SettingsModal: React.FC = () => {
  const {
    settingsOpen,
    setSettingsOpen,
    soundEnabled,
    toggleSound,
    effectsEnabled,
    toggleEffects,
    reducedMotion,
    toggleReducedMotion,
    use3DScene,
    toggle3DScene,
    qualityMode,
    setQualityMode,
  } = useUniverseStore();

  if (!settingsOpen) return null;

  const handleClose = () => {
    if (soundEnabled) audioManager.playClick();
    setSettingsOpen(false);
  };

  const handleToggleSound = () => {
    toggleSound();
    if (!soundEnabled) audioManager.playClick();
  };

  const handleToggleEffects = () => {
    if (soundEnabled) audioManager.playClick();
    toggleEffects();
  };

  const handleToggleMotion = () => {
    if (soundEnabled) audioManager.playClick();
    toggleReducedMotion();
  };

  const handleToggle3D = () => {
    if (soundEnabled) audioManager.playClick();
    toggle3DScene();
  };

  const qualityOptions: QualityMode[] = ['AUTO', 'HIGH', 'MEDIUM', 'LOW'];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-md bg-slate-900/90 border border-yellow-400/30 rounded-3xl p-6 shadow-[0_0_50px_rgba(255,229,0,0.15)]"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-yellow-400">
                <Settings className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-wide">
                  SYSTEM SETTINGS
                </h3>
                <p className="text-xs text-slate-400">HB Universe Preferences (Phase 3)</p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Setting Items */}
          <div className="py-4 space-y-3.5">
            {/* 3D Scene Environment Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Box className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">3D Universe Scene</div>
                  <div className="text-xs text-slate-400">Real-time Three.js floating city</div>
                </div>
              </div>
              <button
                onClick={handleToggle3D}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
                  use3DScene ? 'bg-yellow-400' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-black transition-transform duration-200 ${
                    use3DScene ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Quality Mode Selector */}
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="text-xs font-semibold text-slate-300 mb-2 font-mono uppercase">
                3D Visual Quality Profile
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {qualityOptions.map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      if (soundEnabled) audioManager.playClick();
                      setQualityMode(q);
                    }}
                    className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      qualityMode === q
                        ? 'bg-yellow-400 text-black shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Audio Synthesizer</div>
                  <div className="text-xs text-slate-400">Atmospheric & portal sound FX</div>
                </div>
              </div>
              <button
                onClick={handleToggleSound}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
                  soundEnabled ? 'bg-yellow-400' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-black transition-transform duration-200 ${
                    soundEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Visual Effects Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">High Visual Effects</div>
                  <div className="text-xs text-slate-400">Glow particles & matrix flares</div>
                </div>
              </div>
              <button
                onClick={handleToggleEffects}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
                  effectsEnabled ? 'bg-yellow-400' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-black transition-transform duration-200 ${
                    effectsEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Reduced Motion Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Reduced Motion</div>
                  <div className="text-xs text-slate-400">Mute 3D camera float & parallax</div>
                </div>
              </div>
              <button
                onClick={handleToggleMotion}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
                  reducedMotion ? 'bg-yellow-400' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-black transition-transform duration-200 ${
                    reducedMotion ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* System Footer */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Phase 3 Engine Active</span>
            </div>
            <span>v3.0.0</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
