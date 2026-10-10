import React, { useState, useRef } from 'react';
import { GameHUD } from '../components/GameHUD';
import { GameStartScreen } from '../components/GameStartScreen';
import { GamePauseMenu } from '../components/GamePauseMenu';
import { GameCountdown } from '../components/GameCountdown';
import { GameResultScreen } from '../components/GameResultScreen';
import { GameSession } from '../core/GameSession';
import { audioManager } from '../../audio/audioManager';
import { Zap } from 'lucide-react';

interface ReactionGameProps {
  onBack: () => void;
}

type Stage = 'IDLE' | 'WAITING' | 'READY' | 'EARLY';

export const ReactionGame: React.FC<ReactionGameProps> = ({ onBack }) => {
  const [session] = useState(() => new GameSession('reaction'));
  const [status, setStatus] = useState<'MENU' | 'COUNTDOWN' | 'PLAYING' | 'PAUSED' | 'RESULT'>('MENU');
  const [stage, setStage] = useState<Stage>('IDLE');
  const [round, setRound] = useState(1);
  const [times, setTimes] = useState<number[]>([]);
  const [highScore, setHighScore] = useState(session.highScore);
  const [reward, setReward] = useState({ xp: 0, coins: 0, isNewHighScore: false });

  const timerRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);

  const startRound = () => {
    setStage('WAITING');
    const delay = Math.floor(Math.random() * 2500) + 1500; // 1.5s - 4.0s
    timerRef.current = setTimeout(() => {
      startTimeRef.current = Date.now();
      setStage('READY');
      try { audioManager.playLevelUp(); } catch {}
    }, delay);
  };

  const handleClickArea = () => {
    if (stage === 'WAITING') {
      clearTimeout(timerRef.current);
      setStage('EARLY');
    } else if (stage === 'READY') {
      const reactionTime = Date.now() - startTimeRef.current;
      const newTimes = [...times, reactionTime];
      setTimes(newTimes);

      if (round < 5) {
        setRound(r => r + 1);
        setStage('IDLE');
      } else {
        finishGame(newTimes);
      }
    } else if (stage === 'EARLY' || stage === 'IDLE') {
      startRound();
    }
  };

  const finishGame = (finalTimes: number[]) => {
    const avg = Math.round(finalTimes.reduce((a, b) => a + b, 0) / finalTimes.length);
    const calculatedScore = Math.max(10, Math.floor(1000 - avg * 1.5));

    session.score = calculatedScore;
    const r = session.endGame(avg < 300);
    setReward(r);
    setHighScore(session.highScore);
    setStatus('RESULT');
  };

  const startGameFlow = () => {
    setStatus('COUNTDOWN');
  };

  const handleCountdownReady = () => {
    setRound(1);
    setTimes([]);
    setStage('IDLE');
    session.startGame();
    setStatus('PLAYING');
  };

  const avgTime = times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;
  const bestTime = times.length > 0 ? Math.min(...times) : 0;

  const getTierRating = (ms: number) => {
    if (ms === 0) return 'READY';
    if (ms < 200) return 'LEGENDARY';
    if (ms < 280) return 'EXCELLENT';
    if (ms < 380) return 'GOOD';
    if (ms < 480) return 'AVERAGE';
    return 'TRAINING REQUIRED';
  };

  return (
    <div className="w-full flex flex-col items-center">
      {status === 'MENU' && (
        <GameStartScreen
          title="NEURAL REFLEX TEST"
          subtitle="Precision Reaction Latency Matrix"
          icon="⚡"
          highScore={highScore}
          difficulty="NORMAL"
          onStart={startGameFlow}
          onBack={onBack}
          controlsHelp={[
            'Wait for the screen to turn vibrant CYBER GREEN',
            'Click or tap as fast as humanly possible (5 rounds)',
            'Clicking too early results in round penalty'
          ]}
        />
      )}

      {status === 'COUNTDOWN' && <GameCountdown onComplete={handleCountdownReady} />}

      {(status === 'PLAYING' || status === 'PAUSED') && (
        <div className="w-full max-w-xl flex flex-col items-center">
          <GameHUD
            gameTitle="Neural Reflex Test"
            score={avgTime ? `${avgTime} ms` as any : 0}
            highScore={highScore}
            isPaused={status === 'PAUSED'}
            onPauseToggle={() => (status === 'PAUSED' ? setStatus('PLAYING') : setStatus('PAUSED'))}
            onRestart={startGameFlow}
            onBack={onBack}
          />

          <div className="w-full p-4 flex flex-col items-center select-none">
            <div className="flex items-center justify-between w-full max-w-md px-2 mb-4 text-xs font-mono text-slate-400">
              <span>ROUND: <span className="text-yellow-400 font-bold">{round} / 5</span></span>
              <span>BEST: <span className="text-cyan-400 font-bold">{bestTime ? `${bestTime}ms` : '--'}</span></span>
            </div>

            {/* Reaction Target Box */}
            <div
              onClick={handleClickArea}
              className={`w-full max-w-md h-72 rounded-3xl border flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all shadow-2xl ${
                stage === 'READY'
                  ? 'bg-emerald-500 border-white text-black shadow-[0_0_80px_rgba(16,185,129,0.8)] scale-102'
                  : stage === 'WAITING'
                  ? 'bg-rose-950/80 border-rose-500/50 text-rose-300'
                  : stage === 'EARLY'
                  ? 'bg-amber-950 border-amber-500 text-amber-300'
                  : 'bg-slate-950 border-yellow-400/40 text-white hover:border-yellow-400'
              }`}
            >
              {stage === 'IDLE' && (
                <>
                  <Zap className="w-12 h-12 text-yellow-400 mb-2 animate-bounce" />
                  <h3 className="font-orbitron font-black text-2xl">TAP TO START ROUND {round}</h3>
                  <p className="text-xs font-mono text-slate-400 mt-2">Get ready to click upon green flash</p>
                </>
              )}

              {stage === 'WAITING' && (
                <>
                  <div className="w-8 h-8 rounded-full border-4 border-rose-400 border-t-transparent animate-spin mb-3" />
                  <h3 className="font-orbitron font-black text-2xl text-rose-400">WAIT FOR GREEN...</h3>
                  <p className="text-xs font-mono text-rose-300/70 mt-1">Do not tap yet!</p>
                </>
              )}

              {stage === 'READY' && (
                <>
                  <h3 className="font-orbitron font-black text-5xl text-black">CLICK NOW!</h3>
                  <p className="font-mono text-sm text-black/80 font-bold mt-2">TAP ANYWHERE</p>
                </>
              )}

              {stage === 'EARLY' && (
                <>
                  <h3 className="font-orbitron font-black text-2xl text-amber-400">TOO EARLY!</h3>
                  <p className="text-xs font-mono text-slate-300 mt-2">Penalty: Tap to try round again</p>
                </>
              )}
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
          gameTitle="Neural Reflex Test"
          score={session.score}
          highScore={highScore}
          xpEarned={reward.xp}
          coinsEarned={reward.coins}
          isVictory={avgTime < 300}
          isNewHighScore={reward.isNewHighScore}
          customStats={[
            { label: 'Average Reaction', value: `${avgTime} ms` },
            { label: 'Best Reaction', value: `${bestTime} ms` },
            { label: 'Pilot Rating', value: getTierRating(avgTime) }
          ]}
          onPlayAgain={startGameFlow}
          onBackToArcade={onBack}
        />
      )}
    </div>
  );
};
