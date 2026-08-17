import { gsap } from "../lib/motion";

type CharPair = {
  original: HTMLElement;
  clone: HTMLElement;
};

export function initCharSwapAnimation() {
  document.querySelectorAll("[data-char-swap]").forEach((el) => {
    const text = el.textContent || "";
    el.textContent = "";

    const containers: CharPair[] = [];

    text.split("").forEach((char) => {
      const container = document.createElement("span");
      container.className = "char-swap-container";

      const original = document.createElement("span");
      original.className = "char-swap-original";
      original.textContent = char === " " ? "\u00A0" : char;

      const clone = document.createElement("span");
      clone.className = "char-swap-clone";
      clone.textContent = char === " " ? "\u00A0" : char;

      container.appendChild(original);
      container.appendChild(clone);
      el.appendChild(container);
      containers.push({ original, clone });
    });

    containers.forEach(({ original, clone }) => {
      gsap.set(clone, { x: -(original.offsetWidth + 4) });
    });

    setTimeout(() => startSwapLoop(containers), 2000);
  });
}

function startSwapLoop(containers: CharPair[]) {
  function shuffle<T>(arr: T[]) {
    const s = [...arr];
    for (let i = s.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [s[i], s[j]] = [s[j], s[i]];
    }
    return s;
  }

  function animate() {
    const filtered = containers.filter(
      (c) => (c.original.textContent || "").trim() !== "",
    );
    if (filtered.length === 0) {
      setTimeout(animate, 3000 + Math.random() * 2000);
      return;
    }

    const { original, clone } = shuffle(filtered)[0];
    const charWidth = original.offsetWidth;
    const gap = 4;

    gsap.set(clone, { x: -(charWidth + gap) });
    gsap.set(original, { x: 0 });
    gsap.to(original, {
      x: charWidth + gap,
      duration: 0.5,
      ease: "power2.inOut",
    });
    gsap.to(clone, {
      x: 0,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.set(original, { x: -(charWidth + gap) });
        gsap.set(clone, { x: 0 });
      },
    });

    setTimeout(animate, 3000 + Math.random() * 2000);
  }

  animate();
}
