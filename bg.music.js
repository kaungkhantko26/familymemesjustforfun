document.addEventListener('DOMContentLoaded', () => {
  // --- Video Background ---
  const video = document.createElement('video');
  video.id = 'bgVideo';
  video.src = '-9129542939632791148-2.mp4'; // your video file
  video.autoplay = true;
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.className = 'video-bg';
  Object.assign(video.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: '-2',
    pointerEvents: 'none',
    backgroundColor: '#000'
  });
  document.body.prepend(video);

  // --- Background Music (Persistent) ---
  let bgMusic = document.getElementById('bgMusic');

  if (!bgMusic) {
    bgMusic = document.createElement('audio');
    bgMusic.id = 'bgMusic';
    bgMusic.src = 'Ch.mp3';
    bgMusic.loop = true;
    bgMusic.preload = 'auto';
    bgMusic.volume = 0.6;
    bgMusic.autoplay = true;
    document.body.appendChild(bgMusic);
    // Save a flag so next page knows it's already playing
    sessionStorage.setItem('musicPlaying', 'true');
  }

  // Try autoplay
  const tryPlay = () => {
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          document.removeEventListener('click', tryPlay);
          document.removeEventListener('touchstart', tryPlay);
        })
        .catch(() => {
          // Mobile requires user interaction
          document.addEventListener('click', tryPlay, { once: true });
          document.addEventListener('touchstart', tryPlay, { once: true });
        });
    }
  };
  tryPlay();

  // --- Music Button ---
  let btn = document.getElementById('playMusic');
  if (!btn) {
    btn = document.createElement('button');
    btn.className = 'btn-music';
    btn.id = 'playMusic';
    btn.textContent = bgMusic.paused ? '🔊 Play Music' : '⏸ Pause Music';
    (document.querySelector('.site-header') || document.body).appendChild(btn);
  }

  btn.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play();
      btn.textContent = '⏸ Pause Music';
      sessionStorage.setItem('musicPlaying', 'true');
    } else {
      bgMusic.pause();
      btn.textContent = '🔊 Play Music';
      sessionStorage.removeItem('musicPlaying');
    }
  });
});

// --- Snow & Emoji Animation ---
document.addEventListener('DOMContentLoaded', () => {
  const snowContainer = document.createElement('div');
  Object.assign(snowContainer.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: '9999'
  });
  document.body.appendChild(snowContainer);

  const snowflakes = ['❄️', '❄️', '❄️'];
  const christmasEmojis = ['🎄', '🎅', '🎁', '✨', '🦌'];

  function createFallingItem(arr) {
    const item = document.createElement('div');
    item.textContent = arr[Math.floor(Math.random() * arr.length)];
    Object.assign(item.style, {
      position: 'absolute',
      top: '-2rem',
      left: Math.random() * window.innerWidth + 'px',
      fontSize: Math.random() * 24 + 16 + 'px',
      opacity: Math.random() * 0.8 + 0.2
    });
    snowContainer.appendChild(item);

    const speed = Math.random() * 2 + 1;
    const drift = (Math.random() - 0.5) * 1.5;

    function fall() {
      const top = parseFloat(item.style.top);
      const left = parseFloat(item.style.left);
      if (top < window.innerHeight + 20) {
        item.style.top = top + speed + 'px';
        item.style.left = left + drift + 'px';
        requestAnimationFrame(fall);
      } else item.remove();
    }
    fall();
  }

  setInterval(() => {
    createFallingItem(snowflakes);
    if (Math.random() < 0.5) createFallingItem(christmasEmojis);
  }, 200);
});
