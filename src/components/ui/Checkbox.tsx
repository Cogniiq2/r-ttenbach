import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { EASE } from '@/lib/motion'

export function Checkbox({ checked, onChange, label, tone = 'green', className }: { checked: boolean; onChange: (v: boolean) => void; label: string; tone?: 'green' | 'sand'; className?: string }) {
  const on = tone === 'sand' ? 'bg-sand border-sand' : 'bg-green border-green'
  return (
    <label className={cn('group flex cursor-pointer select-none items-start gap-3 text-[14.5px] leading-snug', className)}>
      <span className="relative mt-[1px] inline-block shrink-0">
        <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className={cn('pressable grid size-[22px] place-items-center rounded-[7px] border bg-white transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-green', checked ? on : 'border-line-2 group-hover:border-ink/50')}>
          <svg viewBox="0 0 16 16" className="size-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <motion.path d="M3 8.5 6.5 12 13 4.5" initial={false} animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }} transition={{ duration: 0.28, ease: EASE }} />
          </svg>
        </span>
      </span>
      <span>{label}</span>
    </label>
  )
}
