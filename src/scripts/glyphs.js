// Campo de glifos. El texto del hero está hecho de caracteres de código (mono) que se "compilan":
// parpadean con caracteres al azar y se resuelven en su carácter final. El puntero los desordena
// (salen despedidos con un resorte y vuelven a compilar). A la derecha, líneas de código ambientales.
const DEFS = [
  { c: '#0E1116', w: 800, t: 1 },            // 0 texto
  { c: '#FF4F1F', w: 800, t: 1 },            // 1 texto acento
  { c: 'rgba(14,17,22,.17)', w: 500 },  // 2 ambiente tenue
  { c: '#1B38F0', w: 800, t: 1 },            // 3 desorden / compilando
  { c: '#FF4F1F', w: 600 },            // 4 ambiente acento
];
const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
const STREAM = 'const negocio={web:true,tienda:true,whatsapp:"pedidos",sistema:"a medida"};export async function construir(idea){const plan=await conversar(idea);const build=compilar(plan);return deploy(build);}import{web,tienda,app}from"camposdev";if(cliente.feliz){lanzar();acompanar();}';
const LINES = [
  'import { web, tienda, app } from "camposdev";',
  'const negocio = { nombre: "tu negocio" };',
  'export async function construir(idea) {',
  '  const plan = await conversar(idea);',
  '  const build = compilar(plan);',
  '  return deploy(build);',
  '}',
  '',
  '<Tienda pedidos="whatsapp" />',
  '<Web rapida movil responsive />',
  'fn sistema(datos) -> Reporte {',
  '  datos.iter().map(ordenar).collect()',
  '}',
  '',
  'if (cliente.feliz) { lanzar(); }',
  'await db.pedidos.insert({ estado: "nuevo" });',
  'git commit -m "primera version"',
  'npm run build && vercel deploy --prod',
  '.boton { background: var(--naranja); }',
  'SELECT * FROM clientes WHERE activo = 1;',
  'return <Pagina titulo="Hola" />;',
  'const rapida = lighthouse(sitio) > 90;',
  '// hecho a mano, sin plantillas',
  'while (negocio.crece) { mejorar(); }',
];
const POOL = '{}()[]<>/=;:.,+-*&|!?#$%_01@~^';

