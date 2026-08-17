import Lenis from "lenis";
import { ScrollTrigger } from "../lib/motion";

export function initSmoothScroll() {
  const lenis = new Lenis({
    autoRaf: true,
    duration: 1.2,
    easing: (t) => 1 - Math.pow(1 - t, 4),
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  lenis.on("scroll", ScrollTrigger.update);
  window.__portfolioLenis = lenis;
  ScrollTrigger.refresh();
}
