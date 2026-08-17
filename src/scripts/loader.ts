import { gsap } from "../lib/motion";

export function initLoader() {
  const loader = document.querySelector<HTMLElement>(".loader");
  const loaderCounter = document.querySelector<HTMLElement>(".loader-counter");
  const loaderCols = document.querySelectorAll<HTMLElement>(".loader-col");

  if (!loader || !loaderCounter) return;

  const isMobile = window.innerWidth <= 768;
  const duration = isMobile ? 800 : 1500;
  const startTime = performance.now();
  let displayedPercent = 0;

  function finishLoader() {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(loader, { display: "none" });
      },
    });

    tl.to(loaderCounter, {
      duration: 0.5,
      opacity: 0,
      y: -50,
      ease: "power2.in",
    }).to(
      loaderCols,
      {
        duration: 1.2,
        scaleY: 0,
        stagger: 0.1,
        ease: "power4.inOut",
        onStart: () => {
          gsap.to(".grid-background .line", {
            duration: 1.5,
            scaleY: 1,
            stagger: 0.08,
            ease: "power3.inOut",
            delay: 0.6,
          });
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent("loaderComplete"));
          }, 500);
        },
      },
      "-=0.2",
    );
  }

  function animateLoader() {
    const elapsed = performance.now() - startTime;
    const progress = Math.min(1, elapsed / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    displayedPercent = Math.round(eased * 100);
    loaderCounter!.textContent = `${displayedPercent}%`;

    if (displayedPercent >= 100) {
      finishLoader();
    } else {
      requestAnimationFrame(animateLoader);
    }
  }

  animateLoader();

  setTimeout(() => {
    if (loader.style.display !== "none") {
      gsap.set(loader, { display: "none" });
      window.dispatchEvent(new CustomEvent("loaderComplete"));
    }
  }, 6000);
}
