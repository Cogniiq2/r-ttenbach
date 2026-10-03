import Lenis from 'lenis'

/**
 * Single smooth-scroll instance for the public site. Native scrolling is kept
 * for touch devices and reduced-motion users; everything else goes through
 * these helpers so modals, sheets and route changes stay in sync.
 */
let lenis: Lenis | null = null
let locks = 0

export function startSmoothScroll() {
  if (lenis || typeof window === 'undefined') return lenis
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null
  lenis = new Lenis({ duration: 1.05, easing: (t) => 1 - Math.pow(1 - t, 3.2), wheelMultiplier: 0.95, touchMultiplier: 1, syncTouch: false })
  const raf = (time: number) => { lenis?.raf(time); if (lenis) requestAnimationFrame(raf) }
  requestAnimationFrame(raf)
  return lenis
}

export function stopSmoothScroll() { lenis?.destroy(); lenis = null }

export function scrollToTop(smooth = false) {
  if (lenis) lenis.scrollTo(0, { immediate: !smooth, force: true })
  else window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' })
}

/** Ref-counted page scroll lock for modals, menus and sheets. */
export function lockScroll() {
  locks += 1
  if (locks === 1) { lenis?.stop(); document.documentElement.style.overflow = 'hidden' }
}
export function unlockScroll() {
  locks = Math.max(0, locks - 1)
  if (locks === 0) { lenis?.start(); document.documentElement.style.overflow = '' }
}
