import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ChevronUp, Info, RotateCcw } from 'lucide-react'
import { Page } from '@/components/site/Page'
import { Button } from '@/components/ui/Button'
import { eur } from '@/components/ui/AnimatedNumber'
import { DateSelector } from '@/components/booking/DateSelector'
import { TimeRangeSelector, type RangeState } from '@/components/booking/TimeRangeSelector'
import { MatchdayNotice } from '@/components/booking/MatchdayNotice'
import { BookingSummary } from '@/components/booking/BookingSummary'
import { PlayersStep } from '@/components/booking/PlayersStep'
import { CheckoutStep, PayButton, type PayState } from '@/components/booking/CheckoutStep'
import { SuccessView } from '@/components/booking/SuccessView'
import { days, players } from '@/lib/data'
import { availabilityFor, freeSlotCount, noticeFor, SNATCH_START, type DayAvailability } from '@/lib/availability'
import { SLOT_MINUTES, fmt, fmtDuration, fmtRange } from '@/lib/time'
import { priceOf, type BookingDraft, type PayMethod, type Player, type Verify } from '@/lib/booking'
import { cn } from '@/lib/cn'
import { EASE, t } from '@/lib/motion'

type Step = 'select' | 'players' | 'checkout' | 'success'
const stepIndex: Record<Step, number> = { select: 0, players: 1, checkout: 2, success: 3 }

function Progress({ step }: { step: Step }) {
  const cur = stepIndex[step]
  return (
    <ol className="flex items-center gap-5 text-[12.5px] font-medium" aria-label="Fortschritt">
      {['Termin', 'Spieler', 'Bestätigung'].map((l, i) => (
        <li key={l} className={cn('flex flex-col gap-2 transition-colors', i <= cur ? 'text-ink' : 'text-muted-2')} aria-current={i === cur ? 'step' : undefined}>
          <span>{l}</span>
          <span className="h-[2px] w-12 overflow-hidden rounded-full bg-line"><motion.span className="block h-full bg-ink" initial={false} animate={{ scaleX: i < cur ? 1 : i === cur ? 0.5 : 0 }} style={{ originX: 0 }} transition={{ duration: 0.5, ease: EASE }} /></span>
        </li>
      ))}
    </ol>
  )
}

/** Apply demo "snatched" segments on top of the base availability. */
function withTaken(day: DayAvailability, taken: number[]): DayAvailability {
  if (!taken.length) return day
  return { ...day, segments: day.segments.map((s) => (taken.includes(s.start) ? { ...s, status: 'booked' } : s)) }
}

