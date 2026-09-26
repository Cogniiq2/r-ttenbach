import { useState } from 'react'
import { Search, UserPlus } from 'lucide-react'
import { Card, PageTitle, statusTone } from './ui'
import { Pill } from '@/components/ui/Pill'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Toggle } from '@/components/ui/Toggle'
import { members } from '@/lib/data'
import { useToast } from '@/lib/toast'

export function Members() {
  const { toast } = useToast()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState<(typeof members)[number] | null>(null)
  const [padel, setPadel] = useState(true)
  const list = members.filter((m) => m.name.toLowerCase().includes(q.toLowerCase()) || m.type.toLowerCase().includes(q.toLowerCase()))
  const initials = (n: string) => n.split(' ').map((s) => s[0]).join('')
  return (
    <div>
      <PageTitle title="Mitglieder" sub="269 Mitglieder · 214 aktiv · 41 Padel freigeschaltet" action={<Button size="sm" variant="dark" icon={<UserPlus size={14} />} onClick={() => toast('Einladung gesendet', 'Demo')}>Mitglied einladen</Button>} />
      <Card pad={false}>
        <div className="border-b border-line p-3">
          <label className="flex h-10 items-center gap-2 rounded-[10px] border border-line bg-paper px-3 text-[14px] focus-within:border-green focus-within:bg-white md:max-w-[360px]"><Search size={15} className="text-muted" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name oder Typ suchen…" className="w-full bg-transparent outline-none placeholder:text-muted-2" /></label>
        </div>
        <ul className="divide-y divide-line">
          {list.map((m) => (
            <li key={m.id}>
              <button onClick={() => { setOpen(m); setPadel(m.padel) }} className="flex w-full items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-paper/70">
                <Avatar initials={initials(m.name)} />
                <div className="min-w-0 flex-1"><div className="truncate text-[15px] font-medium">{m.name}</div><div className="text-[12.5px] text-muted">{m.type}</div></div>
                <div className="hidden text-[13px] text-muted sm:block num">{m.bookings} Buchungen</div>
                <Pill tone={statusTone(m.status)}>{m.status}</Pill>
              </button>
            </li>
          ))}
          {list.length === 0 && <li className="px-5 py-14 text-center text-muted">Kein Mitglied gefunden.</li>}
        </ul>
      </Card>
      <Modal open={!!open} onClose={() => setOpen(null)} side>
        {open && (
          <div className="p-6 pt-14">
            <div className="flex items-center gap-4"><Avatar initials={initials(open.name)} size="lg" /><div><div className="text-[22px] font-semibold tracking-[-0.02em]">{open.name}</div><div className="text-[13.5px] text-muted">{open.email}</div></div></div>
            <dl className="mt-6 divide-y divide-line border-y border-line text-[14px]">
              <div className="flex justify-between py-3"><dt className="text-muted">Mitglied seit</dt><dd className="num font-medium">{open.since}</dd></div>
              <div className="flex justify-between py-3"><dt className="text-muted">Status</dt><dd><Pill tone={statusTone(open.status)}>{open.status}</Pill></dd></div>
              <div className="flex items-center justify-between py-3"><dt className="text-muted">Padel</dt><dd className="flex items-center gap-2 text-[13.5px]">{padel ? 'freigeschaltet' : 'gesperrt'}<Toggle size="sm" checked={padel} onChange={(v) => { setPadel(v); toast(v ? 'Padel freigeschaltet' : 'Padel gesperrt', open.name) }} /></dd></div>
              <div className="flex justify-between py-3"><dt className="text-muted">Buchungen</dt><dd className="num font-medium">{open.bookings}</dd></div>
              <div className="flex justify-between py-3"><dt className="text-muted">Typ</dt><dd className="font-medium">{open.type}</dd></div>
            </dl>
            <div className="mt-6"><div className="mb-2 text-[12px] font-medium uppercase tracking-[0.12em] text-muted">Letzte Buchungen</div><ul className="space-y-1.5 text-[13.5px]">{['Sa, 26. Sep · 18:30–20:00', 'Di, 22. Sep · 09:30–11:00', 'Fr, 18. Sep · 20:00–21:30'].slice(0, Math.min(3, Math.max(1, open.bookings))).map((b) => <li key={b} className="num flex justify-between rounded-[8px] bg-paper px-3 py-2"><span>{b}</span><span className="text-muted">Padel</span></li>)}</ul></div>
            <div className="mt-6 flex gap-2"><Button variant="secondary" full onClick={() => toast('E-Mail geöffnet', 'Demo', 'info')}>Nachricht</Button><Button variant="dark" full onClick={() => { toast('Profil gespeichert'); setOpen(null) }}>Speichern</Button></div>
          </div>
        )}
      </Modal>
    </div>
  )
}
