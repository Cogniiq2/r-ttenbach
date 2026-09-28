import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AnimatedEuro, eur } from '@/components/ui/AnimatedNumber'
import { cn } from '@/lib/cn'
import { extrasTotal, floodlightWindow, memberCount, type BookingDraft } from '@/lib/booking'
import { fmtDuration, fmtRange, priceFor } from '@/lib/time'
import type { DayOption } from '@/lib/data'

interface Props {
  day: DayOption
  start: number | null
  end: number | null
  /** Hover preview end (desktop). */
  previewEnd?: number | null
  draft?: Pick<BookingDraft, 'roster' | 'verify' | 'floodlight' | 'rackets' | 'balls'>
  showPrice: boolean
  action?: ReactNode
  inSheet?: boolean
}

const Row = ({ k, v, className }: { k: string; v: ReactNode; className?: string }) => (
  <div className={cn('flex items-baseline justify-between gap-4 py-[7px]', className)}><dt className="text-[14px] text-muted">{k}</dt><dd className="text-right text-[14.5px] font-medium">{v}</dd></div>
)

export function BookingSummary({ day, start, end, previewEnd = null, draft, showPrice, action, inSheet }: Props) {
  const e = end ?? previewEnd
  const complete = start !== null && e !== null
  const preview = end === null && previewEnd !== null
  const dur = complete ? e! - start! : 0
  const members = draft ? memberCount(draft) : 0
  const price = priceFor(dur, members, draft ? extrasTotal(draft) : 0)
  const fl = complete ? floodlightWindow(start!, e!) : null

  return (
    <div className={cn(!inSheet && 'rounded-[20px] bg-white p-6 hairline')}>
      <div className="flex items-start justify-between">
        <div><div className="eyebrow">Deine Buchung</div><div className="mt-2 text-[20px] font-semibold tracking-[-0.015em]">Padel Court 01</div></div>
        <span className="flex items-center gap-1.5 pt-1 text-[12px] font-medium text-green"><span className="size-1.5 rounded-full bg-green" />bis 22:00</span>
      </div>

      {/* Time block: the hero of the summary */}
      <div className={cn('mt-5 rounded-[14px] px-4 py-3.5 transition-colors', complete ? (preview ? 'bg-green-soft/60' : 'bg-green-soft') : 'bg-paper')}>
        <motion.div key={day.key} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} className="text-[13px] text-muted">{day.full}</motion.div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={complete ? `${start}-${e}` : start !== null ? `s${start}` : 'none'} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }} className="mt-1 flex items-baseline justify-between gap-3">
            {complete ? (
              <><span className="num text-[22px] font-semibold tracking-[-0.02em] text-green-deep">{fmtRange(start!, e!)}</span><span className={cn('num text-[13.5px] font-medium', preview ? 'text-green/70' : 'text-green')}>{fmtDuration(dur)}</span></>
            ) : start !== null ? (
              <><span className="num text-[22px] font-semibold tracking-[-0.02em]">{`${String(Math.floor(start / 60)).padStart(2, '0')}:${String(start % 60).padStart(2, '0')}`} <span className="text-muted-2">– ?</span></span><span className="text-[13px] text-muted">Endzeit wählen</span></>
            ) : (
              <><span className="text-[17px] font-medium text-muted-2">Startzeit wählen</span><span className="text-[13px] text-muted-2">08:00 – 22:00</span></>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {draft && (
        <dl className="mt-3 divide-y divide-line">
          <Row k="Spieler" v={<motion.span key={members} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }}>{draft.roster.length} · {members} {members === 1 ? 'Mitglied' : 'Mitglieder'}</motion.span>} />
          <Row k="Flutlicht" v={<AnimatePresence mode="wait" initial={false}><motion.span key={draft.floodlight ? `${fl?.on}-${fl?.off}` : 'off'} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }} transition={{ duration: 0.2 }} className={cn('num', draft.floodlight && 'text-[#7A5A22]')}>{draft.floodlight && fl ? `${fl.on} – ${fl.off}` : 'aus'}</motion.span></AnimatePresence>} />
          {(draft.rackets || draft.balls) && <Row k="Extras" v={[draft.rackets && 'Leihschläger', draft.balls && 'Bälle'].filter(Boolean).join(', ')} />}
        </dl>
      )}

      {showPrice && complete && (
        <motion.dl initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 border-t border-line pt-3">
          <Row k={`Court · ${fmtDuration(dur)}`} v={<AnimatedEuro value={price.court} className="num" />} />
          <AnimatePresence initial={false}>
            {price.discount !== 0 && <motion.div key="d" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden"><Row k={`Mitgliedervorteil · ${members} ${members === 1 ? 'Mitglied' : 'Mitglieder'}`} v={<AnimatedEuro value={price.discount} className="num text-green" />} className="!text-green [&_dt]:text-green" /></motion.div>}
            {price.extras > 0 && <motion.div key="e" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden"><Row k="Extras" v={eur(price.extras)} /></motion.div>}
          </AnimatePresence>
          <div className="flex items-baseline justify-between pt-3 text-[18px] font-semibold"><dt>Gesamt</dt><dd><AnimatedEuro value={price.total} className="num" /></dd></div>
        </motion.dl>
      )}
      {showPrice && !complete && start === null && <p className="mt-4 text-[13px] text-muted">Der Preis richtet sich nach der Dauer. Mitglieder zahlen weniger.</p>}

      {action && <div className="mt-5">{action}</div>}
      <p className="mt-3 text-center text-[12px] text-muted-2">Demo · Kostenlose Stornierung bis 12 Stunden vor Spielbeginn.</p>
    </div>
  )
}
