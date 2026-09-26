import type { Transition, Variants } from 'framer-motion'

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export const t = {
  micro: { duration: 0.2, ease: EASE } satisfies Transition,
  fast: { duration: 0.28, ease: EASE } satisfies Transition,
  base: { duration: 0.5, ease: EASE } satisfies Transition,
  slow: { duration: 0.8, ease: EASE } satisfies Transition,
  spring: { type: 'spring', stiffness: 420, damping: 34, mass: 0.8 } satisfies Transition,
  springSoft: { type: 'spring', stiffness: 260, damping: 30, mass: 0.9 } satisfies Transition,
  layout: { type: 'spring', stiffness: 380, damping: 36 } satisfies Transition,
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { ...t.base, delay: i * 0.08 } }),
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: (i: number = 0) => ({ opacity: 1, transition: { ...t.base, delay: i * 0.06 } }),
}

export const stagger = (delayChildren = 0, staggerChildren = 0.08): Variants => ({
  hidden: {},
  show: { transition: { delayChildren, staggerChildren } },
})

export const revealViewport = { once: true, margin: '-12% 0px -12% 0px' } as const

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.22, ease: EASE } },
}
