import { Page } from '@/components/site/Page'
import { PageHero } from '@/components/site/PageHero'
import { Button } from '@/components/ui/Button'
import { Photo, type PhotoVariant } from '@/components/ui/Photo'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/cn'
import { club } from '@/lib/club'

const blocks: { title: string; text: string; variant: PhotoVariant; wide?: boolean }[] = [
  { title: `${club.tennisCourts} Tennisplätze`, text: 'Sechs Außenplätze am Lohmühlweg. Die Freiluftsaison ist das Herz des Vereins.', variant: 'clay', wide: true },
  { title: 'Mannschaften', text: 'Punktspielbetrieb im Bayerischen Tennis-Verband. Aktuelle Mannschaften und Spielpläne auf der Vereinsseite.', variant: 'tennis' },
  { title: 'Training', text: 'Trainingsangebote für Einsteiger, Fortgeschrittene und Wettkampfspieler.', variant: 'people' },
  { title: 'Jugend', text: `${club.members.juniors} Jugendliche im Verein. Das ${club.youthTournament.title} ist der Höhepunkt des Jahres.`, variant: 'youth' },
  { title: 'Breitensport', text: 'Tennis ohne Leistungsdruck: Feierabendrunden, Doppel, gemeinsames Spielen.', variant: 'aerial', wide: true },
]

export function Tennis() {
  return (
    <Page>
      <PageHero eyebrow="Tennis" title="Tennis in Röttenbach." lede={`${club.tennisCourts} Außenplätze, Mannschaften, Training und Jugendarbeit am Lohmühlweg.`} variant="clay">
        <div className="flex flex-col gap-3 sm:flex-row"><Button variant="light" size="lg" arrow to="/verein" className="w-full sm:w-auto">Mitglied werden</Button><Button variant="outline-light" size="lg" to="/events" className="w-full sm:w-auto">Events</Button></div>
      </PageHero>

      <section className="section">
        <div className="container-wide">
          <Reveal className="max-w-2xl"><div className="eyebrow">Die Anlage</div><h2 className="display-md mt-4">Alles, was Tennis braucht.</h2></Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {blocks.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.05} className={cn('group grid overflow-hidden rounded-[20px] bg-white hairline', b.wide ? 'md:col-span-2 md:grid-cols-2' : '')}>
                <Photo variant={b.variant} className={cn(b.wide ? 'aspect-[16/10] md:aspect-auto md:min-h-[360px]' : 'aspect-[16/10]')} />
                <div className="flex flex-col justify-between p-6 md:p-8">
                  <div><h3 className="display-sm">{b.title}</h3><p className="mt-3 max-w-md text-[15.5px] leading-relaxed text-muted">{b.text}</p></div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight border-t border-line">
        <div className="container-x grid gap-10 md:grid-cols-3">
          {[['Tennisplätze', String(club.tennisCourts)], ['Mitglieder', String(club.members.total)], ['Jugendliche', String(club.members.juniors)]].map(([l, n], i) => (
            <Reveal key={l} delay={i * 0.08}><div className="num text-[56px] font-semibold leading-none tracking-[-0.04em] md:text-[72px]">{n}</div><div className="mt-3 text-[15px] text-muted">{l}</div></Reveal>
          ))}
        </div>
      </section>
    </Page>
  )
}
