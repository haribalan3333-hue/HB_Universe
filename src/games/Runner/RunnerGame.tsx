import React, { useState, useEffect, useRef } from 'react';
import { GameHUD } from '../components/GameHUD';
import { GameStartScreen } from '../components/GameStartScreen';
import { GamePauseMenu } from '../components/GamePauseMenu';
import { GameCountdown } from '../components/GameCountdown';
import { GameResultScreen } from '../components/GameResultScreen';
import { GameSession } from '../core/GameSession';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface RunnerGameProps {
  onBack: () => void;
}

export const RunnerGame: React.FC<RunnerGameProps> = ({ onBack }) => {
  const [session] = useState(() => new GameSession('runner'));
  const [status, setStatus] = useState<'MENU' | 'COUNTDOWN' | 'PLAYING' | 'PAUSED' | 'RESULT'>('MENU');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(session.highScore);
  const [distance, setDistance] = useState(0);
  const [, setIsJumping] = useState(false);
  const [, setIsSliding] = useState(false);
  const [reward, setReward] = useState({ xp: 0, coins: 0, isNewHighScore: false });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const obstaclesRef = useRef<Array<{ x: number; type: 'BARRIER' | 'LASER' }>>([]);
  const playerYRef = useRef(200);
  const isJumpingRef = useRef(false);
  const isSlidingRef = useRef(false);

  const jump = () => {
    if (!isJumpingRef.current && !isSlidingRef.current) {
      isJumpingRef.current = true;
      setIsJumping(true);
      let velocity = -12;
      const jumpInterval = setInterval(() => {
        playerYRef.current += velocity;
        velocity += 0.8;
        if (playerYRef.current >= 200) {
          playerYRef.current = 200;
          isJumpingRef.current = false;
          setIsJumping(false);
          clearInterval(jumpInterval);
        }
      }, 20);
    }
  };

  const slide = () => {
    if (!isJumpingRef.current && !isSlidingRef.current) {
      isSlidingRef.current = true;
      setIsSliding(true);
      setTimeout(() => {
        isSlidingRef.current = false;
        setIsSliding(false);
      }, 550);
    }
  };

  // Keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status !== 'PLAYING') return;
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') jump();
      else if (e.key === 'ArrowDown' || e.key === 's') slide();
      else if (e.key === 'Escape') setStatus('PAUSED');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status]);

  // Game Loop
  useEffect(() => {
    if (status !== 'PLAYING') return;

    let animId: number;
    let lastSpawn = Date.now();

    const loop = () => {
      setDistance(d => d + 2);
      setScore(s => s + 1);

      // Spawn obstacle every 1.4s
      if (Date.now() - lastSpawn > 1400) {
        lastSpawn = Date.now();
        const type = Math.random() > 0.5 ? 'BARRIER' : 'LASER';
        obstaclesRef.current.push({ x: 450, type });
      }

      // Move obstacles
      obstaclesRef.current.forEach(ob => {
        ob.x -= 6;
      });

      // Collision check
      const playerX = 80;
      for (const ob of obstaclesRef.current) {
        if (Math.abs(ob.x - playerX) < 25) {
          if (ob.type === 'BARRIER' && playerYRef.current >= 170) {
            gameOver();
            return;
          }
          if (ob.type === 'LASER' && !isSlidingRef.current) {
            gameOver();
            return;
          }
        }
      }

      // Remove off-screen
      obstaclesRef.current = obstaclesRef.current.filter(ob => ob.x > -50);

      // Render canvas
      drawCanvas();
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [status]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#060d1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Platform ground
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 240, canvas.width, 60);
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 240);
    ctx.lineTo(canvas.width, 240);
    ctx.stroke();

    // Obstacles
    obstaclesRef.current.forEach(ob => {
      if (ob.type === 'BARRIER') {
        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 8;
        ctx.fillRect(ob.x, 200, 30, 40);
      } else {
        // Floating Laser Beam
        ctx.fillStyle = '#ec4899';
        ctx.shadowColor = '#ec4899';
        ctx.shadowBlur = 10;
        ctx.fillRect(ob.x, 150, 20, 50);
      }
    });

    // Player HB Runner
    ctx.fillStyle = '#ffe500';
    ctx.shadowColor = '#ffe500';
    ctx.shadowBlur = 12;
    const h = isSlidingRef.current ? 22 : 44;
    const y = isSlidingRef.current ? 218 : playerYRef.current - 4;
    ctx.fillRect(65, y, 30, h);
    ctx.shadowBlur = 0;
  };

  const gameOver = () => {
    session.score = score;
    const r = session.endGame(score >= 350);
    setReward(r);
    setHighScore(session.highScore);
    setStatus('RESULT');
  };

  const startGameFlow = () => {
    setStatus('COUNTDOWN');
  };

  const handleCountdownReady = () => {
    setDistance(0);
    setScore(0);
    obstaclesRef.current = [];
    playerYRef.current = 200;
    session.startGame();
    setStatus('PLAYING');
  };

  return (
    <div className="w-full flex flex-col items-center">
      {status === 'MENU' && (
        <GameStartScreen
          title="HB QUANTUM RUNNER"
          subtitle="Cyber-Platform Endless Sprint"
          icon="🏃‍♂️"
          highScore={highScore}
          difficulty="NORMAL"
          onStart={startGameFlow}
          onBack={onBack}
          controlsHelp={[
            'SPACE or UP arrow to JUMP over Barriers',
            'DOWN arrow or S to SLIDE under Laser Gates',
            'Survive as platform speed gradually increases'
          ]}
        />
      )}

      {status === 'COUNTDOWN' && <GameCountdown onComplete={handleCountdownReady} />}

      {(status === 'PLAYING' || status === 'PAUSED') && (
        <div className="w-full max-w-xl flex flex-col items-center">
          <GameHUD
            gameTitle="HB Quantum Runner"
            score={score}
            highScore={highScore}
            isPaused={status === 'PAUSED'}
            onPauseToggle={() => (status === 'PAUSED' ? setStatus('PLAYING') : setStatus('PAUSED'))}
            onRestart={startGameFlow}
            onBack={onBack}
          />

          <div className="w-full p-4 flex flex-col items-center select-none">
            <div className="p-2 rounded-3xl bg-slate-950 border border-yellow-400/40 shadow-[0_0_50px_rgba(255,229,0,0.15)] mb-4">
              <canvas ref={canvasRef} width={420} height={300} className="rounded-2xl max-w-full block" />
            </div>

            {/* Mobile Touch Controls */}
            <div className="flex gap-4 w-full max-w-xs sm:hidden">
              <button
                onClick={jump}
                className="flex-1 py-4 rounded-2xl bg-yellow-400 text-black font-orbitron font-black text-sm flex items-center justify-center shadow-lg"
              >
                <ArrowUp className="w-5 h-5 mr-1" /> JUMP
              </button>
              <button
                onClick={slide}
                className="flex-1 py-4 rounded-2xl bg-slate-900 border border-slate-700 text-white font-orbitron font-black text-sm flex items-center justify-center active:bg-cyan-400 active:text-black"
              >
                <ArrowDown className="w-5 h-5 mr-1" /> SLIDE
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
          gameTitle="HB Quantum Runner"
          score={score}
          highScore={highScore}
          xpEarned={reward.xp}
          coinsEarned={reward.coins}
          isVictory={score >= 450}
          isNewHighScore={reward.isNewHighScore}
          customStats={[
            { label: 'Sprint Distance', value: `${distance}m` }
          ]}
          onPlayAgain={startGameFlow}
          onBackToArcade={onBack}
        />
      )}
    </div>
  );
};
