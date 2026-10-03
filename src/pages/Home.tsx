import { useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Lightbulb } from 'lucide-react'
import { Page } from '@/components/site/Page'
import { Button } from '@/components/ui/Button'
import { Photo } from '@/components/ui/Photo'
import { Picture } from '@/components/ui/Picture'
import { Reveal } from '@/components/ui/Reveal'
import { RevealText } from '@/components/ui/RevealText'
import { Magnetic } from '@/components/ui/Magnetic'
import { Avatar } from '@/components/ui/Avatar'
import { AnimatedCheck } from '@/components/ui/AnimatedCheck'
import { cn } from '@/lib/cn'
import { EASE } from '@/lib/motion'
import { club } from '@/lib/club'
import type { ImageName } from '@/lib/images'

/* ------------------------------------------------------------------ */
/* Hero: photograph, launch sequence, live rail, scroll parallax        */
/* ------------------------------------------------------------------ */
const line = (ms: number) => ({
  initial: { y: '110%' },
  animate: { y: '0%' },
  transition: { duration: 1.05, ease: EASE, delay: ms / 1000 },
})

const rail = [
  { time: '18:00', end: '19:30', free: false },
  { time: '19:30', end: '21:00', free: true },
  { time: '21:00', end: '22:00', free: true },
]

