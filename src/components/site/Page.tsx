import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { pageVariants } from '@/lib/motion'
import { cn } from '@/lib/cn'

export function Page({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.main variants={pageVariants} initial="initial" animate="enter" exit="exit" className={cn('min-h-dvh', className)}>
      {children}
    </motion.main>
  )
}
