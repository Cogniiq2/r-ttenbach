import { LayoutGroup, motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { t } from '@/lib/motion'
import { days } from '@/lib/data'
import { availabilityFor, freeSlotCount } from '@/lib/availability'

export function DateSelector({ value, onChange }: { value: string; onChange: (k: string) => void }) {
  return (
    <LayoutGroup id="dates">
      <div className="no-scrollbar -mx-5 flex gap-1 overflow-x-auto px-5 pb-1 md:mx-0 md:px-0" role="tablist" aria-label="Datum wählen">
        {days.map((d, i) => {
          const active = d.key === value
          const free = freeSlotCount(availabilityFor(i))
          const level = free === 0 ? 0 : free < 8 ? 1 : free < 16 ? 2 : 3
          return (
            <button key={d.key} role="tab" aria-selected={active} aria-label={`${d.full}, ${free === 0 ? 'ausgebucht' : `${free / 2} Stunden frei`}`} onClick={() => onChange(d.key)} className={cn('pressable relative flex h-[84px] w-[64px] shrink-0 flex-col items-center justify-center rounded-[14px] transition-colors md:w-[72px]', active ? 'text-white' : 'text-ink hover:bg-ink/[0.04]')}>
              {active && <motion.span layoutId="date-active" className="absolute inset-0 rounded-[14px] bg-ink" transition={t.spring} />}
              <span className={cn('relative text-[10.5px] font-medium uppercase tracking-[0.12em]', active ? 'text-white/65' : 'text-muted')}>{d.label ?? d.weekday}</span>
              <span className="num relative mt-1 text-[24px] font-semibold leading-none tracking-[-0.02em]">{d.day}</span>
              <span className="relative mt-2 flex h-1.5 items-center gap-[3px]" aria-hidden>
                {level === 0 ? <span className={cn('h-[3px] w-3 rounded-full', active ? 'bg-white/30' : 'bg-line-2')} /> : Array.from({ length: level }).map((_, k) => <span key={k} className={cn('size-[5px] rounded-full', active ? 'bg-[#8FD0A8]' : 'bg-green/70')} />)}
              </span>
            </button>
          )
        })}
      </div>
    </LayoutGroup>
  )
}
