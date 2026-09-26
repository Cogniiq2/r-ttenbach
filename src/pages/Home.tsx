import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Page } from '@/components/site/Page'
import { Button } from '@/components/ui/Button'
import { Photo } from '@/components/ui/Photo'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/cn'
import { EASE } from '@/lib/motion'

/* Launch sequence: background visible at 0ms, lines at 100/190/280, copy 420, CTA 500, rail 620. */
const at = (ms: number, y = 22) => ({
  initial: { opacity: 0, y, clipPath: 'inset(0 0 100% 0)' },
  animate: { opacity: 1, y: 0, clipPath: 'inset(0 0 -20% 0)' },
  transition: { duration: 0.9, ease: EASE, delay: ms / 1000 },
})

const rail = [
  { time: '18:00', end: '19:30', status: 'Belegt' as const },
  { time: '19:30', end: '21:00', status: 'Frei' as const },
  { time: '21:00', end: '22:30', status: 'Frei' as const },
]

function Hero() {
  const [sel, setSel] = useState(1)
  const s = rail[sel]
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-ink text-white">
      <motion.div initial={{ scale: 1.03 }} animate={{ scale: 1 }} transition={{ duration: 2.2, ease: EASE }} className="absolute inset-0">
        <Photo variant="padel" className="h-full w-full" zoom={false} />
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(17,19,17,0.92)_0%,rgba(17,19,17,0.55)_32%,rgba(17,19,17,0.18)_60%,rgba(17,19,17,0.25)_100%)]" />

      <div className="container-wide relative flex min-h-[100svh] flex-col justify-end pb-6 pt-28 md:pb-10">
        <div className="mb-10 md:mb-16 lg:mb-20">
          <h1 className="display-xl">
            <motion.span className="block" {...at(100)}>Tennis.</motion.span>
            <motion.span className="block" {...at(190)}>Padel.</motion.span>
            <motion.span className="block text-white/70" {...at(280)}>Röttenbach.</motion.span>
          </h1>
          <div className="mt-8 flex flex-col gap-6 md:mt-10 md:flex-row md:items-end md:justify-between">
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.42 }} className="max-w-[26rem] text-[17px] leading-[1.45] text-white/75 md:text-[19px]">
              Sport, Gemeinschaft und echte Leidenschaft für den Court.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.5 }} className="flex flex-col gap-3 sm:flex-row">
              <Button to="/padel/buchen" variant="light" size="lg" arrow className="w-full sm:w-auto">Padelplatz buchen</Button>
              <Button to="/verein" variant="outline-light" size="lg" className="w-full sm:w-auto">Verein entdecken</Button>
            </motion.div>
          </div>
        </div>

        {/* Information rail: facts + live availability, part of the composition */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.62 }} className="grid gap-y-6 border-t border-white/15 pt-6 md:grid-cols-12 md:gap-x-8">
          <dl className="flex flex-wrap gap-x-6 gap-y-2 md:col-span-4 md:flex-col md:gap-4">
            {[['6', 'Tennisplätze'], ['1', 'Padel Court'], ['269', 'Mitglieder']].map(([n, l]) => (
              <div key={l} className="flex items-baseline gap-2 whitespace-nowrap"><dt className="num text-[22px] font-semibold leading-none">{n}</dt><dd className="text-[13px] text-white/55">{l}</dd></div>
            ))}
          </dl>
          <div className="md:col-span-8">
            <div className="flex items-center justify-between">
              <div className="text-[13px] font-medium text-white/60">Heute noch spielen? <span className="hidden text-white/35 sm:inline">· Padel Court 01</span></div>
              <span className="flex items-center gap-1.5 text-[12px] font-medium text-white/70"><span className="pulse-dot size-1.5 rounded-full bg-[#8FD0A8] text-[#8FD0A8]" />Live</span>
            </div>
            <div className="mt-3 grid grid-cols-[1fr_1fr_1fr] gap-2 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-stretch">
              {rail.map((d, i) => {
                const busy = d.status === 'Belegt'
                const active = sel === i
                return (
                  <button
                    key={d.time}
                    disabled={busy}
                    onClick={() => setSel(i)}
                    className={cn(
                      'pressable group/r relative flex h-[62px] flex-col justify-center rounded-[12px] border px-3.5 text-left transition-colors',
                      busy && 'cursor-not-allowed border-white/10 text-white/35',
                      !busy && !active && 'border-white/20 text-white hover:border-white/50 hover:bg-white/[0.06]',
                      active && 'border-white bg-white text-ink',
                    )}
                  >
                    <span className="num whitespace-nowrap text-[16px] font-semibold leading-none">{d.time}<span className={cn('ml-1 hidden text-[12px] font-normal sm:inline', active ? 'text-ink/50' : 'text-white/40')}>– {d.end}</span></span>
                    <span className={cn('mt-1.5 text-[11.5px] font-medium', busy ? 'text-white/35' : active ? 'text-green' : 'text-[#8FD0A8]')}>{d.status}{busy && <span className="hidden sm:inline"> · Mannschaft</span>}</span>
                    {busy && <span className="absolute inset-0 rounded-[12px] bg-[repeating-linear-gradient(-45deg,rgba(255,255,255,0.05)_0_6px,transparent_6px_12px)]" />}
                  </button>
                )
              })}
              <Link to="/padel/buchen" className="pressable group col-span-3 flex h-[62px] items-center justify-between gap-6 rounded-[12px] bg-white px-5 text-ink hover:bg-paper sm:col-span-1">
                <span className="leading-tight"><span className="num block text-[15px] font-semibold">{s.time} – {s.end}</span><span className="block text-[12px] text-muted">Jetzt buchen</span></span>
                <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-[3px]" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* Editorial statement: pure typography, lots of air. */
