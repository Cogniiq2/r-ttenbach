import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Clock, MapPin } from 'lucide-react'
import { Page } from '@/components/site/Page'
import { Button } from '@/components/ui/Button'
import { Photo } from '@/components/ui/Photo'
import { Pill } from '@/components/ui/Pill'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/cn'
import { EASE } from '@/lib/motion'

const heroLine = (i: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: EASE, delay: 0.35 + i * 0.1 },
})

const demoSlots = [
  { time: '18:00', end: '19:30', status: 'Belegt' as const },
  { time: '19:30', end: '21:00', status: 'Frei' as const },
  { time: '21:00', end: '22:30', status: 'Frei' as const },
]

function Availability() {
  const [selected, setSelected] = useState(1)
  const s = demoSlots[selected]
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: EASE, delay: 1.05 }}
      className="w-full rounded-[18px] border border-line bg-surface p-4 text-ink shadow-panel md:w-[400px] md:p-5"
    >
      <div className="flex items-center justify-between">
        <div className="text-[16px] font-semibold">Heute noch spielen?</div>
        <span className="flex items-center gap-1.5 text-[12px] font-medium text-green"><span className="pulse-dot size-1.5 rounded-full bg-green" />Live</span>
      </div>
      <div className="mt-3.5 grid grid-cols-3 gap-2">
        {demoSlots.map((d, i) => {
          const busy = d.status === 'Belegt'
          const active = selected === i
          return (
            <button
              key={d.time}
              disabled={busy}
              onClick={() => setSelected(i)}
              className={cn(
                'pressable relative flex h-[60px] flex-col items-start justify-center rounded-[12px] border px-3 text-left',
                busy && 'cursor-not-allowed border-line bg-paper/60 text-muted-2',
                !busy && !active && 'border-line bg-white hover:border-green/60 hover:bg-green-soft/40',
                active && 'border-green bg-green text-white',
              )}
            >
              <span className="num text-[15px] font-semibold leading-none">{d.time}</span>
              <span className={cn('mt-1.5 text-[11.5px] font-medium', busy ? 'text-muted-2' : active ? 'text-white/80' : 'text-green')}>{d.status}</span>
            </button>
          )
        })}
      </div>
      <div className="mt-4 flex items-end justify-between gap-3 border-t border-line pt-4">
        <div>
          <div className="eyebrow whitespace-nowrap">Nächster freier Slot</div>
          <motion.div key={selected} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }} className="num mt-1 text-[15.5px] font-semibold">{s.time} – {s.end}</motion.div>
          <div className="text-[12.5px] text-muted">Padel Court Röttenbach</div>
        </div>
        <Button to="/padel/buchen" variant="dark" size="md" arrow>Jetzt buchen</Button>
      </div>
    </motion.div>
  )
}

function Hero() {
  return (
    <section className="relative isolate min-h-[92vh] overflow-hidden bg-ink text-white">
      <motion.div initial={{ scale: 1.035 }} animate={{ scale: 1 }} transition={{ duration: 1.8, ease: EASE }} className="absolute inset-0">
        <Photo variant="padel" className="h-full w-full" zoom={false} hideCaption />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/25" />
      <div className="container-wide relative flex min-h-[92vh] flex-col justify-end pb-8 pt-32 md:pb-14">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h1 className="display-xl">
              <motion.span className="block" {...heroLine(0)}>Tennis.</motion.span>
              <motion.span className="block" {...heroLine(1)}>Padel.</motion.span>
              <motion.span className="block text-white/85" {...heroLine(2)}>Röttenbach.</motion.span>
            </h1>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.72 }} className="mt-6 max-w-md text-[17px] leading-relaxed text-white/75 md:text-[19px]">
              Sport, Gemeinschaft und echte Leidenschaft für den Court.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.85 }} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button to="/padel/buchen" variant="light" size="lg" arrow>Padelplatz buchen</Button>
              <Button to="/verein" variant="outline-light" size="lg">Verein entdecken</Button>
            </motion.div>
            <motion.dl initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: EASE, delay: 1.0 }} className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-[13.5px] text-white/60 md:mt-14">
              {[['6', 'Tennisplätze'], ['1', 'Padel Court'], ['269', 'Mitglieder']].map(([n, l]) => (
                <div key={l} className="flex items-baseline gap-1.5"><dt className="num text-[15px] font-semibold text-white">{n}</dt><dd>{l}</dd></div>
              ))}
            </motion.dl>
          </div>
          <div className="lg:col-span-5 lg:flex lg:justify-end">
            <Availability />
          </div>
        </div>
      </div>
    </section>
  )
}

