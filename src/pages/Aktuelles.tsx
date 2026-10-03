import { Page } from '@/components/site/Page'
import { Picture } from '@/components/ui/Picture'
import type { ImageName } from '@/lib/images'
import { Reveal } from '@/components/ui/Reveal'
import { Pill } from '@/components/ui/Pill'
import { club } from '@/lib/club'

const news: { d: string; t: string; s: string; v: ImageName; c: string }[] = [
  { d: 'September 2026', t: club.youthTournament.title, s: `Vom ${club.youthTournament.dates} auf der Anlage am Lohmühlweg. Details auf der Vereinsseite.`, v: 'aerial', c: 'Jugend' },
  { d: 'September 2026', t: 'Padel: hohe Auslastung', s: 'Der Padel Court im Sportpark ist stark nachgefragt. Nicht alle Buchungswünsche können berücksichtigt werden. Der Verein hat den Bedarf für weitere Courts untersucht.', v: 'flatlay', c: 'Padel' },
  { d: 'Demo', t: 'Online-Buchung mit freier Dauer', s: 'Startzeit und Endzeit selbst wählen, Mitglieder werden automatisch erkannt, Flutlicht schaltet sich automatisch. Diese Oberfläche ist ein Konzept.', v: 'serve', c: 'Konzept' },
]

export function Aktuelles() {
  return (
    <Page className="pt-[68px] md:pt-[76px]">
      <section className="section">
        <div className="container-x">
          <Reveal className="max-w-2xl"><div className="eyebrow">Aktuelles</div><h1 className="display-lg mt-4">Neues vom Lohmühlweg.</h1></Reveal>
          <div className="mt-14 divide-y divide-line border-t border-line">
            {news.map((n, i) => (
              <Reveal key={n.t} delay={i * 0.04} className="group grid gap-6 py-8 md:grid-cols-12 md:items-center">
                <div className="num text-[13px] text-muted md:col-span-2">{n.d}</div>
                <div className="md:col-span-7"><Pill tone={n.c === 'Padel' ? 'green' : 'neutral'}>{n.c}</Pill><h2 className="mt-3 text-[24px] font-semibold tracking-[-0.02em] md:text-[28px]">{n.t}</h2><p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted">{n.s}</p></div>
                <div className="overflow-hidden rounded-[14px] md:col-span-3"><Picture name={n.v} alt="" sizes="(min-width: 768px) 25vw, 100vw" className="aspect-[16/10]" /></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </Page>
  )
}