export function initGlyphs(canvas, { reduced, hero, body, h1, caret }) {
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, dpr = 1, cw = 7, ch = 13, tw = 5, th = 8;
  let n = 0, X, Y, OX, OY, VX, VY, HC, CC, CL, FT, DL, KIND;
  let atlas, sw = 0, sh = 0, charset = '', cidx = {};
  let started = false, visible = true, t0 = 0, built = false, wantStart = false, raf = 0, last = 0, tick = -1;
  const ptr = { x: -999, y: -999, vx: 0, vy: 0, on: false };
  const rnd = (a) => (Math.random() * a) | 0;

  function makeAtlas() {
    const set = new Set(POOL + STREAM + LINES.join(''));
    set.delete(' ');
    charset = [...set].join('');
    cidx = {}; [...charset].forEach((c, i) => { cidx[c] = i; });
    sw = Math.ceil(cw * dpr) + 2; sh = Math.ceil(Math.max(th, 16) * dpr) + 2;
    atlas = document.createElement('canvas');
    atlas.width = sw * charset.length; atlas.height = sh * DEFS.length;
    const a = atlas.getContext('2d');
    a.textAlign = 'center'; a.textBaseline = 'middle';
    DEFS.forEach((d, r) => {
      a.font = `${d.w} ${((d.t ? tw : cw) / 0.64) * dpr}px "CD Mono", ui-monospace, monospace`;
      a.fillStyle = d.c;
      for (let i = 0; i < charset.length; i++) a.fillText(charset[i], i * sw + sw / 2, r * sh + sh / 2 + dpr * 0.5);
    });
  }

  function measure() {
    // líneas del h1 (texto real, oculto), en coordenadas del hero (sin transformaciones)
    const hb = body.getBoundingClientRect();
    const cs = getComputedStyle(h1);
    const fs = parseFloat(cs.fontSize);
    const out = [];
    h1.querySelectorAll('.ln__in').forEach((el, i) => {
      const rg = document.createRange(); rg.selectNodeContents(el);
      const r = rg.getBoundingClientRect();
      out.push({ txt: el.textContent.toUpperCase(), x: r.left - hb.left + body.offsetLeft, y: r.top - hb.top + body.offsetTop, w: r.width, h: r.height, accent: i === 0 });
    });
    return { lines: out, fs, ls: parseFloat(cs.letterSpacing) || 0 };
  }

  function build() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const hr = hero.getBoundingClientRect();
    W = hr.width; H = hr.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    const mobile = W < 760;
    cw = mobile ? 5.6 : W > 1700 ? 8.4 : 7.4; ch = Math.round(cw * 2.8);
    tw = mobile ? 3.3 : W > 1700 ? 6 : 5.2; th = Math.round(tw * 1.55);
    makeAtlas();
    const cols = Math.ceil(W / cw), rows = Math.ceil(H / ch);
    const xs = [], ys = [], hc = [], cl = [], kd = [];
    let box = null;
    let si = 0;
    if (!reduced) {
      const m = measure();
      const off = document.createElement('canvas'); off.width = Math.ceil(W); off.height = Math.ceil(H);
      const o = off.getContext('2d', { willReadFrequently: true });
      o.fillStyle = '#000'; o.textBaseline = 'alphabetic';
      const lineIdx = [];
      m.lines.forEach((L) => {
        o.font = `800 ${m.fs}px "CD Display", Impact, sans-serif`;
        if ('letterSpacing' in o) o.letterSpacing = m.ls + 'px';
        const mw = o.measureText(L.txt).width;
        const asc = o.measureText(L.txt).fontBoundingBoxAscent || m.fs * 0.9;
        o.save(); o.translate(L.x, L.y + asc); o.scale(L.w / (mw - m.ls || mw), 1); o.fillText(L.txt, 0, 0); o.restore();
      });
      const img = o.getImageData(0, 0, off.width, off.height).data;
      const iw = off.width;
      const cov = (px, py) => { const x = Math.min(iw - 1, Math.max(0, px | 0)), y = Math.min(off.height - 1, Math.max(0, py | 0)); return img[(y * iw + x) * 4 + 3] > 127 ? 1 : 0; };
      const tcols = Math.ceil(W / tw), trows = Math.ceil(H / th);
      box = [1e9, 1e9, -1e9, -1e9];
      m.lines.forEach((L) => { box[0] = Math.min(box[0], L.x); box[1] = Math.min(box[1], L.y); box[2] = Math.max(box[2], L.x + L.w); box[3] = Math.max(box[3], L.y + L.h); });
      for (let r = 0; r < trows; r++) {
        for (let c = 0; c < tcols; c++) {
          const x0 = c * tw, y0 = r * th;
          const s = cov(x0 + tw * 0.25, y0 + th * 0.25) + cov(x0 + tw * 0.75, y0 + th * 0.25) + cov(x0 + tw * 0.5, y0 + th * 0.5) + cov(x0 + tw * 0.25, y0 + th * 0.75) + cov(x0 + tw * 0.75, y0 + th * 0.75);
          if (s < 3) continue;
          const cy = y0 + th / 2;
          let accent = false;
          for (const L of m.lines) if (cy >= L.y && cy <= L.y + L.h) { accent = L.accent; break; }
          xs.push(x0 + tw / 2); ys.push(cy);
          hc.push(cidx[STREAM[si++ % STREAM.length]]); cl.push(accent ? 1 : 0); kd.push(0);
        }
      }
      // posición del cursor de texto: al final de la última línea
      const L = m.lines[m.lines.length - 1];
      if (caret) { caret.style.fontSize = m.fs + 'px'; caret.style.left = (L.x + L.w - body.offsetLeft + 0.08 * m.fs) + 'px'; caret.style.top = (L.y + (L.h - m.fs * 0.74) / 2 + m.fs * 0.02 - body.offsetTop + m.fs * 0.1) + 'px'; }
    }
    // código ambiental con máscara dither
    for (let r = 0; r < rows; r++) {
      const line = LINES[(r * 5 + 3) % LINES.length];
      for (let c = 0; c < cols; c++) {
        if (box && c * cw > box[0] - 16 && c * cw < box[2] + 16 && r * ch > box[1] - 16 && r * ch < box[3] + 16) continue;
        let mk = mobile ? (r / rows - 0.6) / 0.28 : (c / cols - 0.44) / 0.34;
        mk = Math.max(0, Math.min(1, mk));
        if (mk <= BAYER[r & 3][c & 3] / 16) continue;
        const k = (c + r * 3) % (line.length + 8);
        const chr = line[k];
        if (!chr || chr === ' ') continue;
        xs.push(c * cw + cw / 2); ys.push(r * ch + ch / 2);
        hc.push(cidx[chr]); cl.push(Math.random() < 0.035 ? 4 : 2); kd.push(1);
      }
    }
    n = xs.length;
    X = Float32Array.from(xs); Y = Float32Array.from(ys); HC = Uint8Array.from(hc); CL = Uint8Array.from(cl); KIND = Uint8Array.from(kd);
    OX = new Float32Array(n); OY = new Float32Array(n); VX = new Float32Array(n); VY = new Float32Array(n);
    CC = Uint8Array.from(hc); FT = new Float32Array(n); DL = new Float32Array(n);
    for (let i = 0; i < n; i++) DL[i] = started || reduced ? 0 : 1e9;
    if (started && !reduced) schedule();
    built = true;
    if (!reduced) hero.classList.add('has-field');
    draw();
  }

  // orden de compilación: barrido diagonal desde arriba-izquierda
  function schedule() {
    for (let i = 0; i < n; i++) {
      const d = KIND[i] ? 0.5 + (X[i] / W) * 0.9 + Math.random() * 0.4 : (X[i] / W) * 0.55 + (Y[i] / H) * 0.7 + Math.random() * 0.25;
      DL[i] = d; FT[i] = 0.55 + Math.random() * 0.45;
    }
  }

  function draw() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!atlas) return;
    const hw = sw / 2, hh = sh / 2;
    for (let i = 0; i < n; i++) {
      if (DL[i] > 0) continue;
      const fl = FT[i] > 0;
      const k = fl ? CC[i] : HC[i];
      const row = fl && !(KIND[i] && !ptr.on && FT[i] < 0.2) ? 3 : CL[i];
      if (!KIND[i]) { ctx.globalAlpha = 0.2; ctx.fillStyle = row === 3 ? '#1B38F0' : CL[i] ? '#FF4F1F' : '#0E1116'; ctx.fillRect(Math.round((X[i] + OX[i] - tw / 2) * dpr), Math.round((Y[i] + OY[i] - th / 2) * dpr), Math.ceil(tw * dpr) + 1, Math.ceil(th * dpr) + 1); ctx.globalAlpha = 1; }
      ctx.drawImage(atlas, k * sw, row * sh, sw, sh, Math.round((X[i] + OX[i]) * dpr - hw), Math.round((Y[i] + OY[i]) * dpr - hh), sw, sh);
    }
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    const dt = Math.min((now - last) / 1000 || 0.016, 0.05); last = now;
    const tk = Math.floor(now / 70), reroll = tk !== tick; tick = tk;
    const R = 108, R2 = R * R;
    // ambiente: algunas líneas "se reescriben"
    for (let j = 0; j < Math.max(2, n / 260); j++) { const i = rnd(n); if (KIND[i] && DL[i] <= 0 && FT[i] <= 0) FT[i] = 0.1; }
    for (let i = 0; i < n; i++) {
      if (DL[i] > 0) { if (DL[i] < 1e8) DL[i] -= dt; if (DL[i] > 0) continue; }
      if (FT[i] > 0) { FT[i] -= dt; if (reroll) CC[i] = cidx[POOL[rnd(POOL.length)]]; }
      if (ptr.on) {
        const dx = X[i] + OX[i] - ptr.x, dy = Y[i] + OY[i] - ptr.y, d2 = dx * dx + dy * dy;
        if (d2 < R2) {
          const d = Math.sqrt(d2) || 1, f = Math.pow(1 - d / R, 2);
          VX[i] += (dx / d) * f * 2.6 + ptr.vx * f * 0.06;
          VY[i] += (dy / d) * f * 2.6 + ptr.vy * f * 0.06;
          if (f > 0.12 && FT[i] < 0.5) FT[i] = 0.55 + f * 0.6;
        }
      }
      VX[i] += -OX[i] * 0.07; VY[i] += -OY[i] * 0.07;
      VX[i] *= 0.85; VY[i] *= 0.85;
      OX[i] += VX[i]; OY[i] += VY[i];
    }
    ptr.vx *= 0.8; ptr.vy *= 0.8;
    draw();
  }

  function onMove(e) {
    const r = hero.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    ptr.on = y > -40 && y < r.height + 40;
    ptr.vx = x - (ptr.x < -900 ? x : ptr.x); ptr.vy = y - (ptr.y < -900 ? y : ptr.y);
    ptr.x = x; ptr.y = y;
  }

  const fontsReady = Promise.all([
    document.fonts.load('800 100px "CD Display"'), document.fonts.load('700 12px "CD Mono"'), document.fonts.load('500 12px "CD Mono"'),
  ]).catch(() => {}).then(() => document.fonts.ready);

  fontsReady.then(() => {
    build();
    if (wantStart) api.start();
    if (!reduced) {
      window.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerleave', () => { ptr.on = false; });
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 }).observe(canvas);
      raf = requestAnimationFrame(frame);
    }
  });
  let rt, lw = innerWidth;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => { if (innerWidth === lw && reduced) return; lw = innerWidth; if (built) { const s = started; build(); if (s && !reduced) { for (let i = 0; i < n; i++) { DL[i] = 0; FT[i] = 0; } } } }, 200);
  });

  const api = {
    start() {
      if (reduced) return;
      if (!built) { wantStart = true; return; }
      started = true; t0 = performance.now(); schedule();
      setTimeout(() => caret && caret.classList.add('is-on'), 1700);
    },
  };
  return api;
}
