import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { t } from '@/lib/motion'

export function Toggle({ checked, onChange, label, size = 'md' }: { checked: boolean; onChange: (v: boolean) => void; label?: string; size?: 'sm' | 'md' }) {
  const w = size === 'sm' ? 'h-6 w-[42px] p-[3px]' : 'h-7 w-[50px] p-[3px]'
  const k = size === 'sm' ? 'size-[18px]' : 'size-[22px]'
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn('pressable relative inline-flex shrink-0 items-center rounded-full transition-colors duration-200', w, checked ? 'bg-green' : 'bg-[#D5D8D1] hover:bg-[#C9CCC4]')}
    >
      <motion.span layout transition={t.spring} className={cn('rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)]', k, checked ? 'ml-auto' : '')} />
    </button>
  )
}
