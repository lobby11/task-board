
// ============================================
// FILE: utils/confetti.js
// ============================================
export function triggerConfetti() {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    
    createConfettiPieces(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
    );
    createConfettiPieces(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    );
  }, 250);
}

function createConfettiPieces(options) {
  const { particleCount, origin } = options;
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  
  for (let i = 0; i < particleCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = `${origin.x * 100}%`;
    confetti.style.top = `${origin.y * 100}%`;
    confetti.style.setProperty('--tx', `${(Math.random() - 0.5) * 200}vw`);
    confetti.style.setProperty('--ty', `${Math.random() * 100 + 100}vh`);
    confetti.style.setProperty('--rotation', `${Math.random() * 360}deg`);
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
      confetti.remove();
    }, 3000);
  }
}