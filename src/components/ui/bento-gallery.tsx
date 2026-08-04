/* Hallmark · component: interactive bento gallery · genre: editorial · theme: existing portfolio
 * pre-emit critique: P4 H5 E4 S5 R4 V5 · contrast: pass · responsive: pass
 */
"use client"

import React, { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion"
import { ExternalLink, X } from "lucide-react"

import { cn } from "@/lib/utils"

export type ImageItem = {
  id: number | string
  title: string
  desc: string
  url: string
  width: number
  height: number
  layout?: string
  href?: string
  category?: string
  portrait?: boolean
}

interface InteractiveImageBentoGalleryProps {
  imageItems: ImageItem[]
  title: string
  description: string
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
}

function ImageModal({
  item,
  onClose,
}: {
  item: ImageItem
  onClose: () => void
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previouslyFocused = document.activeElement as HTMLElement | null
    const customCursor = document.querySelector(".custom-cursor")
    const projectCursor = document.querySelector(".view-work-cursor")

    document.body.style.overflow = "hidden"
    customCursor?.classList.remove("on-project")
    projectCursor?.classList.remove("visible")
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
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
      window.removeEventListener("keydown", handleKeyDown)
      previouslyFocused?.focus()
    }
  }, [onClose])

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
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
        transition={{ duration: shouldReduceMotion ? 0.1 : 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative grid max-h-[94dvh] w-full max-w-6xl overflow-hidden rounded-2xl border border-paper/15 bg-ink shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute right-3 top-3 z-20 grid size-11 place-items-center rounded-full border border-paper/30 bg-ink text-paper transition-colors duration-200 hover:bg-paper hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper active:opacity-80 disabled:pointer-events-none disabled:opacity-50"
          aria-label="Cerrar vista del proyecto"
        >
          <X aria-hidden="true" size={21} />
        </button>

        <img
          src={item.url}
          alt={item.title}
          width={item.width}
          height={item.height}
          className={cn(
            "max-h-[72dvh] min-h-0 w-full bg-ink object-contain",
            item.portrait && "mx-auto max-w-2xl",
          )}
        />

        <div className="flex min-w-0 items-center justify-between gap-4 border-t border-paper/15 px-4 py-4 text-paper sm:px-6">
          <div className="min-w-0">
            <p className="mb-1 font-[family-name:var(--font-geist)] text-xs uppercase tracking-[0.14em] text-paper/55">
              {item.category}
            </p>
            <h3
              id={`project-modal-title-${item.id}`}
              className="[overflow-wrap:anywhere] font-[family-name:var(--font-display)] text-3xl font-black uppercase leading-none sm:text-5xl"
            >
              {item.title}
            </h3>
            <p id={`project-modal-description-${item.id}`} className="sr-only">
              {item.desc}
            </p>
          </div>

          {item.href && (
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-paper/30 px-4 font-[family-name:var(--font-geist)] text-sm font-bold text-paper transition-colors duration-200 hover:bg-paper hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper active:opacity-80"
            >
              Ver sitio
              <ExternalLink aria-hidden="true" size={16} />
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  )
}

const InteractiveImageBentoGallery: React.FC<
  InteractiveImageBentoGalleryProps
> = ({ imageItems, title, description }) => {
  const [selectedItem, setSelectedItem] = useState<ImageItem | null>(null)
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      id="proyectos"
      className="relative w-full overflow-hidden bg-background py-16 text-foreground transition-colors duration-300 sm:py-24"
    >
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto flex max-w-[1440px] flex-col items-center gap-6 px-5 text-center sm:px-8"
      >
        <h2 className="w-full min-w-0 [overflow-wrap:anywhere] font-[family-name:var(--font-display)] text-[clamp(4.5rem,17vw,15.5rem)] font-black uppercase leading-[0.9] tracking-[-0.02em]">
          {title}
        </h2>
        <p className="max-w-2xl font-[family-name:var(--font-geist)] text-base leading-relaxed text-foreground opacity-70 sm:text-lg">
          {description}
        </p>
      </motion.div>

      <motion.div
        className="mx-auto mt-10 grid max-w-[1320px] grid-cols-1 items-start gap-3 px-5 sm:mt-14 sm:grid-cols-2 sm:gap-4 sm:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {imageItems.map((item) => (
          <motion.button
            type="button"
            key={item.id}
            variants={itemVariants}
            className={cn(
              "project-card group relative w-full self-start overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
              "active:opacity-90 disabled:pointer-events-none disabled:opacity-50",
              item.layout,
            )}
            onClick={() => setSelectedItem(item)}
            aria-label={`Ver proyecto ${item.title}`}
          >
            <img
              src={item.url}
              alt=""
              loading="lazy"
              width={item.width}
              height={item.height}
              className="h-auto w-full"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100" />
            <div className="absolute inset-x-0 bottom-0 z-10 w-full min-w-0 translate-y-2 p-4 text-paper opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 sm:p-5">
              <p className="mb-1 font-[family-name:var(--font-geist)] text-xs uppercase tracking-[0.12em] text-paper/65">
                {item.category}
              </p>
              <h3 className="[overflow-wrap:anywhere] font-[family-name:var(--font-display)] text-[clamp(2rem,4vw,3.4rem)] font-black uppercase leading-none">
                {item.title}
              </h3>
            </div>
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedItem && (
          <ImageModal
            key={selectedItem.id}
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

export default InteractiveImageBentoGallery
