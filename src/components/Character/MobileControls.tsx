import React, { useRef } from 'react';
import { Zap } from 'lucide-react';
import { useUniverseStore } from '../../store/universeStore';

export const MobileControls: React.FC = () => {
  const {
    nearbyPortal,
    setJoystickVector,
    initiatePortalTravel,
    isTraveling,
  } = useUniverseStore();

  const joystickRef = useRef<HTMLDivElement>(null);

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!joystickRef.current || isTraveling) return;
    const touch = e.touches[0];
    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;
    const maxRadius = rect.width / 2;

    const normX = Math.min(1, Math.max(-1, dx / maxRadius));
    const normY = Math.min(1, Math.max(-1, dy / maxRadius));

    setJoystickVector({ x: normX, y: normY });
  };

  const handleTouchEnd = () => {
    setJoystickVector({ x: 0, y: 0 });
  };

  const handleInteract = () => {
    if (!nearbyPortal || isTraveling) return;
    initiatePortalTravel(nearbyPortal.id);
  };

  return (
    <div className="md:hidden fixed inset-x-0 bottom-20 z-40 px-6 flex items-center justify-between pointer-events-none select-none">
      {/* Virtual Joystick */}
      <div
        ref={joystickRef}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="pointer-events-auto w-28 h-28 rounded-full bg-slate-900/80 border-2 border-yellow-400/40 backdrop-blur-md flex items-center justify-center shadow-[0_0_25px_rgba(0,0,0,0.8)]"
      >
        <div className="w-12 h-12 rounded-full bg-yellow-400/30 border border-yellow-400 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-yellow-400 shadow-neon-yellow" />
        </div>
      </div>

      {/* Action Button: Enter nearby portal */}
      {nearbyPortal && (
        <button
          onClick={handleInteract}
          className="pointer-events-auto w-20 h-20 rounded-full bg-yellow-400 border-2 border-black text-black font-orbitron font-black text-xs shadow-neon-yellow flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform cursor-pointer"
        >
          <Zap className="w-6 h-6 fill-black" />
          <span>ENTER</span>
        </button>
      )}
    </div>
  );
};
