// Dynamic import of canvas-confetti
let confettiPromise = null;

export const triggerConfetti = async () => {
  try {
    if (!confettiPromise) {
      confettiPromise = import('canvas-confetti').then(module => module.default);
    }
    const confetti = await confettiPromise;
    
    const end = Date.now() + 1000;
    const colors = ['#ffd700', '#000000'];

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: colors
      });

      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  } catch (error) {
    console.warn('Confetti animation failed:', error);
  }
};
