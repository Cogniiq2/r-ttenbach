import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function Card({ className, children, title, action, pad = true }: { className?: string; children: ReactNode; title?: ReactNode; action?: ReactNode; pad?: boolean }) {
  return (
    <section className={cn('rounded-[16px] border border-line bg-white shadow-[0_1px_2px_rgba(17,19,17,0.03)]', className)}>
      {(title || action) && (
        <header className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <h2 className="text-[14px] font-semibold">{title}</h2>
          {action}
        </header>
      )}
      <div className={cn(pad && 'p-5')}>{children}</div>
    </section>
  )
}

export function PageTitle({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div><h1 className="text-[26px] font-semibold tracking-[-0.025em] md:text-[30px]">{title}</h1>{sub && <p className="mt-1 text-[14.5px] text-muted">{sub}</p>}</div>
      {action}
    </div>
  )
}

export function Metric({ label, value, delta, tone = 'neutral', hint }: { label: string; value: string; delta?: string; tone?: 'neutral' | 'up' | 'down'; hint?: string }) {
  return (
    <div className="rounded-[16px] border border-line bg-white p-5 shadow-[0_1px_2px_rgba(17,19,17,0.03)]">
      <div className="text-[13px] text-muted">{label}</div>
      <div className="num mt-2 text-[30px] font-semibold leading-none tracking-[-0.03em]">{value}</div>
      <div className="mt-3 flex items-center gap-2 text-[12.5px]">
        {delta && <span className={cn('num rounded-full px-1.5 py-0.5 font-medium', tone === 'up' ? 'bg-green-soft text-green' : tone === 'down' ? 'bg-clay-soft text-[#8A4A34]' : 'bg-paper text-muted')}>{delta}</span>}
        <span className="text-muted-2">{hint ?? 'vs. letzte Woche'}</span>
      </div>
    </div>
  )
}

export const statusTone = (s: string) => (s === 'Bezahlt' || s === 'Aktiv' ? 'green' : s === 'Offen' || s === 'Ruhend' ? 'sand' : s === 'Storniert' ? 'red' : 'neutral') as 'green' | 'sand' | 'red' | 'neutral'
