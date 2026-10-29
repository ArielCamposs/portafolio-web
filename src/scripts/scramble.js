// Scramble con sustitución de glifos del MISMO ancho (idea: Anthracite). Re-implementado.
import { gsap } from 'gsap';
const POOL = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=?/<>'.split('');
const ctx = document.createElement('canvas').getContext('2d');
const cache = new Map();
function table(font, upper) {
  const key = font + upper;
  if (cache.has(key)) return cache.get(key);
  ctx.font = font;
  const w = (c) => ctx.measureText(upper ? c.toUpperCase() : c).width;
  const t = { w, pool: POOL.map((c) => [c, w(c)]) };
  cache.set(key, t);
  return t;
}
function subs(ch, t) {
  const w0 = t.w(ch);
  const tol = Math.max(w0 * 0.08, 0.3);
  const ok = t.pool.filter(([c, w]) => c !== ch && Math.abs(w - w0) <= tol).map(([c]) => c);
  return ok.length ? ok : [ch];
}
export function scramble(el, text = el.dataset.final || el.textContent, { duration = 0.6 } = {}) {
  if (!el.dataset.final) el.dataset.final = text;
  const cs = getComputedStyle(el);
  const font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  const upper = cs.textTransform === 'uppercase';
  const t = table(font, upper);
  const chars = [...text];
  const pools = chars.map((c) => (c === ' ' || c === '—' || c === '\n' ? null : subs(c, t)));
  el.__sc && el.__sc.kill();
  const o = { p: 0 };
  let last = 0;
  if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', text);
  el.style.whiteSpace = 'pre';
  el.__sc = gsap.to(o, {
    p: 1, duration, ease: 'none',
    onUpdate() {
      const now = performance.now();
      if (now - last < 40 && o.p < 1) return;
      last = now;
      const k = Math.floor(o.p * chars.length);
      let out = '';
      for (let i = 0; i < chars.length; i++) {
        if (i < k || !pools[i]) out += chars[i];
        else out += pools[i][(Math.random() * pools[i].length) | 0];
      }
      el.textContent = out;
    },
    onComplete() { el.textContent = text; },
  });
}
export function initScramble(reduced) {
  if (reduced) return;
  document.querySelectorAll('[data-scramble]').forEach((el) => {
    el.dataset.final = el.textContent.trim();
    const go = () => scramble(el, el.dataset.final, { duration: 0.5 });
    (el.closest('a,button') || el).addEventListener('pointerenter', go);
    (el.closest('a,button') || el).addEventListener('focus', go);
  });
  document.querySelectorAll('[data-scramble-hover]').forEach((el) => {
    el.dataset.final = el.textContent.trim();
    const host = el.closest('.case__toggle') || el;
    host.addEventListener('pointerenter', () => scramble(el, el.dataset.final, { duration: 0.6 }));
  });
}
