import React from 'react';
import { WorldCard } from './WorldCard';
import { WORLDS_DATA } from '../../data/worlds';

export const WorldGrid: React.FC = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {WORLDS_DATA.map((world, index) => (
          <WorldCard key={world.id} world={world} index={index} />
        ))}
      </div>
    </div>
  );
};
