import { gsap } from "../lib/motion";

export function initCustomCursor() {
  const cursor = document.createElement("div");
  cursor.className = "custom-cursor";
  cursor.innerHTML = `
    <div class="cursor-dot"></div>
    <div class="cursor-ring"></div>
    <div class="cursor-text">&gt;_</div>
  `;
  document.body.appendChild(cursor);

  const viewWorkCursor = document.createElement("div");
  viewWorkCursor.className = "view-work-cursor";
  viewWorkCursor.textContent = "VER";
  document.body.appendChild(viewWorkCursor);

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let viewX = 0;
  let viewY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener("mousedown", (e) => {
    cursor.classList.add("clicking");

    const ripple = document.createElement("div");
    ripple.className = "cursor-click-ripple";
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);

    gsap.fromTo(
      ripple,
      { scale: 0.2, opacity: 0.8 },
      {
        scale: 2.2,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => ripple.remove(),
      },
    );

    const symbols = ["💻", "</>", "{}", "=>", "const", "[]", "()", "JS"];
    for (let i = 0; i < 4; i++) {
      const particle = document.createElement("span");
      particle.className = "cursor-click-particle";
      particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      particle.style.left = `${e.clientX}px`;
      particle.style.top = `${e.clientY}px`;
      document.body.appendChild(particle);

      const angle = Math.random() * Math.PI * 2;
      const velocity = 35 + Math.random() * 55;

      gsap.fromTo(
        particle,
        { x: 0, y: 0, scale: 0.6, opacity: 1 },
        {
          x: Math.cos(angle) * velocity,
          y: Math.sin(angle) * velocity,
          scale: 1.1,
          opacity: 0,
          rotation: (Math.random() - 0.5) * 180,
          duration: 0.8,
          ease: "power3.out",
          onComplete: () => particle.remove(),
        },
      );
    }
  });

  document.addEventListener("mouseup", () => {
    cursor.classList.remove("clicking");
  });

  function updateCursors() {
    cursorX += (mouseX - cursorX) * 0.16;
    cursorY += (mouseY - cursorY) * 0.16;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    viewX += (mouseX - viewX) * 0.1;
    viewY += (mouseY - viewY) * 0.1;
    viewWorkCursor.style.left = `${viewX}px`;
    viewWorkCursor.style.top = `${viewY}px`;

    requestAnimationFrame(updateCursors);
  }
  updateCursors();

  const hoverables = document.querySelectorAll(
    "a:not(.project-card), button, .menu-btn, .menu-link, .social-link, .contact-social-link",
  );
  hoverables.forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("hovering"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("hovering"));
  });

  document.addEventListener("mouseover", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    const card = target.closest(".project-card");
    if (card) {
      cursor.classList.add("on-project");
      viewWorkCursor.classList.add("visible");
    } else {
      cursor.classList.remove("on-project");
      viewWorkCursor.classList.remove("visible");
    }
  });
}
