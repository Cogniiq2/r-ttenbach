import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { Photo, type PhotoVariant } from '@/components/ui/Photo'
import { EASE } from '@/lib/motion'

export function PageHero({ eyebrow, title, lede, variant = 'tennis', children, caption }: { eyebrow: string; title: ReactNode; lede?: string; variant?: PhotoVariant; children?: ReactNode; caption?: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-white">
      <motion.div initial={{ scale: 1.035 }} animate={{ scale: 1 }} transition={{ duration: 1.6, ease: EASE }} className="absolute inset-0">
        <Photo variant={variant} className="h-full w-full" zoom={false} caption={caption} hideCaption />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-ink/20" />
      <div className="container-x relative flex min-h-[62vh] flex-col justify-end pb-14 pt-40 md:min-h-[68vh] md:pb-20">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.1 }} className="eyebrow !text-white/60">{eyebrow}</motion.div>
        <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.2 }} className="display-lg mt-4 max-w-4xl">{title}</motion.h1>
        {lede && <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.38 }} className="lede mt-6 max-w-xl !text-white/70">{lede}</motion.p>}
        {children && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.5 }} className="mt-8">{children}</motion.div>}
      </div>
    </section>
  )
}
