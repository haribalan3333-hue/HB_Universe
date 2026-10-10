import React, { useState, useEffect, useRef } from 'react';
import { GameHUD } from '../components/GameHUD';
import { GameStartScreen } from '../components/GameStartScreen';
import { GamePauseMenu } from '../components/GamePauseMenu';
import { GameCountdown } from '../components/GameCountdown';
import { GameResultScreen } from '../components/GameResultScreen';
import { GameSession } from '../core/GameSession';
import { ArrowLeft, ArrowRight} from 'lucide-react';

interface RacingGameProps {
  onBack: () => void;
}

export const RacingGame: React.FC<RacingGameProps> = ({ onBack }) => {
  const [session] = useState(() => new GameSession('racing'));
  const [status, setStatus] = useState<'MENU' | 'COUNTDOWN' | 'PLAYING' | 'PAUSED' | 'RESULT'>('MENU');
  const [playerLane, setPlayerLane] = useState(1); // 0, 1, 2
  const [distance, setDistance] = useState(0);
  const [score, setScore] = useState(0);
  const [coinsCollected, setCoinsCollected] = useState(0);
  const [speed] = useState(140);
  const [highScore, setHighScore] = useState(session.highScore);
  const [reward, setReward] = useState({ xp: 0, coins: 0, isNewHighScore: false });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const obstaclesRef = useRef<Array<{ lane: number; y: number; type: 'CAR' | 'COIN' }>>([]);
  const laneRef = useRef(playerLane);
  laneRef.current = playerLane;

  const moveLane = (dir: -1 | 1) => {
    setPlayerLane(prev => Math.max(0, Math.min(2, prev + dir)));
  };

  // Keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status !== 'PLAYING') return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') moveLane(-1);
      else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') moveLane(1);
      else if (e.key === 'Escape') setStatus('PAUSED');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status]);

  // Main animation loop
  useEffect(() => {
    if (status !== 'PLAYING') return;

    let animId: number;
    let lastSpawn = Date.now();

    const loop = () => {
      setDistance(d => d + 2);
      setScore(s => s + 1);

      // Spawn traffic obstacles and coins
      if (Date.now() - lastSpawn > 900) {
        lastSpawn = Date.now();
        const randLane = Math.floor(Math.random() * 3);
        const isCoin = Math.random() > 0.6;
        obstaclesRef.current.push({
          lane: randLane,
          y: -50,
          type: isCoin ? 'COIN' : 'CAR'
        });
      }

      // Move obstacles
      obstaclesRef.current.forEach(ob => {
        ob.y += 6;
      });

      // Collision checks
      const playerY = 320;
      for (let i = obstaclesRef.current.length - 1; i >= 0; i--) {
        const ob = obstaclesRef.current[i];
        if (ob.lane === laneRef.current && ob.y >= playerY - 30 && ob.y <= playerY + 30) {
          if (ob.type === 'COIN') {
            setCoinsCollected(c => c + 1);
            setScore(s => s + 50);
            obstaclesRef.current.splice(i, 1);
          } else {
            // Crash!
            gameOver();
            return;
          }
        }
      }

      // Remove off-screen
      obstaclesRef.current = obstaclesRef.current.filter(ob => ob.y < 450);

      // Draw canvas
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

    // Road background
    ctx.fillStyle = '#0a0f1d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Lane markers
    const laneWidth = canvas.width / 3;
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 15]);
    ctx.beginPath();
    ctx.moveTo(laneWidth, 0);
    ctx.lineTo(laneWidth, canvas.height);
    ctx.moveTo(laneWidth * 2, 0);
    ctx.lineTo(laneWidth * 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Obstacles & Coins
    obstaclesRef.current.forEach(ob => {
      const x = ob.lane * laneWidth + laneWidth / 2;
      if (ob.type === 'COIN') {
        ctx.fillStyle = '#ffd700';
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(x, ob.y, 12, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = '#f43f5e';
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 8;
        ctx.fillRect(x - 20, ob.y - 30, 40, 60);
      }
    });

    // Player Car
    const playerX = laneRef.current * laneWidth + laneWidth / 2;
    const playerY = 340;
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 15;
    ctx.fillRect(playerX - 22, playerY - 30, 44, 60);
    ctx.shadowBlur = 0;
  };

  const gameOver = () => {
    session.score = score;
    const r = session.endGame(score >= 400);
    setReward(r);
    setHighScore(session.highScore);
    setStatus('RESULT');
  };

  const startGameFlow = () => {
    setStatus('COUNTDOWN');
  };

  const handleCountdownReady = () => {
    setPlayerLane(1);
    setDistance(0);
    setScore(0);
    setCoinsCollected(0);
    obstaclesRef.current = [];
    session.startGame();
    setStatus('PLAYING');
  };

  return (
    <div className="w-full flex flex-col items-center">
      {status === 'MENU' && (
        <GameStartScreen
          title="HB FUTURE RACE"
          subtitle="Hyper-Speed Quantum Highway"
          icon="🏎️"
          highScore={highScore}
          difficulty="NORMAL"
          onStart={startGameFlow}
          onBack={onBack}
          controlsHelp={[
            'Switch lanes with Left / Right arrows or touch buttons',
            'Avoid colliding with incoming automated cyber cruisers',
            'Collect Quantum Power Cores (+50 pts & coins)'
          ]}
        />
      )}

      {status === 'COUNTDOWN' && <GameCountdown onComplete={handleCountdownReady} />}

      {(status === 'PLAYING' || status === 'PAUSED') && (
        <div className="w-full max-w-xl flex flex-col items-center">
          <GameHUD
            gameTitle="HB Future Race"
            score={score}
            highScore={highScore}
            speed={speed}
            isPaused={status === 'PAUSED'}
            onPauseToggle={() => (status === 'PAUSED' ? setStatus('PLAYING') : setStatus('PAUSED'))}
            onRestart={startGameFlow}
            onBack={onBack}
          />

          <div className="w-full p-4 flex flex-col items-center select-none">
            <div className="p-2 rounded-3xl bg-slate-950 border border-cyan-400/40 shadow-[0_0_50px_rgba(0,240,255,0.2)] mb-4">
              <canvas ref={canvasRef} width={340} height={420} className="rounded-2xl max-w-full block" />
            </div>

            {/* Mobile Lane Steer Buttons */}
            <div className="flex gap-4 w-full max-w-xs sm:hidden">
              <button
                onClick={() => moveLane(-1)}
                className="flex-1 py-4 rounded-2xl bg-slate-900 border border-slate-700 active:bg-cyan-400 active:text-black font-orbitron font-black text-sm flex items-center justify-center text-white"
              >
                <ArrowLeft className="w-6 h-6 mr-1" /> LEFT
              </button>
              <button
                onClick={() => moveLane(1)}
                className="flex-1 py-4 rounded-2xl bg-slate-900 border border-slate-700 active:bg-cyan-400 active:text-black font-orbitron font-black text-sm flex items-center justify-center text-white"
              >
                RIGHT <ArrowRight className="w-6 h-6 ml-1" />
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
          gameTitle="HB Future Race"
          score={score}
          highScore={highScore}
          xpEarned={reward.xp}
          coinsEarned={reward.coins}
          isVictory={score >= 500}
          isNewHighScore={reward.isNewHighScore}
          customStats={[
            { label: 'Distance', value: `${distance}m` },
            { label: 'Coins Picked', value: coinsCollected }
          ]}
          onPlayAgain={startGameFlow}
          onBackToArcade={onBack}
        />
      )}
    </div>
  );
};
