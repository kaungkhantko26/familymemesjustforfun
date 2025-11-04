/* =========================
   script.js — Cool Cloud Theme
   ========================= */

   const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

   /* --- Tiny DOM helpers --- */
   const q = (sel, ctx = document) => (ctx || document).querySelector(sel);
   const qAll = (sel, ctx = document) => Array.from((ctx || document).querySelectorAll(sel));
   
   /* --- Button animation --- */
   function wireButtonClicks() {
     qAll('.btn').forEach(btn => {
       if (btn.tagName === 'A') return;
       if (btn._hasClickAnim) return;
       btn._hasClickAnim = true;
       btn.addEventListener('click', () => {
         if (!REDUCED_MOTION) {
           try {
             btn.animate(
               [
                 { transform: 'translateY(0) scale(1)' },
                 { transform: 'translateY(-4px) scale(1.02)' },
                 { transform: 'translateY(0) scale(0.995)' }
               ],
               { duration: 220, easing: 'cubic-bezier(.2,.9,.3,1)' }
             );
           } catch (err) {}
         }
         const href = btn.getAttribute('data-href'),
               target = btn.getAttribute('target');
         if (href) {
           if (target === 'blank') window.open(href, '_blank');
           else window.location.href = href;
         }
       });
     });
   }
   
   /* --- Lazy load iframes --- */
   function lazyLoadIframes() {
     const iframes = qAll('iframe[data-src]');
     if (!iframes.length) return;
     if ('IntersectionObserver' in window) {
       const obs = new IntersectionObserver((entries, observer) => {
         entries.forEach(entry => {
           if (entry.isIntersecting) {
             const el = entry.target;
             el.src = el.getAttribute('data-src');
             el.removeAttribute('data-src');
             observer.unobserve(el);
           }
         });
       }, { rootMargin: '200px' });
       iframes.forEach(f => obs.observe(f));
     } else {
       iframes.forEach(f => {
         f.src = f.getAttribute('data-src');
         f.removeAttribute('data-src');
       });
     }
   }
   
   /* --- Security --- */
   document.addEventListener('contextmenu', e => e.preventDefault());
   document.addEventListener('keydown', e => {
     if (e.key === 'F12') e.preventDefault();
     if (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(e.key.toUpperCase())) e.preventDefault();
     if (e.ctrlKey && e.key.toLowerCase() === 'u') e.preventDefault();
   });
   
   /* --- VANTA Cloud Background --- */
   let vantaEffect = null;
   function initVanta() {
     if (window.VANTA) {
       if (vantaEffect) vantaEffect.destroy();
       vantaEffect = VANTA.CLOUDS({
         el: "body",
         mouseControls: true,
         touchControls: true,
         gyroControls: false,
         minHeight: 200.00,
         minWidth: 200.00,
         speed: 1.60
       });
     }
   }
   
   /* --- Init --- */
   document.addEventListener('DOMContentLoaded', () => {
     wireButtonClicks();
     lazyLoadIframes();
     initVanta();
   });
   
// Music control
const bgMusic = document.getElementById('bgMusic');
const playBtn = document.getElementById('playMusic');

if (playBtn && bgMusic){
  playBtn.addEventListener('click', ()=>{
    if (bgMusic.paused) {
      bgMusic.play();
      playBtn.textContent = '🎵 Pause Music';
      playBtn.setAttribute('aria-pressed','true');
    } else {
      bgMusic.pause();
      playBtn.textContent = '🎵 Play Music';
      playBtn.setAttribute('aria-pressed','false');
    }
  });

  // Optional: Try autoplay (best-effort)
  const p = bgMusic.play();
  if (p && p.then) {
    p.then(()=> {
      playBtn.textContent = '🎵 Pause Music';
      playBtn.setAttribute('aria-pressed','true');
    })
    .catch(()=> {
      // Autoplay blocked, user must click
    });
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const bgMusic = document.getElementById('bgMusic');
  const playBtn = document.getElementById('playMusic');

  // Try to autoplay on load
  if (bgMusic) {
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        // Autoplay successful
        if(playBtn) playBtn.textContent = 'Pause Music';
      }).catch(() => {
        // Autoplay blocked — wait for user click
        if(playBtn) playBtn.textContent = 'Play Music';
      });
    }
  }

  // Toggle button
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (bgMusic.paused) {
        bgMusic.play();
        playBtn.textContent = 'Pause Music';
      } else {
        bgMusic.pause();
        playBtn.textContent = 'Play Music';
      }
    });
  }
});

document.querySelectorAll('.card').forEach(card => {
  const sparklesContainer = document.createElement('div');
  sparklesContainer.className = 'sparkles';
  card.appendChild(sparklesContainer);

  for (let i = 0; i < 12; i++) { // 12 sparkles per card
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.top = Math.random() * 100 + '%';
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.animationDelay = (Math.random() * 2) + 's';
    sparkle.style.width = sparkle.style.height = (Math.random() * 6 + 4) + 'px';
    sparklesContainer.appendChild(sparkle);
  }
});
