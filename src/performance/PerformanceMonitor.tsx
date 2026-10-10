import React, { useState, useEffect } from 'react';
import { QualityManager } from './QualityManager';
import { Activity } from 'lucide-react';

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState(QualityManager.getMetrics());
  const visible = false; // Set to true in developer mode

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(QualityManager.getMetrics());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed bottom-24 right-4 z-50 bg-slate-950/90 border border-cyan-400/40 rounded-2xl p-3 font-mono text-[11px] text-white shadow-2xl backdrop-blur-md">
      <div className="flex items-center gap-2 mb-1.5 text-cyan-400 font-bold font-orbitron">
        <Activity className="w-3.5 h-3.5" />
        <span>PERF HUD</span>
      </div>
      <div>FPS: <span className="font-bold text-yellow-400">{metrics.fps}</span></div>
      <div>TIER: <span className="font-bold text-cyan-400">{metrics.tier}</span></div>
      <div>DPR: <span className="font-bold text-white">{metrics.dpr.toFixed(2)}</span></div>
      <div>PARTICLES: <span className="font-bold text-slate-300">{metrics.particleBudget}</span></div>
    </div>
  );
};
