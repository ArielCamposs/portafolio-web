// Etiquetas colgadas: péndulos con física propia (idea: tarjetas colgantes de Holloway).
// El pivote es la barra; la aceleración horizontal de la pista (arrastre) y el viento del scroll empujan.
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(Draggable, InertiaPlugin);

export function initTags({ reduced, lenis }) {
  const stage = document.getElementById('tagsStage');
  const track = document.getElementById('tagsTrack');
  const tags = [...track.querySelectorAll('.tag')];
  if (reduced) {
    stage.style.height = 'auto';
    track.style.cssText = 'position:relative;top:0;width:auto;overflow-x:auto;cursor:auto;padding-top:20px;padding-bottom:30px';
    stage.querySelector('.tags__rail').style.display = 'none';
    tags.forEach((t) => (t.style.transform = 'none'));
    return;
  }
  const st = tags.map((el, i) => ({ el, a: 0, w: 0, w0: 5.0 + i * 0.28 }));
  let visible = false, dragging = false;
  let lastX = 0, lastV = 0, ax = 0;

  const bounds = () => ({ minX: Math.min(0, window.innerWidth - track.scrollWidth), maxX: 0 });
  const drag = Draggable.create(track, {
    type: 'x', inertia: true, bounds: bounds(), edgeResistance: 0.8, allowNativeTouchScrolling: true, zIndexBoost: false,
    onPress() { dragging = true; }, onRelease() { dragging = false; },
  })[0];
  if (track.scrollWidth <= window.innerWidth) drag.disable();
  window.addEventListener('resize', () => { drag.applyBounds(bounds()); track.scrollWidth <= window.innerWidth ? drag.disable() : drag.enable(); });

  // entrada: caen de la barra y se balancean
  gsap.set(tags, { opacity: 0, y: -90 });
  ScrollTrigger.create({
    trigger: stage, start: 'top 78%', once: true,
    onEnter() {
      gsap.to(tags, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.09 });
      st.forEach((s, i) => gsap.delayedCall(0.09 * i + 0.25, () => { s.w += (i % 2 ? -1 : 1) * (4 + i * 0.6); }));
    },
  });
  ScrollTrigger.create({ trigger: stage, start: 'top bottom', end: 'bottom top', onToggle: (s) => (visible = s.isActive) });

  tags.forEach((el, i) => el.addEventListener('pointerenter', () => { st[i].w += (Math.random() < 0.5 ? -1 : 1) * 2.2; }));

  let tPrev = performance.now();
  gsap.ticker.add(() => {
    const now = performance.now();
    const dt = Math.min((now - tPrev) / 1000, 1 / 30); tPrev = now;
    if (!visible || dt <= 0) return;
    const x = gsap.getProperty(track, 'x');
    const v = (x - lastX) / dt; ax = (v - lastV) / dt; lastX = x; lastV = v;
    const wind = lenis ? Math.max(-80, Math.min(80, lenis.velocity || 0)) : 0;
    const L = 400, g = 1;
    for (const s of st) {
      for (let k = 0; k < 2; k++) {
        const h = dt / 2;
        const acc = -(s.w0 * s.w0) * Math.sin(s.a) - 2 * 0.13 * s.w0 * s.w - (ax / L) * 0.55 * Math.cos(s.a) + wind * 0.5 * Math.cos(s.a) * 0.05;
        s.w += acc * h; s.w = Math.max(-14, Math.min(14, s.w));
        s.a += s.w * h; s.a = Math.max(-0.75, Math.min(0.75, s.a));
      }
      gsap.set(s.el, { rotation: s.a * 180 / Math.PI });
    }
  });
}
