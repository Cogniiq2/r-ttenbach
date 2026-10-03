import { motion } from 'framer-motion'
import { createElement, type ReactNode } from 'react'
import { EASE } from '@/lib/motion'
import { cn } from '@/lib/cn'

type Part = string | { text: string; className?: string }

/**
 * Masked word-by-word reveal for key headings. Each word rises out of its own
 * clip so lines read as they build. Runs once, when the heading enters view.
 */
export function RevealText({ parts, as = 'h2', className, delay = 0, stagger = 0.035, immediate }: { parts: Part[]; as?: 'h1' | 'h2' | 'h3' | 'p'; className?: string; delay?: number; stagger?: number; immediate?: boolean }) {
  let i = 0
  const words: ReactNode[] = []
  parts.forEach((p, pi) => {
    const text = typeof p === 'string' ? p : p.text
    const cls = typeof p === 'string' ? undefined : p.className
    if (text === '\n') { words.push(<br key={`br${pi}`} className="hidden md:block" />); return }
    text.split(' ').filter(Boolean).forEach((w, wi) => {
      const d = delay + i++ * stagger
      words.push(
        <span key={`${pi}-${wi}`} className="inline-block overflow-hidden pb-[0.08em] align-bottom [margin-bottom:-0.08em]">
          <motion.span
            className={cn('inline-block will-change-transform', cls)}
            initial={{ y: '105%' }}
            {...(immediate ? { animate: { y: '0%' } } : { whileInView: { y: '0%' }, viewport: { once: true, margin: '0px 0px -10% 0px' } })}
            transition={{ duration: 0.9, ease: EASE, delay: d }}
          >
            {w}
          </motion.span>
          {' '}
        </span>,
      )
    })
  })
  return createElement(as, { className }, words)
}
