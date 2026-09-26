import { Page } from '@/components/site/Page'
import { PageHero } from '@/components/site/PageHero'
import { Button } from '@/components/ui/Button'
import { Photo, type PhotoVariant } from '@/components/ui/Photo'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/cn'

const blocks: { title: string; text: string; variant: PhotoVariant; wide?: boolean }[] = [
  { title: '6 Sandplätze', text: 'Gepflegte Sandplätze mit Bewässerung, von April bis Oktober bespielbar. Zwei Plätze mit Flutlicht.', variant: 'clay', wide: true },
  { title: 'Mannschaften', text: 'Acht Mannschaften von Jugend bis Herren 50 im Punktspielbetrieb des BTV.', variant: 'tennis' },
  { title: 'Training', text: 'Lizenzierte Trainer, Gruppen- und Einzeltraining für alle Spielstärken.', variant: 'people' },
  { title: 'Jugend', text: 'Über 60 Kinder und Jugendliche. Ballschule ab sechs Jahren, Camps in den Ferien.', variant: 'youth' },
  { title: 'Breitensport', text: 'After Work Tennis, Schleifchenturniere, Doppelabende. Ohne Leistungsdruck.', variant: 'aerial', wide: true },
]

export function Tennis() {
  return (
    <Page>
      <PageHero eyebrow="Tennis" title="Tennis in Röttenbach." lede="Sechs Sandplätze, acht Mannschaften und ein Training, das bei den Kleinsten anfängt." variant="clay">
        <div className="flex flex-col gap-3 sm:flex-row"><Button variant="light" size="lg" arrow to="/verein" className="w-full sm:w-auto">Mitglied werden</Button><Button variant="outline-light" size="lg" to="/events" className="w-full sm:w-auto">Mannschaftsspiele</Button></div>
      </PageHero>

      <section className="section">
        <div className="container-wide">
          <Reveal className="max-w-2xl"><div className="eyebrow">Die Anlage</div><h2 className="display-md mt-4">Alles, was Tennis braucht.</h2></Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {blocks.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.05} className={cn('group grid overflow-hidden rounded-[20px] border border-line bg-white', b.wide ? 'md:col-span-2 md:grid-cols-2' : '')}>
                <Photo variant={b.variant} className={cn(b.wide ? 'aspect-[16/10] md:aspect-auto md:min-h-[360px]' : 'aspect-[16/10]')} />
                <div className="flex flex-col justify-between p-6 md:p-8">
                  <div><h3 className="display-sm">{b.title}</h3><p className="mt-3 max-w-md text-[15.5px] leading-relaxed text-muted">{b.text}</p></div>
                  <div className="mt-8 flex items-center gap-2 text-[14px] font-medium text-green"><span className="h-px w-6 bg-green transition-all duration-300 group-hover:w-10" />Mehr erfahren</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight border-t border-line">
        <div className="container-x grid gap-10 md:grid-cols-3">
          {[['Sandplätze', '6'], ['Mannschaften', '8'], ['Trainingsstunden pro Woche', '42']].map(([l, n], i) => (
            <Reveal key={l} delay={i * 0.08}><div className="num text-[56px] font-semibold leading-none tracking-[-0.04em] md:text-[72px]">{n}</div><div className="mt-3 text-[15px] text-muted">{l}</div></Reveal>
          ))}
        </div>
      </section>
    </Page>
  )
}
