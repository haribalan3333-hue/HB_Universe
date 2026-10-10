import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { QuizData } from '../../ai/aiTypes';
import { demoAIProvider } from '../../ai/DemoAIProvider';
import { useUniverseStore } from '../../store/universeStore';
import { audioManager } from '../../audio/audioManager';

export const QuizLab: React.FC = () => {
  const { addXp, addCoins, showSpeech, soundEnabled } = useUniverseStore();
  const [quiz, setQuiz] = useState<QuizData>(() => demoAIProvider.generateQuiz('HB Multiverse & AI'));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const currentQ = quiz.questions[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return;
    if (soundEnabled) audioManager.playClick();
    setSelectedOption(idx);

    if (idx === currentQ.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < quiz.questions.length - 1) {
      setCurrentIdx((c) => c + 1);
      setSelectedOption(null);
    } else {
      setCompleted(true);
      const xpEarned = quiz.xpReward + score * 5;
      addXp(xpEarned);
      addCoins(score * 5);
      showSpeech(`🎯 QUIZ FINISHED: ${score}/${quiz.questions.length} CORRECT • +${xpEarned} XP!`, 4000);
    }
  };

  const handleRestart = () => {
    setQuiz(demoAIProvider.generateQuiz('HB Multiverse & AI'));
    setCurrentIdx(0);
    setSelectedOption(null);
    setScore(0);
    setCompleted(false);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-widest">
              KNOWLEDGE TRIALS
            </span>
            <h3 className="text-lg font-orbitron font-bold text-white">
              AI Multiverse Quiz
            </h3>
          </div>
        </div>
      </div>

      {!completed ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-cyan-500/30 space-y-6 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-400 font-bold">
              QUESTION {currentIdx + 1} OF {quiz.questions.length}
            </span>
            <span className="text-slate-400">SCORE: {score}</span>
          </div>

          <h3 className="text-base sm:text-lg font-orbitron font-bold text-white">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = selectedOption === optIdx;
              const isCorrect = optIdx === currentQ.correctIndex;
              const showResult = selectedOption !== null;

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-inter transition-all flex items-center justify-between cursor-pointer ${
                    showResult
                      ? isCorrect
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                        : isSelected
                        ? 'bg-red-500/20 border-red-500 text-red-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-500 opacity-60'
                      : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-200'
                  }`}
                >
                  <span>{opt}</span>
                  {showResult && (
                    <span>
                      {isCorrect ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : isSelected ? <XCircle className="w-4 h-4 text-red-400" /> : null}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation if answered */}
          {selectedOption !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-inter text-slate-300"
            >
              <span className="font-bold text-cyan-400">EXPLANATION: </span>
              {currentQ.explanation}
            </motion.div>
          )}

          {selectedOption !== null && (
            <button
              onClick={handleNext}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-orbitron text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              {currentIdx === quiz.questions.length - 1 ? 'VIEW FINAL RESULTS' : 'NEXT QUESTION ➔'}
            </button>
          )}
        </div>
      ) : (
        /* Results Screen */
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-cyan-500/40 text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 mx-auto">
            <Brain className="w-10 h-10" />
          </div>

          <h2 className="text-3xl font-black font-orbitron text-white">QUIZ COMPLETED!</h2>
          <p className="text-base font-mono text-cyan-300">
            Final Score: {score} / {quiz.questions.length} Correct
          </p>

          <button
            onClick={handleRestart}
            className="px-6 py-3 rounded-xl bg-cyan-500 text-black font-orbitron text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>PLAY ANOTHER QUIZ</span>
          </button>
        </div>
      )}
    </div>
  );
};
