import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { scramble } from './scramble.js';
gsap.registerPlugin(ScrollTrigger, SplitText);

/* Manifiesto: las palabras se encienden con el scroll (idea: Anthracite) */
export function initManifesto(reduced) {
  const words = [...document.querySelectorAll('#manifesto .w')];
  if (reduced) { words.forEach((w) => w.classList.add('is-on')); return; }
  ScrollTrigger.create({
    trigger: '#manifesto', start: 'top 82%', end: 'bottom 50%',
    onUpdate(self) {
      const k = Math.round(self.progress * words.length);
      words.forEach((w, i) => w.classList.toggle('is-on', i < k));
    },
  });
}

/* Contadores con pasos */
export function initCounters(reduced) {
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = +el.dataset.count;
    if (reduced) { el.textContent = target; return; }
    const o = { v: 0 };
    ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => gsap.to(o, { v: target, duration: 1.4, ease: `steps(${target})`, onUpdate: () => (el.textContent = Math.round(o.v)) }) });
  });
}

/* Revelado palabra por palabra con blur (idea: Salo) */
export function initBlurWords(reduced) {
  if (reduced) return;
  document.querySelectorAll('[data-blur]').forEach((el) => {
    document.fonts.ready.then(() => {
      const sp = new SplitText(el, { type: 'words' });
      gsap.set(sp.words, { opacity: 0, filter: 'blur(12px)', willChange: 'opacity, filter' });
      gsap.to(sp.words, { opacity: 1, filter: 'blur(0px)', duration: 1.5, ease: 'power2.out', stagger: 0.06, scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
    });
  });
}

/* Cursor con texto (idea: Nuila) */
export function initCursor(reduced) {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches || reduced) return;
  const c = document.getElementById('cursor'), txt = document.getElementById('cursorText');
  document.documentElement.classList.add('has-cursor');
  const qx = gsap.quickTo(c, 'x', { duration: 0.18, ease: 'power3.out' });
  const qy = gsap.quickTo(c, 'y', { duration: 0.18, ease: 'power3.out' });
  let first = true;
  window.addEventListener('pointermove', (e) => {
    if (first) { gsap.set(c, { x: e.clientX, y: e.clientY }); c.classList.add('is-on'); first = false; }
    qx(e.clientX); qy(e.clientY);
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => c.classList.remove('is-on'));
  document.documentElement.addEventListener('pointerenter', () => c.classList.add('is-on'));
  document.addEventListener('pointerover', (e) => {
    const t = e.target.closest && e.target.closest('[data-cursor]');
    if (t) { txt.textContent = t.dataset.cursor; c.classList.add('has-text'); } else c.classList.remove('has-text');
  });
}

/* Botón de caracteres: la celda parpadea con glifos y se compila a sólido (idea: Hontran) */
export function initPixelButtons(reduced) {
  document.querySelectorAll('.pxbtn').forEach((btn) => {
    if (reduced) { btn.addEventListener('pointerenter', () => (btn.style.background = btn.dataset.px)); btn.addEventListener('pointerleave', () => (btn.style.background = '')); return; }
    const cv = btn.querySelector('canvas'), cx = cv.getContext('2d'), color = btn.dataset.px || '#0E1116';
    const CELL = 10, GL = '{}()<>/=;:+-*&|#$%01';
    const gl = () => GL[(Math.random() * GL.length) | 0];
    let cols, rows, cells, W, H, hover = false, running = false, ox = 0.5, oy = 0.5, dpr = 1;
    const build = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = btn.clientWidth; H = btn.clientHeight; cv.width = W * dpr; cv.height = H * dpr;
      cols = Math.ceil(W / CELL); rows = Math.ceil(H / CELL);
      cells = Array.from({ length: cols * rows }, (_, i) => ({ c: i % cols, r: (i / cols) | 0, s: 0, d: 0, ph: Math.random() * 6 }));
    };
    build(); new ResizeObserver(build).observe(btn);
    let last = 0;
    const tick = (now) => {
      const dt = Math.min((now - last) / 1000 || 0.016, 0.05); last = now;
      cx.setTransform(dpr, 0, 0, dpr, 0, 0); cx.clearRect(0, 0, W, H); cx.fillStyle = color;
      let busy = false;
      for (const k of cells) {
        const dist = Math.hypot(k.c / cols - ox, (k.r / rows - oy) * (H / W)) ;
        if (hover) { k.d += dt; if (k.d > dist * 0.5) k.s = Math.min(1, k.s + dt * 7); }
        else { k.d = 0; k.s = Math.max(0, k.s - dt * 5); }
        if (k.s > 0) {
          busy = true;
          if (k.s < 1) {
            cx.font = '600 11px "CD Mono", monospace'; cx.textAlign = 'center'; cx.textBaseline = 'middle';
            if (((now / 70) | 0) !== k.t) { k.t = (now / 70) | 0; k.g = gl(); }
            cx.fillText(k.g || '#', k.c * CELL + CELL / 2, k.r * CELL + CELL / 2 + 1);
          } else cx.fillRect(k.c * CELL, k.r * CELL, CELL + 0.5, CELL + 0.5);
        } else if (hover) busy = true;
      }
      if (busy || hover) requestAnimationFrame(tick); else running = false;
    };
    const go = () => { if (!running) { running = true; last = performance.now(); requestAnimationFrame(tick); } };
    btn.addEventListener('pointerenter', (e) => { const r = btn.getBoundingClientRect(); ox = (e.clientX - r.left) / r.width; oy = (e.clientY - r.top) / r.height; hover = true; go(); });
    btn.addEventListener('focus', () => { ox = .5; oy = .5; hover = true; go(); });
    btn.addEventListener('pointerleave', () => { hover = false; go(); });
    btn.addEventListener('blur', () => { hover = false; go(); });
  });
}

/* Dock (etiqueta con scramble por sección), tema del header, % de scroll, reloj */
export function initChrome(reduced, lenis) {
  const label = document.getElementById('dockLabel');
  const pct = document.getElementById('dockPct');
  let cur = '';
  const secs = [...document.querySelectorAll('[data-txt]')];
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    const t = e.target.dataset.txt;
    if (t === cur) return; cur = t;
    label.dataset.final = t;
    reduced ? (label.textContent = t) : scramble(label, t, { duration: 0.55 });
  }), { rootMargin: '-50% 0px -50% 0px' });
  secs.forEach((s) => io.observe(s));

  const themed = [...document.querySelectorAll('[data-theme]')];
  const setTheme = () => {
    let th = 'papel';
    for (const s of themed) { const r = s.getBoundingClientRect(); if (r.top <= 30 && r.bottom > 30) { th = s.dataset.theme; break; } }
    document.documentElement.dataset.theme = th;
  };
  const top = document.querySelector('.top');
  let hidden = false;
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate(self) {
    pct.textContent = String(Math.round(self.progress * 100)).padStart(3, '0'); setTheme();
    const y = self.scroll();
    top.classList.toggle('is-solid', y > 40);
    const want = self.direction === 1 && y > window.innerHeight * 0.5;
    if (want !== hidden && !document.body.classList.contains('is-loading')) { hidden = want; gsap.to(top, { yPercent: want ? -100 : 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' }); }
  } });
  setTheme();

  const clock = document.getElementById('clock');
  const fmt = new Intl.DateTimeFormat('es-CL', { timeZone: 'America/Santiago', hour: '2-digit', minute: '2-digit', hour12: false });
  const tick = () => (clock.textContent = `La Ligua · ${fmt.format(new Date())}`);
  tick(); setInterval(tick, 20000);

  // anclas
  document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href'); const el = id.length > 1 && document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(el, { duration: 1.6, easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2) });
    else el.scrollIntoView();
  }));
}
