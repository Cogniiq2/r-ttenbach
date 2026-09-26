import { Page } from '@/components/site/Page'
import { PageHero } from '@/components/site/PageHero'
import { Button } from '@/components/ui/Button'
import { Photo } from '@/components/ui/Photo'
import { Reveal } from '@/components/ui/Reveal'
import { Avatar } from '@/components/ui/Avatar'
import { useToast } from '@/lib/toast'

const board = [
  { n: 'Günter Rottmann', r: '1. Vorsitzender', i: 'GR' },
  { n: 'Sabine Kraus', r: '2. Vorsitzende', i: 'SK' },
  { n: 'Tobias Herzog', r: 'Sportwart', i: 'TH' },
  { n: 'Anna Weber', r: 'Jugendwartin', i: 'AW' },
  { n: 'Lena Hofmann', r: 'Kassenwartin', i: 'LH' },
  { n: 'Lazar Popovic', r: 'Padel & Digitales', i: 'LP' },
]
const history = [['1978', 'Gründung mit zwei Sandplätzen am Lohmühlweg.'], ['1994', 'Ausbau auf sechs Plätze, neues Clubhaus.'], ['2012', 'Flutlicht auf Platz 5 und 6.'], ['2024', 'Erster Padel Court in Röttenbach.'], ['2026', 'Online-Buchung, 269 Mitglieder.']]

export function Verein() {
  const { toast } = useToast()
  return (
    <Page>
      <PageHero eyebrow="Verein" title="Mehr als ein Tennisverein." lede="Seit 1978 am Lohmühlweg. 269 Mitglieder, sechs Plätze, ein Court und eine Gemeinschaft, die bleibt." variant="club" />

      <section className="section">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5"><div className="eyebrow">Über uns</div><h2 className="display-md mt-4">Ein Verein, der sich bewegt.</h2></Reveal>
          <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7"><p className="text-[19px] leading-relaxed md:text-[22px]">Wir sind ein Verein aus Röttenbach für Röttenbach. Wettkampf und Breitensport, Jugendarbeit und Feierabendtennis, Padel und Tradition. Wer hier spielt, bleibt meistens länger als geplant.</p></Reveal>
        </div>
      </section>

      <section className="section-tight bg-surface border-y border-line">
        <div className="container-wide">
          <Reveal className="flex items-end justify-between"><div><div className="eyebrow">Vorstand</div><h2 className="display-sm mt-3">Die Menschen dahinter.</h2></div></Reveal>
          <div className="mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {board.map((b, i) => (
              <Reveal key={b.n} delay={i * 0.05} className="group flex items-center gap-4 border-t border-line pt-5">
                <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-full bg-paper"><Avatar initials={b.i} size="lg" tone={i % 5} className="!ring-0" /></div>
                <div><div className="text-[17px] font-semibold">{b.n}</div><div className="text-[14px] text-muted">{b.r}</div></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          <Reveal className="max-w-xl"><div className="eyebrow">Anlage</div><h2 className="display-md mt-4">Lohmühlweg 11a.</h2></Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-12">
            <Reveal className="group md:col-span-8"><Photo variant="aerial" className="aspect-[16/9] rounded-[22px]" caption="Anlage von oben" /></Reveal>
            <Reveal delay={0.1} className="group md:col-span-4"><Photo variant="club" className="aspect-[16/9] rounded-[22px] md:aspect-auto md:h-full" caption="Clubhaus" /></Reveal>
          </div>
        </div>
      </section>

      <section className="section-tight bg-ink text-white">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-6"><div className="eyebrow !text-white/50">Mitgliedschaft</div><h2 className="display-md mt-4">Werde Teil davon.</h2><p className="mt-5 max-w-md text-[16px] leading-relaxed text-white/65">Mitglieder spielen Tennis ohne Platzgebühr und buchen den Padel Court zum Vorteilspreis. Familien, Jugendliche und Studierende zahlen weniger.</p></Reveal>
          <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8">
            <div className="divide-y divide-white/10 rounded-[18px] border border-white/10">
              {[['Erwachsene', '180 € / Jahr'], ['Jugendliche', '80 € / Jahr'], ['Familien', '320 € / Jahr'], ['Padel-Schnupper', '30 € / Jahr']].map(([k, v]) => <div key={k} className="flex items-center justify-between px-5 py-4 text-[15px]"><span>{k}</span><span className="num font-medium">{v}</span></div>)}
            </div>
            <Button variant="light" size="lg" full arrow className="mt-4" onClick={() => toast('Anfrage gesendet', 'Demo · wir melden uns')}>Mitglied werden</Button>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4"><div className="eyebrow">Geschichte</div><h2 className="display-sm mt-3">Seit 1978.</h2></Reveal>
          <div className="lg:col-span-7 lg:col-start-6">
            {history.map(([y, tx], i) => (
              <Reveal key={y} delay={i * 0.05} className="grid grid-cols-[80px_1fr] gap-6 border-t border-line py-5 md:grid-cols-[120px_1fr]"><div className="num text-[22px] font-semibold tracking-[-0.02em]">{y}</div><p className="pt-1 text-[16px] leading-relaxed text-ink-2">{tx}</p></Reveal>
            ))}
          </div>
        </div>
      </section>
    </Page>
  )
}
