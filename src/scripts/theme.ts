import { ScrollTrigger } from "../lib/motion";

export function updateThemeVisuals(isDark: boolean) {
  document.querySelectorAll<HTMLElement>(".theme-toggle").forEach((toggle) => {
    const sun = toggle.querySelector<HTMLElement>(".theme-toggle-sun");
    const moon = toggle.querySelector<HTMLElement>(".theme-toggle-moon");
    if (isDark) {
      toggle.style.backgroundColor = "rgba(230, 225, 221, 0.3)";
      if (sun) sun.style.backgroundColor = "transparent";
      if (moon) moon.style.backgroundColor = "rgba(26, 26, 26, 0.8)";
    } else {
      toggle.style.backgroundColor = "rgba(26, 26, 26, 0.3)";
      if (sun) sun.style.backgroundColor = "rgba(230, 225, 221, 0.8)";
      if (moon) moon.style.backgroundColor = "transparent";
    }
  });
}

export function initThemeToggle() {
  const controls = document.createElement("div");
  controls.className = "controls-container";

  const toggle = document.createElement("button");
  toggle.className = "theme-toggle";
  toggle.setAttribute("aria-label", "Alternar modo oscuro");
  toggle.type = "button";
  toggle.innerHTML = `
    <div class="theme-toggle-sun">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <circle cx="12" cy="12" r="4"/>
        <line x1="12" y1="2" x2="12" y2="5"/>
        <line x1="12" y1="19" x2="12" y2="22"/>
        <line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/>
        <line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
        <line x1="2" y1="12" x2="5" y2="12"/>
        <line x1="19" y1="12" x2="22" y2="12"/>
        <line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/>
        <line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/>
      </svg>
    </div>
    <div class="theme-toggle-moon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    </div>
  `;
  controls.appendChild(toggle);
  document.body.appendChild(controls);

  const fixedServices = document.getElementById("fixedServices");
  ScrollTrigger.create({
    trigger: ".contact-section",
    start: "top bottom",
    onEnter: () => {
      controls.classList.add("hidden");
      fixedServices?.classList.add("hidden");
    },
    onLeaveBack: () => {
      controls.classList.remove("hidden");
      fixedServices?.classList.remove("hidden");
    },
  });

  toggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    updateThemeVisuals(next === "dark");
  });
}

export function initScrollThemeSwitch() {
  const aboutSection = document.querySelector("#sobre-mi");
  if (!aboutSection) return;

  ScrollTrigger.create({
    trigger: aboutSection,
    start: "top 70%",
    onEnter: () => {
      document.documentElement.setAttribute("data-theme", "dark");
      updateThemeVisuals(true);
    },
    onLeaveBack: () => {
      document.documentElement.setAttribute("data-theme", "light");
      updateThemeVisuals(false);
    },
  });
  ScrollTrigger.refresh();
}
