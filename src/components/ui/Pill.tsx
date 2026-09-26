import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Tone = 'neutral' | 'green' | 'sand' | 'clay' | 'dark' | 'outline' | 'red'

const tones: Record<Tone, string> = {
  neutral: 'bg-paper text-ink-2 border-line',
  green: 'bg-green-soft text-green-deep border-green-line',
  sand: 'bg-sand-soft text-[#7A5A22] border-sand-line',
  clay: 'bg-clay-soft text-[#8A4A34] border-[#E5CDC1]',
  dark: 'bg-ink text-white border-ink',
  outline: 'bg-transparent text-muted border-line-2',
  red: 'bg-[#FBEAEA] text-[#9A3B3B] border-[#F0CFCF]',
}

export function Pill({ tone = 'neutral', className, children, dot }: { tone?: Tone; className?: string; children: ReactNode; dot?: boolean }) {
  return (
    <span className={cn('inline-flex h-[26px] items-center gap-1.5 rounded-full border px-2.5 text-[12px] font-medium leading-none whitespace-nowrap', tones[tone], className)}>
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}
