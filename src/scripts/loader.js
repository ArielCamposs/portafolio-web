// Preloader: "build" real del sitio. Contador en pasos + log de terminal + cortina clip-path expo.inOut (idea: Spitzer)
import { gsap } from 'gsap';
export function runLoader({ reduced, onReveal }) {
  const el = document.getElementById('loader');
  const skip = reduced || sessionStorage.getItem('cdv-seen');
  if (skip || !el) { el && el.remove(); document.body.classList.remove('is-loading'); onReveal(); return Promise.resolve(); }
  document.body.classList.add('is-loading');
  const t0 = performance.now();
  return new Promise((resolve) => {
    const num = document.getElementById('loaderNum');
    const bar = document.getElementById('loaderBar');
    const done = document.getElementById('loaderDone');
    const items = [...el.querySelectorAll('.loader__log li')];
    const marks = [8, 24, 40, 57, 73, 88, 100];
    let shown = 0;
    const o = { v: 0 };
    const N = 14;
    const tl = gsap.timeline({ onComplete() { el.remove(); document.body.classList.remove('is-loading'); sessionStorage.setItem('cdv-seen', '1'); resolve(); } });
    tl.to(o, {
      v: 100, duration: 2.4, ease: 'steps(14)',
      onUpdate() {
        const v = Math.round(o.v);
        num.textContent = String(v).padStart(2, '0');
        const f = Math.round((v / 100) * N);
        bar.textContent = '[' + '#'.repeat(f) + '·'.repeat(N - f) + ']';
        while (shown < items.length && v >= marks[shown]) {
          if (shown === items.length - 1) done.textContent = 'compilado en ' + ((performance.now() - t0) / 1000).toFixed(1) + ' s';
          items[shown].style.opacity = 1; shown++;
        }
      },
    }, 0)
      .to('.loader__term', { opacity: 0, y: -24, duration: 0.5, ease: 'power2.in' }, 2.55)
      .to('.loader__row', { yPercent: -120, duration: 0.9, ease: 'power2.out' }, 2.6)
      .to('.loader__bg', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.05, ease: 'expo.inOut' }, 2.7)
      .add(onReveal, 3.25);
  });
}
