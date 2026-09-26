import { Fragment, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, CalendarPlus, Check, ChevronUp, Info, Lightbulb, Lock, MapPin, Navigation, Plus, Settings2, Share2 } from 'lucide-react'
import { Page } from '@/components/site/Page'
import { Button } from '@/components/ui/Button'
import { Toggle } from '@/components/ui/Toggle'
import { Avatar } from '@/components/ui/Avatar'
import { AnimatedCheck } from '@/components/ui/AnimatedCheck'
import { AnimatedEuro, eur } from '@/components/ui/AnimatedNumber'
import { Skeleton } from '@/components/ui/Skeleton'
import { days, players, slotsFor, type Slot } from '@/lib/data'
import { cn } from '@/lib/cn'
import { EASE, t } from '@/lib/motion'
import { useToast } from '@/lib/toast'
import { useDarkNav } from '@/lib/navTheme'

type Step = 'select' | 'players' | 'checkout' | 'success'
type PayMethod = 'applepay' | 'paypal' | 'card' | 'klarna'
const stepIndex: Record<Step, number> = { select: 0, players: 1, checkout: 2, success: 3 }
const COURT_PRICE = 24
const MEMBER_DISCOUNT = 4

const shift = (hhmm: string, min: number) => {
  const [h, m] = hhmm.split(':').map(Number)
  const tot = h * 60 + m + min
  return `${String(Math.floor(tot / 60)).padStart(2, '0')}:${String(tot % 60).padStart(2, '0')}`
}

/* ------------------------------------------------------------------ */
/* Progress meta                                                        */
/* ------------------------------------------------------------------ */
function Progress({ step }: { step: Step }) {
  const cur = stepIndex[step]
  return (
    <ol className="flex items-center gap-5 text-[12.5px] font-medium">
      {['Termin', 'Spieler', 'Bestätigung'].map((l, i) => (
        <li key={l} className={cn('flex flex-col gap-2 transition-colors', i <= cur ? 'text-ink' : 'text-muted-2')}>
          <span>{l}</span>
          <span className="h-[2px] w-12 overflow-hidden rounded-full bg-line"><motion.span className="block h-full bg-ink" initial={false} animate={{ scaleX: i < cur ? 1 : i === cur ? 0.5 : 0 }} style={{ originX: 0 }} transition={{ duration: 0.6, ease: EASE }} /></span>
        </li>
      ))}
    </ol>
  )
}

/* ------------------------------------------------------------------ */
/* Date selector                                                        */
/* ------------------------------------------------------------------ */
function DateSelector({ value, onChange }: { value: string; onChange: (k: string) => void }) {
  return (
    <LayoutGroup id="dates">
      <div className="no-scrollbar -mx-5 flex gap-1 overflow-x-auto px-5 pb-1 md:mx-0 md:px-0" role="tablist" aria-label="Datum wählen">
        {days.map((d) => {
          const active = d.key === value
          const free = slotsFor(d.key).filter((s) => s.status === 'free' || s.status === 'notice').length
          return (
            <button key={d.key} role="tab" aria-selected={active} onClick={() => onChange(d.key)} className={cn('pressable relative flex h-[84px] w-[64px] shrink-0 flex-col items-center justify-center rounded-[14px] transition-colors md:w-[72px]', active ? 'text-white' : 'text-ink hover:bg-ink/[0.04]')}>
              {active && <motion.span layoutId="date-active" className="absolute inset-0 rounded-[14px] bg-ink" transition={t.spring} />}
              <span className={cn('relative text-[10.5px] font-medium uppercase tracking-[0.12em]', active ? 'text-white/65' : 'text-muted')}>{d.label ?? d.weekday}</span>
              <span className="num relative mt-1 text-[24px] font-semibold leading-none tracking-[-0.02em]">{d.day}</span>
              <span className="relative mt-2 flex h-1.5 items-center gap-[3px]">
                {free === 0 ? <span className={cn('h-[3px] w-3 rounded-full', active ? 'bg-white/30' : 'bg-line-2')} /> : Array.from({ length: Math.min(3, Math.ceil(free / 3)) }).map((_, i) => <span key={i} className={cn('size-[5px] rounded-full', active ? 'bg-[#8FD0A8]' : 'bg-green/70')} />)}
              </span>
            </button>
          )
        })}
      </div>
    </LayoutGroup>
  )
}

