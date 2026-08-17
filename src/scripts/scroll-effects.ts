import { gsap, ScrollTrigger } from "../lib/motion";

export function initScrollProgress() {
  const progressBar = document.getElementById("scrollProgress");
  if (!progressBar) return;

  const update = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
  };

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update, { passive: true });
}

export function initRevealAnimations() {
  const els = document.querySelectorAll("[data-reveal='fade-up']");
  els.forEach((el) => {
    const staggerDelay = parseFloat(el.getAttribute("data-reveal-stagger") || "0");
    const from = { opacity: 0, y: 50 };
    const to = { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" };

    if (staggerDelay > 0) {
      Array.from(el.children).forEach((child, i) => {
        gsap.fromTo(child, from, {
          ...to,
          delay: i * staggerDelay,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      });
    } else {
      gsap.fromTo(el, from, {
        ...to,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }
  });

  document.querySelectorAll(".section-divider--animated").forEach((div) => {
    gsap.fromTo(
      div,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: div,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      },
    );
  });

  ScrollTrigger.refresh();
}

export function initStatsCounter() {
  const stats = document.querySelectorAll<HTMLElement>("[data-count-to]");
  if (stats.length === 0) return;

  const animateStat = (stat: HTMLElement) => {
    if (stat.dataset.counted === "true") return;
    stat.dataset.counted = "true";

    const targetValue = parseFloat(stat.getAttribute("data-count-to") || "0");
    const suffix = stat.getAttribute("data-count-suffix") || "";
    const duration = parseFloat(stat.getAttribute("data-count-duration") || "2");
    if (isNaN(targetValue)) {
      stat.dataset.counted = "false";
      return;
    }

    const obj = { val: 0 };
    gsap.to(obj, {
      val: targetValue,
      duration,
      ease: "power3.out",
      onUpdate: () => {
        stat.textContent = Number.isInteger(targetValue)
          ? `${Math.round(obj.val)}${suffix}`
          : `${obj.val.toFixed(1)}${suffix}`;
      },
      onComplete: () => {
        stat.textContent = `${targetValue}${suffix}`;
      },
    });
  };

  const animateVisibleStats = () => {
    const vh = window.innerHeight || 0;
    stats.forEach((stat) => {
      const rect = stat.getBoundingClientRect();
      if (rect.top < vh * 0.92 && rect.bottom > 0) {
        animateStat(stat);
      }
    });
  };

  window.addEventListener("scroll", animateVisibleStats, { passive: true });
  window.addEventListener("resize", animateVisibleStats, { passive: true });
  window.addEventListener("loaderComplete", () => {
    ScrollTrigger.refresh();
    animateVisibleStats();
  });
  window.__portfolioLenis?.on("scroll", animateVisibleStats);

  stats.forEach((stat) => {
    ScrollTrigger.create({
      trigger: stat,
      start: "top 92%",
      once: true,
      onEnter: () => animateStat(stat),
    });
  });

  ScrollTrigger.refresh();
  animateVisibleStats();
}

export function initMagneticElements() {
  document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
    });
    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.4)",
        overwrite: "auto",
      });
    });
  });
}

export function initParallaxEffects() {
  document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
    const speed = parseFloat(el.getAttribute("data-parallax") || "0.15");
    gsap.fromTo(
      el,
      { y: 0 },
      {
        y: () => -(el.offsetHeight * speed),
        ease: "none",
        scrollTrigger: {
          trigger: el.parentElement || el,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      },
    );
  });
}

export function initSkeletonLoading() {
  document.querySelectorAll(".skeleton-wrapper").forEach((wrapper) => {
    const img = wrapper.querySelector("img");
    const placeholder = wrapper.querySelector(".skeleton-placeholder");
    if (!img || !placeholder) return;

    if (img.complete && img.naturalWidth > 0) {
      img.classList.add("loaded");
      return;
    }

    img.classList.add("skeleton-loading");
    img.addEventListener("load", () => {
      img.classList.remove("skeleton-loading");
      img.classList.add("loaded");
    });
    img.addEventListener("error", () => {
      img.classList.remove("skeleton-loading");
      img.classList.add("loaded");
    });
    if (img.complete) {
      img.classList.remove("skeleton-loading");
      img.classList.add("loaded");
    }
  });
}

export function initGridParallax() {
  const grid = document.querySelector<HTMLElement>(".grid-background");
  if (!grid) return;

  window.addEventListener("mousemove", (e) => {
    const moveX = e.clientX - window.innerWidth / 2;
    const moveY = e.clientY - window.innerHeight / 2;
    gsap.to(grid, {
      x: moveX * 0.02,
      y: moveY * 0.02,
      duration: 0.6,
      ease: "power2.out",
    });
  });
}
