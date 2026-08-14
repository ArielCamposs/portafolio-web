/* Hallmark · component: project detail modal · genre: editorial · theme: existing portfolio
 * pre-emit critique: P4 H5 E4 S5 R4 V4 · contrast: pass · responsive: pass
 */
"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { motion, useReducedMotion } from "framer-motion"
import { ExternalLink, X } from "lucide-react"

import { cn } from "@/lib/utils"
import type { ImageItem, ProjectScreenshot } from "./project"

type LenisHandle = {
  stop: () => void
  start: () => void
}

function getLenis(): LenisHandle | undefined {
  return (window as Window & { lenis?: LenisHandle }).lenis
}

function getScreenshots(item: ImageItem): ProjectScreenshot[] {
  if (item.screenshots && item.screenshots.length > 0) {
    return item.screenshots
  }

  return [{ src: item.url, alt: `Captura de ${item.title}` }]
}

export default function ProjectModal({
  item,
  onClose,
}: {
  item: ImageItem
  onClose: () => void
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const screenshots = getScreenshots(item)
  const [activeIndex, setActiveIndex] = useState(0)
  const activeShot = screenshots[activeIndex] ?? screenshots[0]

  useEffect(() => {
    setActiveIndex(0)
  }, [item.id])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previouslyFocused = document.activeElement as HTMLElement | null
    const customCursor = document.querySelector(".custom-cursor")
    const projectCursor = document.querySelector(".view-work-cursor")
    const lenis = getLenis()

    document.body.style.overflow = "hidden"
    lenis?.stop()
    customCursor?.classList.remove("on-project")
    projectCursor?.classList.remove("visible")
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
        return
      }

      if (event.key === "ArrowRight" && screenshots.length > 1) {
        setActiveIndex((index) => (index + 1) % screenshots.length)
        return
      }

      if (event.key === "ArrowLeft" && screenshots.length > 1) {
        setActiveIndex((index) => (index - 1 + screenshots.length) % screenshots.length)
        return
      }

      if (event.key !== "Tab" || !modalRef.current) return

      const focusableElements = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements.at(-1)

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement?.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement?.focus()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      lenis?.start()
      window.removeEventListener("keydown", handleKeyDown)
      previouslyFocused?.focus()
    }
  }, [onClose, screenshots.length])

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.1 : 0.25 }}
      className="fixed inset-0 z-[20000] flex items-center justify-center bg-ink/90 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`project-modal-title-${item.id}`}
      aria-describedby={`project-modal-description-${item.id}`}
    >
      <motion.div
        ref={modalRef}
        data-lenis-prevent
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
        transition={{ duration: shouldReduceMotion ? 0.1 : 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative grid max-h-[94dvh] w-full max-w-6xl grid-rows-[minmax(0,auto)_minmax(0,1fr)] overflow-hidden rounded-2xl border border-paper/15 bg-ink shadow-2xl lg:grid-cols-[minmax(0,1.15fr)_minmax(17rem,0.85fr)] lg:grid-rows-none"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute right-3 top-3 z-20 grid size-11 place-items-center rounded-full border border-paper/30 bg-ink text-paper transition-colors duration-200 hover:bg-paper hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper active:opacity-80"
          aria-label="Cerrar vista del proyecto"
        >
          <X aria-hidden="true" size={21} />
        </button>

        <div className="flex min-h-0 flex-col bg-ink">
          <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden">
            <img
              src={activeShot.src}
              alt={activeShot.alt}
              width={item.width}
              height={item.height}
              className={cn(
                "max-h-[42dvh] w-full bg-ink object-contain lg:max-h-[94dvh]",
                item.portrait && "mx-auto max-w-md",
              )}
            />
          </div>

          {screenshots.length > 1 && (
            <div className="flex gap-2 overflow-x-auto border-t border-paper/15 p-3">
              {screenshots.map((shot, index) => (
                <button
                  key={`${shot.src}-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Ver captura ${index + 1} de ${item.title}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                  className={cn(
                    "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border transition-opacity duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper active:opacity-80",
                    index === activeIndex
                      ? "border-paper"
                      : "border-paper/20 opacity-70 hover:opacity-100",
                  )}
                >
                  <img
                    src={shot.src}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="min-h-0 overflow-y-auto border-t border-paper/15 px-5 py-6 text-paper sm:px-7 sm:py-8 lg:border-l lg:border-t-0 lg:pr-16">
          <p className="mb-2 font-[family-name:var(--font-geist)] text-xs uppercase tracking-[0.14em] text-paper/55">
            {item.category}
          </p>
          <h3
            id={`project-modal-title-${item.id}`}
            className="[overflow-wrap:anywhere] font-[family-name:var(--font-display)] text-4xl font-black uppercase leading-none sm:text-6xl"
          >
            {item.title}
          </h3>

          <div className="mt-6 space-y-5 font-[family-name:var(--font-geist)]">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-paper/45">
                El problema
              </p>
              <p
                id={`project-modal-description-${item.id}`}
                className="text-sm leading-relaxed text-paper/85 sm:text-base"
              >
                {item.problem}
              </p>
            </div>

            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-paper/45">
                Tecnologías
              </p>
              <ul className="flex flex-wrap gap-2">
                {item.tech.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full border border-paper/25 px-3 py-1.5 text-xs font-medium text-paper/90"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8">
            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full border border-paper/30 px-4 font-[family-name:var(--font-geist)] text-sm font-bold text-paper transition-colors duration-200 hover:bg-paper hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper active:opacity-80"
              >
                Ver sitio
                <ExternalLink aria-hidden="true" size={16} />
              </a>
            ) : (
              <p className="font-[family-name:var(--font-geist)] text-sm text-paper/55">
                Proyecto interno · sin enlace público
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  )
}
