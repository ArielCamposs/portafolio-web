import type Lenis from "lenis";

declare global {
  interface Window {
    __portfolioLenis?: Lenis;
  }
}

export {};
