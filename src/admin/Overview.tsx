import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Lightbulb } from 'lucide-react'
import { PageTitle, statusTone } from './ui'
import { Pill } from '@/components/ui/Pill'
import { Avatar } from '@/components/ui/Avatar'
import { adminBookings } from '@/lib/data'
import { EASE } from '@/lib/motion'
import { cn } from '@/lib/cn'

const timeline = [
  { t: '08:00', v: 1 }, { t: '09:30', v: 1 }, { t: '11:00', v: 0 }, { t: '12:30', v: 2 }, { t: '14:00', v: 1 }, { t: '15:30', v: 1 }, { t: '17:00', v: 1 }, { t: '18:30', v: 3 }, { t: '20:00', v: 1 },
]
const fade = (d: number) => ({ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: EASE, delay: d } })

export function Overview() {
  return (
    <div>
      <PageTitle title="Guten Abend, Günter." sub="Hier ist der aktuelle Stand deiner Anlage." action={<span className="num text-[13px] text-muted">Samstag, 26. September · 19:12</span>} />

      {/* PRIMARY: the court right now */}
      <motion.section {...fade(0)} className="overflow-hidden rounded-[20px] bg-ink text-white">
        <div className="grid lg:grid-cols-12">
          <div className="relative p-6 md:p-8 lg:col-span-7">
            <div className="flex items-center justify-between">
              <div className="text-[12px] font-medium uppercase tracking-[0.16em] text-white/50">Padel Court 01</div>
              <span className="flex items-center gap-2 text-[12.5px] font-medium text-[#8FD0A8]"><span className="pulse-dot size-1.5 rounded-full bg-current" />Aktuell belegt</span>
            </div>
            <div className="num mt-6 whitespace-nowrap text-[38px] font-semibold leading-none tracking-[-0.04em] sm:text-[48px] md:text-[64px]">18:30 <span className="text-white/35">–</span> 20:00</div>
            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
              <div className="flex items-center gap-3"><div className="flex -space-x-2">{['LP', 'MM', 'JS', 'TH'].map((p, i) => <Avatar key={p} initials={p} tone={i} className="!ring-ink" />)}</div><div><div className="text-[15px] font-medium">Lazar Popovic</div><div className="text-[12.5px] text-white/50">+3 Spieler · Doppel · bezahlt</div></div></div>
              <div className="flex items-center gap-2.5 rounded-full bg-white/[0.07] py-1.5 pl-2 pr-3.5 text-[13px]"><Lightbulb size={15} className="glow-light text-sand" />Flutlicht <span className="font-semibold">AN</span><span className="num text-white/40">seit 18:25</span></div>
            </div>
            {/* day timeline */}
            <div className="mt-10">
              <div className="mb-2 flex justify-between text-[11.5px] text-white/45"><span>Heute</span><span className="num">8 / 9 Slots belegt · 86 %</span></div>
              <div className="flex h-9 gap-[3px]">
                {timeline.map((h, i) => (
                  <motion.div key={h.t} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.5, ease: EASE, delay: 0.3 + i * 0.03 }} style={{ transformOrigin: 'bottom' }} className={cn('flex-1 rounded-[4px]', h.v === 3 ? 'bg-[#8FD0A8]' : h.v === 1 ? 'bg-white/45' : h.v === 2 ? 'bg-sand/70' : 'bg-white/10')} title={h.t} />
                ))}
              </div>
              <div className="num mt-1.5 flex justify-between text-[10.5px] text-white/35"><span>08:00</span><span>22:00</span></div>
            </div>
          </div>
          {/* SECONDARY: what happens next */}
          <div className="border-t border-white/10 p-6 md:p-8 lg:col-span-5 lg:border-l lg:border-t-0">
            <div className="text-[12px] font-medium uppercase tracking-[0.16em] text-white/50">Als Nächstes</div>
            <div className="mt-6 space-y-5">
              {[{ t: '20:00 — 21:30', n: 'Max Mustermann', s: '+3 Spieler · Gast · PayPal', i: 'MM', tone: 1 }, { t: '21:30 — 22:00', n: 'Flutlicht aus', s: 'Automatisch, 5 Min. nach Spielende', i: null, tone: 0 }].map((x) => (
                <div key={x.t} className="flex items-start gap-4">
                  {x.i ? <Avatar initials={x.i} tone={x.tone} className="!ring-ink" /> : <span className="grid size-9 place-items-center rounded-full bg-white/[0.07]"><Lightbulb size={15} className="text-white/60" /></span>}
                  <div><div className="num text-[17px] font-semibold tracking-[-0.01em]">{x.t}</div><div className="text-[14px]">{x.n}</div><div className="text-[12.5px] text-white/45">{x.s}</div></div>
                </div>
              ))}
            </div>
            <div className="mt-8 border-t border-white/10 pt-5">
              <div className="text-[12px] font-medium uppercase tracking-[0.16em] text-white/50">Hinweise</div>
              <ul className="mt-3 space-y-2.5 text-[13.5px]">
                <li className="flex gap-2.5"><span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-sand" /><span>Mannschaftsspiel 13:00–18:00 <span className="text-white/45">· Hinweis war aktiv</span></span></li>
                <li className="flex gap-2.5"><span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-white/40" /><span>Jugendturnier So 14:00–18:30 <span className="text-white/45">· Court gesperrt</span></span></li>
                <li className="flex gap-2.5"><span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-clay" /><span>1 offene Zahlung <span className="text-white/45">· Lena Hofmann, 16,00 €</span></span></li>
              </ul>
              <Link to="/admin/kalender" className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-white/80 hover:text-white">Kalender öffnen<ArrowRight size={14} /></Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* TERTIARY: metrics as a quiet strip */}
      <motion.div {...fade(0.15)} className="mt-6 grid grid-cols-2 divide-line rounded-[16px] bg-white hairline md:grid-cols-4 md:divide-x">
        {[['Auslastung', '86 %', '+4 %'], ['Buchungen heute', '9', '+2'], ['Spieler heute', '31', '±0'], ['Umsatz heute', '€184', '+12 %']].map(([l, v, d], i) => (
          <div key={l} className={cn('p-5', i < 2 && 'border-b border-line md:border-b-0')}>
            <div className="text-[12.5px] text-muted">{l}</div>
            <div className="mt-1.5 flex items-baseline gap-2"><span className="num text-[26px] font-semibold leading-none tracking-[-0.03em]">{v}</span><span className={cn('num text-[12px] font-medium', d.startsWith('+') ? 'text-green' : 'text-muted')}>{d}</span></div>
          </div>
        ))}
      </motion.div>

      <motion.section {...fade(0.25)} className="mt-6 rounded-[16px] bg-white hairline">
        <header className="flex items-center justify-between px-5 py-3.5"><h2 className="text-[14px] font-semibold">Buchungen heute</h2><Link to="/admin/buchungen" className="text-[13px] font-medium text-green hover:underline">Alle ansehen</Link></header>
        <div className="overflow-x-auto border-t border-line">
          <table className="w-full min-w-[640px] text-[14px]">
            <thead className="text-left text-[11.5px] uppercase tracking-[0.1em] text-muted"><tr>{['Zeit', 'Spieler', 'Zahlung', 'Betrag', 'Status'].map((h) => <th key={h} className="px-5 py-2.5 font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-line">
              {adminBookings.slice(0, 4).map((b) => (
                <tr key={b.id} className="transition-colors hover:bg-paper/70">
                  <td className="num px-5 py-3 font-medium">{b.time}</td>
                  <td className="px-5 py-3"><div className="flex items-center gap-2.5"><Avatar initials={b.name.split(' ').map((s) => s[0]).join('')} size="sm" />{b.name}<span className="text-muted">+{b.players - 1}</span></div></td>
                  <td className="px-5 py-3 text-muted">{b.method}</td>
                  <td className="num px-5 py-3">{b.amount}</td>
                  <td className="px-5 py-3"><Pill tone={statusTone(b.status)}>{b.status}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>
    </div>
  )
}
