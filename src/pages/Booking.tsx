import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Calendar, CalendarPlus, Check, ChevronDown, Info, Lightbulb, Loader2, MapPin, Navigation, Settings2, Share2, Users, Zap } from 'lucide-react'
import { Page } from '@/components/site/Page'
import { Button } from '@/components/ui/Button'
import { Pill } from '@/components/ui/Pill'
import { Checkbox } from '@/components/ui/Checkbox'
import { Toggle } from '@/components/ui/Toggle'
import { Avatar } from '@/components/ui/Avatar'
import { AnimatedCheck } from '@/components/ui/AnimatedCheck'
import { Skeleton } from '@/components/ui/Skeleton'
import { days, players, slotsFor, type Slot } from '@/lib/data'
import { cn } from '@/lib/cn'
import { EASE, t } from '@/lib/motion'
import { useToast } from '@/lib/toast'
import { useDarkNav } from '@/lib/navTheme'

type Step = 'select' | 'players' | 'checkout' | 'success'
type PayMethod = 'applepay' | 'paypal' | 'card' | 'klarna'

const stepIndex: Record<Step, number> = { select: 0, players: 1, checkout: 2, success: 3 }

/* ------------------------------------------------------------------ */
/* Date selector                                                       */
/* ------------------------------------------------------------------ */
function DateSelector({ value, onChange }: { value: string; onChange: (k: string) => void }) {
  return (
    <LayoutGroup id="dates">
      <div className="no-scrollbar -mx-5 flex gap-1.5 overflow-x-auto px-5 pb-1 md:mx-0 md:px-0" role="tablist" aria-label="Datum wählen">
        {days.map((d) => {
          const active = d.key === value
          return (
            <button
              key={d.key}
              role="tab"
              aria-selected={active}
              onClick={() => onChange(d.key)}
              className={cn('pressable relative flex h-[76px] w-[62px] shrink-0 flex-col items-center justify-center rounded-[14px] text-center transition-colors md:w-[70px]', active ? 'text-white' : 'text-ink hover:bg-ink/[0.04]')}
            >
              {active && <motion.span layoutId="date-active" className="absolute inset-0 rounded-[14px] bg-ink" transition={t.spring} />}
              <span className={cn('relative text-[10.5px] font-medium uppercase tracking-[0.12em]', active ? 'text-white/70' : 'text-muted')}>{d.label ?? d.weekday}</span>
              <span className="num relative mt-1 text-[22px] font-semibold leading-none">{d.day}</span>
              <span className={cn('relative mt-1 text-[10.5px]', active ? 'text-white/60' : 'text-muted-2')}>{d.month}</span>
            </button>
          )
        })}
      </div>
    </LayoutGroup>
  )
}

