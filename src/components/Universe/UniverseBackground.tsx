import React, { useEffect, useState } from 'react';
import { StarfieldCanvas } from './StarfieldCanvas';
import { useUniverseStore } from '../../store/universeStore';

export const UniverseBackground: React.FC = () => {
  const { isWarping, reducedMotion } = useUniverseStore();
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20;
      const y = (e.clientY / innerHeight - 0.5) * 20;
      setMouseOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [reducedMotion]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Layer 1: Dark Gradient & Radial Cosmic Glows */}
      <div className="absolute inset-0 bg-[#050505]" />
      <div className="absolute inset-0 bg-universe-radial opacity-80" />

      {/* Layer 2: Starfield Particle Field */}
      <StarfieldCanvas isWarping={isWarping} />

      {/* Layer 3: Floating Cyber Grid */}
      <div 
        className="absolute inset-0 bg-cyber-grid opacity-30 transition-transform duration-700 ease-out"
        style={{
          transform: reducedMotion ? 'none' : `translate(${mouseOffset.x * 0.5}px, ${mouseOffset.y * 0.5}px)`,
        }}
      />

      {/* Layer 4: Distant Futuristic City Silhouette & Skyline Energy Beacons */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-44 opacity-25 transition-transform duration-1000 ease-out flex items-end justify-between px-4"
        style={{
          transform: reducedMotion ? 'none' : `translate(${mouseOffset.x * -0.8}px, ${mouseOffset.y * -0.4}px)`,
        }}
      >
        {/* SVG Futuristic Skyline Silhouette */}
        <svg
          className="w-full h-full text-[#141428]"
          viewBox="0 0 1440 220"
          fill="none"
          preserveAspectRatio="none"
        >
          {/* Distant Towers */}
          <path
            d="M0 220 L0 180 L40 180 L60 140 L90 140 L100 120 L130 120 L140 160 L180 160 L200 90 L230 90 L240 150 L290 150 L310 110 L340 110 L360 180 L420 180 L440 70 L470 70 L490 170 L540 170 L560 130 L600 130 L620 60 L650 60 L670 160 L720 160 L750 100 L780 100 L810 170 L860 170 L880 80 L920 80 L940 150 L990 150 L1020 120 L1060 120 L1080 180 L1140 180 L1160 90 L1200 90 L1220 160 L1280 160 L1300 130 L1350 130 L1370 170 L1440 170 L1440 220 Z"
            fill="currentColor"
          />
          {/* Cyber Antenna Neon Points */}
          <circle cx="215" cy="85" r="2.5" fill="#00F0FF" className="animate-ping" />
          <circle cx="455" cy="65" r="2.5" fill="#FFE500" className="animate-pulse" />
          <circle cx="635" cy="55" r="3" fill="#FF2A55" className="animate-ping" />
          <circle cx="900" cy="75" r="2.5" fill="#00F0FF" className="animate-pulse" />
          <circle cx="1180" cy="85" r="2.5" fill="#FFE500" className="animate-ping" />
        </svg>
      </div>

      {/* Layer 5: Ambient Neon Auroras */}
      <div className="absolute -top-40 left-1/4 w-[450px] h-[450px] rounded-full bg-yellow-500/10 blur-[130px]" />
      <div className="absolute -bottom-40 right-1/4 w-[450px] h-[450px] rounded-full bg-cyan-500/10 blur-[130px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-purple-900/10 blur-[170px]" />
    </div>
  );
};
