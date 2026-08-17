import { projects } from "../data/projects";
import type { ImageItem, ProjectScreenshot } from "../components/ui/project";

function getLenis() {
  return window.__portfolioLenis;
}

function screenshotsOf(item: ImageItem): ProjectScreenshot[] {
  if (item.screenshots && item.screenshots.length > 0) {
    return item.screenshots;
  }
  return [{ src: item.url, alt: `Captura de ${item.title}` }];
}

export function initProjectModal() {
  const overlay = document.querySelector<HTMLElement>("#project-modal");
  const section = document.querySelector("#proyectos");
  if (!overlay || !section) return;

  const panel = overlay.querySelector<HTMLElement>(".project-modal-panel");
  const image = overlay.querySelector<HTMLImageElement>("[data-modal-image]");
  const thumbs = overlay.querySelector<HTMLElement>("[data-modal-thumbs]");
  const category = overlay.querySelector<HTMLElement>("[data-modal-category]");
  const title = overlay.querySelector<HTMLElement>("#project-modal-title");
  const problem = overlay.querySelector<HTMLElement>("#project-modal-description");
  const techList = overlay.querySelector<HTMLElement>("[data-modal-tech]");
  const link = overlay.querySelector<HTMLAnchorElement>("[data-modal-link]");
  const noLink = overlay.querySelector<HTMLElement>("[data-modal-nolink]");
  const media = overlay.querySelector<HTMLElement>("[data-modal-media]");
  const closeButton = overlay.querySelector<HTMLButtonElement>("[data-modal-close]");

  if (
    !panel ||
    !image ||
    !thumbs ||
    !category ||
    !title ||
    !problem ||
    !techList ||
    !link ||
    !noLink ||
    !media ||
    !closeButton
  ) {
    return;
  }

  let activeItem: ImageItem | null = null;
  let activeIndex = 0;
  let previouslyFocused: HTMLElement | null = null;
  let ignoreBackdropUntil = 0;

  function isOpen() {
    return !overlay.hidden;
  }

  function shots() {
    return activeItem ? screenshotsOf(activeItem) : [];
  }

  function renderShot(index: number) {
    if (!activeItem) return;
    const list = shots();
    const shot = list[index] ?? list[0];
    if (!shot) return;

    activeIndex = index;
    image.src = shot.src;
    image.alt = shot.alt;
    image.width = activeItem.width;
    image.height = activeItem.height;
    media.classList.toggle("is-portrait", Boolean(activeItem.portrait));

    thumbs.hidden = list.length < 2;
    thumbs.replaceChildren(
      ...list.map((item, shotIndex) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "project-modal-thumb";
        button.setAttribute(
          "aria-label",
          `Ver captura ${shotIndex + 1} de ${activeItem!.title}`,
        );
        if (shotIndex === index) button.setAttribute("aria-current", "true");
        const thumb = document.createElement("img");
        thumb.src = item.src;
        thumb.alt = "";
        button.append(thumb);
        button.addEventListener("click", () => renderShot(shotIndex));
        return button;
      }),
    );
  }

  function fill(item: ImageItem) {
    activeItem = item;
    category.textContent = item.category ?? "";
    title.textContent = item.title;
    problem.textContent = item.problem;
    techList.replaceChildren(
      ...item.tech.map((tech) => {
        const li = document.createElement("li");
        li.textContent = tech;
        return li;
      }),
    );

    if (item.href) {
      link.href = item.href;
      link.hidden = false;
      noLink.hidden = true;
    } else {
      link.removeAttribute("href");
      link.hidden = true;
      noLink.hidden = false;
    }

    renderShot(0);
  }

  function open(item: ImageItem, trigger: HTMLElement) {
    fill(item);
    previouslyFocused = trigger;
    ignoreBackdropUntil = Date.now() + 400;
    window.setTimeout(() => {
      overlay.hidden = false;
      document.body.style.overflow = "hidden";
      getLenis()?.stop();
      document.querySelector(".custom-cursor")?.classList.remove("on-project");
      document.querySelector(".view-work-cursor")?.classList.remove("visible");
      closeButton.focus();
    }, 0);
  }

  function close() {
    if (!isOpen()) return;
    overlay.hidden = true;
    activeItem = null;
    document.body.style.overflow = "";
    getLenis()?.start();
    previouslyFocused?.focus();
    previouslyFocused = null;
  }

  section.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest<HTMLElement>("[data-project-id]");
    const id = button?.dataset.projectId;
    if (!id || !button) return;
    const item = projects.find((project) => String(project.id) === id);
    if (!item) return;
    event.preventDefault();
    event.stopPropagation();
    open(item, button);
  });

  closeButton.addEventListener("click", (event) => {
    event.stopPropagation();
    close();
  });

  overlay.addEventListener("click", (event) => {
    if (Date.now() < ignoreBackdropUntil) return;
    if (event.target === overlay) close();
  });

  panel.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  window.addEventListener("keydown", (event) => {
    if (!isOpen()) return;
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (!activeItem) return;
    const list = shots();
    if (list.length < 2) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      renderShot((activeIndex + 1) % list.length);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      renderShot((activeIndex - 1 + list.length) % list.length);
    }
  });
}
