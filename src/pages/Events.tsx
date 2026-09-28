import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Clock, MapPin } from 'lucide-react'
import { Page } from '@/components/site/Page'
import { Button } from '@/components/ui/Button'
import { Photo, type PhotoVariant } from '@/components/ui/Photo'
import { Pill } from '@/components/ui/Pill'
import { Modal } from '@/components/ui/Modal'
import { Reveal } from '@/components/ui/Reveal'
import { events, type ClubEvent, type EventCategory } from '@/lib/data'
import { cn } from '@/lib/cn'
import { EASE, t } from '@/lib/motion'

const filters: ('Alle' | EventCategory)[] = ['Alle', 'Tennis', 'Padel', 'Jugend', 'Verein']
const toneToPhoto: Record<ClubEvent['tone'], PhotoVariant> = { green: 'padel', clay: 'clay', dark: 'night', sand: 'club', moss: 'tennis' }

/** "18.–20. September 2026" → { day: "18–20", month: "Sep" } */
function bigDate(date: string) {
  const m = date.match(/^(\d{1,2})\.(?:–(\d{1,2})\.)?\s*([A-Za-zä]+)/)
  if (!m) return { day: 'Do', month: 'wöchentlich' }
  return { day: m[2] ? `${m[1]}–${m[2]}` : m[1], month: m[3].slice(0, 3) }
}

export function OccupancyRow({ o }: { o: ClubEvent['occupancy'][number] }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 text-[14px]">
      <span className="font-medium">{o.label}</span>
      <span className={cn('flex items-center gap-2 text-right', o.kind === 'blocked' ? 'text-muted' : o.kind === 'notice' ? 'text-[#7A5A22]' : 'text-green')}>
        <span className={cn('size-1.5 rounded-full', o.kind === 'blocked' ? 'bg-muted-2' : o.kind === 'notice' ? 'bg-sand' : 'bg-green')} />{o.value}
      </span>
    </div>
  )
}

export function EventDetail({ e }: { e: ClubEvent }) {
  const d = bigDate(e.date)
  return (
    <div>
      <Photo variant={toneToPhoto[e.tone]} className="aspect-[16/9] sm:rounded-t-[20px]" zoom={false} />
      <div className="p-6 md:p-8">
        <div className="flex items-start gap-6">
          <div className="num leading-none"><div className="text-[44px] font-semibold tracking-[-0.04em]">{d.day}</div><div className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">{d.month}</div></div>
          <div className="pt-1">
            <div className="flex items-center gap-2"><Pill tone={e.category === 'Padel' ? 'green' : 'neutral'}>{e.category}</Pill></div>
            <h2 className="mt-3 text-[26px] font-semibold leading-tight tracking-[-0.025em]">{e.title}</h2>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[13.5px] text-muted"><span className="flex items-center gap-1.5"><Clock size={13} />{e.time}</span><span className="flex items-center gap-1.5"><MapPin size={13} />{e.location}</span></div>
          </div>
        </div>
        <p className="mt-6 text-[15.5px] leading-relaxed">{e.description}</p>
        <div className="mt-7 rounded-[14px] bg-paper px-5 py-1">
          <div className="border-b border-line py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted">Platzbelegung</div>
          <div className="divide-y divide-line">{e.occupancy.map((o) => <OccupancyRow key={o.label} o={o} />)}</div>
        </div>
        <div className="mt-6 flex gap-2.5">
          {e.occupancy.some((o) => o.label.includes('Padel') && o.kind !== 'blocked') && <Button to="/padel/buchen" arrow>Padel buchen</Button>}
          <Button variant="secondary">In den Kalender</Button>
        </div>
      </div>
    </div>
  )
}

