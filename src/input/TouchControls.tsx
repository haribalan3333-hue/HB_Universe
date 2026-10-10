import React from 'react';
import { VirtualJoystick } from './VirtualJoystick';
import { Vector2D } from './inputTypes';
import { useUniverseStore } from '../store/universeStore';
import { audioManager } from '../audio/audioManager';

export const TouchControls: React.FC = () => {
  const { nearbyPortal, openWorldModal, characterPosition, setCharacterPosition, setCharacterRotation, setCharacterAnimation } = useUniverseStore();

  const handleJoystickMove = (vec: Vector2D) => {
    const speed = 0.25;
    const newX = characterPosition[0] + vec.x * speed;
    const newZ = characterPosition[2] + vec.y * speed;

    setCharacterPosition([newX, characterPosition[1], newZ]);
    setCharacterRotation(Math.atan2(vec.x, vec.y));
    setCharacterAnimation(vec.x !== 0 || vec.y !== 0 ? 'RUN' : 'IDLE');
  };

  const handleJoystickEnd = () => {
    setCharacterAnimation('IDLE');
  };

  const handleInteract = () => {
    try { audioManager.playClick(); } catch {}
    if (nearbyPortal) {
      openWorldModal(nearbyPortal);
    }
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none z-30 select-none pb-20 sm:pb-6"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 80px)' }}
    >
      {/* Left Virtual Joystick */}
      <div className="absolute bottom-6 left-6 pointer-events-auto">
        <VirtualJoystick onMove={handleJoystickMove} onEnd={handleJoystickEnd} size={110} />
      </div>

      {/* Right Action Buttons */}
      <div className="absolute bottom-6 right-6 pointer-events-auto flex flex-col gap-3 items-end">
        {nearbyPortal && (
          <button
            onClick={handleInteract}
            className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-yellow-400 to-amber-500 text-black font-orbitron font-black text-xs shadow-[0_0_25px_rgba(255,229,0,0.6)] flex flex-col items-center justify-center border-2 border-white animate-pulse"
          >
            <span className="text-sm">⚡</span>
            <span>ENTER</span>
          </button>
        )}
      </div>
    </div>
  );
};
