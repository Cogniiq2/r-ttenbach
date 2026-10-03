import { useEffect, useRef } from 'react'
import { animate, useInView } from 'framer-motion'
import { EASE } from '@/lib/motion'

/** Counts from 0 to value once in view. Renders the final value without JS. */
export function CountUp({ value, className, duration = 1.4 }: { value: number; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  useEffect(() => {
    if (!inView || !ref.current) return
    const el = ref.current
    const c = animate(0, value, { duration, ease: EASE, onUpdate: (v) => { el.textContent = String(Math.round(v)) } })
    return () => c.stop()
  }, [inView, value, duration])
  return <span ref={ref} className={className}>{value}</span>
}
