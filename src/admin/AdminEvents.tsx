import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Card, PageTitle } from './ui'
import { Pill } from '@/components/ui/Pill'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Field'
import { events } from '@/lib/data'
import { useToast } from '@/lib/toast'
import { OccupancyRow } from '@/pages/Events'

export function AdminEvents() {
  const { toast } = useToast()
  const [create, setCreate] = useState(false)
  const [saving, setSaving] = useState(false)
  return (
    <div>
      <PageTitle title="Events" sub="Veranstaltungen und ihre Auswirkung auf die Platzbelegung." action={<Button size="sm" variant="dark" icon={<Plus size={14} />} onClick={() => setCreate(true)}>Event erstellen</Button>} />
      <div className="grid gap-4 lg:grid-cols-2">
        {events.map((e) => (
          <Card key={e.id} pad={false}>
            <div className="flex items-start justify-between gap-4 p-5"><div><div className="flex items-center gap-2"><Pill tone={e.category === 'Padel' ? 'green' : e.category === 'Jugend' ? 'clay' : 'neutral'}>{e.category}</Pill><span className="text-[12.5px] text-muted">{e.date} · {e.time}</span></div><h3 className="mt-2 text-[18px] font-semibold tracking-[-0.015em]">{e.title}</h3></div><Button size="sm" variant="secondary" onClick={() => toast('Event geöffnet', e.title, 'info')}>Bearbeiten</Button></div>
            <div className="border-t border-line px-5"><div className="divide-y divide-line">{e.occupancy.map((o) => <OccupancyRow key={o.label} o={o} />)}</div></div>
          </Card>
        ))}
      </div>
      <Modal open={create} onClose={() => setCreate(false)}>
        <div className="space-y-4 p-6 md:p-8">
          <div className="text-[22px] font-semibold tracking-[-0.02em]">Event erstellen</div>
          <Input label="Titel" placeholder="z. B. Schleifchenturnier" />
          <div className="grid grid-cols-2 gap-3"><Input label="Datum" type="date" defaultValue="2026-10-17" /><Input label="Uhrzeit" defaultValue="10:00 – 16:00" /></div>
          <Input label="Betroffene Plätze" defaultValue="Tennisplätze 1–4" />
          <Button full loading={saving} onClick={() => { setSaving(true); window.setTimeout(() => { setSaving(false); setCreate(false); toast('Event erstellt', 'Platzbelegung aktualisiert') }, 900) }}>Speichern</Button>
        </div>
      </Modal>
    </div>
  )
}
