import React, { useState } from 'react';
import { Smile, HelpCircle, RefreshCw } from 'lucide-react';
import { demoAIProvider } from '../../ai/DemoAIProvider';
import { useUniverseStore } from '../../store/universeStore';
import { audioManager } from '../../audio/audioManager';

export const EntertainmentHub: React.FC = () => {
  const { addXp, showSpeech, soundEnabled } = useUniverseStore();
  const [joke, setJoke] = useState(() => demoAIProvider.generateJoke());
  const [riddle, setRiddle] = useState(() => demoAIProvider.generateRiddle());
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleNextJoke = () => {
    if (soundEnabled) audioManager.playClick();
    setJoke(demoAIProvider.generateJoke());
    addXp(5);
  };

  const handleNextRiddle = () => {
    if (soundEnabled) audioManager.playClick();
    setRiddle(demoAIProvider.generateRiddle());
    setShowHint(false);
    setShowAnswer(false);
    addXp(5);
  };

  const handleSolveRiddle = () => {
    setShowAnswer(true);
    addXp(10);
    showSpeech('🧠 RIDDLE SOLVED: +10 XP!', 2500);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Joke Generator Card */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-pink-500/30 flex flex-col justify-between space-y-4 shadow-xl backdrop-blur-xl">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono text-pink-400 uppercase font-bold flex items-center gap-1.5">
              <Smile className="w-4 h-4" /> AI COMEDY PROTOCOL
            </span>
            <span className="text-[10px] font-mono text-slate-500">{joke.tag}</span>
          </div>

          <div className="my-6 space-y-3">
            <h4 className="text-base sm:text-lg font-orbitron font-bold text-white">
              &quot;{joke.setup}&quot;
            </h4>
            <p className="text-sm font-inter text-pink-300 font-medium italic">
              ➔ {joke.punchline}
            </p>
          </div>
        </div>

        <button
          onClick={handleNextJoke}
          className="w-full py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-orbitron text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>ANOTHER JOKE (+5 XP)</span>
        </button>
      </div>

      {/* Riddle Generator Card */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-purple-500/30 flex flex-col justify-between space-y-4 shadow-xl backdrop-blur-xl">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono text-purple-400 uppercase font-bold flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" /> QUANTUM RIDDLE ORACLE
            </span>
          </div>

          <div className="my-6 space-y-3">
            <p className="text-sm sm:text-base font-orbitron font-medium text-white leading-relaxed">
              &quot;{riddle.riddle}&quot;
            </p>

            {showHint && (
              <p className="text-xs font-mono text-cyan-400 bg-slate-950 p-2.5 rounded-xl border border-cyan-500/20">
                💡 HINT: {riddle.hint}
              </p>
            )}

            {showAnswer && (
              <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/40 text-xs font-inter text-purple-200">
                <span className="font-bold">ANSWER: {riddle.answer}</span>
                <p className="text-[11px] text-slate-300 mt-1">{riddle.explanation}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!showHint && (
            <button
              onClick={() => setShowHint(true)}
              className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-orbitron font-bold text-slate-300 cursor-pointer"
            >
              HINT
            </button>
          )}

          {!showAnswer ? (
            <button
              onClick={handleSolveRiddle}
              className="flex-1 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-xs font-orbitron font-bold text-white cursor-pointer"
            >
              REVEAL ANSWER
            </button>
          ) : (
            <button
              onClick={handleNextRiddle}
              className="w-full py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-xs font-orbitron font-bold text-white flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>NEXT RIDDLE (+5 XP)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
