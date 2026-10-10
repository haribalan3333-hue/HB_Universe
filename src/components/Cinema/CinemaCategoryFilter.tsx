import React from 'react';
import { CINEMA_CATEGORIES, MediaType } from '../../data/media';
import { audioManager } from '../../audio/audioManager';
import { useUniverseStore } from '../../store/universeStore';

interface CinemaCategoryFilterProps {
  selectedCategory: MediaType | 'all' | 'favorites';
  onSelectCategory: (cat: MediaType | 'all' | 'favorites') => void;
}

export const CinemaCategoryFilter: React.FC<CinemaCategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const { soundEnabled } = useUniverseStore();

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none select-none">
      {CINEMA_CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => {
              if (soundEnabled) audioManager.playClick();
              onSelectCategory(cat.id);
            }}
            className={`px-4 py-2 rounded-xl font-orbitron text-xs font-bold tracking-wider transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              isSelected
                ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(255,42,85,0.5)] border border-red-400'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};