export function Booking() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('select')
  const [dayKey, setDayKey] = useState(days[0].key)
  const [loading, setLoading] = useState(false)
  const [range, setRange] = useState<RangeState>({ start: null, end: null })
  const [previewEnd, setPreviewEnd] = useState<number | null>(null)
  const [ack, setAck] = useState(false)
  const [taken, setTaken] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)
  const [roster, setRoster] = useState<Player[]>(players.slice(0, 3))
  const [verify, setVerify] = useState<Record<string, Verify>>({})
  const [extras, setExtras] = useState({ floodlight: true, rackets: false, balls: false })
  const [method, setMethod] = useState<PayMethod>('applepay')
  const [pay, setPay] = useState<PayState>('idle')
  const [sheet, setSheet] = useState(false)

  const dayIndex = Math.max(0, days.findIndex((d) => d.key === dayKey))
  const day = days[dayIndex]
  const availability = useMemo(() => withTaken(availabilityFor(dayIndex), taken), [dayIndex, taken])
  const free = freeSlotCount(availability)
  const complete = range.start !== null && range.end !== null
  const notice = noticeFor(availability, complete ? { start: range.start!, end: range.end! } : null)
  const canContinue = complete && (!notice || ack)

  const draft: BookingDraft | null = complete ? { dayKey, start: range.start!, end: range.end!, roster, verify, ...extras, method } : null
  const price = draft ? priceOf(draft) : null

  const changeDay = useCallback((k: string) => {
    if (k === dayKey) return
    setLoading(true); setRange({ start: null, end: null }); setAck(false); setError(null); setDayKey(k)
    window.setTimeout(() => setLoading(false), 320)
  }, [dayKey])

  const onRange = (v: RangeState) => {
    setError(null); setAck(false)
    // Demo: a competing booking takes 14:00 on Saturday right as the range is completed.
    if (dayIndex === 0 && v.start === SNATCH_START && v.end !== null && !taken.length) {
      setRange(v)
      window.setTimeout(() => { setTaken([SNATCH_START]); setRange({ start: null, end: null }); setError('Dieser Slot wurde gerade ausgewählt. Bitte wähle eine andere Zeit.') }, 700)
      return
    }
    setRange(v)
  }
  const reset = () => { setRange({ start: null, end: null }); setAck(false); setError(null) }

  const runVerify = useCallback((p: Player, delay = 0) => {
    window.setTimeout(() => setVerify((v) => ({ ...v, [p.initials]: 'checking' })), delay)
    window.setTimeout(() => setVerify((v) => ({ ...v, [p.initials]: 'done' })), delay + 1300)
  }, [])
  useEffect(() => {
    if (step !== 'players') return
    roster.forEach((p, i) => { if (!verify[p.initials]) runVerify(p, 300 + i * 350) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])
  const addPlayer = () => { const p = players[3]; setRoster((r) => [...r, p]); runVerify(p, 250) }

  const confirm = () => {
    setPay('processing')
    window.setTimeout(() => { setPay('done'); window.setTimeout(() => { setStep('success'); window.scrollTo({ top: 0 }) }, 500) }, 1900)
  }
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [step])

  if (step === 'success' && draft) return <Page><SuccessView draft={draft} day={day} /></Page>

  const phaseHint = range.start === null ? 'Startzeit wählen' : range.end === null ? 'Endzeit wählen' : null
  const summaryAction =
    step === 'select' ? <Button size="lg" full arrow disabled={!canContinue} onClick={() => { setSheet(false); setStep('players') }}>{notice && !ack ? 'Hinweis bestätigen' : 'Weiter'}</Button>
    : step === 'players' ? <Button size="lg" full arrow onClick={() => { setSheet(false); setStep('checkout') }}>Zur Zahlung</Button>
    : draft && price ? <PayButton state={pay} method={draft.method} total={price.total} onClick={confirm} /> : null

  const summary = (inSheet?: boolean) => (
    <BookingSummary day={day} start={range.start} end={range.end} previewEnd={previewEnd} draft={stepIndex[step] >= 1 ? { roster, verify, ...extras } : undefined} showPrice={stepIndex[step] >= 1 || complete} action={summaryAction} inSheet={inSheet} />
  )

  return (
    <Page className="bg-paper pb-36 pt-[68px] md:pt-[76px]">
      <motion.div className="pointer-events-none fixed inset-0 z-[5] bg-ink" initial={false} animate={{ opacity: pay === 'done' ? 1 : 0 }} transition={{ duration: 0.6, ease: EASE }} />
      <div className="container-wide">
        <div className="flex flex-col gap-8 pt-8 md:flex-row md:items-end md:justify-between md:pt-12">
          <div>
            <button onClick={() => (step === 'select' ? navigate(-1) : setStep(step === 'checkout' ? 'players' : 'select'))} className="pressable group mb-6 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-muted hover:text-ink">
              <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" /> {step === 'select' ? 'Zurück' : step === 'players' ? 'Termin ändern' : 'Spieler ändern'}
            </button>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3, ease: EASE }}>
                <h1 className="display-md">{step === 'select' ? 'Wann möchtest du spielen?' : step === 'players' ? 'Wer spielt?' : 'Fast geschafft.'}</h1>
                <p className="lede mt-3">{step === 'select' ? 'Tag wählen, Startzeit antippen, Endzeit antippen.' : step === 'players' ? 'Mitglieder werden automatisch erkannt und zahlen weniger.' : 'Prüfe deine Buchung und bestätige die Zahlung.'}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <Progress step={step} />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="min-w-0 lg:col-span-7 xl:col-span-8">
            <AnimatePresence mode="wait">
              {step === 'select' && (
                <motion.div key="select" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={t.base}>
                  <DateSelector value={dayKey} onChange={changeDay} />

                  <div className="mt-10 flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
                    <div>
                      <div className="flex items-center gap-2.5"><h2 className="text-[19px] font-semibold tracking-[-0.015em]">Padel Court 01</h2><span className="text-[13px] text-muted">Sportpark Röttenbach</span></div>
                      <div className="mt-1 text-[13.5px] text-muted">{day.full} · <span className="num">{loading ? '…' : `${fmtDuration(free * SLOT_MINUTES)} frei`}</span></div>
                    </div>
                    {/* phase instruction, changes as the user progresses */}
                    <div className="flex h-9 items-center" aria-live="polite">
                      <AnimatePresence mode="wait" initial={false}>
                        {phaseHint ? (
                          <motion.span key={phaseHint} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }} className="flex items-center gap-2 text-[13.5px] font-medium"><span className={cn('grid size-5 place-items-center rounded-full text-[11px] text-white', range.start === null ? 'bg-ink' : 'bg-green')}>{range.start === null ? 1 : 2}</span>{phaseHint}</motion.span>
                        ) : (
                          <motion.span key="done" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }} className="flex items-center gap-3 text-[13.5px]">
                            <span className="num font-semibold text-green-deep">{fmtRange(range.start!, range.end!)} <span className="font-medium text-green">· {fmtDuration(range.end! - range.start!)}</span></span>
                            <button onClick={reset} className="pressable inline-flex h-8 items-center gap-1.5 rounded-full bg-white px-3 text-[12.5px] font-medium hairline hover:shadow-[inset_0_0_0_1px_var(--color-ink)]"><RotateCcw size={12} />Zeit ändern</button>
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={t.fast} className="overflow-hidden">
                        <div className="mt-4 flex items-start gap-2.5 rounded-[12px] bg-clay-soft/70 px-4 py-3 text-[13.5px] text-[#8A4A34]"><Info size={15} className="mt-0.5 shrink-0" /><span>{error}</span></div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="relative mt-8 min-h-[280px]">
                    <AnimatePresence mode="wait" initial={false}>
                      {loading ? (
                        <motion.div key="sk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="space-y-6 px-[22px]">{[0, 1].map((i) => <div key={i}><div className="skeleton h-9 rounded-[8px]" /><div className="mt-3 flex justify-between">{Array.from({ length: 8 }).map((_, k) => <span key={k} className="skeleton h-3 w-8" />)}</div></div>)}</motion.div>
                      ) : free === 0 ? (
                        <motion.div key="empty" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={t.base} className="flex flex-col items-start py-10">
                          <div className="text-[24px] font-semibold tracking-[-0.02em]">Keine freien Zeiten mehr an diesem Tag.</div>
                          <p className="mt-2 text-[15px] text-muted">Am Freitag sind noch Zeiten verfügbar.</p>
                          <Button variant="secondary" className="mt-6" arrow onClick={() => changeDay(days[6].key)}>Freitag ansehen</Button>
                        </motion.div>
                      ) : (
                        <motion.div key={dayKey} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.28, ease: EASE }}>
                          <TimeRangeSelector day={availability} value={range} onChange={onRange} onPreview={setPreviewEnd} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <AnimatePresence>{notice && <motion.div key="notice" layout className="mt-6"><MatchdayNotice window={notice} acknowledged={ack} onChange={setAck} /></motion.div>}</AnimatePresence>

                  <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-muted">
                    <span className="flex items-center gap-2"><span className="h-3 w-5 rounded-[4px] bg-white shadow-[inset_0_0_0_1px_var(--color-line)]" />Frei</span>
                    <span className="flex items-center gap-2"><span className="h-3 w-5 rounded-[4px] bg-[#DCDFD8]" />Belegt</span>
                    <span className="flex items-center gap-2"><span className="h-3 w-5 rounded-[4px] bg-sand-soft" />Training</span>
                    <span className="flex items-center gap-2"><span className="h-3 w-5 rounded-[4px] bg-[repeating-linear-gradient(-45deg,#E1E3DD_0_3px,#F0F1EC_3px_6px)]" />Gesperrt</span>
                    <span className="flex items-center gap-2"><span className="h-3 w-5 rounded-[4px] bg-green" />Deine Zeit</span>
                    <span className="flex items-center gap-2"><span className="h-[3px] w-5 rounded-full bg-sand" />Hinweis</span>
                    <span className="ml-auto text-muted-2">Zeiten und Belegung: Demo</span>
                  </div>
                </motion.div>
              )}

              {step === 'players' && draft && (
                <motion.div key="players" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={t.base}>
                  <PlayersStep roster={roster} verify={verify} onAdd={addPlayer} start={draft.start} end={draft.end} {...extras} set={(p) => setExtras((e) => ({ ...e, ...p }))} />
                </motion.div>
              )}

              {step === 'checkout' && draft && (
                <motion.div key="checkout" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={t.base}>
                  <CheckoutStep draft={draft} day={day} setMethod={setMethod} pay={pay} onConfirm={confirm} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <aside className="hidden lg:col-span-5 lg:block xl:col-span-4"><div className="sticky top-[100px]">{summary()}</div></aside>
        </div>
      </div>

      {/* Mobile sticky bar */}
      <AnimatePresence>
        {step !== 'checkout' && (
          <motion.div initial={{ y: 90 }} animate={{ y: 0 }} exit={{ y: 90 }} transition={t.springSoft} className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/92 backdrop-blur-xl safe-bottom lg:hidden">
            <div className="container-x flex items-center justify-between gap-4 py-3">
              <button onClick={() => setSheet(true)} className="pressable flex min-w-0 items-center gap-2 text-left" aria-label="Buchungsübersicht öffnen">
                <div className="min-w-0">
                  <div className="num truncate text-[17px] font-semibold">{complete ? fmtRange(range.start!, range.end!) : range.start !== null ? `ab ${fmt(range.start)}` : 'Zeit wählen'}</div>
                  <div className="truncate text-[12.5px] text-muted">{complete ? `${fmtDuration(range.end! - range.start!)} · ${price ? eur(price.total) : ''}` : range.start !== null ? 'Endzeit antippen' : `${day.short} · Padel Court 01`}</div>
                </div>
                <ChevronUp size={16} className="shrink-0 text-muted" />
              </button>
              <Button size="lg" arrow disabled={step === 'select' && !canContinue} onClick={() => (step === 'select' ? setSheet(true) : setStep('checkout'))}>{step === 'select' ? 'Weiter' : 'Zur Zahlung'}</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sheet && (
          <motion.div className="fixed inset-0 z-50 flex items-end lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]" onClick={() => setSheet(false)} />
            <motion.div drag="y" dragConstraints={{ top: 0 }} dragElastic={0.08} onDragEnd={(_, i) => i.offset.y > 80 && setSheet(false)} initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={t.springSoft} className="relative max-h-[88dvh] w-full overflow-y-auto rounded-t-[22px] bg-white p-6 pt-3 shadow-sheet safe-bottom">
              <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-line-2" />
              {summary(true)}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Page>
  )
}
