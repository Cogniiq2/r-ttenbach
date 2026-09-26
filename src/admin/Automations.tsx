import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lightbulb, Mail, MessageSquare, RefreshCw } from 'lucide-react'
import { Card, PageTitle } from './ui'
import { Pill } from '@/components/ui/Pill'
import { Toggle } from '@/components/ui/Toggle'
import { cn } from '@/lib/cn'
import { useToast } from '@/lib/toast'

export function Automations() {
  const { toast } = useToast()
  const [light, setLight] = useState(true)
  const [before, setBefore] = useState(5)
  const [after, setAfter] = useState(5)
  const [others, setOthers] = useState({ mail: true, remind: true, sync: false })
  return (
    <div>
      <PageTitle title="Automationen" sub="Was die Anlage von selbst erledigt." />
      <Card pad={false}>
        <div className="grid lg:grid-cols-[1fr_320px]">
          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-start gap-4">
                <motion.span animate={light ? { backgroundColor: '#F6EFDD', color: '#B98A3E' } : { backgroundColor: '#F6F6F2', color: '#737770' }} className="grid size-12 shrink-0 place-items-center rounded-[14px]"><Lightbulb size={22} className={cn('transition-all duration-500', light && 'glow-light')} /></motion.span>
                <div><div className="flex items-center gap-2.5"><h2 className="text-[20px] font-semibold tracking-[-0.015em]">Flutlicht</h2><Pill tone={light ? 'green' : 'neutral'} dot>{light ? 'Aktiv' : 'Inaktiv'}</Pill></div><p className="mt-1 max-w-md text-[14.5px] leading-relaxed text-muted">Schaltet das LED-Flutlicht des Padel Courts automatisch anhand der Buchungen.</p></div>
              </div>
              <Toggle checked={light} onChange={(v) => { setLight(v); toast(v ? 'Flutlicht-Automation aktiv' : 'Flutlicht-Automation pausiert') }} label="Flutlicht" />
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[{ l: 'Einschalten', v: before, set: setBefore, s: 'vor Buchung' }, { l: 'Ausschalten', v: after, set: setAfter, s: 'nach Buchung' }].map((r) => (
                <div key={r.l} className={cn('rounded-[14px] border p-4 transition-opacity', light ? 'border-line' : 'border-line opacity-50')}>
                  <div className="text-[13px] text-muted">{r.l}</div>
                  <div className="mt-2 flex items-center gap-1.5">
                    {[0, 5, 10, 15].map((m) => <button key={m} disabled={!light} onClick={() => { r.set(m); toast('Einstellung gespeichert', `${r.l}: ${m} Min. ${r.s}`) }} className={cn('pressable num h-9 flex-1 rounded-[8px] border text-[13.5px] font-medium', r.v === m ? 'border-ink bg-ink text-white' : 'border-line-2 bg-white hover:border-ink/40')}>{m} Min.</button>)}
                  </div>
                  <div className="mt-2 text-[12.5px] text-muted">{r.v} Min. {r.s}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-line bg-paper/60 p-6 lg:border-l lg:border-t-0">
            <div className="text-[12px] font-medium uppercase tracking-[0.12em] text-muted">Heute</div>
            <ul className="mt-3 space-y-3 text-[13.5px]">
              {[['18:25', 'Eingeschaltet', 'Buchung Lazar Popovic'], ['20:05', 'Geplant: Aus', 'Nahtlos, Folgebuchung 20:00'], ['21:35', 'Geplant: Aus', 'Buchung Max Mustermann']].map(([tm, a, s], i) => (
                <li key={tm} className="flex gap-3"><span className={cn('num w-11 shrink-0 font-medium', i === 0 ? 'text-ink' : 'text-muted')}>{tm}</span><div><div className={cn('font-medium', i === 0 && 'flex items-center gap-1.5')}>{i === 0 && <span className="pulse-dot size-1.5 rounded-full bg-sand" />}{a}</div><div className="text-[12.5px] text-muted">{s}</div></div></li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {[{ k: 'mail' as const, i: Mail, t: 'Buchungsbestätigung', s: 'E-Mail direkt nach Zahlung.' }, { k: 'remind' as const, i: MessageSquare, t: 'Erinnerung', s: '2 Stunden vor Spielbeginn.' }, { k: 'sync' as const, i: RefreshCw, t: 'Mitglieder-Sync', s: 'Abgleich mit Vereinsverwaltung.' }].map((a) => (
          <Card key={a.k}><div className="flex items-start justify-between gap-4"><div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-paper text-muted"><a.i size={18} /></span><div><div className="text-[15px] font-semibold">{a.t}</div><div className="text-[13px] text-muted">{a.s}</div></div></div><Toggle size="sm" checked={others[a.k]} onChange={(v) => { setOthers({ ...others, [a.k]: v }); toast(v ? 'Automation aktiviert' : 'Automation pausiert', a.t) }} /></div></Card>
        ))}
      </div>
    </div>
  )
}
