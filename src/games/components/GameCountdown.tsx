import React, { useState, useEffect } from 'react';

interface GameCountdownProps {
  onComplete: () => void;
}

export const GameCountdown: React.FC<GameCountdownProps> = ({ onComplete }) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 700);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => onComplete(), 500);
      return () => clearTimeout(timer);
    }
  }, [count, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none pointer-events-none">
      <div className="text-center animate-bounce">
        <div className="font-orbitron font-black text-7xl sm:text-9xl text-yellow-400 drop-shadow-[0_0_40px_rgba(255,229,0,0.8)]">
          {count > 0 ? count : 'GO!'}
        </div>
        <p className="font-mono text-sm text-cyan-400 tracking-widest uppercase mt-4">
          ENGAGING QUANTUM CORE
        </p>
      </div>
    </div>
  );
};