/* ------------------------------------------------------------------ */
/* Slot                                                                 */
/* ------------------------------------------------------------------ */
function SlotCard({ slot, selected, onSelect, taken }: { slot: Slot; selected: boolean; onSelect: () => void; taken?: boolean }) {
  const status = taken ? 'booked' : slot.status
  const disabled = status === 'booked' || status === 'blocked' || status === 'training'
  return (
    <motion.button
      layout="position"
      disabled={disabled}
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'group/slot relative flex min-h-[92px] w-full flex-col justify-between rounded-[14px] px-4 py-3.5 text-left transition-[background-color,box-shadow,transform,color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]',
        status === 'free' && !selected && 'bg-white hairline hover:-translate-y-[1px] hover:shadow-[inset_0_0_0_1px_var(--color-green),0_8px_24px_rgba(17,19,17,0.06)]',
        status === 'notice' && !selected && 'bg-white shadow-[inset_0_0_0_1px_var(--color-sand-line)] hover:-translate-y-[1px] hover:shadow-[inset_0_0_0_1px_var(--color-sand),0_8px_24px_rgba(17,19,17,0.06)]',
        !disabled && 'active:translate-y-0 active:scale-[0.985]',
        selected && 'bg-green text-white shadow-[0_0_0_1px_var(--color-green),0_12px_32px_rgba(49,92,70,0.28)]',
        status === 'booked' && 'cursor-not-allowed bg-paper text-muted-2',
        status === 'training' && 'cursor-not-allowed bg-sand-soft/60 text-[#7A5A22]',
        status === 'blocked' && 'cursor-not-allowed bg-[repeating-linear-gradient(-45deg,#EEEFEA_0_5px,#F6F6F2_5px_10px)] text-muted',
      )}
    >
      <div className="flex w-full items-start justify-between">
        <span className={cn('num text-[18px] font-semibold leading-none tracking-[-0.01em]', status === 'booked' && 'font-medium line-through decoration-muted-2/60')}>{slot.start}</span>
        {selected ? (
          <motion.span initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={t.spring} className="grid size-6 place-items-center rounded-full bg-white text-green"><AnimatedCheck size={14} strokeWidth={3} /></motion.span>
        ) : status === 'free' ? (
          <ArrowRight size={16} className="-translate-x-1 text-green opacity-0 transition-all duration-200 group-hover/slot:translate-x-0 group-hover/slot:opacity-100" />
        ) : status === 'notice' ? (
          <span className="flex size-6 items-center justify-center rounded-full bg-sand-soft text-sand"><Info size={13} /></span>
        ) : status === 'blocked' ? (
          <Lock size={14} className="text-muted-2" />
        ) : null}
      </div>
      <div className="flex w-full items-end justify-between gap-2">
        <span className={cn('num whitespace-nowrap text-[12.5px]', selected ? 'text-white/70' : disabled ? 'text-current opacity-70' : 'text-muted')}>{slot.start} – {slot.end}</span>
        <span className={cn('whitespace-nowrap text-[11.5px] font-medium', selected ? 'text-white/90' : status === 'free' ? 'text-green' : status === 'notice' ? 'text-[#7A5A22]' : 'text-current opacity-80')}>
          {status === 'free' ? 'Frei' : status === 'notice' ? 'Hinweis' : status === 'booked' ? 'Belegt' : status === 'training' ? slot.label ?? 'Training' : slot.label ?? 'Gesperrt'}
        </span>
      </div>
      {selected && slot.status === 'notice' && <span className="absolute -bottom-[7px] left-8 size-3.5 rotate-45 rounded-[2px] bg-green" />}
    </motion.button>
  )
}

/* ------------------------------------------------------------------ */
/* Matchday notice – sits inside the grid, connected to the slot        */
/* ------------------------------------------------------------------ */
function MatchdayNotice({ acknowledged, onChange }: { acknowledged: boolean; onChange: (v: boolean) => void }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: -8, scale: 0.995 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, transition: { duration: 0.18 } }} transition={{ duration: 0.5, ease: EASE }} className="col-span-full overflow-hidden rounded-[16px] bg-sand-soft">
      <div className="grid gap-5 p-5 md:grid-cols-[1fr_auto] md:items-end md:p-6">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-sand">Parallelveranstaltung</div>
          <div className="mt-2 text-[17px] font-semibold tracking-[-0.01em] text-ink">Mannschaftsspiel auf der Tennisanlage</div>
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

/* ------------------------------------------------------------------ */
/* Players                                                              */
/* ------------------------------------------------------------------ */
type Verify = 'idle' | 'checking' | 'done'

function Dots() {
  return (
    <span className="flex items-center gap-[3px]">
      {[0, 1, 2].map((i) => <motion.span key={i} className="size-[4px] rounded-full bg-muted" animate={{ opacity: [0.25, 1, 0.25] }} transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }} />)}
    </span>
  )
}