function EventRow({ e, onOpen }: { e: ClubEvent; onOpen: () => void }) {
  const d = bigDate(e.date)
  return (
    <motion.button layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={t.layout} onClick={onOpen} className="group grid w-full grid-cols-[72px_1fr] items-center gap-5 border-t border-line py-6 text-left md:grid-cols-[120px_1fr_180px_40px] md:gap-8 md:py-7">
      <div className="num leading-none"><div className="text-[34px] font-semibold tracking-[-0.04em] md:text-[44px]">{d.day}</div><div className="mt-1 text-[10.5px] font-medium uppercase tracking-[0.18em] text-muted">{d.month}</div></div>
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-[12px] text-muted"><span className={cn('size-1.5 rounded-full', e.category === 'Padel' ? 'bg-green' : e.category === 'Jugend' ? 'bg-clay' : e.category === 'Verein' ? 'bg-sand' : 'bg-muted-2')} />{e.category} · {e.time}</div>
        <h3 className="mt-1.5 text-[20px] font-semibold leading-tight tracking-[-0.02em] transition-colors group-hover:text-green md:text-[24px]">{e.title}</h3>
        <p className="mt-1.5 line-clamp-1 text-[14px] text-muted md:hidden">{e.location}</p>
      </div>
      <div className="hidden md:block"><Photo variant={toneToPhoto[e.tone]} className="aspect-[16/10] rounded-[12px]" /></div>
      <span className="hidden size-10 place-items-center rounded-full border border-line text-muted transition-all duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-white md:grid"><ArrowUpRight size={16} /></span>
    </motion.button>
  )
}

export function Events() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<(typeof filters)[number]>('Alle')
  const [open, setOpen] = useState<ClubEvent | null>(null)
  useEffect(() => { setOpen(id ? events.find((e) => e.id === id) ?? null : null) }, [id])
  const list = useMemo(() => events.filter((e) => !e.featured && (filter === 'Alle' || e.category === filter)), [filter])

  return (
    <Page className="pt-[68px] md:pt-[76px]">
      <section className="container-wide pt-12 md:pt-20">
        <Reveal className="max-w-3xl"><div className="eyebrow">Events</div><h1 className="display-lg mt-4">Was bei uns passiert.</h1></Reveal>
        <Reveal delay={0.1} className="mt-12 md:mt-16">
          <button onClick={() => navigate('/events/jugendturnier')} className="group grid w-full overflow-hidden rounded-[24px] bg-ink text-left text-white lg:grid-cols-12">
            <div className="relative lg:col-span-8"><Photo variant="youth" className="aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[540px]" /><div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-ink/40" /></div>
            <div className="flex flex-col justify-between p-7 md:p-10 lg:col-span-4">
              <div className="num leading-none"><div className="text-[80px] font-semibold tracking-[-0.05em] md:text-[112px]">18<span className="text-white/35">–</span>20</div><div className="mt-2 text-[12.5px] font-medium uppercase tracking-[0.2em] text-white/55">Sep 2026 · Jugend</div></div>
              <div className="mt-16"><h2 className="text-[28px] font-semibold leading-tight tracking-[-0.025em] md:text-[34px]">42. Röttenbacher Jugendturnier</h2><p className="mt-3 text-[15px] text-white/60">Drei Tage Nachwuchstennis am Lohmühlweg. Details auf tennis-roettenbach.de.</p><div className="mt-6 flex items-center gap-2 text-[14.5px] font-medium">Event ansehen<ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-[3px]" /></div></div>
            </div>
          </button>
        </Reveal>
      </section>

      <section className="container-wide pb-[96px] pt-[80px] md:pb-[140px] md:pt-[120px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="display-sm">Kalender</h2>
          <LayoutGroup id="event-filter">
            <div className="no-scrollbar -mx-5 flex gap-1 overflow-x-auto px-5 md:mx-0 md:px-0" role="tablist">
              {filters.map((f) => (
                <button key={f} role="tab" aria-selected={filter === f} onClick={() => setFilter(f)} className={cn('pressable relative h-10 shrink-0 rounded-full px-4 text-[14px] font-medium transition-colors', filter === f ? 'text-white' : 'text-ink-2 hover:bg-ink/[0.05]')}>
                  {filter === f && <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-ink" transition={t.spring} />}
                  <span className="relative">{f}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
        </div>
        <motion.div layout className="mt-8 border-b border-line">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((e) => <EventRow key={e.id} e={e} onOpen={() => navigate(`/events/${e.id}`)} />)}
            {list.length === 0 && <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-t border-line py-14 text-[15px] text-muted">Keine weiteren Events in dieser Kategorie.</motion.div>}
          </AnimatePresence>
        </motion.div>
      </section>

      <Modal open={!!open} onClose={() => navigate('/events')} className="sm:max-w-[640px]">
        {open && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, ease: EASE }}><EventDetail e={open} /></motion.div>}
      </Modal>
    </Page>
  )
}
