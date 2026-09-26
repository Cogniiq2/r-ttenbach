import { Plus } from 'lucide-react'
import { Card, Metric, PageTitle } from './ui'
import { Pill } from '@/components/ui/Pill'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/lib/toast'

const vouchers = [['GS-2026-0148', '50,00 €', '50,00 €', 'Aktiv'], ['GS-2026-0147', '25,00 €', '9,00 €', 'Teilweise'], ['GS-2026-0142', '100,00 €', '0,00 €', 'Eingelöst'], ['GS-2026-0139', '50,00 €', '50,00 €', 'Aktiv']]

export function Vouchers() {
  const { toast } = useToast()
  return (
    <div>
      <PageTitle title="Gutscheine" sub="Verkaufte und eingelöste Padel-Gutscheine." action={<Button size="sm" variant="dark" icon={<Plus size={14} />} onClick={() => toast('Gutschein erstellt', 'GS-2026-0149 · 50,00 €')}>Gutschein erstellen</Button>} />
      <div className="grid gap-4 sm:grid-cols-3"><Metric label="Verkauft (Monat)" value="12" delta="+4" tone="up" /><Metric label="Offener Wert" value="€430" hint="noch nicht eingelöst" /><Metric label="Eingelöst (Monat)" value="€175" hint="7 Buchungen" /></div>
      <Card className="mt-4" pad={false} title="Alle Gutscheine">
        <div className="overflow-x-auto"><table className="w-full min-w-[560px] text-[14px]"><thead className="text-left text-[12px] uppercase tracking-[0.1em] text-muted"><tr>{['Code', 'Wert', 'Restwert', 'Status'].map((h) => <th key={h} className="px-5 py-3 font-medium">{h}</th>)}</tr></thead><tbody className="divide-y divide-line">{vouchers.map(([c, v, r, s]) => <tr key={c} className="hover:bg-paper/70"><td className="num px-5 py-3.5 font-medium">{c}</td><td className="num px-5 py-3.5">{v}</td><td className="num px-5 py-3.5">{r}</td><td className="px-5 py-3.5"><Pill tone={s === 'Aktiv' ? 'green' : s === 'Teilweise' ? 'sand' : 'neutral'}>{s}</Pill></td></tr>)}</tbody></table></div>
      </Card>
    </div>
  )
}
