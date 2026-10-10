import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check } from 'lucide-react';
import { AICharacter } from '../../ai/aiTypes';
import { AI_CHARACTERS } from '../../ai/AICharacters';
import { audioManager } from '../../audio/audioManager';
import { useUniverseStore } from '../../store/universeStore';

interface AICharacterSelectorProps {
  selectedCharacter: AICharacter;
  onSelectCharacter: (char: AICharacter) => void;
}

export const AICharacterSelector: React.FC<AICharacterSelectorProps> = ({
  selectedCharacter,
  onSelectCharacter,
}) => {
  const { soundEnabled, addXp } = useUniverseStore();

  const handleSelect = (char: AICharacter) => {
    if (soundEnabled) audioManager.playClick();
    onSelectCharacter(char);
    addXp(5);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono text-yellow-400 font-bold uppercase tracking-widest">
            NEURAL PERSONAS
          </span>
          <h3 className="text-lg font-orbitron font-bold text-white">
            Select Active AI Companion
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">{AI_CHARACTERS.length} AI Personas Available</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {AI_CHARACTERS.map((char) => {
          const isSelected = selectedCharacter.id === char.id;

          return (
            <motion.div
              key={char.id}
              whileHover={{ y: -4 }}
              onClick={() => handleSelect(char)}
              style={{
                borderColor: isSelected ? char.color : undefined,
                boxShadow: isSelected ? `0 0 30px ${char.color}35` : undefined,
              }}
              className={`p-5 rounded-2xl bg-slate-900/80 border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected ? 'border-2' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl p-2 rounded-xl bg-slate-950 border border-slate-800">
                    {char.avatar}
                  </span>
                  {isSelected ? (
                    <span
                      style={{ backgroundColor: `${char.color}25`, color: char.color }}
                      className="text-[10px] font-mono px-2.5 py-1 rounded-md font-bold flex items-center gap-1 border border-current"
                    >
                      <Check className="w-3 h-3" /> ACTIVE COMPANION
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-500">TAP TO ACTIVATE</span>
                  )}
                </div>

                <h4 className="font-orbitron font-bold text-base text-white">{char.name}</h4>
                <p className="text-xs font-mono text-yellow-400/90 mt-0.5">{char.role}</p>
                <p className="text-xs text-slate-300 font-inter mt-2 leading-relaxed">
                  {char.tagline}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="truncate max-w-[180px]">{char.specialty}</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
