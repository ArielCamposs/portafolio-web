/* Hallmark · component: interactive bento gallery · genre: editorial · theme: existing portfolio
 * pre-emit critique: P4 H5 E4 S5 R4 V5 · contrast: pass · responsive: pass
 */
"use client"

import React, { useState } from "react"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion"

import { cn } from "@/lib/utils"
import type { ImageItem } from "./project"
import ProjectModal from "./project-modal"

export type { ImageItem, ProjectScreenshot } from "./project"

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
            aria-label={`Ver detalle de ${item.title}`}
          >
            <img
              src={item.url}
              alt=""
              loading="lazy"
              width={item.width}
              height={item.height}
              className="h-auto w-full"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent opacity-90 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100" />
            <div className="absolute inset-x-0 bottom-0 z-10 w-full min-w-0 p-4 text-paper sm:p-5">
              <p className="mb-1 font-[family-name:var(--font-geist)] text-xs uppercase tracking-[0.12em] text-paper/65">
                {item.category}
              </p>
              <h3 className="[overflow-wrap:anywhere] font-[family-name:var(--font-display)] text-[clamp(2rem,4vw,3.4rem)] font-black uppercase leading-none">
                {item.title}
              </h3>
              <p className="mt-2 max-w-xl font-[family-name:var(--font-geist)] text-sm leading-snug text-paper/80 sm:text-base">
                {item.desc}
              </p>
            </div>
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedItem && (
          <ProjectModal
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
