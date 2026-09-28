import { Page } from '@/components/site/Page'
import { PageHero } from '@/components/site/PageHero'
import { Button } from '@/components/ui/Button'
import { Photo } from '@/components/ui/Photo'
import { Reveal } from '@/components/ui/Reveal'
import { Pill } from '@/components/ui/Pill'
import { club } from '@/lib/club'

export function Padel() {
  return (
    <Page>
      <PageHero eyebrow="Padel" title="Padel wächst in Röttenbach." lede="Ein Court im Sportpark der Gemeinde, öffentliche Zeiten für Röttenbacher, eigene Zeiten für TC-Mitglieder." variant="padel">
        <div className="flex flex-col gap-3 sm:flex-row"><Button variant="light" size="lg" arrow to="/padel/buchen" className="w-full sm:w-auto">Court buchen</Button><Button variant="outline-light" size="lg" to="/gutschein" className="w-full sm:w-auto">Padel verschenken</Button></div>
      </PageHero>

      <section className="section">
        <div className="container-wide grid items-center gap-12 lg:grid-cols-12">
          <Reveal className="group lg:col-span-7"><Photo variant="padel" className="aspect-[4/3] rounded-[24px]" /></Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <div className="flex gap-2"><Pill tone="green" dot>Hohe Auslastung</Pill><Pill tone="outline">Sportpark</Pill></div>
            <h2 className="display-md mt-5">Der Court.</h2>
            <p className="lede mt-5">Der Padel Court steht im {club.padel.location}. Er ist stark nachgefragt: Nicht alle Buchungswünsche können berücksichtigt werden. Der Verein hat den Bedarf für weitere Courts untersucht.</p>
            <dl className="mt-8 grid grid-cols-2 gap-6 text-[14px]">
              {[['Courts', '1'], ['Standort', 'Sportpark Röttenbach'], ['Öffentliche Zeiten', 'für Röttenbacher'], ['Mitgliederzeiten', 'für TC-Mitglieder']].map(([k, v]) => <div key={k}><dt className="text-muted">{k}</dt><dd className="mt-1 font-medium">{v}</dd></div>)}
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="section-tight bg-ink text-white">
        <div className="container-wide">
          <Reveal className="max-w-2xl"><div className="eyebrow !text-white/50">So funktioniert die Buchung</div><h2 className="display-md mt-4">Von bis wann du willst.</h2></Reveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-[20px] bg-white/10 md:grid-cols-4">
            {[['01', 'Tag wählen', 'Freie Zeiten auf einen Blick, öffentliche und Mitgliederzeiten markiert.'], ['02', 'Von – bis', 'Startzeit antippen, Endzeit antippen. Dauer und Preis passen sich an.'], ['03', 'Spieler', 'Mitglieder werden automatisch erkannt und zahlen weniger.'], ['04', 'Spielen', 'Flutlicht schaltet sich fünf Minuten vor Beginn automatisch ein.']].map(([n, t, s], i) => (
              <Reveal key={n} delay={i * 0.06} className="bg-ink p-7"><div className="num text-[13px] text-white/40">{n}</div><div className="mt-6 text-[19px] font-semibold">{t}</div><p className="mt-2 text-[14px] leading-relaxed text-white/60">{s}</p></Reveal>
            ))}
          </div>
          <p className="mt-4 text-[12.5px] text-white/35">Buchungsablauf als Demo. Zeiten, Preise und Belegung sind Beispiele.</p>
        </div>
      </section>

      <section className="section">
        <div className="container-wide grid gap-5 md:grid-cols-3">
          {[{ t: 'Öffentliche Zeiten', s: 'Für Röttenbacher Bürgerinnen und Bürger gibt es öffentliche Spielzeiten am Court.', v: 'people' as const }, { t: 'Mitgliederzeiten', s: 'TC-Mitglieder haben eigene Zeiten. Das System kann beides abbilden.', v: 'night' as const }, { t: 'Nachfrage', s: 'Die Auslastung ist hoch. Der Bedarf für weitere Courts wurde untersucht.', v: 'aerial' as const }].map((c, i) => (
            <Reveal key={c.t} delay={i * 0.06} className="group overflow-hidden rounded-[20px] bg-white hairline">
              <Photo variant={c.v} className="aspect-[4/3]" />
              <div className="p-6"><h3 className="text-[21px] font-semibold tracking-[-0.015em]">{c.t}</h3><p className="mt-2 text-[15px] leading-relaxed text-muted">{c.s}</p></div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-tight border-t border-line">
        <div className="container-x flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <Reveal><h2 className="display-sm">Heute noch spielen?</h2><p className="mt-2 text-[15.5px] text-muted">Wähle Tag, Start und Ende. Fertig.</p></Reveal>
          <Reveal delay={0.1}><Button size="xl" arrow to="/padel/buchen">Court buchen</Button></Reveal>
        </div>
      </section>
    </Page>
  )
}
