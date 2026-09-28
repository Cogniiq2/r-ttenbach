import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Lightbulb, MapPin } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { AnimatedCheck } from '@/components/ui/AnimatedCheck'
import { eur } from '@/components/ui/AnimatedNumber'
import { cn } from '@/lib/cn'
import { t } from '@/lib/motion'
import { floodlightWindow, memberCount, payLabel, priceOf, type BookingDraft, type PayMethod } from '@/lib/booking'
import { fmtDuration, fmtRange } from '@/lib/time'
import { fullAddress } from '@/lib/club'
import type { DayOption } from '@/lib/data'
import { Dots } from './PlayersStep'

export const AppleMark = () => <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden><path d="M16.7 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.3 1.2 9.7.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.6-1-2.6-3.8zM14.3 5.4c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.2-.6 2.8-1.4z" /></svg>
const alt: { id: PayMethod; badge: ReactNode }[] = [
  { id: 'paypal', badge: <span className="text-[14px] font-bold italic tracking-[-0.02em]"><span className="text-[#253B80]">Pay</span><span className="text-[#179BD7]">Pal</span></span> },
  { id: 'card', badge: <span className="flex items-center gap-1"><span className="h-3.5 w-5 rounded-[3px] bg-gradient-to-br from-[#EB001B] to-[#F79E1B] opacity-85" /><span className="h-3.5 w-5 rounded-[3px] bg-[#1A1F71] opacity-85" /></span> },
  { id: 'klarna', badge: <span className="rounded-[4px] bg-[#FFB3C7] px-1.5 py-0.5 text-[11px] font-bold text-ink">Klarna.</span> },
]

export type PayState = 'idle' | 'processing' | 'done'

export function PayButton({ state, method, total, onClick }: { state: PayState; method: PayMethod; total: number; onClick: () => void }) {
  return (
    <motion.button layout onClick={onClick} disabled={state !== 'idle'} className={cn('pressable relative flex h-[52px] w-full items-center justify-center overflow-hidden rounded-btn text-[15.5px] font-medium text-white transition-colors', state === 'done' ? 'bg-green' : 'bg-ink hover:bg-ink-2')}>
      <AnimatePresence mode="wait" initial={false}>
        {state === 'idle' && <motion.span key="i" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }} className="flex items-center gap-2">{method === 'applepay' && <AppleMark />}Buchung bestätigen · <span className="num">{eur(total)}</span></motion.span>}
        {state === 'processing' && <motion.span key="p" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }} className="flex items-center gap-2.5"><Dots />Zahlung wird verarbeitet</motion.span>}
        {state === 'done' && <motion.span key="d" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={t.spring} className="flex items-center gap-2"><AnimatedCheck size={18} strokeWidth={3} />Bestätigt</motion.span>}
      </AnimatePresence>
      {state === 'processing' && <motion.span className="absolute inset-x-0 bottom-0 h-[2px] bg-white/60" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.9, ease: 'linear' }} style={{ originX: 0 }} />}
    </motion.button>
  )
}

