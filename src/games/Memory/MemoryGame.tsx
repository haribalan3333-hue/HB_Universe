import React, { useState } from 'react';
import { GameHUD } from '../components/GameHUD';
import { GameStartScreen } from '../components/GameStartScreen';
import { GamePauseMenu } from '../components/GamePauseMenu';
import { GameCountdown } from '../components/GameCountdown';
import { GameResultScreen } from '../components/GameResultScreen';
import { GameSession } from '../core/GameSession';
import { audioManager } from '../../audio/audioManager';

interface MemoryGameProps {
  onBack: () => void;
}

const SYMBOLS = ['🌌', '⚡', '🤖', '🎮', '🎬', '🎵', '🏆', '👑', '🚀', '🔮', '💎', '🔥'];

export const MemoryGame: React.FC<MemoryGameProps> = ({ onBack }) => {
  const [session] = useState(() => new GameSession('memory'));
  const [status, setStatus] = useState<'MENU' | 'COUNTDOWN' | 'PLAYING' | 'PAUSED' | 'RESULT'>('MENU');
  const [difficulty, setDifficulty] = useState<'EASY' | 'NORMAL' | 'HARD'>('NORMAL');
  const [cards, setCards] = useState<Array<{ id: number; symbol: string; flipped: boolean; matched: boolean }>>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(session.highScore);
  const [reward, setReward] = useState({ xp: 0, coins: 0, isNewHighScore: false });

  const pairCounts = { EASY: 4, NORMAL: 8, HARD: 12 };

  const handleCardClick = (idx: number) => {
    if (cards[idx].flipped || cards[idx].matched || selected.length >= 2) return;

    try { audioManager.playClick(); } catch {}

    const newCards = [...cards];
    newCards[idx].flipped = true;
    setCards(newCards);

    const newSelected = [...selected, idx];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newSelected;
      if (cards[first].symbol === cards[second].symbol) {
        // Matched!
        setTimeout(() => {
          try { audioManager.playLevelUp(); } catch {}
          setCards(prev =>
            prev.map((c, i) => (i === first || i === second ? { ...c, matched: true } : c))
          );
          setMatches(m => {
            const nextMatches = m + 1;
            if (nextMatches === pairCounts[difficulty]) {
              finishGame();
            }
            return nextMatches;
          });
          setSelected([]);
        }, 500);
      } else {
        // Mismatch flip back
        setTimeout(() => {
          setCards(prev =>
            prev.map((c, i) => (i === first || i === second ? { ...c, flipped: false } : c))
          );
          setSelected([]);
        }, 800);
      }
    }
  };

  const finishGame = () => {
    const finalScore = Math.max(100, 1000 - moves * 25 - timerSeconds * 5);
    setScore(finalScore);
    session.score = finalScore;
    session.difficulty = difficulty;
    const r = session.endGame(true);
    setReward(r);
    setHighScore(session.highScore);
    setStatus('RESULT');
  };

  const startGameFlow = () => {
    setStatus('COUNTDOWN');
  };

  const handleCountdownReady = () => {
    const pairs = pairCounts[difficulty];
    const pickedSymbols = SYMBOLS.slice(0, pairs);
    const deck = [...pickedSymbols, ...pickedSymbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, id) => ({ id, symbol, flipped: false, matched: false }));

    setCards(deck);
    setSelected([]);
    setMoves(0);
    setMatches(0);
    setScore(0);
    setTimerSeconds(0);
    session.startGame();
    setStatus('PLAYING');
  };

  return (
    <div className="w-full flex flex-col items-center">
      {status === 'MENU' && (
        <GameStartScreen
          title="HOLO MEMORY MATRIX"
          subtitle="Quantum Pattern Recognition Grid"
          icon="🧠"
          highScore={highScore}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          onStart={startGameFlow}
          onBack={onBack}
          controlsHelp={[
            'Flip two cards to match holographic symbols',
            'Fewer moves & faster completion yields higher score rating',
            'Easy: 4 pairs • Normal: 8 pairs • Hard: 12 pairs'
          ]}
        />
      )}

      {status === 'COUNTDOWN' && <GameCountdown onComplete={handleCountdownReady} />}

      {(status === 'PLAYING' || status === 'PAUSED') && (
        <div className="w-full max-w-xl flex flex-col items-center">
          <GameHUD
            gameTitle="Holo Memory Matrix"
            score={score}
            highScore={highScore}
            timer={timerSeconds}
            isPaused={status === 'PAUSED'}
            onPauseToggle={() => (status === 'PAUSED' ? setStatus('PLAYING') : setStatus('PAUSED'))}
            onRestart={startGameFlow}
            onBack={onBack}
          />

          <div className="w-full p-6 flex flex-col items-center select-none">
            <div className="flex items-center gap-6 mb-6 text-xs font-mono text-slate-300">
              <div>MOVES: <span className="text-yellow-400 font-bold">{moves}</span></div>
              <div>MATCHES: <span className="text-emerald-400 font-bold">{matches} / {pairCounts[difficulty]}</span></div>
            </div>

            <div
              className={`grid gap-3 w-full max-w-md ${
                difficulty === 'EASY'
                  ? 'grid-cols-4'
                  : difficulty === 'NORMAL'
                  ? 'grid-cols-4'
                  : 'grid-cols-6'
              }`}
            >
              {cards.map((card, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCardClick(idx)}
                  disabled={card.flipped || card.matched}
                  className={`aspect-square rounded-2xl border flex items-center justify-center text-3xl sm:text-4xl transition-all ${
                    card.matched
                      ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] opacity-80'
                      : card.flipped
                      ? 'bg-slate-900 border-yellow-400 text-white shadow-[0_0_15px_rgba(255,229,0,0.3)]'
                      : 'bg-slate-950 border-slate-800 text-transparent hover:border-cyan-400/50 hover:bg-slate-900'
                  }`}
                >
                  {card.flipped || card.matched ? card.symbol : '❓'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {status === 'PAUSED' && (
        <GamePauseMenu
          onResume={() => setStatus('PLAYING')}
          onRestart={startGameFlow}
          onBack={onBack}
        />
      )}

      {status === 'RESULT' && (
        <GameResultScreen
          gameTitle="Holo Memory Matrix"
          score={score}
          highScore={highScore}
          xpEarned={reward.xp}
          coinsEarned={reward.coins}
          isVictory={true}
          isNewHighScore={reward.isNewHighScore}
          customStats={[
            { label: 'Moves Made', value: moves },
            { label: 'Pairs Found', value: matches }
          ]}
          onPlayAgain={startGameFlow}
          onBackToArcade={onBack}
        />
      )}
    </div>
  );
};
