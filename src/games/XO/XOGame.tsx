import React, { useState, useEffect } from 'react';
import { GameHUD } from '../components/GameHUD';
import { GameStartScreen } from '../components/GameStartScreen';
import { GamePauseMenu } from '../components/GamePauseMenu';
import { GameCountdown } from '../components/GameCountdown';
import { GameResultScreen } from '../components/GameResultScreen';
import { GameSession } from '../core/GameSession';
import { audioManager } from '../../audio/audioManager';

interface XOGameProps {
  onBack: () => void;
}

type Cell = 'X' | 'O' | null;

export const XOGame: React.FC<XOGameProps> = ({ onBack }) => {
  const [session] = useState(() => new GameSession('xo'));
  const [status, setStatus] = useState<'MENU' | 'COUNTDOWN' | 'PLAYING' | 'PAUSED' | 'RESULT'>('MENU');
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [vsAi, setVsAi] = useState(true);
  const [difficulty, setDifficulty] = useState<'EASY' | 'NORMAL' | 'HARD'>('HARD');
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(session.highScore);
  const [reward, setReward] = useState({ xp: 0, coins: 0, isNewHighScore: false });
  const [isVictory, setIsVictory] = useState(false);

  const WIN_COMBOS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  const checkWinner = (b: Cell[]): { winner: Cell | 'DRAW' | null; line: number[] | null } => {
    for (const line of WIN_COMBOS) {
      const [a, bIndex, c] = line;
      if (b[a] && b[a] === b[bIndex] && b[a] === b[c]) {
        return { winner: b[a], line };
      }
    }
    if (b.every(cell => cell !== null)) {
      return { winner: 'DRAW', line: null };
    }
    return { winner: null, line: null };
  };

  const getMinimaxMove = (b: Cell[]): number => {
    const emptyIndices = b.map((val, idx) => (val === null ? idx : null)).filter(val => val !== null) as number[];

    if (difficulty === 'EASY') {
      return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    }

    if (difficulty === 'NORMAL') {
      // Try to win or block immediately, otherwise random
      for (const idx of emptyIndices) {
        const copy = [...b];
        copy[idx] = 'O';
        if (checkWinner(copy).winner === 'O') return idx;
      }
      for (const idx of emptyIndices) {
        const copy = [...b];
        copy[idx] = 'X';
        if (checkWinner(copy).winner === 'X') return idx;
      }
      return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    }

    // Minimax Hard
    const minimax = (newBoard: Cell[], isMaximizing: boolean, depth: number): number => {
      const result = checkWinner(newBoard);
      if (result.winner === 'O') return 10 - depth;
      if (result.winner === 'X') return depth - 10;
      if (result.winner === 'DRAW') return 0;

      const avail = newBoard.map((v, i) => (v === null ? i : null)).filter(v => v !== null) as number[];

      if (isMaximizing) {
        let bestScore = -Infinity;
        for (const idx of avail) {
          newBoard[idx] = 'O';
          const currentScore = minimax(newBoard, false, depth + 1);
          newBoard[idx] = null;
          bestScore = Math.max(bestScore, currentScore);
        }
        return bestScore;
      } else {
        let bestScore = Infinity;
        for (const idx of avail) {
          newBoard[idx] = 'X';
          const currentScore = minimax(newBoard, true, depth + 1);
          newBoard[idx] = null;
          bestScore = Math.min(bestScore, currentScore);
        }
        return bestScore;
      }
    };

    let bestScore = -Infinity;
    let bestMove = emptyIndices[0];

    for (const idx of emptyIndices) {
      b[idx] = 'O';
      const moveScore = minimax(b, false, 0);
      b[idx] = null;
      if (moveScore > bestScore) {
        bestScore = moveScore;
        bestMove = idx;
      }
    }

    return bestMove;
  };

  const handleCellClick = (index: number) => {
    if (board[index] || winningLine || status !== 'PLAYING') return;

    try { audioManager.playClick(); } catch {}

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);

    const winResult = checkWinner(newBoard);
    if (winResult.winner) {
      finishGame(winResult.winner, winResult.line);
      return;
    }

    setIsXNext(!isXNext);
  };

  // AI turn hook
  useEffect(() => {
    if (status === 'PLAYING' && vsAi && !isXNext && !winningLine) {
      const timer = setTimeout(() => {
        const move = getMinimaxMove(board);
        if (move !== undefined) {
          try { audioManager.playClick(); } catch {}
          const newBoard = [...board];
          newBoard[move] = 'O';
          setBoard(newBoard);

          const winResult = checkWinner(newBoard);
          if (winResult.winner) {
            finishGame(winResult.winner, winResult.line);
          } else {
            setIsXNext(true);
          }
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isXNext, vsAi, status, board, winningLine]);

  const finishGame = (winner: Cell | 'DRAW', line: number[] | null) => {
    setWinningLine(line);
    let pts = 0;
    let won = false;

    if (winner === 'X') {
      pts = 100;
      won = true;
    } else if (winner === 'DRAW') {
      pts = 40;
    } else {
      pts = 15;
    }

    setScore(pts);
    setIsVictory(won);
    session.score = pts;
    session.difficulty = difficulty;
    const r = session.endGame(won);
    setReward(r);
    setHighScore(session.highScore);

    setTimeout(() => {
      setStatus('RESULT');
    }, 1200);
  };

  const startGameFlow = () => {
    setStatus('COUNTDOWN');
  };

  const handleCountdownReady = () => {
    setBoard(Array(9).fill(null));
    setWinningLine(null);
    setIsXNext(true);
    setScore(0);
    session.startGame();
    setStatus('PLAYING');
  };

  return (
    <div className="w-full flex flex-col items-center">
      {status === 'MENU' && (
        <GameStartScreen
          title="XO CYBER ARENA"
          subtitle="Quantum Logic Matrix Strategy"
          icon="❌⭕"
          highScore={highScore}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          onStart={startGameFlow}
          onBack={onBack}
          controlsHelp={[
            'Tap or click empty grid squares to place mark',
            'Align 3 marks in horizontal, vertical, or diagonal line',
            'AI adapts with Minimax calculation on Hard difficulty'
          ]}
        />
      )}

      {status === 'COUNTDOWN' && <GameCountdown onComplete={handleCountdownReady} />}

      {(status === 'PLAYING' || status === 'PAUSED') && (
        <div className="w-full max-w-xl flex flex-col items-center">
          <GameHUD
            gameTitle="XO Cyber Arena"
            score={score}
            highScore={highScore}
            isPaused={status === 'PAUSED'}
            onPauseToggle={() => (status === 'PAUSED' ? setStatus('PLAYING') : setStatus('PAUSED'))}
            onRestart={startGameFlow}
            onBack={onBack}
          />

          <div className="w-full p-6 sm:p-8 flex flex-col items-center select-none">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setVsAi(!vsAi)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300 hover:border-cyan-400"
              >
                MODE: {vsAi ? 'PILOT VS AI' : '2-PLAYER LOCAL'}
              </button>
              <div className="text-xs font-mono text-slate-400">
                TURN: <span className="font-orbitron font-bold text-yellow-400">{isXNext ? 'PILOT X' : vsAi ? 'AI O' : 'PILOT O'}</span>
              </div>
            </div>

            {/* 3x3 Grid */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-xs sm:max-w-sm aspect-square p-3 rounded-3xl bg-slate-950 border border-yellow-400/40 shadow-[0_0_50px_rgba(0,240,255,0.15)] relative">
              {board.map((cell, idx) => {
                const isWinCell = winningLine?.includes(idx);
                return (
                  <button
                    key={idx}
                    onClick={() => handleCellClick(idx)}
                    disabled={cell !== null || winningLine !== null || (vsAi && !isXNext)}
                    className={`rounded-2xl border flex items-center justify-center font-orbitron font-black text-4xl sm:text-5xl transition-all ${
                      isWinCell
                        ? 'bg-yellow-400 border-white text-black shadow-[0_0_30px_rgba(255,229,0,0.8)] scale-105'
                        : cell === 'X'
                        ? 'bg-cyan-500/10 border-cyan-400/60 text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                        : cell === 'O'
                        ? 'bg-rose-500/10 border-rose-400/60 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                        : 'bg-slate-900/60 border-slate-800 hover:border-yellow-400/50 hover:bg-slate-800/80 text-transparent'
                    }`}
                  >
                    {cell || '•'}
                  </button>
                );
              })}
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
          gameTitle="XO Cyber Arena"
          score={score}
          highScore={highScore}
          xpEarned={reward.xp}
          coinsEarned={reward.coins}
          isVictory={isVictory}
          isNewHighScore={reward.isNewHighScore}
          onPlayAgain={startGameFlow}
          onBackToArcade={onBack}
        />
      )}
    </div>
  );
};
