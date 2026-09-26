import { useEffect, useRef } from 'react'
import { animate, useMotionValue } from 'framer-motion'
import { EASE } from '@/lib/motion'

export const eur = (n: number) => `${n < 0 ? '−' : ''}${Math.abs(n).toFixed(2).replace('.', ',')} €`

/** Interpolates between currency values instead of swapping them. */
export function AnimatedEuro({ value, className }: { value: number; className?: string }) {
  const mv = useMotionValue(value)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.6, ease: EASE, onUpdate: (v) => { if (ref.current) ref.current.textContent = eur(v) } })
    return () => controls.stop()
  }, [value, mv])
  return <span ref={ref} className={className}>{eur(value)}</span>
}