function Hero() {
  const ref = useRef<HTMLElement>(null)
  const [sel, setSel] = useState(1)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '16%'])
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -80])
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const s = rail[sel]
  return (
    <section ref={ref} className="relative isolate min-h-[100svh] overflow-hidden bg-ink text-white">
      <motion.div style={{ y: imgY, scale: imgScale }} className="absolute inset-0 origin-top">
        <motion.div initial={{ scale: 1.08, opacity: 0.4 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 2.2, ease: EASE }} className="absolute inset-0">
          <Picture name="overhead" alt="Padelspieler beim Rückhandschlag auf blauem Court" priority cover focus="62% 40%" className="h-full w-full" zoom={false} />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,12,18,0.82)_0%,rgba(9,12,18,0.45)_45%,rgba(9,12,18,0.05)_75%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(9,12,18,0.92)_0%,rgba(9,12,18,0.35)_35%,transparent_60%)]" />
      <div className="grain absolute inset-0 opacity-60" />

      <motion.div style={{ y: textY, opacity: fade }} className="container-wide relative flex min-h-[100svh] flex-col justify-end pb-6 pt-28 md:pb-10">
        <div className="mb-10 md:mb-14 lg:mb-16">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.05 }} className="mb-6 flex items-center gap-3 text-[11.5px] font-medium uppercase tracking-[0.18em] text-white/60">
            <span className="h-px w-8 bg-white/40" />{club.name}
          </motion.div>
          <h1 className="display-xl">
            <span className="block overflow-hidden pb-[0.04em]"><motion.span className="block" {...line(100)}>Tennis.</motion.span></span>
            <span className="block overflow-hidden pb-[0.04em]"><motion.span className="block" {...line(190)}>Padel.</motion.span></span>
            <span className="block overflow-hidden pb-[0.06em]"><motion.span className="block text-white/60" {...line(280)}>Röttenbach.</motion.span></span>
          </h1>
          <div className="mt-8 flex flex-col gap-6 md:mt-10 md:flex-row md:items-end md:justify-between">
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.42 }} className="max-w-[26rem] text-[17px] leading-[1.45] text-white/75 md:text-[19px]">
              Sport, Gemeinschaft und echte Leidenschaft für den Court.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.5 }} className="flex flex-col gap-3 sm:flex-row">
              <Magnetic className="block w-full sm:inline-block sm:w-auto"><Button to="/padel/buchen" variant="light" size="lg" arrow className="w-full sm:w-auto">Padelplatz buchen</Button></Magnetic>
              <Button to="/verein" variant="outline-light" size="lg" className="w-full sm:w-auto">Verein entdecken</Button>
            </motion.div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.62 }} className="grid gap-y-6 border-t border-white/15 pt-6 md:grid-cols-12 md:gap-x-8">
          <dl className="flex flex-wrap gap-x-6 gap-y-2 md:col-span-4 md:flex-col md:gap-3">
            {[[String(club.tennisCourts), 'Tennisplätze'], ['1', 'Padel Court'], [String(club.members.total), 'Mitglieder']].map(([n, l]) => (
              <div key={l} className="flex items-baseline gap-2 whitespace-nowrap"><dt className="num text-[22px] font-semibold leading-none">{n}</dt><dd className="text-[13px] text-white/55">{l}</dd></div>
            ))}
          </dl>
          <div className="md:col-span-8">
            <div className="flex items-center justify-between">
              <div className="text-[13px] font-medium text-white/60">Heute noch spielen? <span className="hidden text-white/35 sm:inline">· Padel Court 01 · Demo</span></div>
              <span className="flex items-center gap-1.5 text-[12px] font-medium text-white/70"><span className="pulse-dot size-1.5 rounded-full bg-[#8FD0A8] text-[#8FD0A8]" />Live</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
              {rail.map((d, i) => {
                const active = sel === i
                return (
                  <button key={d.time} disabled={!d.free} onClick={() => setSel(i)} aria-pressed={active}
                    className={cn('pressable relative flex h-[62px] flex-col justify-center overflow-hidden rounded-[12px] border px-3.5 text-left backdrop-blur-md transition-colors',
                      !d.free && 'cursor-not-allowed border-white/10 bg-white/[0.03] text-white/35',
                      d.free && !active && 'border-white/20 bg-white/[0.06] text-white hover:border-white/50 hover:bg-white/[0.1]',
                      active && 'border-white bg-white text-ink')}>
                    <span className="num whitespace-nowrap text-[16px] font-semibold leading-none">{d.time}<span className={cn('ml-1 hidden text-[12px] font-normal sm:inline', active ? 'text-ink/50' : 'text-white/40')}>– {d.end}</span></span>
                    <span className={cn('mt-1.5 text-[11.5px] font-medium', !d.free ? 'text-white/35' : active ? 'text-green' : 'text-[#8FD0A8]')}>{d.free ? 'Frei' : 'Belegt'}</span>
                    {!d.free && <span className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,rgba(255,255,255,0.05)_0_6px,transparent_6px_12px)]" />}
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
      </motion.div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
function Statement() {
  return (
    <section className="py-[96px] md:py-[150px] lg:py-[190px]">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="eyebrow lg:col-span-3 lg:pt-4">Der Verein</Reveal>
          <RevealText className="display-lg lg:col-span-9" parts={['Seit Jahren verbindet uns Tennis.', { text: 'Jetzt wächst auch Padel.', className: 'text-muted-2' }]} />
        </div>
        <Reveal delay={0.2} className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-12">
          <p className="lede max-w-md lg:col-span-5 lg:col-start-4">Ein Verein für Wettkampf, Freizeit, Nachwuchs und Gemeinschaft. Sechs Tennisplätze am Lohmühlweg, ein Padel Court im Sportpark der Gemeinde und Menschen, die gerne hier sind.</p>
          <div className="lg:col-span-3 lg:col-start-10 lg:justify-self-end"><Button to="/verein" variant="secondary" arrow>Über den Verein</Button></div>
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
function Sports() {
  return (
    <section className="container-wide">
      <div className="grid gap-3 md:grid-cols-2 md:gap-4">
        {[
          { to: '/tennis', title: 'Tennis', sub: 'Sechs Tennisplätze, Mannschaften, Training und Jugend.', n: '01', media: <Photo variant="clay" className="aspect-[4/5] md:aspect-[5/6] lg:aspect-[4/5]" /> },
          { to: '/padel', title: 'Padel', sub: 'Ein Court im Sportpark, hohe Nachfrage. Von bis wann du willst.', n: '02', media: <Picture name="flatlay" alt="Zwei Padelschläger auf blauem Kunstrasen" focus="55% 50%" sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[4/5] md:aspect-[5/6] lg:aspect-[4/5]" /> },
        ].map((c, i) => (
          <Reveal key={c.to} delay={i * 0.08}>
            <Link to={c.to} className="group relative block overflow-hidden rounded-[24px] bg-ink text-white">
              {c.media}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
              <div className="num absolute left-6 top-6 text-[13px] text-white/60 md:left-8 md:top-8">{c.n}</div>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-8">
                <div>
                  <h3 className="text-[44px] font-semibold leading-none tracking-[-0.035em] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 md:text-[64px]">{c.title}</h3>
                  <p className="mt-3 max-w-xs text-[14.5px] text-white/70">{c.sub}</p>
                </div>
                <span className="grid size-12 shrink-0 place-items-center rounded-full border border-white/30 text-white transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-ink"><ArrowUpRight size={20} className="transition-transform duration-300 group-hover:rotate-45" /></span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Story: pinned photographs with live product UI on top               */
/* ------------------------------------------------------------------ */
function RangeChip() {
  return (
    <div className="w-[min(320px,78vw)] rounded-[16px] bg-white/95 p-4 text-ink shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur">
      <div className="flex items-center justify-between text-[12px] text-muted"><span>Sa, 26. September</span><span>Padel Court 01</span></div>
      <div className="num mt-1.5 text-[24px] font-semibold tracking-[-0.02em] text-green-deep">18:00 – 19:30</div>
      <div className="relative mt-3 h-7">
        <div className="absolute inset-y-[9px] inset-x-0 flex gap-[3px]">{Array.from({ length: 12 }).map((_, i) => <span key={i} className={cn('flex-1 rounded-[3px]', [1, 2, 9].includes(i) ? 'bg-[#DCDFD8]' : 'bg-paper shadow-[inset_0_0_0_1px_var(--color-line)]')} />)}</div>
        <motion.div initial={{ width: 0 }} whileInView={{ width: '25%' }} viewport={{ once: false }} transition={{ duration: 0.8, ease: EASE, delay: 0.3 }} className="absolute inset-y-0 left-[33.3%] flex items-center justify-between rounded-full bg-green px-1 shadow-[0_6px_18px_rgba(49,92,70,0.35)]">
          <span className="size-5 rounded-full bg-white" /><span className="size-5 rounded-full bg-white" />
        </motion.div>
      </div>
      <div className="mt-2 text-[13px] font-medium text-green">1 Std. 30 Min.</div>
    </div>
  )
}
function PlayersChip() {
  return (
    <div className="w-[min(320px,78vw)] space-y-1 rounded-[16px] bg-white/95 p-2 text-ink shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur">
      {[['LP', 'Lazar Popovic', true], ['MM', 'Max Mustermann', false]].map(([i, n, m], k) => (
        <div key={String(i)} className="flex items-center gap-3 rounded-[11px] px-2.5 py-2">
          <Avatar initials={String(i)} size="sm" tone={k} />
          <div className="min-w-0 flex-1 truncate text-[14px] font-medium">{n}</div>
          {m ? <span className="flex items-center gap-1 text-[12px] font-medium text-green"><span className="grid size-4 place-items-center rounded-full bg-green-soft"><AnimatedCheck size={10} strokeWidth={3} /></span>Mitglied</span> : <span className="text-[12px] text-muted">Gast</span>}
        </div>
      ))}
    </div>
  )
}
function LightChip() {
  return (
    <div className="flex items-center gap-3.5 rounded-full border border-white/25 bg-white/[0.14] py-2.5 pl-2.5 pr-5 text-white shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl">
      <span className="relative grid size-10 place-items-center rounded-full bg-sand/20"><span className="absolute inset-0 animate-pulse rounded-full bg-sand/25 blur-md" /><Lightbulb size={18} className="glow-light relative text-sand" /></span>
      <div><div className="text-[13.5px] font-medium">Flutlicht · automatisch</div><div className="num text-[12.5px] text-white/60">17:55 – 19:35 Uhr</div></div>
    </div>
  )
}

const steps: { n: string; title: string; text: string; image: ImageName; focus: string; alt: string; chip: ReactNode }[] = [
  { n: '01', title: 'Von – bis, wie du willst.', text: 'Startzeit antippen, Endzeit antippen. Die Dauer, der Preis und alles danach passen sich an.', image: 'rackets', focus: '55% 45%', alt: 'Padelschläger und Bälle auf dem Court', chip: <RangeChip /> },
  { n: '02', title: 'Mitglieder werden erkannt.', text: 'Mitspieler hinzufügen, Mitgliedschaft wird geprüft, der Vorteil steht sofort im Preis.', image: 'duo', focus: '50% 40%', alt: 'Zwei Spieler klatschen sich am Court ab', chip: <PlayersChip /> },
  { n: '03', title: 'Licht an. Von selbst.', text: 'Das Flutlicht folgt deiner Buchung: fünf Minuten vor Beginn an, fünf Minuten nach Ende aus.', image: 'serve', focus: '50% 30%', alt: 'Spielerin beim Aufschlag unter Flutlicht', chip: <LightChip /> },
]

function Story() {
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (v) => setActive(Math.min(steps.length - 1, Math.max(0, Math.floor(v * steps.length * 0.999)))))
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section className="mt-[96px] bg-ink text-white md:mt-[140px]">
      {/* Desktop: pinned */}
      <section ref={ref} className="relative hidden lg:block" style={{ height: `${steps.length * 90 + 30}vh` }}>
        <div className="sticky top-0 flex h-screen items-center">
          <div className="container-wide grid w-full grid-cols-12 items-center gap-12">
            <div className="col-span-5">
              <div className="eyebrow !text-white/45">Padel buchen</div>
              <h2 className="display-md mt-5">So einfach spielt Röttenbach.</h2>
              <div className="relative mt-12 pl-8">
                <div className="absolute inset-y-0 left-0 w-px bg-white/12" />
                <motion.div className="absolute left-0 top-0 w-px bg-white" style={{ height: bar }} />
                {steps.map((s, i) => (
                  <div key={s.n} className="py-4">
                    <div className={cn('flex items-baseline gap-4 transition-opacity duration-500', active === i ? 'opacity-100' : 'opacity-35')}>
                      <span className="num text-[13px] text-white/50">{s.n}</span>
                      <h3 className="text-[26px] font-semibold tracking-[-0.025em]">{s.title}</h3>
                    </div>
                    <AnimatePresence initial={false}>
                      {active === i && (
                        <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: EASE }} className="overflow-hidden pl-[42px] text-[16px] leading-relaxed text-white/60">
                          <span className="block max-w-sm pt-2">{s.text}</span>
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
              <div className="mt-12"><Magnetic className="inline-block"><Button to="/padel/buchen" variant="light" size="lg" arrow>Court buchen</Button></Magnetic></div>
            </div>
            <div className="col-span-6 col-start-7">
              <div className="relative h-[78vh] max-h-[760px] overflow-hidden rounded-[28px]">
                {steps.map((s, i) => (
                  <motion.div key={s.n} className="absolute inset-0" initial={false}
                    animate={{ clipPath: i <= active ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)', scale: i === active ? 1 : 1.06 }}
                    transition={{ duration: 1, ease: EASE }} style={{ zIndex: i }}>
                    <Picture name={s.image} alt={s.alt} focus={s.focus} sizes="50vw" className="h-full w-full" zoom={false} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
                  </motion.div>
                ))}
                <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center p-8">
                  <AnimatePresence mode="wait">
                    <motion.div key={active} initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12, scale: 0.98 }} transition={{ duration: 0.55, ease: EASE, delay: 0.15 }}>
                      {steps[active].chip}
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="num absolute right-6 top-6 z-10 rounded-full bg-black/35 px-3 py-1 text-[12px] text-white/80 backdrop-blur">{steps[active].n} / 0{steps.length}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile and tablet: stacked */}
      <div className="container-x py-[88px] md:py-[120px] lg:hidden">
        <div className="eyebrow !text-white/45">Padel buchen</div>
        <h2 className="display-md mt-5">So einfach spielt Röttenbach.</h2>
        <div className="mt-12 space-y-16">
          {steps.map((s) => (
            <Reveal key={s.n}>
              <div className="relative overflow-hidden rounded-[22px]">
                <Picture name={s.image} alt={s.alt} focus={s.focus} sizes="100vw" className="aspect-[4/5] md:aspect-[16/11]" zoom={false} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex justify-center p-5">{s.chip}</div>
              </div>
              <div className="mt-6 flex items-baseline gap-4"><span className="num text-[13px] text-white/50">{s.n}</span><h3 className="text-[24px] font-semibold tracking-[-0.025em]">{s.title}</h3></div>
              <p className="mt-2 max-w-md pl-[38px] text-[15.5px] leading-relaxed text-white/60">{s.text}</p>
            </Reveal>
          ))}
        </div>
        <div className="mt-14"><Button to="/padel/buchen" variant="light" size="lg" arrow className="w-full sm:w-auto">Court buchen</Button></div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
function EventFeature() {
  return (
    <section className="py-[96px] md:py-[140px]">
      <div className="container-wide">
        <Reveal>
          <Link to="/events/jugendturnier" className="group grid overflow-hidden rounded-[24px] bg-surface hairline transition-shadow duration-500 hover:shadow-panel lg:grid-cols-12">
            <div className="relative overflow-hidden lg:col-span-7"><Photo variant="youth" className="aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[520px]" /></div>
            <div className="flex flex-col justify-between p-7 md:p-10 lg:col-span-5">
              <div className="flex items-start justify-between">
                <div className="num leading-none">
                  <div className="text-[64px] font-semibold tracking-[-0.05em] md:text-[88px]">18<span className="text-muted-2">–</span>20</div>
                  <div className="mt-2 text-[13px] font-medium uppercase tracking-[0.18em] text-muted">September 2026</div>
                </div>
                <span className="rounded-full border border-line px-2.5 py-1 text-[11.5px] font-medium text-muted">Jugend</span>
              </div>
              <div className="mt-14">
                <div className="eyebrow">Event</div>
                <h3 className="display-sm mt-3">{club.youthTournament.title}</h3>
                <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted">Drei Tage Nachwuchstennis auf der Anlage am Lohmühlweg.</p>
                <div className="mt-8 flex items-center gap-2 text-[14.5px] font-medium">Event ansehen<ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-[3px]" /></div>
              </div>
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
function Closing() {
  return (
    <section className="py-[110px] md:py-[170px]">
      <div className="container-x text-center">
        <RevealText as="h2" className="display-xl mx-auto max-w-5xl" parts={['Bis gleich', { text: 'am Court.', className: 'text-muted-2' }]} />
        <Reveal delay={0.25}><p className="lede mx-auto mt-8 max-w-md">Tag wählen, Start und Ende antippen, spielen. Mitglieder werden automatisch erkannt.</p></Reveal>
        <Reveal delay={0.35} className="mt-10 flex justify-center"><Magnetic strength={0.3} className="inline-block"><Button to="/padel/buchen" size="xl" arrow>Padel Court buchen</Button></Magnetic></Reveal>
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
      <Story />
      <EventFeature />
      <Closing />
    </Page>
  )
}
