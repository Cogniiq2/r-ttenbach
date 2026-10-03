import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Photo, type PhotoVariant } from '@/components/ui/Photo'
import { Picture } from '@/components/ui/Picture'
import { EASE } from '@/lib/motion'
import type { ImageName } from '@/lib/images'

interface Props { eyebrow: string; title: ReactNode; lede?: string; variant?: PhotoVariant; image?: ImageName; focus?: string; children?: ReactNode }

export function PageHero({ eyebrow, title, lede, variant = 'tennis', image, focus, children }: Props) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -50])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-ink text-white">
      <motion.div style={{ y }} className="absolute inset-0">
        <motion.div initial={{ scale: 1.06 }} animate={{ scale: 1 }} transition={{ duration: 1.8, ease: EASE }} className="absolute inset-0">
          {image ? <Picture name={image} alt="" priority cover focus={focus} className="h-full w-full" zoom={false} /> : <Photo variant={variant} className="h-full w-full" zoom={false} />}
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-ink/25" />
      {image && <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,12,18,0.7)_0%,transparent_65%)]" />}
      <motion.div style={{ y: textY, opacity: fade }} className="container-x relative flex min-h-[68vh] flex-col justify-end pb-14 pt-40 md:min-h-[76vh] md:pb-20">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.1 }} className="eyebrow flex items-center gap-3 !text-white/60"><span className="h-px w-8 bg-white/40" />{eyebrow}</motion.div>
        <h1 className="display-lg mt-5 max-w-4xl overflow-hidden pb-[0.06em]"><motion.span className="block" initial={{ y: '105%' }} animate={{ y: '0%' }} transition={{ duration: 1, ease: EASE, delay: 0.18 }}>{title}</motion.span></h1>
        {lede && <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.38 }} className="mt-6 max-w-xl text-[17px] leading-[1.5] text-white/72 md:text-[19px]">{lede}</motion.p>}
        {children && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.5 }} className="mt-8">{children}</motion.div>}
      </motion.div>
    </section>
  )
}
