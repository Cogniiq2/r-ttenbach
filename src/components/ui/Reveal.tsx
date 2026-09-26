import { motion, type HTMLMotionProps } from 'framer-motion'
import { EASE, revealViewport } from '@/lib/motion'

interface Props extends HTMLMotionProps<'div'> { delay?: number; y?: number }

export function Reveal({ delay = 0, y = 18, children, ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={revealViewport}
      transition={{ duration: 0.7, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
