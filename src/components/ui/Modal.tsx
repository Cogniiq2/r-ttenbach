import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { EASE, t } from '@/lib/motion'

export function Modal({ open, onClose, children, className, side }: { open: boolean; onClose: () => void; children: ReactNode; className?: string; side?: boolean }) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey) }
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div key="backdrop" className={cn('fixed inset-0 z-[90] flex', side ? 'justify-end' : 'items-end justify-center sm:items-center')} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-[3px]" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal
            initial={side ? { x: 40, opacity: 0 } : { y: 24, opacity: 0, scale: 0.985 }}
            animate={side ? { x: 0, opacity: 1 } : { y: 0, opacity: 1, scale: 1 }}
            exit={side ? { x: 24, opacity: 0, transition: { duration: 0.2, ease: EASE } } : { y: 12, opacity: 0, scale: 0.99, transition: { duration: 0.18, ease: EASE } }}
            transition={t.springSoft}
            className={cn(
              'relative z-10 w-full bg-surface shadow-panel',
              side ? 'h-full max-w-[460px] overflow-y-auto' : 'max-h-[92dvh] overflow-y-auto rounded-t-[22px] sm:max-w-[560px] sm:rounded-[20px]',
              className,
            )}
          >
            <button onClick={onClose} aria-label="Schließen" className="pressable absolute right-3.5 top-3.5 z-10 grid size-9 place-items-center rounded-full bg-paper text-ink-2 hover:bg-line">
              <X size={16} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
