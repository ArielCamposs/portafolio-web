// Bloque "En desarrollo": el mismo barrido de compilación que los casos,
// y el video solo se reproduce mientras está en pantalla.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const GLY = '01{}[]()<>/=+*#%$&;:_-|?!~'.split('');
const hash = (a, b, c) => {
  let h = (a * 374761393 + b * 668265263 + c * 1274126177) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};
const CELL_W = 9, CELL_H = 14, AHEAD = 90, BEHIND = 46;

export function initLab(reduced) {
  const root = document.getElementById('en-desarrollo');
  if (!root) return;
  const video = root.querySelector('.lab__video');
  const view = root.querySelector('.stage__view');
  const after = root.querySelector('.after');
  const code = root.querySelector('.before__code');
  const cv = root.querySelector('.stage__band');
  const st = root.querySelector('.stage__st');
  const g = cv.getContext('2d');
  const fam = (getComputedStyle(document.documentElement).getPropertyValue('--f-m') || '').trim() || 'ui-monospace, monospace';
  const lines = [...root.querySelectorAll('.bl')].map((n) => ({ n, t: n.dataset.t, last: n.dataset.t, top: 0, left: 0 }));

  const posterOnly = () => {
    video.removeAttribute('autoplay');
    video.pause();
    video.querySelectorAll('source').forEach((s) => s.remove());
    video.load();
  };

  if (reduced) {
    posterOnly();
    after.style.clipPath = 'none';
    if (st) st.textContent = '[##########] 100%';
    return;
  }

  video.pause();

  let W = 0, H = 0, dpr = 1, p = 0, cw = 7, cols = 40, lh = 20, started = false;
  const S = () => W * 0.18;
  const edge = (y, t) => (W + S()) * t - S() * (y / Math.max(H, 1));

  function measure() {
    W = view.clientWidth;
    H = view.clientHeight;
    if (!W) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    if (code) {
      const cs = getComputedStyle(code);
      const gx = document.createElement('canvas').getContext('2d');
      gx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      cw = gx.measureText('M').width || 7;
      lh = parseFloat(cs.lineHeight) || 20;
      cols = Math.max(8, Math.floor((code.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)) / cw));
      const vr = view.getBoundingClientRect();
      lines.forEach((l) => {
        const r = l.n.getBoundingClientRect();
        l.top = r.top - vr.top;
        l.left = r.left - vr.left + parseFloat(getComputedStyle(l.n).paddingLeft);
      });
    }
    render(p);
  }

  function noise(t) {
    const bucket = Math.floor(performance.now() / 70);
    lines.forEach((l, li) => {
      let s = l.t;
      if (t > 0 && t < 1) {
        let o = '';
        for (let i = 0; i < l.t.length; i++) {
          const ch = l.t[i];
          if (ch === ' ') { o += ch; continue; }
          const row = Math.floor(i / cols), col = i % cols;
          const d = l.left + col * cw - edge(l.top + row * lh + lh / 2, t);
          o += d > -4 && d < AHEAD + 20 && hash(i + 1, li + 7, bucket) < 0.35 + 0.6 * (1 - d / (AHEAD + 20))
            ? GLY[Math.floor(hash(i, li, bucket + 3) * GLY.length)]
            : ch;
        }
        s = o;
      }
      if (s !== l.last) { l.n.textContent = s; l.last = s; }
    });
  }

  function band(t) {
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, W, H);
    if (t <= 0 || t >= 1) return;
    const bucket = Math.floor(performance.now() / 70);
    g.font = `700 11px ${fam}`;
    g.textBaseline = 'middle';
    g.textAlign = 'center';
    const rows = Math.ceil(H / CELL_H);
    for (let r = 0; r < rows; r++) {
      const y = r * CELL_H;
      const ex = edge(y + CELL_H / 2, t);
      const c0 = Math.max(0, Math.floor((ex - BEHIND) / CELL_W));
      const c1 = Math.min(Math.ceil(W / CELL_W), Math.ceil((ex + AHEAD) / CELL_W));
      for (let k = c0; k < c1; k++) {
        const x = k * CELL_W, d = x - ex;
        const dens = d > 0 ? 1 - d / AHEAD : 1 + d / BEHIND;
        if (hash(k, r, bucket) > dens * 0.96) continue;
        const u = hash(k + 99, r + 13, bucket >> 1);
        let bg, fg;
        if (u < 0.5) { bg = 'rgba(14,17,22,.9)'; fg = u < 0.28 ? '#FF4F1F' : '#F0EEE6'; }
        else if (u < 0.78) { bg = '#1B38F0'; fg = '#F0EEE6'; }
        else { bg = u < 0.9 ? '#F0EEE6' : '#FF4F1F'; fg = '#0E1116'; }
        g.fillStyle = bg;
        g.fillRect(x, y, CELL_W - 1, CELL_H - 1);
        g.fillStyle = fg;
        g.fillText(GLY[Math.floor(hash(k, r + 5, bucket) * GLY.length)], x + CELL_W / 2 - 0.5, y + CELL_H / 2);
      }
    }
  }

  function render(t) {
    p = t;
    if (!W) return;
    if (t >= 1) after.style.clipPath = 'none';
    else {
      const xt = edge(0, t), xb = edge(H, t);
      after.style.clipPath = `polygon(0 0,${xt}px 0,${xb}px 100%,0 100%)`;
    }
    const n = Math.round(t * 10);
    if (st) st.textContent = `[${'#'.repeat(n)}${'·'.repeat(10 - n)}] ${Math.round(t * 100)}%`;
    noise(t);
    band(t);
  }

  function compile() {
    if (started) return;
    started = true;
    const o = { p: 0 };
    gsap.to(o, {
      p: 1,
      duration: 1.9,
      ease: 'power2.inOut',
      onUpdate: () => render(o.p),
      onComplete: () => render(1),
    });
  }

  const stage = root.querySelector('.stage');
  ScrollTrigger.create({ trigger: stage, start: 'top 68%', once: true, onEnter: compile });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const run = video.play();
        if (run) run.catch(() => {});
      } else video.pause();
    });
  }, { threshold: 0.28 });
  io.observe(view);

  new ResizeObserver(() => measure()).observe(view);
  measure();
  render(0);
}
