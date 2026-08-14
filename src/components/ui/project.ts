export type ProjectScreenshot = {
  src: string
  alt: string
}

export type ImageItem = {
  id: number | string
  title: string
  desc: string
  problem: string
  tech: string[]
  url: string
  width: number
  height: number
  layout?: string
  href?: string
  category?: string
  portrait?: boolean
  screenshots?: ProjectScreenshot[]
}
