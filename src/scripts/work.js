// Proyectos como casos antes/después. Filtro por tipo de negocio (GSAP Flip),
// "compilación" del problema al sitio real (barrido en diagonal + bloques de caracteres),
// mockup con auto-scroll de la captura completa. Todo en una función render(p) pura.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
gsap.registerPlugin(ScrollTrigger, Flip);

const GLY = '01{}[]()<>/=+*#%$&;:_-|?!~'.split('');
const hash = (a, b, c) => {
  let h = (a * 374761393 + b * 668265263 + c * 1274126177) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};
const CELL_W = 9, CELL_H = 14, AHEAD = 90, BEHIND = 46;

export function initWork({ reduced, lenis }) {
  const section = document.getElementById('proyectos');
  const list = document.getElementById('casesList');
  const divider = document.getElementById('casesDiv');
  const out = document.getElementById('filtersOut');
  const chips = [...document.querySelectorAll('#filters .chip')];
  const cases = [...list.querySelectorAll('.case')];
  const total = cases.length;
  const fam = (getComputedStyle(document.documentElement).getPropertyValue('--f-m') || '').trim() || 'ui-monospace, monospace';
  const ctrls = new Map();

  /* ───────────── un caso ───────────── */
  function setupCase(el) {
    const stage = el.querySelector('.stage');
    const view = el.querySelector('.stage__view');
    const after = el.querySelector('.after');
    const code = el.querySelector('.before__code');
    const cv = el.querySelector('.stage__band');
    const g = cv.getContext('2d');
    const st = el.querySelector('.stage__st');
    const tabs = [...el.querySelectorAll('.stab')];
    const flow = [...el.querySelectorAll('.flow__i')];
    const vp = el.querySelector('.mock__vp');
    const img = el.querySelector('.mock__img');
    const lines = [...el.querySelectorAll('.bl')].map((n) => ({ n, t: n.dataset.t, last: n.dataset.t, top: 0, left: 0 }));
    const c = { el, state: 'before', p: 0, tw: null, scrollTw: null, inView: false, hover: false, manual: false, done: false, W: 0, H: 0, dpr: 1, cw: 7, cols: 40, lh: 20, open: true };
    const S = () => c.W * 0.18;
    const edge = (y, p) => (c.W + S()) * p - S() * (y / c.H);

    function measure() {
      c.W = view.clientWidth; c.H = view.clientHeight;
      if (!c.W) return;
      c.dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(c.W * c.dpr); cv.height = Math.round(c.H * c.dpr);
      const cs = getComputedStyle(code);
      const gx = document.createElement('canvas').getContext('2d');
      gx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      c.cw = gx.measureText('M').width || 7;
      c.lh = parseFloat(cs.lineHeight) || 20;
      c.cols = Math.max(8, Math.floor((code.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)) / c.cw));
      const vr = view.getBoundingClientRect();
      lines.forEach((l) => {
        const r = l.n.getBoundingClientRect();
        l.top = r.top - vr.top; l.left = r.left - vr.left + parseFloat(getComputedStyle(l.n).paddingLeft);
      });
      render(c.p);
      buildScroll();
    }

    function noise(p) {
      const bucket = Math.floor(performance.now() / 70);
      lines.forEach((l, li) => {
        let s = l.t;
        if (p > 0 && p < 1) {
          let o = '';
          for (let i = 0; i < l.t.length; i++) {
            const ch = l.t[i];
            if (ch === ' ') { o += ch; continue; }
            const row = Math.floor(i / c.cols), col = i % c.cols;
            const d = l.left + col * c.cw - edge(l.top + row * c.lh + c.lh / 2, p);
            o += d > -4 && d < AHEAD + 20 && hash(i + 1, li + 7, bucket) < 0.35 + 0.6 * (1 - d / (AHEAD + 20)) ? GLY[Math.floor(hash(i, li, bucket + 3) * GLY.length)] : ch;
          }
          s = o;
        }
        if (s !== l.last) { l.n.textContent = s; l.last = s; }
      });
    }

    function band(p) {
      g.setTransform(c.dpr, 0, 0, c.dpr, 0, 0);
      g.clearRect(0, 0, c.W, c.H);
      if (p <= 0 || p >= 1) return;
      const bucket = Math.floor(performance.now() / 70);
      g.font = `700 11px ${fam}`; g.textBaseline = 'middle'; g.textAlign = 'center';
      const rows = Math.ceil(c.H / CELL_H);
      for (let r = 0; r < rows; r++) {
        const y = r * CELL_H;
        const ex = edge(y + CELL_H / 2, p);
        const c0 = Math.max(0, Math.floor((ex - BEHIND) / CELL_W)), c1 = Math.min(Math.ceil(c.W / CELL_W), Math.ceil((ex + AHEAD) / CELL_W));
        for (let k = c0; k < c1; k++) {
          const x = k * CELL_W, d = x - ex;
          const dens = d > 0 ? 1 - d / AHEAD : 1 + d / BEHIND;
          if (hash(k, r, bucket) > dens * 0.96) continue;
          const t = hash(k + 99, r + 13, bucket >> 1);
          let bg, fg;
          if (t < 0.5) { bg = 'rgba(14,17,22,.9)'; fg = t < 0.28 ? '#FF4F1F' : '#F0EEE6'; }
          else if (t < 0.78) { bg = '#1B38F0'; fg = '#F0EEE6'; }
          else { bg = t < 0.9 ? '#F0EEE6' : '#FF4F1F'; fg = '#0E1116'; }
          g.fillStyle = bg; g.fillRect(x, y, CELL_W - 1, CELL_H - 1);
          g.fillStyle = fg; g.fillText(GLY[Math.floor(hash(k, r + 5, bucket) * GLY.length)], x + CELL_W / 2 - 0.5, y + CELL_H / 2);
        }
      }
    }

    function render(p) {
      c.p = p;
      if (!c.W) return;
      if (p >= 1) after.style.clipPath = 'none';
      else { const xt = edge(0, p), xb = edge(c.H, p); after.style.clipPath = `polygon(0 0,${xt}px 0,${xb}px 100%,0 100%)`; }
      const n = Math.round(p * 10);
      st.textContent = `[${'#'.repeat(n)}${'·'.repeat(10 - n)}] ${Math.round(p * 100)}%`;
      if (reduced) return;
      noise(p); band(p);
    }

    /* auto-scroll del mockup (captura completa) */
    function buildScroll() {
      const prog = c.scrollTw ? c.scrollTw.progress() : 0;
      if (c.scrollTw) { c.scrollTw.kill(); c.scrollTw = null; }
      gsap.set(img, { y: 0 });
      if (!c.W) return;
      after.classList.remove('is-short');
      let dist = img.offsetHeight - vp.clientHeight;
      if (dist < 12) { after.classList.add('is-short'); return; }
      if (reduced) return;
      c.scrollTw = gsap.to(img, { y: -dist, duration: Math.max(4, dist / 190), ease: 'sine.inOut', yoyo: true, repeat: -1, repeatDelay: 1.1, paused: true });
      c.scrollTw.progress(prog);
      syncScroll();
    }
    function syncScroll() {
      if (!c.scrollTw) return;
      c.scrollTw.paused(!(c.state === 'after' && c.p >= 1 && c.inView && !c.hover && c.open));
    }

    function setState(s, { instant = false } = {}) {
      if (s === c.state && !c.tw && ((s === 'after' && c.p === 1) || (s === 'before' && c.p === 0))) return;
      c.state = s;
      stage.dataset.state = s;
      tabs.forEach((t) => { const on = t.dataset.s === s; t.classList.toggle('is-on', on); t.setAttribute('aria-pressed', on); });
      flow.forEach((f) => f.classList.toggle('is-on', f.dataset.for === 'before' || s === 'after'));
      c.tw && c.tw.kill();
      const to = s === 'after' ? 1 : 0;
      if (instant || reduced) { c.tw = null; render(to); syncScroll(); return; }
      const o = { p: c.p };
      c.tw = gsap.to(o, {
        p: to, duration: to ? 1.9 : 1.2, ease: to ? 'power2.inOut' : 'power2.inOut',
        onUpdate: () => render(o.p),
        onComplete: () => { c.tw = null; render(to); syncScroll(); },
      });
      syncScroll();
    }

    function maybeAuto() {
      if (c.done || c.manual || !c.open || c.state !== 'before') return;
      const r = stage.getBoundingClientRect();
      if (r.height && r.top < innerHeight * 0.62 && r.bottom > innerHeight * 0.25) {
        c.done = true;
        gsap.delayedCall(0.55, () => { if (!c.manual && c.state === 'before') setState('after'); });
      }
    }

    tabs.forEach((t) => t.addEventListener('click', () => { c.manual = true; c.done = true; setState(t.dataset.s); }));
    stage.addEventListener('pointerenter', () => {
      c.hover = true; syncScroll();
      if (!reduced && !c.manual && c.state === 'before' && c.p === 0) { c.done = true; setState('after'); }
    });
    stage.addEventListener('pointerleave', () => { c.hover = false; syncScroll(); });

    ScrollTrigger.create({
      trigger: stage, start: 'top 62%', end: 'bottom 25%',
      onEnter: maybeAuto, onEnterBack: maybeAuto,
      onToggle: (s) => { c.inView = s.isActive; syncScroll(); },
    });
    ScrollTrigger.create({ trigger: stage, start: 'top bottom', end: 'bottom top', onToggle: (s) => { c.inView = s.isActive; syncScroll(); } });

    new ResizeObserver(() => measure()).observe(view);
    img.addEventListener('load', buildScroll);

    Object.assign(c, { setState, maybeAuto, syncScroll, measure });
    if (reduced) { c.done = true; setState('after', { instant: true }); }
    else render(0);
    return c;
  }
  cases.forEach((el) => ctrls.set(el, setupCase(el)));

  /* ───────────── abrir / cerrar ───────────── */
  const setOpen = (el, open) => {
    el.classList.toggle('is-open', open);
    el.querySelector('.case__toggle').setAttribute('aria-expanded', open);
    const c = ctrls.get(el); c.open = open; c.syncScroll();
  };
  const after = () => { ScrollTrigger.refresh(); ctrls.forEach((c) => { c.measure(); c.maybeAuto(); }); };

  cases.forEach((el) => el.querySelector('.case__toggle').addEventListener('click', () => {
    const open = !el.classList.contains('is-open');
    const state = reduced ? null : Flip.getState([...list.children], { props: 'opacity' });
    setOpen(el, open);
    if (state) Flip.from(state, { duration: 0.85, ease: 'expo.inOut', scale: false, onComplete: after });
    else after();
    if (open) gsap.delayedCall(reduced ? 0 : 0.9, () => ctrls.get(el).maybeAuto());
  }));

  /* ───────────── filtro por tipo de negocio ───────────── */
  const orig = cases.slice();
  function applyFilter(id) {
    const label = chips.find((b) => b.dataset.f === id).querySelector('span').textContent;
    const match = id === 'todo' ? orig : orig.filter((el) => el.dataset.tags.split(' ').includes(id));
    const rest = id === 'todo' ? [] : orig.filter((el) => !match.includes(el));
    chips.forEach((b) => b.setAttribute('aria-pressed', b.dataset.f === id));
    out.textContent = id === 'todo' ? `// mostrando los ${total} casos` : `// ${match.length} ${match.length === 1 ? 'caso' : 'casos'} para «${label}» primero · ${rest.length} más abajo`;
    const state = reduced ? null : Flip.getState([...list.children], { props: 'opacity' });
    match.forEach((el) => list.insertBefore(el, divider));
    rest.forEach((el) => list.appendChild(el));
    if (rest.length) list.insertBefore(divider, rest[0]); else list.appendChild(divider);
    divider.hidden = !rest.length;
    match.forEach((el) => setOpen(el, true));
    rest.forEach((el) => setOpen(el, false));
    const first = match[0];
    const go = () => {
      after();
      const y = first.getBoundingClientRect().top + window.scrollY - 175;
      const rt = first.getBoundingClientRect().top;
      if (rt < 150 || rt > innerHeight * 0.6) {
        if (lenis) lenis.scrollTo(y, { duration: 1.1 }); else window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
      }
      gsap.delayedCall(reduced ? 0 : 1.2, () => match.forEach((el) => ctrls.get(el).maybeAuto()));
    };
    if (state) Flip.from(state, { duration: 0.95, ease: 'expo.inOut', scale: false, stagger: 0.035, onEnter: (t) => gsap.fromTo(t, { opacity: 0 }, { opacity: 1, duration: 0.5 }), onComplete: go });
    else go();
  }
  chips.forEach((b) => b.addEventListener('click', () => { if (b.getAttribute('aria-pressed') !== 'true') applyFilter(b.dataset.f); }));

  window.addEventListener('load', () => ScrollTrigger.refresh());
  return { applyFilter };
}
