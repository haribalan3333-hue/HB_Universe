import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { PwaManager } from './PwaManager';

export const InstallPromptModal: React.FC = () => {
  const [canInstall, setCanInstall] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    PwaManager.init(() => {
      if (!sessionStorage.getItem('hb_install_dismissed')) {
        setCanInstall(true);
      }
    });
  }, []);

  const handleInstall = async () => {
    const success = await PwaManager.promptInstall();
    if (success) setCanInstall(false);
  };

  const handleDismiss = () => {
    setDismissed(true);
    setCanInstall(false);
    sessionStorage.setItem('hb_install_dismissed', 'true');
  };

  if (!canInstall || dismissed) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 bg-slate-950 border border-yellow-400/50 rounded-3xl p-4 sm:p-5 shadow-[0_0_40px_rgba(255,229,0,0.25)] text-white backdrop-blur-2xl select-none">
      <button onClick={handleDismiss} className="absolute top-4 right-4 text-slate-400 hover:text-white">
        <X className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-3.5 mb-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-yellow-400 to-amber-500 p-0.5 shadow-lg shrink-0">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-orbitron font-black text-yellow-400 text-lg">
            HB
          </div>
        </div>
        <div>
          <h4 className="font-orbitron font-black text-sm text-white">INSTALL HB UNIVERSE</h4>
          <p className="text-[11px] font-mono text-slate-400">Play offline & enjoy full-screen app mode</p>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={handleInstall}
          className="flex-1 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-orbitron font-black text-xs hover:scale-105 transition-transform flex items-center justify-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" /> INSTALL APP
        </button>
        <button
          onClick={handleDismiss}
          className="px-3 py-2 rounded-xl bg-slate-900 text-slate-400 font-mono text-xs hover:bg-slate-800"
        >
          LATER
        </button>
      </div>
    </div>
  );
};
