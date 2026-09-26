import { Page } from '@/components/site/Page'
import { PageHero } from '@/components/site/PageHero'
import { Button } from '@/components/ui/Button'
import { Photo } from '@/components/ui/Photo'
import { Reveal } from '@/components/ui/Reveal'
import { Pill } from '@/components/ui/Pill'

export function Padel() {
  return (
    <Page>
      <PageHero eyebrow="Padel" title="Padel wächst in Röttenbach." lede="Ein Court, unglaublich viel Nachfrage. Online buchen, Flutlicht automatisch, direkt spielen." variant="padel">
        <div className="flex gap-3"><Button variant="light" size="lg" arrow to="/padel/buchen">Court buchen</Button><Button variant="outline-light" size="lg" to="/gutschein">Padel verschenken</Button></div>
      </PageHero>

      <section className="section">
        <div className="container-wide grid items-center gap-12 lg:grid-cols-12">
          <Reveal className="group lg:col-span-7"><Photo variant="padel" className="aspect-[4/3] rounded-[24px]" caption="Padel Court 01" /></Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <div className="flex gap-2"><Pill tone="green" dot>Geöffnet</Pill><Pill tone="outline">Outdoor</Pill><Pill tone="outline">Flutlicht</Pill></div>
            <h2 className="display-md mt-5">Der Court.</h2>
            <p className="lede mt-5">Panoramaglas, Kunstrasen mit Sandfüllung, LED-Flutlicht. Seit 2024 der meistgebuchte Platz der Anlage.</p>
            <dl className="mt-8 grid grid-cols-2 gap-6 text-[14px]">
              {[['Maße', '20 × 10 m'], ['Belag', 'Kunstrasen'], ['Spielzeit', '90 Minuten'], ['Buchbar', '08:00 – 22:00']].map(([k, v]) => <div key={k}><dt className="text-muted">{k}</dt><dd className="mt-1 font-medium">{v}</dd></div>)}
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="section-tight bg-ink text-white">
        <div className="container-wide">
          <Reveal className="max-w-2xl"><div className="eyebrow !text-white/50">So funktioniert's</div><h2 className="display-md mt-4">Buchen in unter einer Minute.</h2></Reveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-[20px] bg-white/10 md:grid-cols-4">
            {[['01', 'Zeit wählen', 'Freie Slots in Echtzeit, 90 Minuten pro Buchung.'], ['02', 'Spieler angeben', 'Mitglieder werden automatisch erkannt und zahlen weniger.'], ['03', 'Bezahlen', 'Apple Pay, PayPal, Karte oder Klarna.'], ['04', 'Spielen', 'Flutlicht schaltet sich automatisch fünf Minuten vorher ein.']].map(([n, t, s], i) => (
              <Reveal key={n} delay={i * 0.06} className="bg-ink p-7"><div className="num text-[13px] text-white/40">{n}</div><div className="mt-6 text-[19px] font-semibold">{t}</div><p className="mt-2 text-[14px] leading-relaxed text-white/60">{s}</p></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-wide grid gap-5 md:grid-cols-3">
          {[{ t: 'Teams', s: 'Erste Padel-Mannschaft in Planung für 2027.', v: 'people' as const }, { t: 'Community', s: 'Padel Nights, Americanos, offene Spielrunden.', v: 'night' as const }, { t: 'Ausbau', s: 'Ein zweiter Court ist in Prüfung. Die Nachfrage ist da.', v: 'aerial' as const }].map((c, i) => (
            <Reveal key={c.t} delay={i * 0.06} className="group overflow-hidden rounded-[20px] border border-line bg-white">
              <Photo variant={c.v} className="aspect-[4/3]" />
              <div className="p-6"><h3 className="text-[21px] font-semibold tracking-[-0.015em]">{c.t}</h3><p className="mt-2 text-[15px] leading-relaxed text-muted">{c.s}</p></div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-tight border-t border-line">
        <div className="container-x flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <Reveal><h2 className="display-sm">Heute noch spielen?</h2><p className="mt-2 text-[15.5px] text-muted">Nächster freier Slot: 19:30 – 21:00</p></Reveal>
          <Reveal delay={0.1}><Button size="xl" arrow to="/padel/buchen">Court buchen</Button></Reveal>
        </div>
      </section>
    </Page>
  )
}