export function CheckoutStep({ draft, day, setMethod, pay, onConfirm }: { draft: BookingDraft; day: DayOption; setMethod: (m: PayMethod) => void; pay: PayState; onConfirm: () => void }) {
  const price = priceOf(draft)
  const fl = floodlightWindow(draft.start, draft.end)
  const members = memberCount(draft)
  return (
    <div className="grid gap-12 md:grid-cols-12">
      <div className="md:col-span-6">
        <div className="eyebrow">Übersicht</div>
        <div className="mt-5 flex items-start gap-5">
          <div className="num leading-none"><div className="text-[56px] font-semibold tracking-[-0.05em]">{day.day}</div><div className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">{day.month}</div></div>
          <div className="pt-1.5">
            <div className="num text-[22px] font-semibold tracking-[-0.02em]">{fmtRange(draft.start, draft.end)}</div>
            <div className="mt-0.5 text-[14px] text-muted">{day.full} · {fmtDuration(draft.end - draft.start)}</div>
            <div className="mt-0.5 text-[14px] text-muted">Padel Court 01</div>
          </div>
        </div>
        <div className="mt-8 divide-y divide-line border-y border-line text-[14.5px]">
          <div className="flex items-center justify-between py-3.5"><span className="text-muted">Spieler</span><div className="flex items-center gap-2.5"><div className="flex -space-x-2">{draft.roster.map((p, i) => <Avatar key={p.initials} initials={p.initials} tone={i} size="sm" />)}</div><span className="font-medium">{draft.roster.length} · {members} {members === 1 ? 'Mitglied' : 'Mitglieder'}</span></div></div>
          <div className="flex items-center justify-between py-3.5"><span className="text-muted">Flutlicht</span><span className={cn('flex items-center gap-2 font-medium', draft.floodlight && 'text-[#7A5A22]')}><Lightbulb size={14} className={draft.floodlight ? 'glow-light text-sand' : 'text-muted'} /><span className="num">{draft.floodlight ? `${fl.on} – ${fl.off} Uhr` : 'aus'}</span></span></div>
          <div className="flex items-center justify-between py-3.5"><span className="text-muted">Extras</span><span className="font-medium">{[draft.rackets && 'Leihschläger', draft.balls && 'Bälle'].filter(Boolean).join(', ') || 'keine'}</span></div>
          <div className="flex items-center justify-between py-3.5"><span className="text-muted">Ort</span><span className="flex items-center gap-1.5 font-medium"><MapPin size={14} className="text-muted" />{fullAddress}</span></div>
        </div>
      </div>
      <div className="md:col-span-6">
        <div className="flex items-baseline justify-between"><div className="eyebrow">Zahlung</div><span className="num text-[15px] font-semibold">{eur(price.total)}</span></div>
        <button onClick={() => setMethod('applepay')} aria-pressed={draft.method === 'applepay'} className={cn('pressable mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-[12px] text-[17px] font-semibold tracking-[-0.02em] transition-[box-shadow,background-color]', draft.method === 'applepay' ? 'bg-ink text-white' : 'bg-white text-ink hairline hover:shadow-[inset_0_0_0_1px_var(--color-ink)]')}>
          <AppleMark /> Pay{draft.method === 'applepay' && <Check size={16} className="ml-2 text-white/60" />}
        </button>
        <div className="my-5 flex items-center gap-3 text-[12px] text-muted-2"><span className="h-px flex-1 bg-line" />oder<span className="h-px flex-1 bg-line" /></div>
        <div className="grid grid-cols-3 gap-2">
          {alt.map((m) => {
            const on = draft.method === m.id
            return <button key={m.id} onClick={() => setMethod(m.id)} aria-pressed={on} className={cn('pressable flex h-[68px] flex-col items-center justify-center gap-1.5 rounded-[12px] bg-white text-[12.5px] font-medium transition-[box-shadow]', on ? 'shadow-[inset_0_0_0_2px_var(--color-ink)]' : 'hairline hover:shadow-[inset_0_0_0_1px_var(--color-ink)]')}><span className="flex h-6 items-center">{m.badge}</span>{payLabel[m.id]}</button>
          })}
        </div>
        <AnimatePresence initial={false}>
          {draft.method === 'card' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={t.fast} className="overflow-hidden">
              <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_92px_72px]">
                {['Kartennummer', 'MM / JJ', 'CVC'].map((p) => <input key={p} placeholder={p} aria-label={p} className="num h-12 rounded-[12px] bg-white px-3.5 text-[15px] outline-none hairline placeholder:text-muted-2 focus:shadow-[inset_0_0_0_1px_var(--color-green)]" />)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="mt-6 lg:hidden"><PayButton state={pay} method={draft.method} total={price.total} onClick={onConfirm} /></div>
        <p className="mt-5 text-[12px] leading-relaxed text-muted-2">Demo. Es findet keine Zahlung statt. Mit der Bestätigung akzeptierst du die Platzordnung des TC Röttenbach.</p>
      </div>
    </div>
  )
}
