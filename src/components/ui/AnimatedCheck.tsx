import { motion } from 'framer-motion'
import { EASE } from '@/lib/motion'
import { cn } from '@/lib/cn'

export function AnimatedCheck({ size = 20, className, delay = 0, strokeWidth = 2.6 }: { size?: number; className?: string; delay?: number; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={cn(className)}>
      <motion.path d="M5 12.5 9.5 17 19 7" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.45, ease: EASE, delay }} />
    </svg>
  )
}
