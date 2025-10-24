/* script.js — Fixed version without mailbox modal */

const THEME_KEY = 'family_hub_halloween';
const REDUCED_MOTION = window.matchMedia('(prefers-motion: fast)').matches;

/* Tiny helpers */
const q = (sel, ctx = document) => (ctx || document).querySelector(sel);
const qAll = (sel, ctx = document) => Array.from((ctx || document).querySelectorAll(sel));
const create = (tag, props = {}, children = []) => {
  const el = document.createElement(tag);
  Object.entries(props).forEach(([k, v]) => {
    if (k === 'class') el.className = v;
    else if (k === 'text') el.textContent = v;
    else if (k === 'html') el.innerHTML = v;
    else el.setAttribute(k, String(v));
  });
  if (!Array.isArray(children)) children = [children];
  children.forEach(c => {
    if (typeof c === 'string') el.appendChild(document.createTextNode(c));
    else if (c) el.appendChild(c);
  });
  return el;
};

/* Halloween decorations */
function makeDecorFragment() {
  const frag = document.createDocumentFragment();

  const decor = create('div', { class: 'halloween-decor', 'aria-hidden': 'true' });
  const floats = [
    { cls: 'f1', emoji: '' },
    { cls: 'f2', emoji: '' },
    { cls: 'f3', emoji: '' },
    { cls: 'f4', emoji: '' },
    { cls: 'f5', emoji: '' },
  ];
  floats.forEach(f => {
    const el = create('div', { class: `float ${f.cls}` });
    el.textContent = f.emoji;
    decor.appendChild(el);
  });
  frag.appendChild(decor);

  const falling = create('div', { class: 'falling', 'aria-hidden': 'true' });
  const leaves = [
    { cls: 'l1', emoji: '🍁' },
    { cls: 'l2', emoji: '🍂' },
    { cls: 'l3', emoji: '🍁' },
    { cls: 'l4', emoji: '🍂' },
    { cls: 'l5', emoji: '🍂' },
    { cls: 'l6', emoji: '🍂' },
  ];

  leaves.forEach(l => {
    const el = create('div', { class: `leaf ${l.cls}` });
    el.textContent = l.emoji;
    falling.appendChild(el);
  });
  frag.appendChild(falling);

  return frag;
}

/* Set/remove CSS variables */
function setRootVars(vars = {}) {
  const root = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
}
function removeRootVars(keys = []) {
  const root = document.documentElement;
  keys.forEach(k => root.style.removeProperty(k));
}

/* Enable/disable Halloween theme */
function enableHalloween() {
  if (!document.body.classList.contains('halloween')) {
    document.body.classList.add('halloween');
  }
  setRootVars({
    '--bg': 'linear-gradient(180deg,#06040a 0%, #170b17 50%, #260810 100%)',
    '--surface': 'rgba(18,18,20,0.72)',
    '--card-surface': 'linear-gradient(180deg, rgba(24,14,12,0.8), rgba(32,12,10,0.6))',
    '--text': '#f7f2ea',
    '--muted': '#e6d7c6',
    '--brand': '#ff7b1a',
    '--accent': '#ffb84d'
  });
  if (!REDUCED_MOTION && !q('.halloween-decor')) {
    const frag = makeDecorFragment();
    document.body.appendChild(frag);
  }
  qAll('.main-nav a, .card, .card p, .card li, .title-group h1, .title-group .tagline').forEach(el => {
    el.style.color = '';
  });
  localStorage.setItem(THEME_KEY, '1');
  updateToggleButton(true);
}

function disableHalloween() {
  document.body.classList.remove('halloween');
  const deco = q('.halloween-decor');
  if (deco) deco.remove();
  const fall = q('.falling');
  if (fall) fall.remove();
  removeRootVars(['--bg','--surface','--card-surface','--text','--muted','--brand','--accent']);
  localStorage.removeItem(THEME_KEY);
  updateToggleButton(false);
}

function toggleHalloween() {
  if (document.body.classList.contains('halloween')) disableHalloween();
  else enableHalloween();
}

/* Toggle button in header */
function ensureToggleButton() {
  let btn = q('#halloweenToggle');
  if (btn) return btn;

  btn = create('button', {
    id: 'halloweenToggle',
    class: 'btn',
    type: 'button',
    title: 'Toggle Halloween theme',
    'aria-pressed': 'false'
  }, ['🎃 Halloween']);

  const header = q('.site-header') || document.body;
  header.appendChild(btn);

  btn.addEventListener('click', () => {
    toggleHalloween();
    btn.blur();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'h' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      toggleHalloween();
    }
  });

  return btn;
}

function updateToggleButton(isOn) {
  const btn = q('#halloweenToggle');
  if (!btn) return;
  btn.setAttribute('aria-pressed', String(Boolean(isOn)));
  btn.textContent = isOn ? '🎃 Halloween (On)' : '🎃 Halloween';
}

/* Lazy load iframes */
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

/* Button clicks — navigation only */
function wireButtonClicks() {
  qAll('.btn').forEach(btn => {
    // Skip anchors to let them behave naturally
    if (btn.tagName === 'A') return;

    if (btn._hasClickAnim) return;
    btn._hasClickAnim = true;

    btn.addEventListener('click', (e) => {
      if (!REDUCED_MOTION) {
        try {
          btn.animate([
            { transform: 'translateY(0) scale(1)' },
            { transform: 'translateY(-4px) scale(1.02)' },
            { transform: 'translateY(0) scale(0.995)' }
          ], { duration: 220, easing: 'cubic-bezier(.2,.9,.3,1)' });
        } catch (err) {}
      }

      const href = btn.getAttribute('data-href');
      const target = btn.getAttribute('target');
      if (href) {
        if (target === '_blank') window.open(href, '_blank');
        else window.location.href = href;
      }
    });
  });
}

/* DOM ready init */
document.addEventListener('DOMContentLoaded', () => {
  wireButtonClicks();
  ensureToggleButton();

  if (localStorage.getItem(THEME_KEY) === '1') enableHalloween();
  else updateToggleButton(false);

  lazyLoadIframes();

  const mo = new MutationObserver((mutations) => {
    let added = false;
    for (const m of mutations) if (m.addedNodes && m.addedNodes.length) { added = true; break; }
    if (added) wireButtonClicks();
  });
  mo.observe(document.body, { childList: true, subtree: true });

  window.FamilyHub = { enableHalloween, disableHalloween, toggleHalloween };
});
