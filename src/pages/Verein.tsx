import { ArrowUpRight } from 'lucide-react'
import { Page } from '@/components/site/Page'
import { PageHero } from '@/components/site/PageHero'
import { Button } from '@/components/ui/Button'
import { Picture } from '@/components/ui/Picture'
import { Reveal } from '@/components/ui/Reveal'
import { CountUp } from '@/components/ui/CountUp'
import { Avatar } from '@/components/ui/Avatar'
import { club, fullAddress } from '@/lib/club'

export function Verein() {
  return (
    <Page>
      <PageHero eyebrow="Verein" title="Mehr als ein Tennisverein." lede={`${club.members.total} Mitglieder, ${club.tennisCourts} Tennisplätze und ein Padel Court im Sportpark der Gemeinde.`} image="handshake" focus="48% 42%" />

      <section className="section">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5"><div className="eyebrow">Über uns</div><h2 className="display-md mt-4">Ein Verein, der sich bewegt.</h2></Reveal>
          <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7"><p className="text-[19px] leading-relaxed md:text-[22px]">Wir sind ein Verein aus Röttenbach für Röttenbach. Wettkampf und Breitensport, Jugendarbeit und Feierabendtennis, Padel und Tradition. Wer hier spielt, bleibt meistens länger als geplant.</p></Reveal>
        </div>
      </section>

      <section className="section-tight border-y border-line bg-surface">
        <div className="container-x grid gap-10 md:grid-cols-3">
          {[[String(club.members.total), 'Mitglieder'], [String(club.members.adults), 'Erwachsene'], [String(club.members.juniors), 'Jugendliche']].map(([n, l], i) => (
            <Reveal key={l} delay={i * 0.08}><div className="num text-[56px] font-semibold leading-none tracking-[-0.04em] md:text-[72px]"><CountUp value={Number(n)} /></div><div className="mt-3 text-[15px] text-muted">{l}</div></Reveal>
          ))}
          <Reveal delay={0.3} className="text-[12.5px] text-muted-2 md:col-span-3">Mitgliederzahlen laut BTV-Vereinsprofil.</Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div><div className="eyebrow">Vorstand</div><h2 className="display-sm mt-3">Ansprechpartner.</h2></div>
            <a href={club.website} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1.5 text-[14px] font-medium text-green">Vollständiger Vorstand auf tennis-roettenbach.de<ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></a>
          </Reveal>
          <div className="mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-2">
            {club.board.map((b, i) => (
              <Reveal key={b.name} delay={i * 0.06} className="flex items-center gap-4 border-t border-line pt-5">
                <Avatar initials={b.name.split(' ').map((s) => s[0]).join('')} size="lg" tone={i} className="!ring-0" />
                <div><div className="text-[17px] font-semibold">{b.name}</div><div className="text-[14px] text-muted">{b.role}</div></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-wide">
          <Reveal className="max-w-xl"><div className="eyebrow">Anlage</div><h2 className="display-md mt-4">{club.address.street}.</h2><p className="lede mt-4">{club.tennisCourts} Tennisplätze am Lohmühlweg. Der Padel Court liegt im Sportpark der Gemeinde Röttenbach.</p></Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-12">
            <Reveal className="group md:col-span-8"><Picture name="shadow" alt="Spieler auf dem Sandplatz, von oben fotografiert" focus="40% 60%" sizes="(min-width: 768px) 66vw, 100vw" className="aspect-[16/9] rounded-[22px]" /></Reveal>
            <Reveal delay={0.1} className="group md:col-span-4"><Picture name="aerial" alt="Sandplatz von oben" focus="50% 55%" sizes="(min-width: 768px) 33vw, 100vw" className="aspect-[16/9] h-full rounded-[22px] md:aspect-auto" /></Reveal>
          </div>
        </div>
      </section>

      <section className="section-tight bg-ink text-white">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-6"><div className="eyebrow !text-white/50">Mitgliedschaft</div><h2 className="display-md mt-4">Werde Teil davon.</h2><p className="mt-5 max-w-md text-[16px] leading-relaxed text-white/65">Tennis auf sechs Plätzen, eigene Padel-Zeiten für Mitglieder und eine Gemeinschaft, die bleibt. Beiträge und Aufnahmeantrag findest du auf der Vereinsseite.</p></Reveal>
          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <address className="text-[15px] not-italic leading-relaxed text-white/75">{club.name}<br />{fullAddress}</address>
            <Button variant="light" size="lg" full arrow className="mt-6" onClick={() => window.open(club.website, '_blank', 'noreferrer')}>Zur Vereinsseite</Button>
          </Reveal>
        </div>
      </section>
    </Page>
  )
}