/* ------------------------------------------------------------------ */
/* Slot card                                                           */
/* ------------------------------------------------------------------ */
function SlotCard({ slot, selected, onSelect, index, taken }: { slot: Slot; selected: boolean; onSelect: () => void; index: number; taken?: boolean }) {
  const disabled = slot.status === 'booked' || slot.status === 'blocked' || slot.status === 'training' || taken
  const labelText = taken ? 'Belegt' : slot.status === 'booked' ? 'Belegt' : slot.status === 'blocked' ? 'Nicht verfügbar' : slot.status === 'training' ? 'Training' : 'Frei'
  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ ...t.base, delay: index * 0.03 }}
      disabled={disabled}
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'group/slot relative flex w-full flex-col rounded-[14px] border px-4 py-3.5 text-left transition-[border-color,background-color,box-shadow,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]',
        !disabled && !selected && 'border-line bg-white hover:-translate-y-[1px] hover:border-green hover:shadow-soft',
        !disabled && 'active:scale-[0.985]',
        selected && 'border-green bg-green text-white shadow-[0_8px_30px_rgba(49,92,70,0.22)]',
        disabled && 'cursor-not-allowed border-transparent bg-paper text-muted-2',
        slot.status === 'blocked' && 'bg-[repeating-linear-gradient(-45deg,#F0F1EC_0px,#F0F1EC_6px,#F6F6F2_6px,#F6F6F2_12px)]',
      )}
    >
      <div className="flex w-full items-center justify-between">
        <span className={cn('num text-[17px] font-semibold leading-none', disabled && 'font-medium')}>{slot.start}</span>
        <span className="flex items-center gap-2">
          {slot.status === 'notice' && !selected && <Info size={14} className="text-sand" />}
          {selected ? (
            <span className="grid size-6 place-items-center rounded-full bg-white text-green"><AnimatedCheck size={14} strokeWidth={3} /></span>
          ) : !disabled ? (
            <ArrowRight size={16} className="text-green opacity-0 transition-all duration-200 group-hover/slot:translate-x-0 group-hover/slot:opacity-100 -translate-x-1" />
          ) : null}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className={cn('text-[12.5px]', selected ? 'text-white/75' : disabled ? 'text-muted-2' : 'text-muted')}>{slot.start} – {slot.end}</span>
        <span className={cn('text-[11.5px] font-medium', selected ? 'text-white/85' : slot.status === 'training' ? 'text-[#7A5A22]' : slot.status === 'blocked' ? 'text-muted' : disabled ? 'text-muted-2' : 'text-green')}>
          {labelText}
        </span>
      </div>
      <AnimatePresence initial={false}>
        {selected && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={t.fast} className="overflow-hidden">
            <div className="mt-3 flex items-center justify-between gap-2 whitespace-nowrap border-t border-white/20 pt-3 text-[12px] text-white/85">
              <span>90 Min. · Doppel</span>
              <span className="num font-medium">ab 16,00 €</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {slot.status === 'blocked' && slot.label && (
        <span className="absolute right-3 top-3 rounded-full bg-white px-2 py-0.5 text-[10.5px] font-medium text-muted">{slot.label}</span>
      )}
    </motion.button>
  )
}

/* ------------------------------------------------------------------ */
/* Matchday notice                                                     */
/* ------------------------------------------------------------------ */
function MatchdayNotice({ acknowledged, onChange }: { acknowledged: boolean; onChange: (v: boolean) => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, transition: { duration: 0.2 } }}
      transition={t.base}
      className="relative overflow-hidden rounded-[16px] border border-sand-line bg-sand-soft p-5"
    >
      <div className="flex gap-3.5">
        <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-white text-sand"><Info size={16} /></span>
        <div className="min-w-0">
          <div className="text-[15px] font-semibold text-ink">Parallelveranstaltung auf der Tennisanlage</div>
          <p className="mt-1.5 text-[14px] leading-relaxed text-[#5F4A22]">
            Während deiner Buchung findet ein Mannschaftsspiel statt. Der Padel Court bleibt geöffnet. Wir bitten während dieser Zeit um besondere Rücksichtnahme und reduzierte Lautstärke.
          </p>
          <Checkbox className="mt-4" tone="sand" checked={acknowledged} onChange={onChange} label="Ich habe den Hinweis gelesen." />
        </div>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* Player row with animated member check                               */
