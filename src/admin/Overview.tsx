import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Lightbulb } from 'lucide-react'
import { Card, Metric, PageTitle, statusTone } from './ui'
import { Pill } from '@/components/ui/Pill'
import { Avatar } from '@/components/ui/Avatar'
import { adminBookings } from '@/lib/data'
import { EASE } from '@/lib/motion'

const hours = [
  { h: '08', v: 1 }, { h: '09', v: 1 }, { h: '11', v: 0 }, { h: '12', v: 0.5 }, { h: '14', v: 1 }, { h: '15', v: 1 }, { h: '17', v: 1 }, { h: '18', v: 1 }, { h: '20', v: 1 },
]

export function Overview() {
  return (
    <div>
      <PageTitle title="Guten Abend, Günter." sub="Hier ist der aktuelle Stand deiner Anlage." action={<Pill tone="outline">Demo-Daten · Sa, 26. Sep</Pill>} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Auslastung', value: '86 %', delta: '+4 %', tone: 'up' as const },
          { label: 'Buchungen heute', value: '9', delta: '+2', tone: 'up' as const },
          { label: 'Spieler heute', value: '31', delta: '±0', tone: 'neutral' as const },
          { label: 'Umsatz', value: '€184', delta: '+12 %', tone: 'up' as const },
        ].map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: i * 0.06 }}><Metric {...m} /></motion.div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.25 }} className="xl:col-span-2">
          <Card pad={false} title="Live · Padel Court 01" action={<span className="flex items-center gap-2 text-[12.5px] font-medium text-green"><span className="pulse-dot size-1.5 rounded-full bg-green" />Aktuell belegt</span>}>
            <div className="grid md:grid-cols-2">
              <div className="border-b border-line p-5 md:border-b-0 md:border-r">
                <div className="text-[12px] font-medium uppercase tracking-[0.12em] text-muted">Jetzt</div>
                <div className="num mt-2 text-[28px] font-semibold tracking-[-0.02em]">18:30 – 20:00</div>
                <div className="mt-4 flex items-center gap-3"><Avatar initials="LP" tone={0} /><div><div className="text-[15px] font-medium">Lazar Popovic</div><div className="text-[12.5px] text-muted">+3 Spieler · Doppel</div></div></div>
                <div className="mt-5 flex items-center gap-2 rounded-[10px] bg-sand-soft px-3 py-2 text-[13px] text-[#7A5A22]"><Lightbulb size={14} className="glow-light text-sand" />Flutlicht <span className="font-semibold">AN</span><span className="ml-auto num text-[12px] text-[#7A5A22]/70">seit 18:25</span></div>
              </div>
              <div className="p-5">
                <div className="text-[12px] font-medium uppercase tracking-[0.12em] text-muted">Nächste Buchung</div>
                <div className="num mt-2 text-[28px] font-semibold tracking-[-0.02em] text-ink/70">20:00 – 21:30</div>
                <div className="mt-4 flex items-center gap-3"><Avatar initials="MM" tone={1} /><div><div className="text-[15px] font-medium">Max Mustermann</div><div className="text-[12.5px] text-muted">+3 Spieler · Gast</div></div></div>
                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-[11.5px] text-muted"><span>Belegung heute</span><span className="num">8 / 9 Slots</span></div>
                  <div className="flex h-7 gap-[3px]">
                    {hours.map((h, i) => (
                      <motion.div key={h.h} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.5, ease: EASE, delay: 0.4 + i * 0.03 }} style={{ transformOrigin: 'bottom' }} className={h.v === 1 ? 'flex-1 rounded-[3px] bg-green' : h.v === 0.5 ? 'flex-1 rounded-[3px] bg-sand' : 'flex-1 rounded-[3px] bg-line'} title={`${h.h}:00`} />
                    ))}
                  </div>
                  <div className="num mt-1.5 flex justify-between text-[10.5px] text-muted-2"><span>08:00</span><span>22:00</span></div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}>
          <Card title="Hinweise" pad={false}>
            <ul className="divide-y divide-line">
              {[
                ['Mannschaftsspiel 13:00–18:00', 'Padel geöffnet · Hinweis aktiv', 'sand'],
                ['Jugendturnier So 14:00–18:30', 'Padel Court gesperrt', 'neutral'],
                ['1 offene Zahlung', 'Lena Hofmann · 16,00 € (Klarna)', 'clay'],
              ].map(([a, b, tone]) => (
                <li key={a} className="flex items-start gap-3 px-5 py-3.5"><span className={tone === 'sand' ? 'mt-1.5 size-2 rounded-full bg-sand' : tone === 'clay' ? 'mt-1.5 size-2 rounded-full bg-clay' : 'mt-1.5 size-2 rounded-full bg-muted-2'} /><div><div className="text-[14px] font-medium">{a}</div><div className="text-[12.5px] text-muted">{b}</div></div></li>
              ))}
            </ul>
            <Link to="/admin/kalender" className="flex items-center justify-between border-t border-line px-5 py-3 text-[13px] font-medium text-green hover:bg-paper">Kalender öffnen<ArrowRight size={14} /></Link>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.35 }} className="mt-4">
        <Card title="Buchungen heute" pad={false} action={<Link to="/admin/buchungen" className="text-[13px] font-medium text-green hover:underline">Alle ansehen</Link>}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-[14px]">
              <thead className="text-left text-[12px] uppercase tracking-[0.1em] text-muted"><tr>{['Zeit', 'Spieler', 'Court', 'Zahlung', 'Betrag', 'Status'].map((h) => <th key={h} className="px-5 py-3 font-medium">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-line">
                {adminBookings.slice(0, 4).map((b) => (
                  <tr key={b.id} className="transition-colors hover:bg-paper/70">
                    <td className="num px-5 py-3 font-medium">{b.time}</td>
                    <td className="px-5 py-3"><div className="flex items-center gap-2.5"><Avatar initials={b.name.split(' ').map((s) => s[0]).join('')} size="sm" />{b.name}<span className="text-muted">+{b.players - 1}</span></div></td>
                    <td className="px-5 py-3 text-muted">{b.court}</td>
                    <td className="px-5 py-3 text-muted">{b.method}</td>
                    <td className="num px-5 py-3">{b.amount}</td>
                    <td className="px-5 py-3"><Pill tone={statusTone(b.status)}>{b.status}</Pill></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