function Statement() {
  return (
    <section className="py-[96px] md:py-[150px] lg:py-[190px]">
      <div className="container-x">
        <Reveal className="grid gap-10 lg:grid-cols-12">
          <div className="eyebrow lg:col-span-3">Der Verein</div>
          <h2 className="display-lg lg:col-span-9">
            Seit Jahren verbindet uns Tennis. <span className="text-muted-2">Jetzt wächst auch Padel.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.12} className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-12">
          <p className="lede max-w-md lg:col-span-5 lg:col-start-4">Ein Verein für Wettkampf, Freizeit, Nachwuchs und Gemeinschaft. Sechs Sandplätze, ein Padel Court, ein Clubhaus und Menschen, die gerne hier sind.</p>
          <div className="lg:col-span-3 lg:col-start-10 lg:justify-self-end"><Button to="/verein" variant="secondary" arrow>Über den Verein</Button></div>
        </Reveal>
      </div>
    </section>
  )
}

/* Immersive full-bleed media band with the two sports as one composition. */
function Sports() {
  return (
    <section className="container-wide">
      <div className="grid gap-3 md:grid-cols-2 md:gap-4">
        {[
          { to: '/tennis', title: 'Tennis', sub: 'Sechs Sandplätze, acht Mannschaften, Training ab sechs Jahren.', v: 'tennis' as const, n: '01' },
          { to: '/padel', title: 'Padel', sub: 'Ein Court, ständig ausgebucht. Online buchen, direkt spielen.', v: 'padel' as const, n: '02' },
        ].map((c, i) => (
          <Reveal key={c.to} delay={i * 0.08}>
            <Link to={c.to} className="group relative block overflow-hidden rounded-[24px] bg-ink text-white">
              <Photo variant={c.v} className="aspect-[4/5] md:aspect-[5/6] lg:aspect-[4/5]" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
              <div className="absolute left-6 top-6 num text-[13px] text-white/60 md:left-8 md:top-8">{c.n}</div>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-8">
                <div>
                  <h3 className="text-[40px] font-semibold leading-none tracking-[-0.03em] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 md:text-[56px]">{c.title}</h3>
                  <p className="mt-3 max-w-xs text-[14.5px] text-white/70">{c.sub}</p>
                </div>
                <span className="grid size-12 shrink-0 place-items-center rounded-full border border-white/30 text-white transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-ink"><ArrowUpRight size={20} /></span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

const dayRow = [
  { t: '08:00', s: 1 }, { t: '09:30', s: 0 }, { t: '11:00', s: 0 }, { t: '12:30', s: 2 }, { t: '14:00', s: 0 }, { t: '15:30', s: 1 }, { t: '17:00', s: 0 }, { t: '18:30', s: 1 }, { t: '20:00', s: 0 },
]

/* Interactive product moment on a dark stage. */
function PadelProduct() {
  const [pick, setPick] = useState<number | null>(null)
  return (
    <section className="mt-[96px] bg-ink py-[96px] text-white md:mt-[140px] md:py-[140px]">
      <div className="container-x grid items-center gap-14 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <div className="eyebrow !text-white/45">Padel</div>
          <h2 className="display-md mt-5">Ein Court.<br />Immer mehr Begeisterung.</h2>
          <ul className="mt-9 space-y-4 border-l border-white/15 pl-6 text-[18px] leading-tight md:text-[20px]">
            {[['Hohe Auslastung.', '86 % der Slots sind belegt.'], ['Einfach buchen.', 'Unter einer Minute, auf jedem Gerät.'], ['Direkt spielen.', 'Flutlicht schaltet sich automatisch.']].map(([a, b]) => (
              <li key={a}><span className="font-medium">{a}</span> <span className="text-white/50">{b}</span></li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row"><Button to="/padel" variant="light" size="lg" arrow className="w-full sm:w-auto">Padel entdecken</Button><Button to="/padel/buchen" variant="outline-light" size="lg" className="w-full sm:w-auto">Court buchen</Button></div>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
          <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm md:p-6">
            <div className="flex items-center justify-between">
              <div><div className="text-[15px] font-semibold">Padel Court 01</div><div className="text-[12.5px] text-white/50">Samstag, 26. September · 90 Minuten je Slot</div></div>
              <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[12px] font-medium text-[#8FD0A8]"><span className="size-1.5 rounded-full bg-current" />bis 22:00</span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {dayRow.map((d, i) => {
                const free = d.s === 0
                const active = pick === i
                return (
                  <button key={d.t} disabled={!free} onClick={() => setPick(active ? null : i)} className={cn('pressable num relative flex h-[56px] flex-col justify-center rounded-[10px] border px-3 text-left text-[14px] font-medium transition-colors', free && !active && 'border-white/15 hover:border-white/45 hover:bg-white/[0.05]', active && 'border-white bg-white text-ink', !free && 'border-transparent bg-white/[0.04] text-white/35')}>
                    {d.t}
                    <span className={cn('text-[11px] font-normal', active ? 'text-green' : free ? 'text-[#8FD0A8]' : d.s === 2 ? 'text-[#D9B87A]' : 'text-white/35')}>{free ? 'Frei' : d.s === 1 ? 'Belegt' : 'Training'}</span>
                  </button>
                )
              })}
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-[13px] text-white/50">
              <span>{pick !== null ? `${dayRow[pick].t} ausgewählt` : 'Slot antippen'}</span>
              <Link to="/padel/buchen" className="group flex items-center gap-1.5 font-medium text-white">Weiter zur Buchung<ArrowRight size={14} className="transition-transform group-hover:translate-x-[3px]" /></Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* Event as an editorial poster: date is the graphic. */
function EventFeature() {
  return (
    <section className="py-[96px] md:py-[140px]">
      <div className="container-wide">
        <Reveal>
          <Link to="/events/jugendturnier" className="group grid overflow-hidden rounded-[24px] bg-surface hairline lg:grid-cols-12">
            <div className="relative lg:col-span-7"><Photo variant="youth" className="aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[520px]" /></div>
            <div className="flex flex-col justify-between p-7 md:p-10 lg:col-span-5">
              <div className="flex items-start justify-between">
                <div className="num leading-none">
                  <div className="text-[64px] font-semibold tracking-[-0.05em] md:text-[88px]">18<span className="text-muted-2">–</span>20</div>
                  <div className="mt-2 text-[13px] font-medium uppercase tracking-[0.18em] text-muted">September 2026</div>
                </div>
                <span className="rounded-full border border-line px-2.5 py-1 text-[11.5px] font-medium text-muted">Jugend</span>
              </div>
              <div className="mt-14">
                <div className="eyebrow">Nächstes Event</div>
                <h3 className="display-sm mt-3">42. Röttenbacher Jugendturnier</h3>
                <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted">Drei Tage Nachwuchstennis auf allen Plätzen. Finals am Sonntagnachmittag.</p>
                <div className="mt-8 flex items-center gap-2 text-[14.5px] font-medium">Event ansehen<ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-[3px]" /></div>
              </div>
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

const faces = [
  { t: 'Mannschaften', s: 'Acht Teams im Punktspielbetrieb.', v: 'tennis' as const },
  { t: 'Nachwuchs', s: 'Ballschule ab sechs Jahren.', v: 'youth' as const },
  { t: 'Freizeitspieler', s: 'Ohne Druck, ohne Termin.', v: 'people' as const },
  { t: 'Padel', s: 'Die schnellste Community im Verein.', v: 'padel' as const },
  { t: 'Events', s: 'Saisonstart, Clubmeisterschaft, Padel Night.', v: 'night' as const },
]

/* Community as a horizontal film strip, not a card grid. */
function Community() {
  return (
    <section className="border-t border-line pt-[96px] md:pt-[140px]">
      <div className="container-wide flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <Reveal><div className="eyebrow">Gemeinschaft</div><h2 className="display-md mt-4">Ein Verein, viele Gesichter.</h2></Reveal>
        <Reveal delay={0.1} className="text-[14px] text-muted">Wischen, um mehr zu sehen</Reveal>
      </div>
      <Reveal delay={0.1} className="mt-10 md:mt-14">
        <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 md:gap-4 md:px-8 lg:px-12 xl:px-[72px]">
          {faces.map((f, i) => (
            <div key={f.t} className={cn('group relative shrink-0 snap-start overflow-hidden rounded-[20px] text-white', i === 0 ? 'w-[78vw] md:w-[46vw] lg:w-[520px]' : 'w-[62vw] md:w-[30vw] lg:w-[340px]')}>
              <Photo variant={f.v} className={i === 0 ? 'aspect-[4/5] md:aspect-[5/4]' : 'aspect-[3/4]'} />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6"><div className="num text-[12px] text-white/50">0{i + 1}</div><div className="mt-2 text-[20px] font-semibold tracking-[-0.015em]">{f.t}</div><p className="mt-1 text-[13.5px] text-white/65">{f.s}</p></div>
            </div>
          ))}
          <div className="w-px shrink-0" />
        </div>
      </Reveal>
    </section>
  )
}

const sponsors = ['Sparkasse Erlangen', 'Brauerei Weller', 'Autohaus Kern', 'Raiffeisenbank', 'Bäckerei Hofmann', 'Physio Röttenbach']

function Sponsors() {
  return (
    <section className="py-[96px] md:py-[120px]">
      <div className="container-x">
        <Reveal className="flex flex-col gap-8 border-t border-line pt-10 md:flex-row md:items-center md:justify-between">
          <div className="eyebrow shrink-0">Partner des Vereins</div>
          <div className="flex flex-wrap gap-x-8 gap-y-3 md:justify-end">
            {sponsors.map((s) => <span key={s} className="text-[15px] font-semibold tracking-[-0.01em] text-ink/30 transition-colors duration-300 hover:text-ink">{s}</span>)}
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
      <Statement />
      <Sports />
      <PadelProduct />
      <EventFeature />
      <Community />
      <Sponsors />
    </Page>
  )
}
