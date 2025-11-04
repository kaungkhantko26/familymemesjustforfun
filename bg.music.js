document.addEventListener('DOMContentLoaded', () => {
    // --- Video Background ---
    const video = document.createElement('video');
    video.src = '-9129542939632791148-2.mp4'; // Replace with your video file
    video.autoplay = true;
    video.loop = true;
    video.muted = true; // set false to play sound
    video.className = 'video-bg';
    video.style.position = 'fixed';
    video.style.top = 0;
    video.style.left = 0;
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
    video.style.zIndex = '-2';
    document.body.appendChild(video);
  
    // --- Music Toggle Button ---
    const bgMusic = document.createElement('audio');
    bgMusic.id = 'bgMusic';
    bgMusic.src = 'Ch.mp3'; // Replace with your music file
    bgMusic.loop = true;
    document.body.appendChild(bgMusic);
  
    const btn = document.createElement('button');
    btn.className = 'btn-music';
    btn.id = 'playMusic';
    btn.textContent = 'Play Music';
    // Optional: position button in header
    const header = document.querySelector('.site-header') || document.body;
    header.appendChild(btn);
  
    // Try autoplay
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        btn.textContent = 'Pause Music';
      }).catch(() => {
        btn.textContent = 'Play Music';
      });
    }
  
    // Toggle button
    btn.addEventListener('click', () => {
      if (bgMusic.paused) {
        bgMusic.play();
        btn.textContent = 'Pause Music';
      } else {
        bgMusic.pause();
        btn.textContent = 'Play Music';
      }
    });
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    const snowContainer = document.createElement('div');
    snowContainer.style.position = 'fixed';
    snowContainer.style.top = 0;
    snowContainer.style.left = 0;
    snowContainer.style.width = '100%';
    snowContainer.style.height = '100%';
    snowContainer.style.pointerEvents = 'none';
    snowContainer.style.zIndex = '9999';
    document.body.appendChild(snowContainer);
  
    const snowflakes = ['❄️', '❄️', '❄️']; // Snow emojis
    const christmasEmojis = ['🎄', '🎅', '🎁', '✨', '🦌'];
  
    function createFallingItem(emojisArray) {
      const item = document.createElement('div');
      item.textContent = emojisArray[Math.floor(Math.random() * emojisArray.length)];
      item.style.position = 'absolute';
      item.style.top = '-2rem';
      item.style.left = Math.random() * window.innerWidth + 'px';
      item.style.fontSize = (Math.random() * 24 + 16) + 'px';
      item.style.opacity = Math.random() * 0.8 + 0.2;
      snowContainer.appendChild(item);
  
      const speed = Math.random() * 2 + 1; // vertical speed
      const drift = (Math.random() - 0.5) * 1.5; // horizontal drift
  
      function fall() {
        const top = parseFloat(item.style.top);
        const left = parseFloat(item.style.left);
        if (top < window.innerHeight + 20) {
          item.style.top = top + speed + 'px';
          item.style.left = left + drift + 'px';
          requestAnimationFrame(fall);
        } else {
          item.remove();
        }
      }
      fall();
    }
  
    // Spawn snow and emojis continuously
    setInterval(() => {
      createFallingItem(snowflakes);
      if (Math.random() < 0.5) createFallingItem(christmasEmojis); // fewer emojis
    }, 200);
  });
  