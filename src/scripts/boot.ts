import { initLoader } from "./loader";
import { initSmoothScroll } from "./smooth-scroll";
import { initCustomCursor } from "./cursor";
import { initThemeToggle, initScrollThemeSwitch } from "./theme";
import { initCharSwapAnimation } from "./char-swap";
import {
  initGridParallax,
  initMagneticElements,
  initParallaxEffects,
  initRevealAnimations,
  initScrollProgress,
  initSkeletonLoading,
  initStatsCounter,
} from "./scroll-effects";

initLoader();
initScrollProgress();

function startRuntime() {
  const inits = [
    initSmoothScroll,
    initCustomCursor,
    initThemeToggle,
    initScrollThemeSwitch,
    initCharSwapAnimation,
    initRevealAnimations,
    initStatsCounter,
    initMagneticElements,
    initParallaxEffects,
    initSkeletonLoading,
    initGridParallax,
  ];

  for (const init of inits) {
    try {
      init();
    } catch (error) {
      console.error(error);
    }
  }
}

if (document.readyState === "complete") {
  startRuntime();
} else {
  window.addEventListener("load", startRuntime, { once: true });
}
