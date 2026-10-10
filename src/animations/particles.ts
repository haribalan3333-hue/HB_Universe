import confetti from 'canvas-confetti';

export const triggerWarpBurst = () => {
  try {
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#FFE500', '#00F0FF', '#FFFFFF', '#FF2A55'],
      ticks: 200,
      gravity: 0.4,
      scalar: 1.2,
    });
  } catch {
    // Safe fallback
  }
};

export const triggerLevelUpEffect = () => {
  try {
    confetti({
      particleCount: 120,
      spread: 120,
      origin: { y: 0.6 },
      colors: ['#FFE500', '#FFE500', '#FFFFFF', '#10B981'],
      ticks: 300,
      gravity: 0.6,
      scalar: 1.4,
    });
  } catch {
    // Fallback
  }
};