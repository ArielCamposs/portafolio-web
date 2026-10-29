import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import { initSmooth } from './smooth.js';
import { runLoader } from './loader.js';
import { initScramble } from './scramble.js';
import { initGlyphs } from './glyphs.js';
import { initTags } from './tags.js';
import { initWork } from './work.js';
import { initLab } from './lab.js';
import { initProcess } from './process.js';
import { initManifesto, initCounters, initBlurWords, initCursor, initPixelButtons, initChrome } from './ui.js';

gsap.registerPlugin(ScrollTrigger, SplitText, Flip);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

const lenis = initSmooth(reduced);
const hero = document.getElementById('inicio');
const field = initGlyphs(document.getElementById('stitch'), { reduced, hero, body: hero.querySelector('.hero__body'), h1: document.getElementById('heroH1'), caret: document.getElementById('heroCaret') });

/* hero: estado inicial (oculto detrás del preloader). El h1 real queda invisible (a11y/SEO); el texto lo dibuja el campo de glifos */
if (!reduced) {
  gsap.set('.eyebrow, .hero__lede', { opacity: 0, y: 18 });
  gsap.set('.corner', { opacity: 0, scale: 0.6 });
  gsap.set('.top', { yPercent: -100 });
  gsap.set('.dock', { yPercent: 160 });
}

function revealHero() {
  field.start();
  if (reduced) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.to('.eyebrow', { opacity: 1, y: 0, duration: 0.9 }, 0.1)
    .to('.hero__lede', { opacity: 1, y: 0, duration: 1 }, 0.9)
    .to('.corner', { opacity: 1, scale: 1, duration: 0.8, stagger: 0.09, ease: 'back.out(1.8)' }, 1.0)
    .to('.top', { yPercent: 0, duration: 0.9 }, 0.5)
    .to('.dock', { yPercent: 0, duration: 0.9 }, 0.7);
}

runLoader({ reduced, onReveal: revealHero });

initScramble(reduced);
initCursor(reduced);
initPixelButtons(reduced);
initChrome(reduced, lenis);
initManifesto(reduced);
initCounters(reduced);
initBlurWords(reduced);
initTags({ reduced, lenis });
initProcess(reduced);
await initWork({ reduced, lenis });
initLab(reduced);

/* scroll del hero */
if (!reduced) {
  gsap.to(['.hero__body', '#stitch'], { y: -90, opacity: 0.1, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.fromTo('.contact__h .ln__in', { yPercent: 105 }, { yPercent: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.contact__h', start: 'top 88%', once: true } });
  gsap.to('.contact__marq-in', { x: -240, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'bottom bottom', scrub: true } });
}
document.fonts.ready.then(() => ScrollTrigger.refresh());
window.addEventListener('load', () => ScrollTrigger.refresh());
