import { Card, PageTitle } from './ui'
import { Input } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/lib/toast'

export function Settings() {
  const { toast } = useToast()
  return (
    <div>
      <PageTitle title="Einstellungen" sub="Anlage, Preise und Buchungsregeln." action={<Button size="sm" variant="dark" onClick={() => toast('Einstellungen gespeichert')}>Speichern</Button>} />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Anlage"><div className="space-y-4"><Input label="Vereinsname" defaultValue="Tennisclub Röttenbach e.V." /><Input label="Adresse" defaultValue="Lohmühlweg 11A, 91341 Röttenbach" /><div className="grid grid-cols-2 gap-3"><Input label="Öffnet" defaultValue="08:00" /><Input label="Schließt" defaultValue="22:00" /></div></div></Card>
        <Card title="Padel-Preise"><div className="space-y-4"><div className="grid grid-cols-2 gap-3"><Input label="Court je 30 Min. (Demo)" defaultValue="8,00 €" /><Input label="Mitgliedervorteil je 30 Min. (Demo)" defaultValue="1,00 € / Mitglied" /></div><div className="grid grid-cols-2 gap-3"><Input label="Leihschläger" defaultValue="4,00 €" /><Input label="Bälle" defaultValue="3,00 €" /></div><div className="grid grid-cols-2 gap-3"><Input label="Buchungsraster" defaultValue="30 Minuten" /><Input label="Maximale Dauer" defaultValue="3 Stunden" /></div><Input label="Kostenlose Stornierung bis (Demo)" defaultValue="12 Stunden vor Spielbeginn" /></div></Card>
      </div>
    </div>
  )
}
