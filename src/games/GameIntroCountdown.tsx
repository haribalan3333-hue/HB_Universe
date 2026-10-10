import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GameIntroCountdownProps {
  gameTitle: string;
  onComplete: () => void;
}

export const GameIntroCountdown: React.FC<GameIntroCountdownProps> = ({
  gameTitle,
  onComplete,
}) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count <= 0) {
      onComplete();
      return;
    }
    const timer = setTimeout(() => {
      setCount((prev) => prev - 1);
    }, 700);
    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md select-none">
      <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 mb-2">
        {gameTitle}
      </span>
      <h3 className="text-xl font-orbitron font-bold text-slate-300 mb-6">PREPARE FOR BATTLE</h3>

      <AnimatePresence mode="wait">
        <motion.div
          key={count}
          className="text-7xl sm:text-9xl font-black font-orbitron text-yellow-400 neon-text-yellow"
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 1 }}
          exit={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {count > 0 ? count : 'GO!'}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
