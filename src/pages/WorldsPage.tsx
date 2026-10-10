import React from 'react';
import { motion } from 'framer-motion';
import { WorldGrid } from '../components/WorldCard/WorldGrid';
import { pageVariants } from '../animations/transitions';

export const WorldsPage: React.FC = () => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      <div>
        <h1 className="font-orbitron font-black text-3xl sm:text-4xl text-white mb-2">
          ALL <span className="text-yellow-400">WORLDS</span> & DIMENSIONS
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 font-inter">
          Complete catalog of worlds within HB Universe. Each dimension features unique mechanics and rewards.
        </p>
      </div>

      <WorldGrid />
    </motion.div>
  );
};
