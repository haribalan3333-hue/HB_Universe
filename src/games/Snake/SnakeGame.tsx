import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameHUD } from '../components/GameHUD';
import { GameStartScreen } from '../components/GameStartScreen';
import { GamePauseMenu } from '../components/GamePauseMenu';
import { GameCountdown } from '../components/GameCountdown';
import { GameResultScreen } from '../components/GameResultScreen';
import { GameSession } from '../core/GameSession';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface SnakeGameProps {
  onBack: () => void;
}

const GRID = 18;

export const SnakeGame: React.FC<SnakeGameProps> = ({ onBack }) => {
  const [session] = useState(() => new GameSession('snake'));
  const [status, setStatus] = useState<'MENU' | 'COUNTDOWN' | 'PLAYING' | 'PAUSED' | 'RESULT'>('MENU');
  const [snake, setSnake] = useState<[number, number][]>([[9, 9], [9, 10], [9, 11]]);
  const [dir, setDir] = useState<[number, number]>([0, -1]);
  const [food, setFood] = useState<[number, number]>([4, 4]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(session.highScore);
  const [difficulty, setDifficulty] = useState<'EASY' | 'NORMAL' | 'HARD'>('NORMAL');
  const [reward, setReward] = useState({ xp: 0, coins: 0, isNewHighScore: false });
  const [timerSeconds] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dirRef = useRef(dir);
  dirRef.current = dir;

  const spawnFood = useCallback((currentSnake: [number, number][]): [number, number] => {
    let newFood: [number, number];
    while (true) {
      newFood = [Math.floor(Math.random() * GRID), Math.floor(Math.random() * GRID)];
      const onSnake = currentSnake.some(seg => seg[0] === newFood[0] && seg[1] === newFood[1]);
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const changeDirection = useCallback((newDir: [number, number]) => {
    const current = dirRef.current;
    if (newDir[0] === -current[0] && newDir[1] === -current[1]) return; // prevent reverse
    setDir(newDir);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status !== 'PLAYING') return;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') changeDirection([0, -1]);
      else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') changeDirection([0, 1]);
      else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') changeDirection([-1, 0]);
      else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') changeDirection([1, 0]);
      else if (e.key === 'Escape') setStatus('PAUSED');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, changeDirection]);

  // Game Loop
  useEffect(() => {
    if (status !== 'PLAYING') return;

    const speedMap = { EASY: 140, NORMAL: 95, HARD: 65 };
    const interval = setInterval(() => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const currentDir = dirRef.current;
        const newHead: [number, number] = [head[0] + currentDir[0], head[1] + currentDir[1]];

        // Wall collision
        if (newHead[0] < 0 || newHead[0] >= GRID || newHead[1] < 0 || newHead[1] >= GRID) {
          gameOver();
          return prevSnake;
        }

        // Self collision
        if (prevSnake.some(seg => seg[0] === newHead[0] && seg[1] === newHead[1])) {
          gameOver();
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Eat food
        if (newHead[0] === food[0] && newHead[1] === food[1]) {
          setScore(s => s + 10);
          setFood(spawnFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speedMap[difficulty]);

    return () => clearInterval(interval);
  }, [status, difficulty, food, spawnFood]);

  const gameOver = () => {
    session.score = score;
    session.difficulty = difficulty;
    const r = session.endGame(score >= 100);
    setReward(r);
    setHighScore(session.highScore);
    setStatus('RESULT');
  };

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width / GRID;

    // Clear background
    ctx.fillStyle = '#050b14';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath();
      ctx.moveTo(i * size, 0);
      ctx.lineTo(i * size, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * size);
      ctx.lineTo(canvas.width, i * size);
      ctx.stroke();
    }

    // Food
    ctx.fillStyle = '#ffd700';
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc((food[0] + 0.5) * size, (food[1] + 0.5) * size, size * 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Snake
    snake.forEach((seg, idx) => {
      ctx.fillStyle = idx === 0 ? '#00f0ff' : '#10b981';
      ctx.shadowColor = idx === 0 ? '#00f0ff' : '#10b981';
      ctx.shadowBlur = idx === 0 ? 10 : 4;
      ctx.fillRect(seg[0] * size + 1, seg[1] * size + 1, size - 2, size - 2);
    });
    ctx.shadowBlur = 0;
  }, [snake, food]);

  const startGameFlow = () => {
    setStatus('COUNTDOWN');
  };

  const handleCountdownReady = () => {
    setSnake([[9, 9], [9, 10], [9, 11]]);
    setDir([0, -1]);
    setScore(0);
    setFood([4, 4]);
    session.startGame();
    setStatus('PLAYING');
  };

  return (
    <div className="w-full flex flex-col items-center">
      {status === 'MENU' && (
        <GameStartScreen
          title="NEON SNAKE 2099"
          subtitle="Quantum Reflex Cyber Grid"
          icon="🐍"
          highScore={highScore}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          onStart={startGameFlow}
          onBack={onBack}
          controlsHelp={[
            'Control snake with WASD, Arrow keys, or on-screen D-Pad',
            'Collect glowing Quantum Energy Orbs (+10 pts)',
            'Avoid colliding with the perimeter shield and your own tail'
          ]}
        />
      )}

      {status === 'COUNTDOWN' && <GameCountdown onComplete={handleCountdownReady} />}

      {(status === 'PLAYING' || status === 'PAUSED') && (
        <div className="w-full max-w-xl flex flex-col items-center">
          <GameHUD
            gameTitle="Neon Snake 2099"
            score={score}
            highScore={highScore}
            timer={timerSeconds}
            isPaused={status === 'PAUSED'}
            onPauseToggle={() => (status === 'PAUSED' ? setStatus('PLAYING') : setStatus('PAUSED'))}
            onRestart={startGameFlow}
            onBack={onBack}
          />

          <div className="w-full p-4 flex flex-col items-center select-none">
            <div className="p-2 rounded-3xl bg-slate-950 border border-emerald-400/40 shadow-[0_0_50px_rgba(16,185,129,0.2)] mb-4">
              <canvas ref={canvasRef} width={360} height={360} className="rounded-2xl max-w-full aspect-square block" />
            </div>

            {/* Mobile Virtual D-Pad */}
            <div className="grid grid-cols-3 gap-2 w-48 sm:hidden mt-2">
              <div />
              <button
                onClick={() => changeDirection([0, -1])}
                className="h-12 rounded-xl bg-slate-900 border border-slate-700 active:bg-yellow-400 active:text-black flex items-center justify-center text-white"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
              <div />

              <button
                onClick={() => changeDirection([-1, 0])}
                className="h-12 rounded-xl bg-slate-900 border border-slate-700 active:bg-yellow-400 active:text-black flex items-center justify-center text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => changeDirection([0, 1])}
                className="h-12 rounded-xl bg-slate-900 border border-slate-700 active:bg-yellow-400 active:text-black flex items-center justify-center text-white"
              >
                <ArrowDown className="w-5 h-5" />
              </button>
              <button
                onClick={() => changeDirection([1, 0])}
                className="h-12 rounded-xl bg-slate-900 border border-slate-700 active:bg-yellow-400 active:text-black flex items-center justify-center text-white"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
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
          gameTitle="Neon Snake 2099"
          score={score}
          highScore={highScore}
          xpEarned={reward.xp}
          coinsEarned={reward.coins}
          isVictory={score >= 150}
          isNewHighScore={reward.isNewHighScore}
          customStats={[
            { label: 'Snake Length', value: snake.length },
            { label: 'Orbs Consumed', value: Math.floor(score / 10) }
          ]}
          onPlayAgain={startGameFlow}
          onBackToArcade={onBack}
        />
      )}
    </div>
  );
};