function PlayerRow({ p, index, state }: { p: (typeof players)[number]; index: number; state: Verify }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={t.base} className="flex items-center gap-4 py-4">
      <Avatar initials={p.initials} tone={index} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15.5px] font-medium">{p.name}</div>
        <div className="text-[12.5px] text-muted">Spieler {index + 1}</div>
      </div>
      <div className="min-w-[150px] text-right">
        <AnimatePresence mode="wait" initial={false}>
          {state === 'checking' ? (
            <motion.span key="c" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-2.5 text-[12.5px] text-muted"><Dots />Mitgliedschaft wird geprüft</motion.span>
          ) : state === 'done' && p.kind === 'member' ? (
            <motion.span key="m" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={t.fast} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-green"><span className="grid size-5 place-items-center rounded-full bg-green-soft"><AnimatedCheck size={12} strokeWidth={3} /></span>TC Röttenbach Mitglied</motion.span>
          ) : state === 'done' ? (
            <motion.span key="g" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={t.fast} className="text-[13px] text-muted">Gast · regulärer Preis</motion.span>
          ) : (
            <motion.span key="i" className="text-[13px] text-muted-2">–</motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* Extras                                                               */
/* ------------------------------------------------------------------ */
function ExtraRow({ icon, title, sub, checked, onChange, price, children }: { icon: ReactNode; title: string; sub?: ReactNode; checked: boolean; onChange: (v: boolean) => void; price?: string; children?: ReactNode }) {
  return (
    <div className="py-4">
      <div className="flex items-center gap-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-paper text-muted">{icon}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2 text-[15.5px] font-medium">{title}{price && <span className="num text-[12.5px] font-normal text-muted">{price}</span>}</div>
          {sub && <div className="text-[13px] text-muted">{sub}</div>}
        </div>
        <Toggle checked={checked} onChange={onChange} label={title} />
      </div>
      {children}
    </div>
  )
}

function Floodlight({ on, onChange, start, end }: { on: boolean; onChange: (v: boolean) => void; start: string; end: string }) {
  return (
    <div className="py-4">
      <div className="flex items-center gap-4">
        <span className="relative grid size-10 shrink-0 place-items-center rounded-full bg-paper">
          <motion.span className="absolute inset-0 rounded-full bg-sand" animate={{ opacity: on ? 0.28 : 0, scale: on ? 1.25 : 0.9 }} transition={{ duration: 0.7, ease: EASE }} style={{ filter: 'blur(5px)' }} />
          <motion.span animate={{ color: on ? '#B98A3E' : '#737770' }} transition={{ duration: 0.5 }} className="relative"><Lightbulb size={18} className={cn('transition-[filter] duration-700', on && 'glow-light')} /></motion.span>
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2 text-[15.5px] font-medium">Flutlicht<span className="text-[12.5px] font-normal text-muted">inklusive</span></div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={on ? 'on' : 'off'} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }} transition={{ duration: 0.25 }} className={cn('text-[13px]', on ? 'text-[#7A5A22]' : 'text-muted')}>
              {on ? `Automatisch von ${start} bis ${end} Uhr.` : 'Aus. Der Court bleibt unbeleuchtet.'}
            </motion.div>
          </AnimatePresence>
        </div>
        <Toggle checked={on} onChange={onChange} label="Flutlicht" />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Success                                                              */
/* ------------------------------------------------------------------ */
function Success({ dayFull, slot, floodlight, method }: { dayFull: string; slot: Slot; floodlight: boolean; method: PayMethod }) {
  const { toast } = useToast()
  useDarkNav()
  const [d1, d2] = dayFull.split(', ')
  const label = { applepay: 'Apple Pay', paypal: 'PayPal', card: 'Karte', klarna: 'Klarna' }[method]
  const actions = [
    { icon: <CalendarPlus size={17} />, label: 'Zum Kalender', on: () => toast('Kalendereintrag erstellt', 'Demo · keine .ics-Datei') },
    { icon: <Share2 size={17} />, label: 'Teilen', on: () => toast('Link kopiert', 'Demo') },
    { icon: <Navigation size={17} />, label: 'Route', on: () => toast('Route geöffnet', 'Lohmühlweg 11a, Röttenbach', 'info') },
    { icon: <Settings2 size={17} />, label: 'Buchung verwalten', to: '/buchung/TCR-2609-1830' },
  ]
  const item = (d: number) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, ease: EASE, delay: d } })
  return (
    <div className="relative min-h-dvh bg-ink text-white">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.6 }} className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_0%,rgba(49,92,70,0.5),transparent)]" />
      <div className="container-x relative grid min-h-dvh gap-14 py-28 lg:grid-cols-12 lg:items-center lg:py-32">
        <div className="lg:col-span-7">
          <motion.div {...item(0.1)} className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-green"><AnimatedCheck size={18} delay={0.35} strokeWidth={3} /></span>
            <span className="text-[11.5px] font-medium uppercase tracking-[0.16em] text-white/50">Match confirmed</span>
          </motion.div>
          <motion.h1 {...item(0.25)} className="display-lg mt-8">Buchung bestätigt.</motion.h1>
          <motion.p {...item(0.4)} className="mt-5 max-w-md text-[16px] leading-relaxed text-white/60">Deine Bestätigung ist unterwegs. Der Court ist für euch reserviert.</motion.p>
          <motion.div {...item(0.55)} className="mt-12 grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-[auto_1fr] sm:items-center">
            <div className="num leading-none"><div className="text-[72px] font-semibold tracking-[-0.05em] md:text-[96px]">{d2.split('.')[0]}</div><div className="mt-2 text-[12.5px] font-medium uppercase tracking-[0.18em] text-white/50">{d2.split(' ')[1]?.slice(0, 3)} · {d1}</div></div>
            <div className="sm:pl-8">
              <div className="num text-[30px] font-semibold tracking-[-0.02em] md:text-[36px]">{slot.start} – {slot.end}</div>
              <div className="mt-1 text-[15px] text-white/65">Padel Court 01 · 90 Minuten</div>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-soft/15 px-2.5 py-1 text-[12.5px] font-medium text-[#8FD0A8]"><Check size={12} strokeWidth={3} />Bezahlt · {label}</span>
                <div className="flex items-center gap-2 pl-1"><div className="flex -space-x-2">{players.map((p, i) => <Avatar key={p.initials} initials={p.initials} tone={i} size="sm" className="!ring-ink" />)}</div><span className="text-[12.5px] text-white/50">4 Spieler</span></div>
              </div>
            </div>
          </motion.div>
          <motion.div {...item(0.75)} className="mt-8 flex items-start gap-3 rounded-[14px] border border-white/10 bg-white/[0.04] px-4 py-3.5 text-[14px] text-white/75">
            <Lightbulb size={16} className={cn('mt-0.5 shrink-0', floodlight ? 'glow-light text-sand' : 'text-white/40')} />
            {floodlight ? <span>Flutlicht wird automatisch um <span className="num font-medium text-white">{shift(slot.start, -5)} Uhr</span> aktiviert und um {shift(slot.end, 5)} Uhr ausgeschaltet.</span> : <span>Flutlicht nicht gebucht. Du kannst es bis Spielbeginn ergänzen.</span>}
          </motion.div>
        </div>
        <motion.div {...item(0.9)} className="lg:col-span-4 lg:col-start-9">
          <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">Aktionen</div>
          <div className="mt-4 divide-y divide-white/10 border-y border-white/10">
            {actions.map((a) => {
              const cls = 'pressable group flex h-14 w-full items-center justify-between text-left text-[15px] font-medium hover:text-white'
              const inner = <><span className="flex items-center gap-3 text-white/85 group-hover:text-white"><span className="text-white/45">{a.icon}</span>{a.label}</span><ArrowRight size={16} className="text-white/35 transition-transform group-hover:translate-x-[3px] group-hover:text-white" /></>
              return a.to ? <Link key={a.label} to={a.to} className={cls}>{inner}</Link> : <button key={a.label} onClick={a.on} className={cls}>{inner}</button>
            })}
          </div>
          <div className="num mt-4 text-[12.5px] text-white/35">Buchungsnummer TCR-2609-1830</div>
        </motion.div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Payment                                                              */
/* ------------------------------------------------------------------ */
const AppleMark = () => <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden><path d="M16.7 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.3 1.2 9.7.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.6-1-2.6-3.8zM14.3 5.4c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.2-.6 2.8-1.4z" /></svg>
const alt: { id: PayMethod; label: string; badge: ReactNode }[] = [
  { id: 'paypal', label: 'PayPal', badge: <span className="text-[14px] font-bold italic tracking-[-0.02em]"><span className="text-[#253B80]">Pay</span><span className="text-[#179BD7]">Pal</span></span> },
  { id: 'card', label: 'Karte', badge: <span className="flex items-center gap-1"><span className="h-3.5 w-5 rounded-[3px] bg-gradient-to-br from-[#EB001B] to-[#F79E1B] opacity-85" /><span className="h-3.5 w-5 rounded-[3px] bg-[#1A1F71] opacity-85" /></span> },
  { id: 'klarna', label: 'Klarna', badge: <span className="rounded-[4px] bg-[#FFB3C7] px-1.5 py-0.5 text-[11px] font-bold text-ink">Klarna.</span> },
]

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */
export function Booking() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [step, setStep] = useState<Step>('select')
  const [dayKey, setDayKey] = useState(days[0].key)
  const [loading, setLoading] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [ack, setAck] = useState(false)
  const [takenId, setTakenId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [roster, setRoster] = useState(players.slice(0, 3))
  const [verify, setVerify] = useState<Record<string, Verify>>({})
  const [floodlight, setFloodlight] = useState(true)
  const [rackets, setRackets] = useState(false)
  const [balls, setBalls] = useState(false)
  const [sheet, setSheet] = useState(false)
  const [method, setMethod] = useState<PayMethod>('applepay')
  const [pay, setPay] = useState<'idle' | 'processing' | 'done'>('idle')

  const slots = useMemo(() => slotsFor(dayKey), [dayKey])
  const day = days.find((d) => d.key === dayKey)!
  const selected = slots.find((s) => s.id === selectedId) ?? null
  const freeCount = slots.filter((s) => s.status === 'free' || s.status === 'notice').length
  const needsAck = selected?.status === 'notice'
  const canContinue = !!selected && (!needsAck || ack)
  const members = roster.filter((p) => p.kind === 'member' && verify[p.initials] === 'done').length
  const guests = roster.length - members
  const extras = (rackets ? 4 : 0) + (balls ? 3 : 0)
  const discount = -MEMBER_DISCOUNT * members
  const total = COURT_PRICE + discount + extras

  const changeDay = useCallback((k: string) => {
    if (k === dayKey) return
    setLoading(true); setSelectedId(null); setAck(false); setError(null); setDayKey(k)
    window.setTimeout(() => setLoading(false), 380)
  }, [dayKey])

  const selectSlot = (s: Slot) => {
    setError(null)
    if (s.start === '14:00' && dayKey === days[0].key && takenId !== s.id) {
      setSelectedId(s.id)
      window.setTimeout(() => { setTakenId(s.id); setSelectedId((c) => (c === s.id ? null : c)); setError('Dieser Slot wurde gerade ausgewählt. Bitte wähle eine andere Zeit.') }, 700)
      return
    }
    setSelectedId((c) => (c === s.id ? null : s.id)); setAck(false)
  }

  const runVerify = useCallback((p: (typeof players)[number], delay = 0) => {
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

  if (step === 'success' && selected) return <Page><Success dayFull={day.full} slot={selected} floodlight={floodlight} method={method} /></Page>

  const Summary = ({ inSheet }: { inSheet?: boolean }) => (
    <div className={cn(!inSheet && 'rounded-[20px] bg-white p-6 hairline')}>
      <div className="flex items-start justify-between">
        <div><div className="eyebrow">Deine Buchung</div><div className="mt-2 text-[20px] font-semibold tracking-[-0.015em]">Padel Court 01</div></div>
        <span className="flex items-center gap-1.5 pt-1 text-[12px] font-medium text-green"><span className="size-1.5 rounded-full bg-green" />bis 22:00</span>
      </div>
      <dl className="mt-5 space-y-2.5 border-t border-line pt-5 text-[14.5px]">
        <div className="flex justify-between gap-4"><dt className="text-muted">Datum</dt><motion.dd key={dayKey} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} className="text-right font-medium">{day.full}</motion.dd></div>
        <div className="flex justify-between gap-4"><dt className="text-muted">Uhrzeit</dt>
          <AnimatePresence mode="wait" initial={false}><motion.dd key={selected?.id ?? 'none'} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }} className={cn('num font-medium', !selected && 'text-muted-2')}>{selected ? `${selected.start} – ${selected.end}` : 'Slot wählen'}</motion.dd></AnimatePresence>
        </div>
        <div className="flex justify-between gap-4"><dt className="text-muted">Dauer</dt><dd className="font-medium">90 Minuten</dd></div>
        {stepIndex[step] >= 1 && (
          <>
            <div className="flex justify-between gap-4"><dt className="text-muted">Spieler</dt><motion.dd key={`${members}-${guests}`} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} className="font-medium">{members} {members === 1 ? 'Mitglied' : 'Mitglieder'} · {guests} {guests === 1 ? 'Gast' : 'Gäste'}</motion.dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">Flutlicht</dt><motion.dd key={String(floodlight)} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} className={cn('font-medium', floodlight && 'text-[#7A5A22]')}>{floodlight ? 'automatisch' : 'aus'}</motion.dd></div>
          </>
        )}
      </dl>
      {stepIndex[step] >= 1 && (
        <motion.dl initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5 space-y-2 border-t border-line pt-5 text-[14.5px]">
          <div className="flex justify-between"><dt className="text-muted">Court · 90 Min.</dt><dd className="num">{eur(COURT_PRICE)}</dd></div>
          <AnimatePresence initial={false}>
            {discount !== 0 && <motion.div key="d" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex justify-between overflow-hidden text-green"><dt>Mitgliedervorteil</dt><dd><AnimatedEuro value={discount} className="num" /></dd></motion.div>}
            {extras > 0 && <motion.div key="e" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex justify-between overflow-hidden"><dt className="text-muted">Extras</dt><dd className="num">{eur(extras)}</dd></motion.div>}
          </AnimatePresence>
          <div className="flex items-baseline justify-between pt-2 text-[18px] font-semibold"><dt>Gesamt</dt><dd><AnimatedEuro value={total} className="num" /></dd></div>
        </motion.dl>
      )}
      <div className="mt-6">
        {step === 'select' && <Button size="lg" full arrow disabled={!canContinue} onClick={() => { setSheet(false); setStep('players') }}>{needsAck && !ack ? 'Hinweis bestätigen' : 'Weiter'}</Button>}
        {step === 'players' && <Button size="lg" full arrow onClick={() => { setSheet(false); setStep('checkout') }}>Zur Zahlung</Button>}
        {step === 'checkout' && <PayButton />}
      </div>
      <p className="mt-3 text-center text-[12px] text-muted-2">Kostenlose Stornierung bis 12 Stunden vor Spielbeginn.</p>
    </div>
  )

  const PayButton = () => (
    <motion.button
      layout
      onClick={confirm}
      disabled={pay !== 'idle'}
      className={cn('pressable relative flex h-[52px] w-full items-center justify-center overflow-hidden rounded-btn text-[15.5px] font-medium text-white transition-colors', pay === 'done' ? 'bg-green' : 'bg-ink hover:bg-ink-2')}
    >
      <AnimatePresence mode="wait" initial={false}>
        {pay === 'idle' && <motion.span key="i" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="flex items-center gap-2">{method === 'applepay' && <AppleMark />}Buchung bestätigen · {eur(total)}</motion.span>}
        {pay === 'processing' && <motion.span key="p" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="flex items-center gap-2.5"><Dots />Zahlung wird verarbeitet</motion.span>}
        {pay === 'done' && <motion.span key="d" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={t.spring} className="flex items-center gap-2"><AnimatedCheck size={18} strokeWidth={3} />Bestätigt</motion.span>}
      </AnimatePresence>
      {pay === 'processing' && <motion.span className="absolute inset-x-0 bottom-0 h-[2px] bg-white/60" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.9, ease: 'linear' }} style={{ originX: 0 }} />}
    </motion.button>
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
                <h1 className="display-md">{step === 'select' ? 'Deinen Court buchen.' : step === 'players' ? 'Wer spielt?' : 'Fast geschafft.'}</h1>
                <p className="lede mt-3">{step === 'select' ? 'Wähle deinen Termin und starte dein Match.' : step === 'players' ? 'Mitglieder werden automatisch erkannt und zahlen weniger.' : 'Prüfe deine Buchung und bestätige die Zahlung.'}</p>
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

                  <div className="mt-10 flex items-end justify-between border-b border-line pb-4">
                    <div>
                      <div className="flex items-center gap-2.5"><h2 className="text-[19px] font-semibold tracking-[-0.015em]">Padel Court 01</h2><span className="text-[13px] text-muted">Outdoor · Doppel</span></div>
                      <div className="mt-1 text-[13.5px] text-muted">{day.full} · <span className="num">{loading ? '…' : `${freeCount} freie Slots`}</span></div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[13px] font-medium text-green"><span className="pulse-dot size-1.5 rounded-full bg-green" />Geöffnet bis 22:00</div>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={t.fast} className="overflow-hidden">
                        <div className="mt-4 flex items-start gap-2.5 rounded-[12px] bg-clay-soft/70 px-4 py-3 text-[13.5px] text-[#8A4A34]"><Info size={15} className="mt-0.5 shrink-0" /><span>{error}</span></div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="relative mt-5 min-h-[300px]">
                    <AnimatePresence mode="wait" initial={false}>
                      {loading ? (
                        <motion.div key="sk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="grid grid-cols-2 gap-3 md:grid-cols-3">{Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className="h-[92px] rounded-[14px]" />)}</motion.div>
                      ) : freeCount === 0 ? (
                        <motion.div key="empty" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={t.base} className="flex flex-col items-start py-10">
                          <div className="text-[24px] font-semibold tracking-[-0.02em]">Keine freien Slots mehr an diesem Tag.</div>
                          <p className="mt-2 text-[15px] text-muted">Am Freitag sind noch Zeiten verfügbar.</p>
                          <Button variant="secondary" className="mt-6" arrow onClick={() => changeDay(days[6].key)}>Freitag ansehen</Button>
                        </motion.div>
                      ) : (
                        <motion.div key={dayKey} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }} className="grid grid-flow-dense grid-cols-2 gap-3 md:grid-cols-3">
                          {slots.map((s) => (
                            <Fragment key={s.id}>
                              <SlotCard slot={s} selected={selectedId === s.id} taken={takenId === s.id} onSelect={() => selectSlot(s)} />
                              {selectedId === s.id && s.status === 'notice' && <MatchdayNotice acknowledged={ack} onChange={setAck} />}
                            </Fragment>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[12.5px] text-muted">
                    <span className="flex items-center gap-2"><span className="size-3 rounded-[4px] bg-white hairline" />Frei</span>
                    <span className="flex items-center gap-2"><span className="size-3 rounded-[4px] bg-paper" />Belegt</span>
                    <span className="flex items-center gap-2"><span className="size-3 rounded-[4px] bg-sand-soft" />Training</span>
                    <span className="flex items-center gap-2"><span className="size-3 rounded-[4px] bg-[repeating-linear-gradient(-45deg,#E4E6E0_0_2px,#F6F6F2_2px_4px)]" />Gesperrt</span>
                  </div>
                </motion.div>
              )}

              {step === 'players' && (
                <motion.div key="players" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={t.base}>
                  <section>
                    <div className="flex items-end justify-between border-b border-line pb-3"><h2 className="text-[17px] font-semibold">Spieler</h2><span className="num text-[13px] text-muted">{roster.length} / 4</span></div>
                    <div className="divide-y divide-line">{roster.map((p, i) => <PlayerRow key={p.initials} p={p} index={i} state={verify[p.initials] ?? 'idle'} />)}</div>
                    <AnimatePresence>
                      {roster.length < 4 && (
                        <motion.div exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-[13.5px]">
                            <span className="text-muted">Vorschlag:</span>
                            <button onClick={addPlayer} className="pressable group inline-flex h-10 items-center gap-2 rounded-full bg-white pl-1.5 pr-4 font-medium hairline hover:shadow-[inset_0_0_0_1px_var(--color-ink)]"><Avatar initials="TH" size="sm" tone={3} />Tobias Herzog<Plus size={14} className="text-muted transition-transform group-hover:rotate-90" /></button>
                            <button onClick={() => toast('Einladungslink kopiert', 'Demo')} className="pressable h-10 rounded-full px-4 font-medium text-muted hover:text-ink">Link teilen</button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </section>
                  <section className="mt-12">
                    <div className="border-b border-line pb-3"><h2 className="text-[17px] font-semibold">Extras</h2></div>
                    <div className="divide-y divide-line">
                      <Floodlight on={floodlight} onChange={setFloodlight} start={shift(selected!.start, -5)} end={shift(selected!.end, 5)} />
                      <ExtraRow icon={<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><ellipse cx="12" cy="9" rx="6" ry="7" /><path d="M12 16v6M9 19h6" /></svg>} title="Leihschläger" sub="2 Schläger liegen am Court bereit." price="+ 4,00 €" checked={rackets} onChange={setRackets} />
                      <ExtraRow icon={<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M5 6.5c4 1.5 6 5 6 9.5M19 6.5c-4 1.5-6 5-6 9.5" /></svg>} title="Bälle" sub="Neue Dose, 3 Bälle." price="+ 3,00 €" checked={balls} onChange={setBalls} />
                    </div>
                  </section>
                </motion.div>
              )}

              {step === 'checkout' && (
                <motion.div key="checkout" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={t.base} className="grid gap-12 md:grid-cols-12">
                  <div className="md:col-span-6">
                    <div className="eyebrow">Übersicht</div>
                    <div className="mt-5 flex items-start gap-5">
                      <div className="num leading-none"><div className="text-[56px] font-semibold tracking-[-0.05em]">{day.day}</div><div className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">{day.month}</div></div>
                      <div className="pt-1.5">
                        <div className="num text-[22px] font-semibold tracking-[-0.02em]">{selected?.start} – {selected?.end}</div>
                        <div className="mt-0.5 text-[14px] text-muted">{day.full}</div>
                        <div className="mt-0.5 text-[14px] text-muted">Padel Court 01 · 90 Minuten</div>
                      </div>
                    </div>
                    <div className="mt-8 divide-y divide-line border-y border-line text-[14.5px]">
                      <div className="flex items-center justify-between py-3.5"><span className="text-muted">Spieler</span><div className="flex items-center gap-2.5"><div className="flex -space-x-2">{roster.map((p, i) => <Avatar key={p.initials} initials={p.initials} tone={i} size="sm" />)}</div><span className="font-medium">{roster.length}</span></div></div>
                      <div className="flex items-center justify-between py-3.5"><span className="text-muted">Flutlicht</span><span className={cn('flex items-center gap-2 font-medium', floodlight && 'text-[#7A5A22]')}><Lightbulb size={14} className={floodlight ? 'glow-light text-sand' : 'text-muted'} />{floodlight ? `${shift(selected!.start, -5)} – ${shift(selected!.end, 5)} Uhr` : 'aus'}</span></div>
                      <div className="flex items-center justify-between py-3.5"><span className="text-muted">Extras</span><span className="font-medium">{[rackets && 'Leihschläger', balls && 'Bälle'].filter(Boolean).join(', ') || 'keine'}</span></div>
                      <div className="flex items-center justify-between py-3.5"><span className="text-muted">Ort</span><span className="flex items-center gap-1.5 font-medium"><MapPin size={14} className="text-muted" />Lohmühlweg 11a</span></div>
                    </div>
                  </div>
                  <div className="md:col-span-6">
                    <div className="flex items-baseline justify-between"><div className="eyebrow">Zahlung</div><span className="num text-[15px] font-semibold">{eur(total)}</span></div>
                    <button onClick={() => setMethod('applepay')} aria-pressed={method === 'applepay'} className={cn('pressable mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-[12px] text-[17px] font-semibold tracking-[-0.02em] transition-[box-shadow,background-color]', method === 'applepay' ? 'bg-ink text-white' : 'bg-white text-ink hairline hover:shadow-[inset_0_0_0_1px_var(--color-ink)]')}>
                      <AppleMark /> Pay{method === 'applepay' && <Check size={16} className="ml-2 text-white/60" />}
                    </button>
                    <div className="my-5 flex items-center gap-3 text-[12px] text-muted-2"><span className="h-px flex-1 bg-line" />oder<span className="h-px flex-1 bg-line" /></div>
                    <div className="grid grid-cols-3 gap-2">
                      {alt.map((m) => {
                        const on = method === m.id
                        return (
                          <button key={m.id} onClick={() => setMethod(m.id)} aria-pressed={on} className={cn('pressable flex h-[68px] flex-col items-center justify-center gap-1.5 rounded-[12px] bg-white text-[12.5px] font-medium transition-[box-shadow]', on ? 'shadow-[inset_0_0_0_2px_var(--color-ink)]' : 'hairline hover:shadow-[inset_0_0_0_1px_var(--color-ink)]')}>
                            <span className="flex h-6 items-center">{m.badge}</span>{m.label}
                          </button>
                        )
                      })}
                    </div>
                    <AnimatePresence initial={false}>
                      {method === 'card' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={t.fast} className="overflow-hidden">
                          <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_92px_72px]">
                            <input placeholder="Kartennummer" className="num h-12 rounded-[12px] bg-white px-3.5 text-[15px] outline-none hairline placeholder:text-muted-2 focus:shadow-[inset_0_0_0_1px_var(--color-green)]" />
                            <input placeholder="MM / JJ" className="num h-12 rounded-[12px] bg-white px-3.5 text-[15px] outline-none hairline placeholder:text-muted-2 focus:shadow-[inset_0_0_0_1px_var(--color-green)]" />
                            <input placeholder="CVC" className="num h-12 rounded-[12px] bg-white px-3.5 text-[15px] outline-none hairline placeholder:text-muted-2 focus:shadow-[inset_0_0_0_1px_var(--color-green)]" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="mt-6 lg:hidden"><PayButton /></div>
                    <p className="mt-5 text-[12px] leading-relaxed text-muted-2">Demo. Es findet keine Zahlung statt. Mit der Bestätigung akzeptierst du die Platzordnung des TC Röttenbach.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <aside className="hidden lg:col-span-5 lg:block xl:col-span-4"><div className="sticky top-[100px]"><Summary /></div></aside>
        </div>
      </div>

      {/* Mobile sticky bar */}
      <AnimatePresence>
        {step !== 'checkout' && (
          <motion.div initial={{ y: 90 }} animate={{ y: 0 }} exit={{ y: 90 }} transition={t.springSoft} className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/92 backdrop-blur-xl safe-bottom lg:hidden">
            <div className="container-x flex items-center justify-between gap-4 py-3">
              <button onClick={() => setSheet(true)} className="pressable flex min-w-0 items-center gap-2 text-left">
                <div className="min-w-0">
                  <div className="num truncate text-[17px] font-semibold">{selected ? `${selected.start} – ${selected.end}` : 'Slot wählen'}</div>
                  <div className="truncate text-[12.5px] text-muted">{stepIndex[step] >= 1 ? `${day.short} · ${eur(total)}` : `${day.short} · Padel Court 01`}</div>
                </div>
                <ChevronUp size={16} className="text-muted" />
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
            <motion.div drag="y" dragConstraints={{ top: 0 }} dragElastic={0.08} onDragEnd={(_, i) => i.offset.y > 80 && setSheet(false)} initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={t.springSoft} className="relative w-full rounded-t-[22px] bg-white p-6 pt-3 shadow-sheet safe-bottom">
              <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-line-2" />
              <Summary inSheet />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Page>
  )
}
