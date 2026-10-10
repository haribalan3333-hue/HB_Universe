import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Clock, CheckCircle, XCircle, Zap } from 'lucide-react';
import { ChallengeItem } from '../../data/challenges';
import { useUniverseStore } from '../../store/universeStore';
import { audioManager } from '../../audio/audioManager';
import { recordDailyActivity } from '../../progression/StreakManager';

interface ChallengeSessionModalProps {
  challenge: ChallengeItem;
  onClose: () => void;
  onComplete: (results: {
    score: number;
    accuracy: number;
    timeTakenSeconds: number;
    xpEarned: number;
    coinsEarned: number;
  }) => void;
}

export const ChallengeSessionModal: React.FC<ChallengeSessionModalProps> = ({
  challenge,
  onClose,
  onComplete,
}) => {
  const { addXp, addCoins, showSpeech, soundEnabled } = useUniverseStore();
  const [timeLeft, setTimeLeft] = useState(challenge.timeLimitSeconds);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Reaction challenge state
  const [reactionState, setReactionState] = useState<'WAIT' | 'READY' | 'CLICK' | 'DONE'>('WAIT');
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const reactionStartTime = useRef<number>(0);
  const reactionTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimeRef = useRef<number>(Date.now());

  // Countdown timer
  useEffect(() => {
    if (challenge.category === 'REACTION') return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishChallenge();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [challenge]);

  // Reaction Challenge Flow
  useEffect(() => {
    if (challenge.category !== 'REACTION') return;

    if (reactionState === 'WAIT') {
      const delay = 1500 + Math.random() * 2500;
      reactionTimerRef.current = setTimeout(() => {
        setReactionState('CLICK');
        reactionStartTime.current = Date.now();
      }, delay);
    }

    return () => {
      if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);
    };
  }, [reactionState, challenge.category]);

  const handleReactionClick = () => {
    if (reactionState === 'WAIT') {
      if (soundEnabled) audioManager.playClick();
      setReactionState('WAIT');
      alert('FALSE START! Wait for the hyper-glow signal.');
      return;
    }

    if (reactionState === 'CLICK') {
      const ms = Date.now() - reactionStartTime.current;
      const nextTimes = [...reactionTimes, ms];
      setReactionTimes(nextTimes);

      if (nextTimes.length >= 3) {
        setReactionState('DONE');
        const avg = Math.round(nextTimes.reduce((a, b) => a + b, 0) / nextTimes.length);
        const score = Math.max(100, 1000 - avg * 2);
        const xpEarned = challenge.xpReward;
        const coinsEarned = challenge.coinReward;

        addXp(xpEarned);
        addCoins(coinsEarned);
        recordDailyActivity();

        onComplete({
          score,
          accuracy: 100,
          timeTakenSeconds: Math.round((Date.now() - startTimeRef.current) / 1000),
          xpEarned,
          coinsEarned,
        });
      } else {
        setReactionState('WAIT');
      }
    }
  };

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return;
    if (soundEnabled) audioManager.playClick();
    setSelectedOption(idx);

    const q = challenge.questions[currentQIndex];
    if (idx === q.correctIndex) {
      setCorrectAnswers((c) => c + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex < challenge.questions.length - 1) {
      setCurrentQIndex((c) => c + 1);
      setSelectedOption(null);
      setShowHint(false);
    } else {
      finishChallenge();
    }
  };

  const finishChallenge = () => {
    const totalQ = challenge.questions.length || 1;
    const finalScore = Math.round((correctAnswers / totalQ) * 1000);
    const accuracy = Math.round((correctAnswers / totalQ) * 100);
    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000);

    const xpEarned = Math.floor(challenge.xpReward * (accuracy / 100 + 0.5));
    const coinsEarned = Math.floor(challenge.coinReward * (accuracy / 100 + 0.5));

    addXp(xpEarned);
    addCoins(coinsEarned);
    recordDailyActivity();
    showSpeech(`🏆 CHALLENGE COMPLETE: +${xpEarned} XP!`, 3500);

    onComplete({
      score: finalScore,
      accuracy,
      timeTakenSeconds: timeTaken,
      xpEarned,
      coinsEarned,
    });
  };

  const currentQ = challenge.questions[currentQIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-2xl rounded-3xl bg-slate-950 border border-cyan-400/40 p-6 sm:p-8 flex flex-col justify-between shadow-[0_0_80px_rgba(0,240,255,0.3)] max-h-[90vh] overflow-y-auto"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-widest">
              {challenge.category} ARENA TRIAL
            </span>
            <h3 className="text-base sm:text-lg font-orbitron font-bold text-white">
              {challenge.title}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {challenge.category !== 'REACTION' && (
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-cyan-400/30 text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> {timeLeft}s
              </span>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 hover:border-red-500 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* REACTION ARENA VIEW */}
        {challenge.category === 'REACTION' ? (
          <div className="my-10 flex flex-col items-center justify-center text-center space-y-6">
            <span className="text-xs font-mono text-slate-400">
              ROUND {reactionTimes.length + 1} OF 3
            </span>

            <motion.div
              onClick={handleReactionClick}
              whileTap={{ scale: 0.95 }}
              className={`w-64 h-64 rounded-full flex flex-col items-center justify-center cursor-pointer shadow-2xl transition-all ${
                reactionState === 'CLICK'
                  ? 'bg-emerald-500 text-black shadow-[0_0_80px_#10B981] animate-pulse'
                  : 'bg-red-500/20 border-4 border-red-500/60 text-red-300'
              }`}
            >
              <Zap className="w-12 h-12 mb-2" />
              <span className="font-orbitron font-black text-xl">
                {reactionState === 'CLICK' ? '⚡ TAP NOW!' : 'WAIT FOR SIGNAL...'}
              </span>
            </motion.div>

            {reactionTimes.length > 0 && (
              <div className="flex gap-4 font-mono text-xs text-slate-400">
                {reactionTimes.map((t, idx) => (
                  <span key={idx}>Round {idx + 1}: {t}ms</span>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* QUESTION / CODING / PUZZLE VIEW */
          <div className="my-6 space-y-5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-400 font-bold">
                QUESTION {currentQIndex + 1} OF {challenge.questions.length}
              </span>
              <span className="text-slate-400">ACCURACY: {correctAnswers} CORRECT</span>
            </div>

            <h4 className="text-base sm:text-lg font-orbitron font-bold text-white">
              {currentQ?.prompt}
            </h4>

            {/* Code Snippet Box if present */}
            {currentQ?.codeSnippet && (
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs sm:text-sm text-emerald-300 whitespace-pre">
                {currentQ.codeSnippet}
              </div>
            )}

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ?.options.map((opt, optIdx) => {
                const isSelected = selectedOption === optIdx;
                const isCorrect = optIdx === currentQ.correctIndex;
                const answered = selectedOption !== null;

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    disabled={answered}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-inter transition-all flex items-center justify-between cursor-pointer ${
                      answered
                        ? isCorrect
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                          : isSelected
                          ? 'bg-red-500/20 border-red-500 text-red-300'
                          : 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-60'
                        : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200'
                    }`}
                  >
                    <span>{opt}</span>
                    {answered && (
                      <span>
                        {isCorrect ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : isSelected ? <XCircle className="w-4 h-4 text-red-400" /> : null}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation / Hint */}
            {currentQ?.hint && !showHint && selectedOption === null && (
            <button
              onClick={() => setShowHint(true)}
              className="px-3 py-1 rounded-lg bg-slate-900 border border-cyan-500/30 text-xs font-mono text-cyan-400 hover:bg-slate-800 transition-colors"
            >
              💡 SHOW HINT
            </button>
          )}

          {showHint && currentQ?.hint && (
            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300">
              💡 HINT: {currentQ.hint}
            </div>
          )}

          {selectedOption !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-inter text-slate-300"
              >
                <span className="font-bold text-cyan-400">EXPLANATION: </span>
                {currentQ.explanation}
              </motion.div>
            )}
          </div>
        )}

        {/* Footer Next Button */}
        {selectedOption !== null && (
          <button
            onClick={handleNextQuestion}
            className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-orbitron text-xs font-bold uppercase tracking-wider cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.4)]"
          >
            {currentQIndex === challenge.questions.length - 1 ? 'FINISH CHALLENGE' : 'NEXT QUESTION ➔'}
          </button>
        )}
      </motion.div>
    </div>
  );
};
