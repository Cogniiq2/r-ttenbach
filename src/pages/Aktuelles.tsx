import { Page } from '@/components/site/Page'
import { Photo, type PhotoVariant } from '@/components/ui/Photo'
import { Reveal } from '@/components/ui/Reveal'
import { Pill } from '@/components/ui/Pill'

const news: { d: string; t: string; s: string; v: PhotoVariant; c: string }[] = [
  { d: '22. Sep 2026', t: 'Jugendturnier: 124 Teilnehmer, ein Wochenende', s: 'Rekordbeteiligung beim 42. Röttenbacher Jugendturnier. Die Finals am Sonntag hatten Zuschauer bis zum Zaun.', v: 'youth', c: 'Jugend' },
  { d: '15. Sep 2026', t: 'Online-Buchung für den Padel Court ist live', s: 'Ab sofort lässt sich der Padel Court in unter einer Minute buchen. Mitglieder werden automatisch erkannt.', v: 'padel', c: 'Padel' },
  { d: '02. Sep 2026', t: 'Herren 30 sichern Klassenerhalt', s: 'Ein 5:4 im letzten Heimspiel gegen Herzogenaurach reicht für die Bezirksliga.', v: 'tennis', c: 'Tennis' },
  { d: '20. Aug 2026', t: 'Flutlicht jetzt automatisch', s: 'Das Padel-Flutlicht schaltet sich fünf Minuten vor jeder Buchung ein und fünf Minuten danach aus.', v: 'night', c: 'Verein' },
]

export function Aktuelles() {
  return (
    <Page className="pt-[68px] md:pt-[76px]">
      <section className="section">
        <div className="container-x">
          <Reveal className="max-w-2xl"><div className="eyebrow">Aktuelles</div><h1 className="display-lg mt-4">Neues vom Lohmühlweg.</h1></Reveal>
          <div className="mt-14 divide-y divide-line border-t border-line">
            {news.map((n, i) => (
              <Reveal key={n.t} delay={i * 0.04} className="group grid cursor-pointer gap-6 py-8 md:grid-cols-12 md:items-center">
                <div className="num text-[13px] text-muted md:col-span-2">{n.d}</div>
                <div className="md:col-span-7"><div className="flex items-center gap-3"><Pill tone={n.c === 'Padel' ? 'green' : 'neutral'}>{n.c}</Pill></div><h2 className="mt-3 text-[24px] font-semibold tracking-[-0.02em] transition-colors group-hover:text-green md:text-[28px]">{n.t}</h2><p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted">{n.s}</p></div>
                <div className="md:col-span-3"><Photo variant={n.v} className="aspect-[16/10] rounded-[14px]" /></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </Page>
  )
}
