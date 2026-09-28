import { motion } from 'framer-motion'
import { AnimatedCheck } from '@/components/ui/AnimatedCheck'
import { cn } from '@/lib/cn'
import { EASE } from '@/lib/motion'
import { fmtRange } from '@/lib/time'

export function MatchdayNotice({ acknowledged, onChange, window: w }: { acknowledged: boolean; onChange: (v: boolean) => void; window: { start: number; end: number; label: string; text?: string } }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6, transition: { duration: 0.18 } }} transition={{ duration: 0.4, ease: EASE }} className="overflow-hidden rounded-[16px] bg-sand-soft">
      <div className="grid gap-5 p-5 md:grid-cols-[1fr_auto] md:items-end md:p-6">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-sand">Parallelveranstaltung<span className="num normal-case tracking-normal text-sand/70">· {fmtRange(w.start, w.end)}</span></div>
          <div className="mt-2 text-[17px] font-semibold tracking-[-0.01em] text-ink">{w.text ?? w.label}</div>
          <p className="mt-1.5 max-w-xl text-[14.5px] leading-relaxed text-[#5F4A22]">Während deiner Buchung findet parallel ein Mannschaftsspiel statt. Der Padel Court bleibt geöffnet. Bitte nehmt besondere Rücksicht auf den laufenden Spielbetrieb.</p>
        </div>
        <label className={cn('pressable flex h-11 cursor-pointer select-none items-center gap-3 self-start rounded-[11px] px-4 text-[14px] font-medium transition-colors md:self-auto', acknowledged ? 'bg-ink text-white' : 'bg-white text-ink hover:bg-white/70')}>
          <input type="checkbox" className="sr-only" checked={acknowledged} onChange={(e) => onChange(e.target.checked)} />
          <span className={cn('grid size-5 place-items-center rounded-full border transition-colors', acknowledged ? 'border-white/40 bg-white text-ink' : 'border-line-2')}>{acknowledged && <AnimatedCheck size={12} strokeWidth={3} />}</span>
          Hinweis gelesen
        </label>
      </div>
    </motion.div>
  )
}
