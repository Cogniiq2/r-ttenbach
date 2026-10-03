import { Page } from '@/components/site/Page'
import { PageHero } from '@/components/site/PageHero'
import { Button } from '@/components/ui/Button'
import { Picture } from '@/components/ui/Picture'
import { Reveal } from '@/components/ui/Reveal'
import { RevealText } from '@/components/ui/RevealText'
import { CountUp } from '@/components/ui/CountUp'
import { cn } from '@/lib/cn'
import { club } from '@/lib/club'
import type { ImageName } from '@/lib/images'

const blocks: { title: string; text: string; image: ImageName; focus: string; alt: string; wide?: boolean }[] = [
  { title: `${club.tennisCourts} Tennisplätze`, text: 'Sechs Außenplätze am Lohmühlweg. Die Freiluftsaison ist das Herz des Vereins.', image: 'net', focus: '50% 50%', alt: 'Netz auf einem Sandplatz', wide: true },
  { title: 'Mannschaften', text: 'Punktspielbetrieb im Bayerischen Tennis-Verband. Aktuelle Mannschaften und Spielpläne auf der Vereinsseite.', image: 'clayPlayer', focus: '50% 42%', alt: 'Tennisspieler in Bereitschaftsstellung' },
  { title: 'Training', text: 'Trainingsangebote für Einsteiger, Fortgeschrittene und Wettkampfspieler.', image: 'handshake', focus: '45% 42%', alt: 'Handschlag am Netz nach dem Match' },
  { title: 'Jugend', text: `${club.members.juniors} Jugendliche im Verein. Das ${club.youthTournament.title} ist der Höhepunkt des Jahres.`, image: 'aerial', focus: '50% 60%', alt: 'Sandplatz von oben mit zwei Spielern' },
]

export function Tennis() {
  return (
    <Page>
      <PageHero eyebrow="Tennis" title="Tennis in Röttenbach." lede={`${club.tennisCourts} Außenplätze, Mannschaften, Training und Jugendarbeit am Lohmühlweg.`} image="shadow" focus="38% 72%">
        <div className="flex flex-col gap-3 sm:flex-row"><Button variant="light" size="lg" arrow to="/verein" className="w-full sm:w-auto">Mitglied werden</Button><Button variant="outline-light" size="lg" to="/events" className="w-full sm:w-auto">Events</Button></div>
      </PageHero>

      <section className="section">
        <div className="container-wide">
          <div className="max-w-2xl"><Reveal className="eyebrow">Die Anlage</Reveal><RevealText className="display-md mt-4" parts={['Alles, was Tennis braucht.']} /></div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {blocks.map((b, i) => (
              <Reveal key={b.title} delay={(i % 2) * 0.06} className={cn('group grid overflow-hidden rounded-[22px] bg-white hairline', b.wide ? 'md:col-span-2 md:grid-cols-2' : '')}>
                <div className="relative overflow-hidden">
                  <Picture name={b.image} alt={b.alt} focus={b.focus} sizes={b.wide ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 768px) 50vw, 100vw'} className={cn('h-full w-full', b.wide ? 'aspect-[16/10] md:aspect-auto md:min-h-[420px]' : 'aspect-[4/3]')} />
                </div>
                <div className="flex flex-col justify-end p-6 md:p-8">
                  <div className="num text-[12.5px] text-muted-2">0{i + 1}</div>
                  <h3 className="display-sm mt-2">{b.title}</h3>
                  <p className="mt-3 max-w-md text-[15.5px] leading-relaxed text-muted">{b.text}</p>
                </div>
              </Reveal>
            ))}
            <Reveal delay={0.06} className="flex flex-col justify-between gap-10 rounded-[22px] bg-ink p-8 text-white md:p-10">
              <div className="max-w-xl"><div className="num text-[12.5px] text-white/40">05</div><h3 className="display-sm mt-2">Breitensport</h3><p className="mt-3 text-[16px] leading-relaxed text-white/65">Tennis ohne Leistungsdruck: Feierabendrunden, Doppel, gemeinsames Spielen. Für alle, die einfach gerne auf dem Platz stehen.</p></div>
              <Button variant="light" size="lg" arrow to="/verein" className="w-full sm:w-auto sm:self-start">Mitglied werden</Button>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-ink text-white">
        <div className="absolute inset-0"><Picture name="aerial" alt="" focus="50% 40%" cover className="h-full w-full" zoom={false} /></div>
        <div className="absolute inset-0 bg-ink/70" />
        <div className="container-x relative grid gap-10 py-[96px] md:grid-cols-3 md:py-[140px]">
          {[['Tennisplätze', club.tennisCourts], ['Mitglieder', club.members.total], ['Jugendliche', club.members.juniors]].map(([l, n], i) => (
            <Reveal key={String(l)} delay={i * 0.08}><div className="num text-[64px] font-semibold leading-none tracking-[-0.04em] md:text-[88px]"><CountUp value={Number(n)} /></div><div className="mt-3 text-[15px] text-white/60">{l}</div></Reveal>
          ))}
        </div>
      </section>
    </Page>
  )
}
