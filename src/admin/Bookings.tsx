import { useState } from 'react'
import { Search, Download } from 'lucide-react'
import { Card, PageTitle, statusTone } from './ui'
import { Pill } from '@/components/ui/Pill'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { adminBookings } from '@/lib/data'
import { useToast } from '@/lib/toast'
import { cn } from '@/lib/cn'

const tabs = ['Alle', 'Bezahlt', 'Offen', 'Storniert']

export function Bookings() {
  const { toast } = useToast()
  const [tab, setTab] = useState('Alle')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState<(typeof adminBookings)[number] | null>(null)
  const list = adminBookings.filter((b) => (tab === 'Alle' || b.status === tab) && b.name.toLowerCase().includes(q.toLowerCase()))
  return (
    <div>
      <PageTitle title="Buchungen" sub="Alle Buchungen des Padel Courts." action={<Button variant="secondary" size="sm" icon={<Download size={14} />} onClick={() => toast('Export gestartet', 'CSV · Demo')}>Exportieren</Button>} />
      <Card pad={false}>
        <div className="flex flex-col gap-3 border-b border-line p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1">{tabs.map((t) => <button key={t} onClick={() => setTab(t)} className={cn('pressable h-9 rounded-[8px] px-3 text-[13.5px] font-medium', tab === t ? 'bg-ink text-white' : 'text-muted hover:bg-paper hover:text-ink')}>{t}</button>)}</div>
          <label className="flex h-9 items-center gap-2 rounded-[8px] border border-line bg-paper px-3 text-[13.5px] focus-within:border-green sm:w-[240px]"><Search size={14} className="text-muted" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Spieler suchen" className="w-full bg-transparent outline-none placeholder:text-muted-2" /></label>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-[14px]">
            <thead className="text-left text-[12px] uppercase tracking-[0.1em] text-muted"><tr>{['Zeit', 'Dauer', 'Spieler', 'Zahlung', 'Betrag', 'Status', ''].map((h, i) => <th key={i} className="px-5 py-3 font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-line">
              {list.map((b) => (
                <tr key={b.id} onClick={() => setOpen(b)} className="cursor-pointer transition-colors hover:bg-paper/70">
                  <td className="num px-5 py-3.5 font-medium">{b.time}</td>
                  <td className="num px-5 py-3.5 text-muted">{b.duration}</td>
                  <td className="px-5 py-3.5"><div className="flex items-center gap-2.5"><Avatar initials={b.name.split(' ').map((s) => s[0]).join('')} size="sm" />{b.name}<span className="text-muted">+{b.players - 1}</span></div></td>
                                    <td className="px-5 py-3.5 text-muted">{b.method}</td>
                  <td className="num px-5 py-3.5">{b.amount}</td>
                  <td className="px-5 py-3.5"><Pill tone={statusTone(b.status)}>{b.status}</Pill></td>
                  <td className="px-5 py-3.5 text-right text-[13px] text-green">Details</td>
                </tr>
              ))}
              {list.length === 0 && <tr><td colSpan={7} className="px-5 py-14 text-center text-muted">Keine Buchungen gefunden.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
      <Modal open={!!open} onClose={() => setOpen(null)} side>
        {open && (
          <div className="p-6 pt-14">
            <div className="eyebrow">Buchung</div>
            <div className="num mt-2 text-[26px] font-semibold tracking-[-0.02em]">{open.time}</div>
            <div className="text-[14px] text-muted">Samstag, 26. September · {open.court}</div>
            <div className="mt-4"><Pill tone={statusTone(open.status)}>{open.status}</Pill></div>
            <dl className="mt-6 divide-y divide-line border-y border-line text-[14px]">
              {[['Gebucht von', open.name], ['Dauer', open.duration], ['Spieler', `${open.players}`], ['Zahlungsart', open.method], ['Betrag', open.amount], ['Flutlicht', 'Automatisch'], ['Buchungsnummer', `TCR-2609-${open.time.slice(0, 2)}${open.time.slice(3, 5)}`]].map(([k, v]) => <div key={k} className="flex justify-between py-3"><dt className="text-muted">{k}</dt><dd className="num font-medium">{v}</dd></div>)}
            </dl>
            <div className="mt-6 flex gap-2"><Button variant="secondary" full onClick={() => { toast('E-Mail gesendet', 'Buchungsbestätigung · Demo'); setOpen(null) }}>Bestätigung senden</Button><Button variant="dark" full className="!bg-[#9A3B3B] hover:!bg-[#7E2F2F]" onClick={() => { toast('Buchung storniert', 'Rückerstattung ausgelöst · Demo'); setOpen(null) }}>Stornieren</Button></div>
          </div>
        )}
      </Modal>
    </div>
  )
}
