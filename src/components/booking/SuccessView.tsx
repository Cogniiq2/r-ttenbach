import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CalendarPlus, Check, Lightbulb, Navigation, Settings2, Share2 } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { AnimatedCheck } from '@/components/ui/AnimatedCheck'
import { cn } from '@/lib/cn'
import { EASE } from '@/lib/motion'
import { useToast } from '@/lib/toast'
import { useDarkNav } from '@/lib/navTheme'
import { BOOKING_ID, floodlightWindow, memberCount, payLabel, priceOf, type BookingDraft } from '@/lib/booking'
import { fmtDuration, fmtRange } from '@/lib/time'
import { fullAddress } from '@/lib/club'
import type { DayOption } from '@/lib/data'

export function SuccessView({ draft, day }: { draft: BookingDraft; day: DayOption }) {
  const { toast } = useToast()
  useDarkNav()
  const fl = floodlightWindow(draft.start, draft.end)
  const price = priceOf(draft)
  const item = (d: number) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, ease: EASE, delay: d } })
  const actions = [
    { icon: <CalendarPlus size={17} />, label: 'Zum Kalender', on: () => toast('Kalendereintrag erstellt', 'Demo · keine .ics-Datei') },
    { icon: <Share2 size={17} />, label: 'Teilen', on: () => toast('Link kopiert', 'Demo') },
    { icon: <Navigation size={17} />, label: 'Route', on: () => toast('Route geöffnet', fullAddress, 'info') },
    { icon: <Settings2 size={17} />, label: 'Buchung verwalten', to: `/buchung/${BOOKING_ID}` },
  ]
  return (
    <div className="relative min-h-dvh bg-ink text-white">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.6 }} className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_0%,rgba(49,92,70,0.5),transparent)]" />
      <div className="container-x relative grid min-h-dvh gap-14 py-28 lg:grid-cols-12 lg:items-center lg:py-32">
        <div className="lg:col-span-7">
          <motion.div {...item(0.1)} className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-green"><AnimatedCheck size={18} delay={0.35} strokeWidth={3} /></span><span className="text-[11.5px] font-medium uppercase tracking-[0.16em] text-white/50">Match confirmed</span></motion.div>
          <motion.h1 {...item(0.25)} className="display-lg mt-8">Buchung bestätigt.</motion.h1>
          <motion.p {...item(0.4)} className="mt-5 max-w-md text-[16px] leading-relaxed text-white/60">Deine Bestätigung ist unterwegs. Der Court ist für euch reserviert.</motion.p>
          <motion.div {...item(0.55)} className="mt-12 grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-[auto_1fr] sm:items-center">
            <div className="num leading-none"><div className="text-[72px] font-semibold tracking-[-0.05em] md:text-[96px]">{day.day}</div><div className="mt-2 text-[12.5px] font-medium uppercase tracking-[0.18em] text-white/50">{day.month} · {day.full.split(',')[0]}</div></div>
            <div className="sm:pl-8">
              <div className="num text-[30px] font-semibold tracking-[-0.02em] md:text-[36px]">{fmtRange(draft.start, draft.end)}</div>
              <div className="mt-1 text-[15px] text-white/65">{fmtDuration(draft.end - draft.start)} · Padel Court 01</div>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-soft/15 px-2.5 py-1 text-[12.5px] font-medium text-[#8FD0A8]"><Check size={12} strokeWidth={3} />Bezahlt · {payLabel[draft.method]} · <span className="num">{price.total.toFixed(2).replace('.', ',')} €</span></span>
                <div className="flex items-center gap-2 pl-1"><div className="flex -space-x-2">{draft.roster.map((p, i) => <Avatar key={p.initials} initials={p.initials} tone={i} size="sm" className="!ring-ink" />)}</div><span className="text-[12.5px] text-white/50">{draft.roster.length} Spieler · {memberCount(draft)} Mitglieder</span></div>
              </div>
            </div>
          </motion.div>
          <motion.div {...item(0.75)} className="mt-8 flex items-start gap-3 rounded-[14px] border border-white/10 bg-white/[0.04] px-4 py-3.5 text-[14px] text-white/75">
            <Lightbulb size={16} className={cn('mt-0.5 shrink-0', draft.floodlight ? 'glow-light text-sand' : 'text-white/40')} />
            {draft.floodlight ? <span>Flutlicht automatisch <span className="num font-medium text-white">{fl.on} – {fl.off} Uhr</span>. Fünf Minuten vor Spielbeginn an, fünf Minuten nach Spielende aus.</span> : <span>Flutlicht nicht gebucht. Du kannst es bis Spielbeginn ergänzen.</span>}
          </motion.div>
        </div>
        <motion.div {...item(0.9)} className="lg:col-span-4 lg:col-start-9">
          <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">Aktionen</div>
          <div className="mt-4 divide-y divide-white/10 border-y border-white/10">
            {actions.map((a) => {
              const cls = 'pressable group flex h-14 w-full items-center justify-between text-left text-[15px] font-medium hover:text-white'
              const inner = <><span className="flex items-center gap-3 text-white/85 group-hover:text-white"><span className="text-white/45">{a.icon}</span>{a.label}</span><ArrowRight size={16} className="text-white/35 transition-transform group-hover:translate-x-[3px] group-hover:text-white" /></>
              return a.to ? <Link key={a.label} to={a.to} state={{ draft, dayKey: day.key }} className={cls}>{inner}</Link> : <button key={a.label} onClick={a.on} className={cls}>{inner}</button>
            })}
          </div>
          <div className="num mt-4 text-[12.5px] text-white/35">Buchungsnummer {BOOKING_ID}</div>
        </motion.div>
      </div>
    </div>
  )
}
