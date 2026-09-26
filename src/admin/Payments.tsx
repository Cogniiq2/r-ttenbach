import { motion } from 'framer-motion'
import { Card, Metric, PageTitle, statusTone } from './ui'
import { Pill } from '@/components/ui/Pill'
import { adminBookings } from '@/lib/data'
import { EASE } from '@/lib/motion'

const week = [92, 148, 121, 176, 203, 184, 96]
const methods = [['Apple Pay', 42], ['Karte', 28], ['PayPal', 21], ['Klarna', 9]] as const

export function Payments() {
  const max = Math.max(...week)
  return (
    <div>
      <PageTitle title="Zahlungen" sub="Umsätze, Auszahlungen und Zahlungsarten. Demo-Daten." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Heute" value="€184" delta="+12 %" tone="up" hint="vs. letzter Samstag" />
        <Metric label="Dieser Monat" value="€3.412" delta="+8 %" tone="up" hint="vs. August" />
        <Metric label="Rückerstattungen" value="€48" delta="3" hint="Buchungen storniert" />
        <Metric label="Nächste Auszahlung" value="€1.206" hint="Mi, 30. Sep · Stripe" />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card title="Umsatz diese Woche" className="lg:col-span-2">
          <div className="flex h-[180px] items-end gap-3">
            {week.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <span className="num text-[11px] text-muted">€{v}</span>
                <motion.div initial={{ height: 0 }} animate={{ height: `${(v / max) * 130}px` }} transition={{ duration: 0.7, ease: EASE, delay: i * 0.05 }} className={i === 5 ? 'w-full rounded-[6px] bg-green' : 'w-full rounded-[6px] bg-green/25'} />
                <span className="text-[11.5px] text-muted">{['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'][i]}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Zahlungsarten">
          <ul className="space-y-4">
            {methods.map(([m, p], i) => (
              <li key={m}><div className="mb-1.5 flex justify-between text-[13.5px]"><span className="font-medium">{m}</span><span className="num text-muted">{p} %</span></div><div className="h-1.5 overflow-hidden rounded-full bg-line"><motion.div initial={{ width: 0 }} animate={{ width: `${p}%` }} transition={{ duration: 0.8, ease: EASE, delay: 0.2 + i * 0.08 }} className="h-full rounded-full bg-green" /></div></li>
            ))}
          </ul>
        </Card>
      </div>
      <Card className="mt-4" title="Letzte Transaktionen" pad={false}>
        <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-[14px]"><thead className="text-left text-[12px] uppercase tracking-[0.1em] text-muted"><tr>{['Zeit', 'Kunde', 'Zahlungsart', 'Betrag', 'Status'].map((h) => <th key={h} className="px-5 py-3 font-medium">{h}</th>)}</tr></thead><tbody className="divide-y divide-line">{adminBookings.map((b) => <tr key={b.id} className="hover:bg-paper/70"><td className="num px-5 py-3.5">{b.time}</td><td className="px-5 py-3.5 font-medium">{b.name}</td><td className="px-5 py-3.5 text-muted">{b.method}</td><td className="num px-5 py-3.5">{b.amount}</td><td className="px-5 py-3.5"><Pill tone={statusTone(b.status)}>{b.status}</Pill></td></tr>)}</tbody></table></div>
      </Card>
    </div>
  )
}