function Intro() {
  return (
    <section className="section">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-7">
          <div className="eyebrow">Der Verein</div>
          <h2 className="display-md mt-5">Seit Jahren verbindet uns Tennis.<br className="hidden md:block" /> Jetzt wächst auch Padel.</h2>
          <p className="lede mt-7 max-w-lg">Ein Verein für Wettkampf, Freizeit, Nachwuchs und Gemeinschaft. Sechs Sandplätze, ein Padel Court, ein Clubhaus und Menschen, die gerne hier sind.</p>
          <div className="mt-8 flex gap-3">
            <Button to="/verein" variant="secondary" arrow>Über den Verein</Button>
          </div>
        </Reveal>
        <div className="grid grid-cols-5 gap-4 lg:col-span-5">
          <Reveal delay={0.1} className="group col-span-3 mt-10">
            <Photo variant="club" className="aspect-[4/5] rounded-[20px]" caption="Clubhaus" />
          </Reveal>
          <Reveal delay={0.2} className="group col-span-2">
            <Photo variant="clay" className="aspect-[3/4] rounded-[20px]" caption="Platz 3" />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function SportCard({ to, title, sub, variant, meta }: { to: string; title: string; sub: string; variant: 'tennis' | 'padel'; meta: string[] }) {
  return (
    <Link to={to} className="group relative block overflow-hidden rounded-[22px] bg-ink text-white">
      <Photo variant={variant} className="aspect-[4/5] md:aspect-[5/6] lg:aspect-[4/5]" hideCaption />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        <div className="flex flex-wrap gap-2">{meta.map((m) => <span key={m} className="rounded-full border border-white/25 px-2.5 py-1 text-[11.5px] font-medium text-white/85 backdrop-blur-sm">{m}</span>)}</div>
        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <h3 className="display-sm transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[3px]">{title}</h3>
            <p className="mt-1.5 text-[15px] text-white/70">{sub}</p>
          </div>
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-ink opacity-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:opacity-100 translate-x-2"><ArrowUpRight size={20} /></span>
        </div>
      </div>
    </Link>
  )
}

function Sports() {
  return (
    <section className="section-tight">
      <div className="container-wide">
        <Reveal className="mb-10 flex items-end justify-between md:mb-14">
          <div>
            <div className="eyebrow">Zwei Sportarten</div>
            <h2 className="display-md mt-4">Wähle deinen Court.</h2>
          </div>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          <Reveal><SportCard to="/tennis" title="Tennis" sub="Sechs Sandplätze, Mannschaften, Training und Breitensport." variant="tennis" meta={['6 Sandplätze', 'Mannschaften', 'Jugend']} /></Reveal>
          <Reveal delay={0.1}><SportCard to="/padel" title="Padel" sub="Ein Court, ständig ausgebucht. Online buchen, direkt spielen." variant="padel" meta={['1 Court', 'Online buchbar', 'Flutlicht']} /></Reveal>
        </div>
      </div>
    </section>
  )
}

const padelDay = [
  { t: '08:00', s: 1 }, { t: '09:30', s: 0 }, { t: '11:00', s: 0 }, { t: '12:30', s: 2 }, { t: '14:00', s: 0 }, { t: '15:30', s: 1 }, { t: '17:00', s: 0 }, { t: '18:30', s: 1 }, { t: '20:00', s: 0 },
]

function PadelFeature() {
  return (
    <section className="section">
      <div className="container-x grid items-center gap-12 lg:grid-cols-12">
        <Reveal className="order-2 lg:order-1 lg:col-span-5">
          <div className="rounded-[20px] border border-line bg-surface p-5 shadow-soft md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[15px] font-semibold">Padel Court 01</div>
                <div className="text-[12.5px] text-muted">Samstag, 26. September</div>
              </div>
              <Pill tone="green" dot>Geöffnet bis 22:00</Pill>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {padelDay.map((d, i) => (
                <motion.div
                  key={d.t}
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.1 + i * 0.04 }}
                  className={cn('num flex h-[52px] flex-col justify-center rounded-[10px] border px-3 text-[13.5px] font-medium', d.s === 0 ? 'border-line bg-white text-ink' : d.s === 1 ? 'border-transparent bg-paper text-muted-2' : 'border-sand-line bg-sand-soft text-[#7A5A22]')}
                >
                  {d.t}
                  <span className="text-[11px] font-normal">{d.s === 0 ? 'Frei' : d.s === 1 ? 'Belegt' : 'Training'}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-[13px] text-muted">
              <span className="flex items-center gap-1.5"><Clock size={14} />90 Minuten pro Slot</span>
              <span className="num font-medium text-ink">86 % Auslastung</span>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="order-1 lg:order-2 lg:col-span-6 lg:col-start-7">
          <div className="eyebrow">Padel</div>
          <h2 className="display-md mt-5">Ein Court.<br />Immer mehr Begeisterung.</h2>
          <ul className="mt-8 space-y-3 text-[19px] font-medium tracking-[-0.01em] md:text-[22px]">
            {['Hohe Auslastung.', 'Einfach buchen.', 'Direkt spielen.'].map((l, i) => (
              <motion.li key={l} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE, delay: 0.2 + i * 0.1 }} className="flex items-center gap-3">
                <span className="size-1.5 rounded-full bg-green" />{l}
              </motion.li>
            ))}
          </ul>
          <div className="mt-10 flex gap-3">
            <Button to="/padel" variant="primary" size="lg" arrow>Padel entdecken</Button>
            <Button to="/padel/buchen" variant="ghost" size="lg">Court buchen</Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function EventFeature() {
  return (
    <section className="section-tight">
      <div className="container-wide">
        <Reveal>
          <Link to="/events/jugendturnier" className="group relative block overflow-hidden rounded-[24px] bg-ink text-white">
            <Photo variant="youth" className="aspect-[4/5] sm:aspect-[16/10] lg:aspect-[21/9]" hideCaption />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10 lg:p-14">
              <div className="flex items-center gap-2">
                <Pill tone="dark" className="!border-white/20 !bg-white/10 !text-white backdrop-blur-sm">Jugend</Pill>
                <Pill tone="dark" className="!border-white/20 !bg-white/10 !text-white backdrop-blur-sm">3 Tage</Pill>
              </div>
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="eyebrow !text-white/60">Nächstes Event</div>
                  <h3 className="display-md mt-3 max-w-xl">42. Röttenbacher Jugendturnier</h3>
                  <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[14.5px] text-white/75">
                    <span className="flex items-center gap-2"><Clock size={15} />18.–20. September</span>
                    <span className="flex items-center gap-2"><MapPin size={15} />Gesamte Anlage</span>
                  </div>
                </div>
                <span className="pressable inline-flex h-[52px] items-center gap-2 self-start rounded-btn bg-white px-6 text-[15.5px] font-medium text-ink group-hover:bg-paper">
                  Event ansehen <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-[3px]" />
                </span>
              </div>
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

const community = [
  { title: 'Mannschaften', text: 'Von Herren 30 bis Damen 40. Punktspiele, Ehrgeiz und Teamgeist.', variant: 'tennis' as const, span: 'md:col-span-3 md:row-span-2', ratio: 'aspect-[4/5] md:aspect-auto' },
  { title: 'Nachwuchs', text: 'Training ab sechs Jahren, Turniere und Camps.', variant: 'youth' as const, span: 'md:col-span-3', ratio: 'aspect-[16/10]' },
  { title: 'Freizeitspieler', text: 'Ohne Druck, ohne Termin.', variant: 'people' as const, span: 'md:col-span-1', ratio: 'aspect-[4/5] md:aspect-[3/4]' },
  { title: 'Padel', text: 'Die schnellste Community im Verein.', variant: 'padel' as const, span: 'md:col-span-1', ratio: 'aspect-[4/5] md:aspect-[3/4]' },
  { title: 'Events', text: 'Saisonstart, Clubmeisterschaft, Padel Night.', variant: 'night' as const, span: 'md:col-span-1', ratio: 'aspect-[4/5] md:aspect-[3/4]' },
]

function Community() {
  return (
    <section className="section">
      <div className="container-wide">
        <Reveal className="max-w-2xl">
          <div className="eyebrow">Gemeinschaft</div>
          <h2 className="display-md mt-4">Ein Verein, viele Gesichter.</h2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-6 md:grid-flow-dense">
          {community.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06} className={cn('group relative overflow-hidden rounded-[20px] text-white', c.span)}>
              <Photo variant={c.variant} className={cn('h-full w-full', c.ratio, c.span.includes('row-span-2') && 'md:absolute md:inset-0')} hideCaption />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                <div className={cn('font-semibold tracking-[-0.01em]', c.span.includes('row-span-2') ? 'text-[26px]' : 'text-[17px]')}>{c.title}</div>
                <p className="mt-1 max-w-xs text-[13px] leading-snug text-white/70">{c.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

const sponsors = ['Sparkasse Erlangen', 'Brauerei Weller', 'Autohaus Kern', 'Raiffeisenbank', 'Bäckerei Hofmann', 'Physio Röttenbach']

function Sponsors() {
  return (
    <section className="border-t border-line py-14 md:py-20">
      <div className="container-x">
        <Reveal className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="eyebrow shrink-0">Partner des Vereins</div>
          <div className="no-scrollbar flex gap-x-8 gap-y-3 overflow-x-auto md:flex-wrap md:justify-end md:overflow-visible">
            {sponsors.map((s) => (
              <span key={s} className="shrink-0 whitespace-nowrap text-[15px] font-semibold tracking-[-0.01em] text-ink/35 transition-colors duration-300 hover:text-ink">{s}</span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function Home() {
  return (
    <Page>
      <Hero />
      <Intro />
      <Sports />
      <PadelFeature />
      <EventFeature />
      <Community />
      <Sponsors />
    </Page>
  )
}
