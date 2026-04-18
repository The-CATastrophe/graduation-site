// ── CONFETTI on load ─
window.addEventListener('load', () => {
  setTimeout(() => {
    const isMobile = window.innerWidth < 768;
    confetti({
      particleCount: isMobile ? 50 : 80,
      spread: 65,
      origin: { y: 0.3 },
      colors: ['#c9a84c', '#ffe680', '#fff7cc', '#ffffff', '#b8860b']
    });
  }, 700);
});

// ── COIN ANIMATION ──
const tipButton = document.getElementById('tipBtn');
const qrPopup = document.getElementById('qrPopup');
const qrClose = document.getElementById('qrClose');
const coin = tipButton.querySelector('.coin');
coin.maxMoveLoopCount = 90;

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const resetCoin = () => {
  coin.style.setProperty('--coin-x-multiplier', 0);
  coin.style.setProperty('--coin-scale-multiplier', 0);
  coin.style.setProperty('--coin-rotation-multiplier', 0);
  coin.style.setProperty('--shine-opacity-multiplier', 0.4);
  coin.style.setProperty('--shine-bg-multiplier', '50%');
  coin.style.setProperty('opacity', 1);
  tipButton.classList.remove('clicked', 'shrink-landing', 'coin-landed');
  tipButton.clicked = false;
};

const closeQrPopup = () => {
  qrPopup.classList.remove('active');
  resetCoin();
};

const flipCoinLoop = () => {
  if (prefersReducedMotion) {
    // Skip animation, directly show QR
    tipButton.classList.add('coin-landed');
    coin.style.setProperty('opacity', 0);
    qrPopup.classList.add('active');
    return;
  }

  coin.moveLoopCount++;
  let pct = coin.moveLoopCount / coin.maxMoveLoopCount;
  coin.angle = -coin.maxFlipAngle * Math.pow((pct - 1), 2) + coin.maxFlipAngle;

  coin.style.setProperty('--coin-y-multiplier', -11 * Math.pow(pct * 2 - 1, 4) + 11);
  coin.style.setProperty('--coin-x-multiplier', pct);
  coin.style.setProperty('--coin-scale-multiplier', pct * 0.6);
  coin.style.setProperty('--coin-rotation-multiplier', pct * coin.sideRotationCount);
  coin.style.setProperty('--front-scale-multiplier', Math.max(Math.cos(coin.angle), 0));
  coin.style.setProperty('--front-y-multiplier', Math.sin(coin.angle));
  coin.style.setProperty('--middle-scale-multiplier', Math.abs(Math.cos(coin.angle)));
  coin.style.setProperty('--middle-y-multiplier', Math.cos((coin.angle + Math.PI / 2) % Math.PI));
  coin.style.setProperty('--back-scale-multiplier', Math.max(Math.cos(coin.angle - Math.PI), 0));
  coin.style.setProperty('--back-y-multiplier', Math.sin(coin.angle - Math.PI));
  coin.style.setProperty('--shine-opacity-multiplier', 4 * Math.sin((coin.angle + Math.PI / 2) % Math.PI) - 3.2);
  coin.style.setProperty('--shine-bg-multiplier', -40 * (Math.cos((coin.angle + Math.PI / 2) % Math.PI) - 0.5) + '%');

  if (coin.moveLoopCount < coin.maxMoveLoopCount) {
    if (coin.moveLoopCount === coin.maxMoveLoopCount - 6) tipButton.classList.add('shrink-landing');
    window.requestAnimationFrame(flipCoinLoop);
  } else {
    tipButton.classList.add('coin-landed');
    coin.style.setProperty('opacity', 0);

    setTimeout(() => {
      const isMobile = window.innerWidth < 768;
      confetti({
        particleCount: isMobile ? 25 : 40,
        spread: 50,
        origin: { y: 0.65 },
        colors: ['#c9a84c', '#ffe680', '#ffffff']
      });
    }, 200);

    qrPopup.classList.add('active');
  }
};

const flipCoin = () => {
  coin.moveLoopCount = 0;
  flipCoinLoop();
};

tipButton.addEventListener('click', () => {
  if (tipButton.clicked) return;
  tipButton.classList.add('clicked');
  setTimeout(() => {
    coin.sideRotationCount = Math.floor(Math.random() * 5) * 90;
    coin.maxFlipAngle = (Math.floor(Math.random() * 4) + 3) * Math.PI;
    tipButton.clicked = true;
    flipCoin();
  }, 50);
});

qrClose.addEventListener('click', closeQrPopup);