/* ------------------------------------------------------------------ */
function PlayerRow({ p, index, active }: { p: (typeof players)[number]; index: number; active: boolean }) {
  const [state, setState] = useState<'checking' | 'done'>('checking')
  useEffect(() => {
    if (!active) return
    const id = window.setTimeout(() => setState('done'), 900 + index * 500)
    return () => window.clearTimeout(id)
  }, [active, index])
  const member = p.kind === 'member'
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...t.base, delay: index * 0.07 }} className="flex items-center gap-3.5 rounded-[14px] border border-line bg-white px-4 py-3.5">
      <Avatar initials={p.initials} tone={index} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-[12px] text-muted"><span>Spieler {index + 1}</span></div>
        <div className="truncate text-[15px] font-medium">{p.name}</div>
      </div>
      <div className="h-7 min-w-[150px] text-right">
        <AnimatePresence mode="wait" initial={false}>
          {state === 'checking' ? (
            <motion.span key="checking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }} className="inline-flex h-7 items-center gap-2 text-[12.5px] text-muted">
              <Loader2 size={13} className="animate-spin" /> Mitglied wird geprüft…
            </motion.span>
          ) : (
            <motion.span key="done" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={t.fast}>
              {member ? <Pill tone="green"><Check size={12} strokeWidth={3} />TC Röttenbach Mitglied</Pill> : <Pill tone="neutral">Gast</Pill>}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* Extras                                                              */
/* ------------------------------------------------------------------ */
function ExtraRow({ icon, title, sub, checked, onChange, price }: { icon: React.ReactNode; title: string; sub?: string; checked: boolean; onChange: (v: boolean) => void; price?: string }) {
  return (
    <div className={cn('flex items-center gap-4 rounded-[14px] border px-4 py-3.5 transition-colors', checked ? 'border-green-line bg-green-soft/40' : 'border-line bg-white')}>
      <span className={cn('grid size-9 shrink-0 place-items-center rounded-[10px] transition-colors', checked ? 'bg-white text-green' : 'bg-paper text-muted')}>{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-[15px] font-medium">{title}{price && <span className="num text-[12.5px] font-normal text-muted">{price}</span>}</div>
        {sub && <div className="text-[12.5px] leading-snug text-muted">{sub}</div>}
      </div>
      <Toggle checked={checked} onChange={onChange} label={title} />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Payment button                                                      */
/* ------------------------------------------------------------------ */
const payMethods: { id: PayMethod; label: string; badge: React.ReactNode }[] = [
  { id: 'applepay', label: 'Apple Pay', badge: <span className="flex items-center gap-0.5 text-[15px] font-semibold tracking-[-0.03em]"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden><path d="M16.7 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.3 1.2 9.7.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.6-1-2.6-3.8zM14.3 5.4c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.2-.6 2.8-1.4z"/></svg>Pay</span> },
  { id: 'paypal', label: 'PayPal', badge: <span className="text-[15px] font-bold italic tracking-[-0.02em]"><span className="text-[#253B80]">Pay</span><span className="text-[#179BD7]">Pal</span></span> },
  { id: 'card', label: 'Karte', badge: <span className="flex items-center gap-1"><span className="h-4 w-6 rounded-[3px] bg-gradient-to-br from-[#EB001B] to-[#F79E1B] opacity-80" /><span className="h-4 w-6 rounded-[3px] bg-[#1A1F71] opacity-80" /></span> },
  { id: 'klarna', label: 'Klarna', badge: <span className="rounded-[4px] bg-[#FFB3C7] px-1.5 py-0.5 text-[12px] font-bold text-ink">Klarna.</span> },
]

/* ------------------------------------------------------------------ */
/* Success                                                             */
/* ------------------------------------------------------------------ */
function Success({ dayFull, slot, floodlight, method }: { dayFull: string; slot: Slot; floodlight: boolean; method: PayMethod }) {
  const { toast } = useToast()
  useDarkNav()
  const [d1, d2] = dayFull.split(', ')
  const startMinus5 = `${String(Number(slot.start.slice(0, 2)) - (slot.start.endsWith('00') ? 1 : 0)).padStart(2, '0')}:${slot.start.endsWith('00') ? '55' : String(Number(slot.start.slice(3)) - 5).padStart(2, '0')}`
  const actions = [
    { icon: <CalendarPlus size={17} />, label: 'Zum Kalender hinzufügen', on: () => toast('Kalendereintrag erstellt', 'Demo · .ics wird nicht erzeugt') },
    { icon: <Share2 size={17} />, label: 'Buchung teilen', on: () => toast('Link kopiert', 'Demo · kein echter Link') },
    { icon: <Navigation size={17} />, label: 'Route öffnen', on: () => toast('Route geöffnet', 'Lohmühlweg 11a, Röttenbach', 'info') },
    { icon: <Settings2 size={17} />, label: 'Buchung verwalten', to: '/buchung/TCR-2609-1830' },
  ]
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="relative min-h-dvh bg-ink text-white">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.4, delay: 0.2 }} className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(49,92,70,0.55),transparent)]" />
      <div className="container-x relative flex min-h-dvh flex-col items-center justify-center py-28 text-center">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ ...t.springSoft, delay: 0.15 }} className="grid size-20 place-items-center rounded-full bg-green shadow-[0_0_0_10px_rgba(49,92,70,0.25)]">
          <AnimatedCheck size={36} delay={0.45} strokeWidth={2.8} />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.6 }} className="display-lg mt-10">Match confirmed.</motion.h1>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.8 }} className="mt-8">
          <div className="text-[15px] uppercase tracking-[0.12em] text-white/55">{d1}</div>
          <div className="mt-1 text-[28px] font-semibold tracking-[-0.02em] md:text-[34px]">{d2}</div>
          <div className="num mt-1 text-[22px] text-white/85 md:text-[26px]">{slot.start} – {slot.end}</div>
          <div className="mt-3 text-[15px] text-white/60">Padel Court Röttenbach</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 1.0 }} className="mt-10 flex flex-col items-center gap-5 md:flex-row md:gap-10">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">{players.map((p, i) => <Avatar key={p.initials} initials={p.initials} tone={i} className="!ring-ink" />)}</div>
            <span className="text-[13.5px] text-white/60">4 Spieler</span>
          </div>
          <div className="flex items-center gap-2 text-[13.5px]"><Pill tone="green">Bezahlt · {payMethods.find((m) => m.id === method)?.label}</Pill></div>
          <div className="flex items-center gap-2 text-[13.5px] text-white/70"><Lightbulb size={15} className={floodlight ? 'glow-light text-sand' : 'text-white/40'} />Flutlicht: {floodlight ? `${startMinus5} automatisch` : 'nicht gebucht'}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 1.2 }} className="mt-12 grid w-full max-w-2xl grid-cols-2 gap-2.5 md:grid-cols-4">
          {actions.map((a) =>
            a.to ? (
              <Link key={a.label} to={a.to} className="pressable flex h-[76px] flex-col items-center justify-center gap-2 rounded-[14px] border border-white/15 bg-white/[0.06] px-3 text-center text-[12.5px] font-medium backdrop-blur-sm hover:border-white/35 hover:bg-white/10">{a.icon}{a.label}</Link>
            ) : (
              <button key={a.label} onClick={a.on} className="pressable flex h-[76px] flex-col items-center justify-center gap-2 rounded-[14px] border border-white/15 bg-white/[0.06] px-3 text-center text-[12.5px] font-medium backdrop-blur-sm hover:border-white/35 hover:bg-white/10">{a.icon}{a.label}</button>
            ),
          )}
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="mt-10 text-[13px] text-white/40">Buchungsnummer TCR-2609-1830 · Demo</motion.div>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* Main page                                                           */
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
  const [floodlight, setFloodlight] = useState(true)
  const [rackets, setRackets] = useState(false)
  const [balls, setBalls] = useState(false)
  const [sheet, setSheet] = useState(false)
  const [method, setMethod] = useState<PayMethod | null>(null)
  const [paying, setPaying] = useState(false)

  const slots = useMemo(() => slotsFor(dayKey), [dayKey])
  const day = days.find((d) => d.key === dayKey)!
  const selected = slots.find((s) => s.id === selectedId) ?? null
  const freeCount = slots.filter((s) => s.status === 'free' || s.status === 'notice').length
  const needsAck = selected?.status === 'notice'
  const canContinue = !!selected && (!needsAck || ack)

  const changeDay = useCallback((k: string) => {
    if (k === dayKey) return
    setLoading(true)
    setSelectedId(null); setAck(false); setError(null)
    setDayKey(k)
    window.setTimeout(() => setLoading(false), 420)
  }, [dayKey])

  const selectSlot = (s: Slot) => {
    setError(null)
    // demo: one slot gets "snatched" to show inline error feedback
    if (s.start === '14:00' && dayKey === days[0].key && takenId !== s.id) {
      setSelectedId(s.id)
      window.setTimeout(() => {
        setTakenId(s.id)
        setSelectedId((cur) => (cur === s.id ? null : cur))
        setError('Dieser Slot wurde gerade ausgewählt. Bitte wähle eine andere Zeit.')
      }, 700)
      return
    }
    setSelectedId((cur) => (cur === s.id ? null : s.id))
    setAck(false)
  }

  const price = useMemo(() => {
    const court = 24
    const memberDiscount = -8
    const extras = (rackets ? 4 : 0) + (balls ? 3 : 0)
    return { court, memberDiscount, extras, total: court + memberDiscount + extras }
  }, [rackets, balls])
  const eur = (n: number) => `${n < 0 ? '−' : ''}${Math.abs(n).toFixed(2).replace('.', ',')} €`

  const pay = (m: PayMethod) => {
    setMethod(m)
    setPaying(true)
    window.setTimeout(() => { setPaying(false); setStep('success'); window.scrollTo({ top: 0 }) }, 1800)
  }

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [step])

  if (step === 'success' && selected) return <Page><Success dayFull={day.full} slot={selected} floodlight={floodlight} method={method ?? 'applepay'} /></Page>

  /* Summary panel (desktop sticky, mobile inside sheet) */
  const Summary = ({ inSheet }: { inSheet?: boolean }) => (
    <div className={cn('flex flex-col', !inSheet && 'rounded-[20px] border border-line bg-surface p-6 shadow-panel')}>
      <div className="flex items-center justify-between">
        <div className="eyebrow">Deine Buchung</div>
        <Pill tone="green" dot>Geöffnet bis 22:00</Pill>
      </div>
      <div className="mt-4 text-[20px] font-semibold tracking-[-0.01em]">Padel Court 01</div>
      <div className="mt-1 text-[14px] text-muted">Outdoor · Doppel</div>
      <div className="mt-5 space-y-3 border-t border-line pt-5 text-[14.5px]">
        <div className="flex items-center justify-between"><span className="text-muted">Datum</span><motion.span key={dayKey} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} className="font-medium">{day.full}</motion.span></div>
        <div className="flex items-center justify-between"><span className="text-muted">Uhrzeit</span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={selected?.id ?? 'none'} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }} transition={{ duration: 0.18 }} className={cn('num font-medium', !selected && 'text-muted-2')}>{selected ? `${selected.start} – ${selected.end}` : 'Slot wählen'}</motion.span>
          </AnimatePresence>
        </div>
        <div className="flex items-center justify-between"><span className="text-muted">Dauer</span><span className="font-medium">90 Minuten</span></div>
        {stepIndex[step] >= 1 && (
          <>
            <div className="flex items-center justify-between"><span className="text-muted">Spieler</span><span className="font-medium">2 Mitglieder · 2 Gäste</span></div>
            <div className="flex items-center justify-between"><span className="text-muted">Extras</span><span className="text-right font-medium">{[floodlight && 'Flutlicht', rackets && 'Leihschläger', balls && 'Bälle'].filter(Boolean).join(', ') || '–'}</span></div>
          </>
        )}
      </div>
      {stepIndex[step] >= 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5 space-y-2 border-t border-line pt-5 text-[14.5px]">
          <div className="flex justify-between"><span className="text-muted">Court</span><span className="num">{eur(price.court)}</span></div>
          <div className="flex justify-between text-green"><span>Mitgliedervorteil</span><span className="num">{eur(price.memberDiscount)}</span></div>
          {price.extras > 0 && <div className="flex justify-between"><span className="text-muted">Extras</span><span className="num">{eur(price.extras)}</span></div>}
          <div className="flex items-baseline justify-between pt-2 text-[17px] font-semibold"><span>Gesamt</span><motion.span key={price.total} initial={{ opacity: 0.4, y: 3 }} animate={{ opacity: 1, y: 0 }} className="num">{eur(price.total)}</motion.span></div>
        </motion.div>
      )}
      <AnimatePresence>
        {needsAck && !ack && step === 'select' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="mt-4 flex items-center gap-2 rounded-[10px] bg-sand-soft px-3 py-2 text-[12.5px] text-[#7A5A22]"><Info size={13} />Bitte bestätige zuerst den Hinweis.</div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mt-6">
        {step === 'select' && <Button size="lg" full arrow disabled={!canContinue} onClick={() => { setSheet(false); setStep('players') }}>Weiter</Button>}
        {step === 'players' && <Button size="lg" full arrow onClick={() => { setSheet(false); setStep('checkout') }}>Zur Zahlung</Button>}
        {step === 'checkout' && <div className="text-center text-[12.5px] text-muted">Wähle rechts eine Zahlungsart.</div>}
      </div>
      <p className="mt-3 text-center text-[12px] text-muted-2">Kostenlose Stornierung bis 12 Stunden vor Spielbeginn.</p>
    </div>
  )

  return (
    <Page className="bg-paper pb-32 pt-[68px] md:pt-[76px]">
      <div className="container-wide">
        {/* Header */}
        <div className="flex flex-col gap-6 pt-8 md:flex-row md:items-end md:justify-between md:pt-12">
          <div>
            <button onClick={() => (step === 'select' ? navigate(-1) : setStep(step === 'checkout' ? 'players' : 'select'))} className="pressable group mb-5 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-muted hover:text-ink">
              <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" /> {step === 'select' ? 'Zurück' : step === 'players' ? 'Zeit ändern' : 'Spieler ändern'}
            </button>
            <h1 className="display-md">{step === 'select' ? 'Deinen Court buchen.' : step === 'players' ? 'Wer spielt?' : 'Fast geschafft.'}</h1>
            <p className="lede mt-3">{step === 'select' ? 'Wähle deinen Termin und starte dein Match.' : step === 'players' ? 'Mitglieder werden automatisch erkannt. Gäste zahlen den regulären Preis.' : 'Überprüfe deine Buchung und wähle eine Zahlungsart.'}</p>
          </div>
          <ol className="flex items-center gap-2 text-[12.5px] font-medium">
            {(['Zeit', 'Spieler', 'Zahlung'] as const).map((l, i) => {
              const cur = stepIndex[step]
              return (
                <li key={l} className="flex items-center gap-2">
                  <span className={cn('flex h-8 items-center gap-2 rounded-full border px-3 transition-colors', i < cur ? 'border-green-line bg-green-soft text-green' : i === cur ? 'border-ink bg-ink text-white' : 'border-line text-muted')}>
                    {i < cur ? <Check size={12} strokeWidth={3} /> : <span className="num">{i + 1}</span>}{l}
                  </span>
                  {i < 2 && <span className="h-px w-4 bg-line-2" />}
                </li>
              )
            })}
          </ol>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* LEFT */}
          <div className="min-w-0 lg:col-span-7 xl:col-span-8">
            <AnimatePresence mode="wait">
              {step === 'select' && (
                <motion.div key="select" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={t.base}>
                  <DateSelector value={dayKey} onChange={changeDay} />

                  <div className="mt-8 flex items-end justify-between rounded-[18px] border border-line bg-surface p-5">
                    <div>
                      <div className="flex items-center gap-2.5"><h2 className="text-[19px] font-semibold tracking-[-0.01em]">Padel Court 01</h2><Pill tone="outline">Outdoor</Pill><Pill tone="outline">Doppel</Pill></div>
                      <div className="mt-1 text-[13.5px] text-muted">Lohmühlweg 11a · Flutlicht verfügbar</div>
                    </div>
                    <div className="text-right"><div className="flex items-center justify-end gap-1.5 text-[13px] font-medium text-green"><span className="size-1.5 rounded-full bg-green" />Geöffnet</div><div className="text-[12.5px] text-muted">bis 22:00</div></div>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div initial={{ opacity: 0, y: -6, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={t.fast} className="overflow-hidden">
                        <div className="mt-4 flex items-start gap-2.5 rounded-[12px] border border-clay-soft bg-clay-soft/60 px-4 py-3 text-[13.5px] text-[#8A4A34]"><Info size={15} className="mt-0.5 shrink-0" /><span>{error}</span></div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-6 flex items-center justify-between">
                    <h3 className="text-[15px] font-medium">{day.full}</h3>
                    <span className="num text-[13px] text-muted">{loading ? '…' : `${freeCount} freie Slots`}</span>
                  </div>

                  <div className="relative mt-4 min-h-[280px]">
                    <AnimatePresence mode="wait" initial={false}>
                      {loading ? (
                        <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="grid grid-cols-2 gap-3 md:grid-cols-3">
                          {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className="h-[86px] rounded-[14px]" />)}
                        </motion.div>
                      ) : freeCount === 0 ? (
                        <motion.div key="empty" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={t.base} className="flex flex-col items-center rounded-[18px] border border-dashed border-line-2 px-6 py-14 text-center">
                          <span className="grid size-12 place-items-center rounded-full bg-paper text-muted"><Calendar size={20} /></span>
                          <div className="mt-5 text-[18px] font-semibold">Keine freien Slots mehr an diesem Tag.</div>
                          <p className="mt-1.5 text-[14.5px] text-muted">Am Vortag sind noch Zeiten verfügbar.</p>
                          <Button variant="secondary" className="mt-6" arrow onClick={() => changeDay(days[6].key)}>Freitag ansehen</Button>
                        </motion.div>
                      ) : (
                        <motion.div key={dayKey} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="grid grid-cols-2 gap-3 md:grid-cols-3">
                          {slots.map((s, i) => <SlotCard key={s.id} slot={s} index={i} selected={selectedId === s.id} taken={takenId === s.id} onSelect={() => selectSlot(s)} />)}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="mt-6">
                    <AnimatePresence>{needsAck && <MatchdayNotice acknowledged={ack} onChange={setAck} />}</AnimatePresence>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[12.5px] text-muted">
                    <span className="flex items-center gap-2"><span className="size-3 rounded-[4px] border border-line bg-white" />Frei</span>
                    <span className="flex items-center gap-2"><span className="size-3 rounded-[4px] bg-paper" />Belegt</span>
                    <span className="flex items-center gap-2"><span className="size-3 rounded-[4px] border border-sand-line bg-sand-soft" />Training / Hinweis</span>
                    <span className="flex items-center gap-2"><span className="size-3 rounded-[4px] bg-[repeating-linear-gradient(-45deg,#E4E6E0_0px,#E4E6E0_2px,#F6F6F2_2px,#F6F6F2_4px)]" />Gesperrt</span>
                  </div>
                </motion.div>
              )}

              {step === 'players' && (
                <motion.div key="players" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={t.base} className="space-y-10">
                  <section>
                    <div className="mb-4 flex items-center justify-between"><h2 className="flex items-center gap-2 text-[17px] font-semibold"><Users size={17} className="text-muted" />Spieler</h2><button onClick={() => toast('Einladungslink kopiert', 'Demo')} className="pressable text-[13.5px] font-medium text-green hover:underline">+ Spieler einladen</button></div>
                    <div className="space-y-2.5">{players.map((p, i) => <PlayerRow key={p.initials} p={p} index={i} active />)}</div>
                    <div className="mt-4 grid grid-cols-2 gap-2.5 md:grid-cols-4">
                      {[['2', 'Mitglieder'], ['2', 'Gäste'], ['16,00 €', 'Gesamt'], ['−8,00 €', 'Mitgliedervorteil']].map(([n, l]) => (
                        <div key={l} className="rounded-[12px] bg-white px-4 py-3 hairline"><div className="num text-[18px] font-semibold">{n}</div><div className="text-[12px] text-muted">{l}</div></div>
                      ))}
                    </div>
                  </section>
                  <section>
                    <h2 className="mb-4 flex items-center gap-2 text-[17px] font-semibold"><Zap size={17} className="text-muted" />Extras</h2>
                    <div className="space-y-2.5">
                      <ExtraRow icon={<Lightbulb size={17} className={cn('transition-all duration-500', floodlight && 'glow-light text-sand')} />} title="Flutlicht" sub="Automatisch 5 Minuten vor Spielbeginn aktiviert und 5 Minuten nach Spielende ausgeschaltet." checked={floodlight} onChange={setFloodlight} price="inklusive" />
                      <ExtraRow icon={<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><ellipse cx="12" cy="9" rx="6" ry="7" /><path d="M12 16v6M9 19h6" /></svg>} title="Leihschläger" sub="2 Schläger am Court hinterlegt." checked={rackets} onChange={setRackets} price="+ 4,00 €" />
                      <ExtraRow icon={<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M5 6.5c4 1.5 6 5 6 9.5M19 6.5c-4 1.5-6 5-6 9.5" /></svg>} title="Bälle" sub="Neue Dose, 3 Bälle." checked={balls} onChange={setBalls} price="+ 3,00 €" />
                    </div>
                  </section>
                </motion.div>
              )}

              {step === 'checkout' && (
                <motion.div key="checkout" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={t.base} className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-[20px] border border-line bg-surface p-6">
                    <div className="eyebrow">Buchungsdetails</div>
                    <div className="mt-4 flex items-start gap-4">
                      <div className="num flex w-14 shrink-0 flex-col items-center rounded-[12px] bg-ink py-2 text-white"><span className="text-[22px] font-semibold leading-none">{day.day}</span><span className="mt-1 text-[10px] uppercase tracking-widest text-white/60">{day.month}</span></div>
                      <div>
                        <div className="text-[17px] font-semibold">Padel Court 01</div>
                        <div className="num mt-0.5 text-[15px]">{selected?.start} – {selected?.end}</div>
                        <div className="mt-0.5 text-[13px] text-muted">{day.full} · 90 Minuten</div>
                      </div>
                    </div>
                    <div className="mt-6 border-t border-line pt-5">
                      <div className="mb-3 text-[13px] font-medium">Spieler</div>
                      <div className="flex items-center gap-3"><div className="flex -space-x-2">{players.map((p, i) => <Avatar key={p.initials} initials={p.initials} tone={i} size="sm" />)}</div><span className="text-[13px] text-muted">Lazar, Max, Jonas, Tobias</span></div>
                    </div>
                    <div className="mt-6 border-t border-line pt-5 text-[13.5px]">
                      <div className="flex items-center gap-2"><Lightbulb size={14} className={floodlight ? 'glow-light text-sand' : 'text-muted'} /><span>Flutlicht {floodlight ? 'automatisch' : 'aus'}</span></div>
                      <div className="mt-2 flex items-center gap-2 text-muted"><MapPin size={14} />Lohmühlweg 11a, 91341 Röttenbach</div>
                    </div>
                  </div>
                  <div className="rounded-[20px] border border-line bg-surface p-6">
                    <div className="flex items-center justify-between"><div className="eyebrow">Zahlung</div><span className="num text-[15px] font-semibold">{eur(price.total)}</span></div>
                    <div className="mt-4 space-y-2.5">
                      {payMethods.map((m) => {
                        const active = method === m.id
                        return (
                          <button
                            key={m.id}
                            disabled={paying && !active}
                            onClick={() => pay(m.id)}
                            className={cn('pressable flex h-14 w-full items-center justify-between rounded-[12px] border px-4 text-left text-[15px] font-medium transition-all', active ? 'border-ink bg-ink text-white' : 'border-line-2 bg-white hover:border-ink/50', paying && !active && 'opacity-40')}
                          >
                            <span className="flex items-center gap-3">{active && paying ? <Loader2 size={17} className="animate-spin" /> : active ? <Check size={17} /> : null}{active && paying ? 'Zahlung wird verarbeitet…' : `Mit ${m.label} bezahlen`}</span>
                            <span className={cn('flex items-center rounded-[6px] bg-white px-2 py-1', !active && 'bg-paper')}>{m.badge}</span>
                          </button>
                        )
                      })}
                    </div>
                    <p className="mt-5 text-[12px] leading-relaxed text-muted-2">Demo-Oberfläche. Es findet keine echte Zahlung statt. Mit Klick akzeptierst du die Platzordnung des TC Röttenbach.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT (desktop sticky) */}
          <aside className="hidden lg:col-span-5 lg:block xl:col-span-4">
            <div className="sticky top-[100px]"><Summary /></div>
          </aside>
        </div>
      </div>

      {/* Mobile sticky bar */}
      <AnimatePresence>
        {step !== 'checkout' && (
          <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} transition={t.springSoft} className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/90 backdrop-blur-xl safe-bottom lg:hidden">
            <div className="container-x flex items-center justify-between gap-4 py-3">
              <button onClick={() => setSheet(true)} className="pressable flex min-w-0 items-center gap-2 text-left">
                <div className="min-w-0">
                  <div className="num truncate text-[16px] font-semibold">{selected ? `${selected.start} – ${selected.end}` : 'Kein Slot gewählt'}</div>
                  <div className="truncate text-[12px] text-muted">{stepIndex[step] >= 1 ? `${day.short} · ${eur(price.total)}` : `${day.short} · Padel Court 01`}</div>
                </div>
                <ChevronDown size={16} className="rotate-180 text-muted" />
              </button>
              <Button size="lg" arrow disabled={step === 'select' && !canContinue} onClick={() => (step === 'select' ? setSheet(true) : setStep('checkout'))}>{step === 'select' ? 'Weiter' : 'Zur Zahlung'}</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile bottom sheet */}
      <AnimatePresence>
        {sheet && (
          <motion.div className="fixed inset-0 z-50 flex items-end lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]" onClick={() => setSheet(false)} />
            <motion.div drag="y" dragConstraints={{ top: 0 }} dragElastic={0.08} onDragEnd={(_, i) => i.offset.y > 80 && setSheet(false)} initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={t.springSoft} className="relative w-full rounded-t-[22px] bg-surface p-6 pt-3 shadow-sheet safe-bottom">
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line-2" />
              <Summary inSheet />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Page>
  )
}
