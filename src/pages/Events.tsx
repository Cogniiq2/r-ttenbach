import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { ArrowUpRight, Clock, MapPin } from 'lucide-react'
import { Page } from '@/components/site/Page'
import { PageHero } from '@/components/site/PageHero'
import { Button } from '@/components/ui/Button'
import { Photo, type PhotoVariant } from '@/components/ui/Photo'
import { Pill } from '@/components/ui/Pill'
import { Modal } from '@/components/ui/Modal'
import { Reveal } from '@/components/ui/Reveal'
import { events, type ClubEvent, type EventCategory } from '@/lib/data'
import { cn } from '@/lib/cn'
import { t } from '@/lib/motion'

const filters: ('Alle' | EventCategory)[] = ['Alle', 'Tennis', 'Padel', 'Jugend', 'Verein']
const toneToPhoto: Record<ClubEvent['tone'], PhotoVariant> = { green: 'padel', clay: 'clay', dark: 'night', sand: 'club', moss: 'tennis' }

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

function EventCard({ e, onOpen }: { e: ClubEvent; onOpen: () => void }) {
  return (
    <motion.button layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={t.layout} onClick={onOpen} className="group flex flex-col overflow-hidden rounded-[18px] border border-line bg-white text-left transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-[2px] hover:border-ink/25 hover:shadow-panel active:translate-y-0 active:scale-[0.99]">
      <Photo variant={toneToPhoto[e.tone]} className="aspect-[16/10]" hideCaption />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between"><Pill tone={e.category === 'Padel' ? 'green' : e.category === 'Jugend' ? 'clay' : e.category === 'Verein' ? 'sand' : 'neutral'}>{e.category}</Pill><span className="text-[12.5px] text-muted">{e.date}</span></div>
        <div className="mt-3 flex items-start justify-between gap-3">
          <h3 className="text-[19px] font-semibold tracking-[-0.015em] transition-transform duration-300 group-hover:-translate-y-[2px]">{e.title}</h3>
          <ArrowUpRight size={18} className="mt-1 shrink-0 text-muted-2 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
        </div>
        <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-muted">{e.description}</p>
        <div className="mt-4 flex items-center gap-4 border-t border-line pt-4 text-[12.5px] text-muted"><span className="flex items-center gap-1.5"><Clock size={13} />{e.time}</span><span className="flex items-center gap-1.5"><MapPin size={13} />{e.location}</span></div>
      </div>
    </motion.button>
  )
}

export function EventDetail({ e }: { e: ClubEvent }) {
  return (
    <div>
      <Photo variant={toneToPhoto[e.tone]} className="aspect-[16/9] sm:rounded-t-[20px]" hideCaption zoom={false} />
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-2"><Pill tone={e.category === 'Padel' ? 'green' : 'neutral'}>{e.category}</Pill><Pill tone="outline">{e.location}</Pill></div>
        <h2 className="display-sm mt-4">{e.title}</h2>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[14px] text-muted"><span className="flex items-center gap-2"><Clock size={14} />{e.date} · {e.time}</span><span className="flex items-center gap-2"><MapPin size={14} />Lohmühlweg 11a</span></div>
        <p className="mt-5 text-[15.5px] leading-relaxed">{e.description}</p>
        <div className="mt-7 rounded-[14px] border border-line bg-paper px-5 py-2">
          <div className="border-b border-line py-3 text-[12px] font-medium uppercase tracking-[0.12em] text-muted">Platzbelegung</div>
          <div className="divide-y divide-line">{e.occupancy.map((o) => <OccupancyRow key={o.label} o={o} />)}</div>
        </div>
        <div className="mt-6 flex gap-2.5">
          {e.occupancy.some((o) => o.label.includes('Padel') && o.kind !== 'blocked') && <Button to="/padel/buchen" arrow>Padel buchen</Button>}
          <Button variant="secondary">Zum Kalender</Button>
        </div>
      </div>
    </div>
  )
}

export function Events() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<(typeof filters)[number]>('Alle')
  const [open, setOpen] = useState<ClubEvent | null>(null)
  useEffect(() => { setOpen(id ? events.find((e) => e.id === id) ?? null : null) }, [id])
  const list = useMemo(() => events.filter((e) => filter === 'Alle' || e.category === filter), [filter])
  const featured = events.find((e) => e.featured)!

  return (
    <Page>
      <PageHero eyebrow="Events" title="Was bei uns passiert." lede="Turniere, Mannschaftsspiele, Saisonfeste und Padel Nights. Alles, was den Verein lebendig macht." variant="youth" />

      <section className="section-tight">
        <div className="container-wide">
          <Reveal>
            <button onClick={() => navigate('/events/jugendturnier')} className="group relative block w-full overflow-hidden rounded-[24px] bg-ink text-left text-white">
              <Photo variant="youth" className="aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]" hideCaption />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 lg:p-14">
                <div className="eyebrow !text-white/60">Highlight</div>
                <h2 className="display-md mt-3 max-w-2xl">{featured.title}</h2>
                <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[14.5px] text-white/75"><span>{featured.date}</span><span>{featured.time}</span><span>{featured.location}</span></div>
              </div>
            </button>
          </Reveal>

          <div className="mt-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 className="display-sm">Alle Events</h2>
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

          <motion.div layout className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {list.map((e) => <EventCard key={e.id} e={e} onOpen={() => navigate(`/events/${e.id}`)} />)}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <Modal open={!!open} onClose={() => navigate('/events')} className="sm:max-w-[640px]">
        {open && <EventDetail e={open} />}
      </Modal>
    </Page>
  )
}
