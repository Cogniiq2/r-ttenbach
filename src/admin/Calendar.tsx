import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Lightbulb, Plus } from 'lucide-react'
import { PageTitle } from './ui'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Pill } from '@/components/ui/Pill'
import { Textarea } from '@/components/ui/Field'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/cn'
import { EASE, t } from '@/lib/motion'
import { useToast } from '@/lib/toast'

type Kind = 'booking' | 'training' | 'match' | 'tournament' | 'blocked' | 'notice'
interface Block { id: string; day: number; start: number; end: number; kind: Kind; title: string; sub?: string; players?: string[] }

const START = 8, END = 23, ROW = 44 // px per hour
const dayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
const dayNums = [21, 22, 23, 24, 25, 26, 27]
const TODAY = 5

const kindStyle: Record<Kind, string> = {
  booking: 'bg-green-soft border-green-line text-green-deep',
  training: 'bg-sand-soft border-sand-line text-[#6E5220]',
  match: 'bg-[#EDE8F5] border-[#D9CFEA] text-[#4E3B78]',
  tournament: 'bg-clay-soft border-[#E5CDC1] text-[#7E4430]',
  blocked: 'bg-[repeating-linear-gradient(-45deg,#ECEDE8_0px,#ECEDE8_5px,#F6F6F2_5px,#F6F6F2_10px)] border-line-2 text-muted',
  notice: 'bg-sand-soft/40 border-dashed border-sand/70 text-[#6E5220]',
}
const kindLabel: Record<Kind, string> = { booking: 'Buchung', training: 'Training', match: 'Mannschaftsspiel', tournament: 'Jugendturnier', blocked: 'Court gesperrt', notice: 'Hinweis aktiv' }

const initial: Block[] = [
  { id: '1', day: 0, start: 12.5, end: 14, kind: 'training', title: 'Training', sub: 'Jugend U14' },
  { id: '2', day: 0, start: 18.5, end: 20, kind: 'booking', title: 'Anna Weber', sub: '+1', players: ['AW', 'LH'] },
  { id: '3', day: 1, start: 9.5, end: 11, kind: 'booking', title: 'Tobias Herzog', sub: '+3', players: ['TH', 'JS', 'LP', 'MM'] },
  { id: '4', day: 1, start: 17, end: 18.5, kind: 'booking', title: 'Lena Hofmann', sub: '+3', players: ['LH', 'AW'] },
  { id: '5', day: 2, start: 12.5, end: 14, kind: 'training', title: 'Training', sub: 'Erwachsene' },
  { id: '6', day: 2, start: 20, end: 21.5, kind: 'booking', title: 'Max Mustermann', sub: '+3', players: ['MM', 'LP'] },
  { id: '7', day: 3, start: 18, end: 21, kind: 'blocked', title: 'Court gesperrt', sub: 'Wartung Kunstrasen' },
  { id: '8', day: 4, start: 19, end: 23, kind: 'tournament', title: 'Padel Night', sub: 'Americano' },
  { id: '9', day: 5, start: 8, end: 9.5, kind: 'booking', title: 'Jonas Schäfer', sub: '+1', players: ['JS', 'TH'] },
  { id: '10', day: 5, start: 12.5, end: 14, kind: 'training', title: 'Training', sub: 'Jugend U12' },
  { id: '11', day: 5, start: 13, end: 18, kind: 'notice', title: 'Mannschaftsspiel', sub: 'Hinweis aktiv' },
  { id: '12', day: 5, start: 15.5, end: 17, kind: 'booking', title: 'Anna Weber', sub: '+1', players: ['AW', 'LH'] },
  { id: '13', day: 5, start: 18.5, end: 20, kind: 'booking', title: 'Lazar Popovic', sub: '+3', players: ['LP', 'MM', 'JS', 'TH'] },
  { id: '14', day: 5, start: 20, end: 21.5, kind: 'booking', title: 'Max Mustermann', sub: '+3', players: ['MM', 'LP'] },
  { id: '15', day: 6, start: 8, end: 12, kind: 'tournament', title: 'Jugendturnier', sub: 'Finals' },
  { id: '16', day: 6, start: 14, end: 18.5, kind: 'blocked', title: 'Court gesperrt', sub: 'Jugendturnier' },
  { id: '17', day: 6, start: 18.5, end: 20, kind: 'booking', title: 'Tobias Herzog', sub: '+3', players: ['TH', 'JS'] },
]

const fmt = (h: number) => `${String(Math.floor(h)).padStart(2, '0')}:${h % 1 ? '30' : '00'}`

export function Calendar() {
  const { toast } = useToast()
  const [blocks, setBlocks] = useState<Block[]>(initial)
  const [selected, setSelected] = useState<Block | null>(null)
  const [drag, setDrag] = useState<{ day: number; a: number; b: number } | null>(null)
  const [range, setRange] = useState<{ day: number; start: number; end: number } | null>(null)
  const [mode, setMode] = useState<'block' | 'notice'>('notice')
  const [reason, setReason] = useState('Mannschaftsspiel')
  const [saving, setSaving] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)
  const hours = useMemo(() => Array.from({ length: END - START }, (_, i) => START + i), [])

  const posToSlot = (e: React.PointerEvent, day: number) => {
    const el = e.currentTarget as HTMLElement
    const rect = el.getBoundingClientRect()
    const y = e.clientY - rect.top
    return { day, h: Math.max(START, Math.min(END, START + Math.round((y / ROW) * 2) / 2)) }
  }
  const onDown = (e: React.PointerEvent, day: number) => {
    if ((e.target as HTMLElement).closest('[data-block]')) return
    const { h } = posToSlot(e, day)
    setDrag({ day, a: h, b: h + 0.5 })
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onMove = (e: React.PointerEvent, day: number) => { if (!drag || drag.day !== day) return; const { h } = posToSlot(e, day); setDrag({ ...drag, b: Math.max(drag.a + 0.5, h) }) }
  const onUp = () => {
    if (!drag) return
    const s = Math.min(drag.a, drag.b), en = Math.max(drag.a, drag.b)
    if (en - s >= 0.5) setRange({ day: drag.day, start: s, end: en })
    setDrag(null)
  }
  const save = () => {
    if (!range) return
    setSaving(true)
    window.setTimeout(() => {
      setBlocks((b) => [...b, { id: String(Date.now()), day: range.day, start: range.start, end: range.end, kind: mode === 'block' ? 'blocked' : 'notice', title: mode === 'block' ? 'Court gesperrt' : reason, sub: mode === 'block' ? reason : 'Hinweis aktiv' }])
      setSaving(false); setRange(null)
      toast(mode === 'block' ? 'Court gesperrt' : 'Hinweis aktualisiert', `${dayNames[range.day]} · ${fmt(range.start)}–${fmt(range.end)}`)
    }, 900)
  }

  return (
    <div>
      <PageTitle title="Kalender" sub="Padel Court 01 · Wochenansicht" action={<div className="flex items-center gap-2"><div className="flex h-9 items-center rounded-[10px] border border-line bg-white"><button className="pressable grid size-9 place-items-center rounded-l-[10px] hover:bg-paper" aria-label="Vorherige Woche"><ChevronLeft size={16} /></button><span className="num px-2 text-[13.5px] font-medium">21. – 27. Sep 2026</span><button className="pressable grid size-9 place-items-center rounded-r-[10px] hover:bg-paper" aria-label="Nächste Woche"><ChevronRight size={16} /></button></div><Button size="sm" variant="dark" icon={<Plus size={14} />} onClick={() => setRange({ day: TODAY, start: 13, end: 18 })}>Zeitraum</Button></div>} />

      <div className="mb-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[12px] text-muted">
        {(['booking', 'training', 'match', 'tournament', 'blocked', 'notice'] as Kind[]).map((k) => <span key={k} className="flex items-center gap-1.5"><span className={cn('size-3 rounded-[3px] border', kindStyle[k])} />{kindLabel[k]}</span>)}
        <span className="ml-auto hidden text-muted-2 md:inline">Tipp: Zeitraum mit der Maus aufziehen</span>
      </div>

      <div className="overflow-hidden rounded-[16px] border border-line bg-white">
        <div className="overflow-x-auto">
          <div className="min-w-[860px]">
            <div className="grid grid-cols-[56px_repeat(7,1fr)] border-b border-line">
              <div />
              {dayNames.map((d, i) => (
                <div key={d} className={cn('flex items-center gap-2 border-l border-line px-3 py-2.5 text-[13px]', i === TODAY && 'bg-paper/60')}>
                  <span className="text-muted">{d}</span>
                  <span className={cn('num grid size-7 place-items-center rounded-full font-semibold', i === TODAY ? 'bg-ink text-white' : '')}>{dayNums[i]}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-[56px_repeat(7,1fr)]" ref={gridRef}>
              <div className="relative" style={{ height: (END - START) * ROW }}>
                {hours.map((h) => <div key={h} className="num absolute right-2 -translate-y-1/2 text-[11px] text-muted-2" style={{ top: (h - START) * ROW }}>{h}:00</div>)}
              </div>
              {dayNames.map((_, day) => (
                <div
                  key={day}
                  className={cn('relative select-none border-l border-line', day === TODAY && 'bg-paper/40')}
                  style={{ height: (END - START) * ROW, touchAction: 'none' }}
                  onPointerDown={(e) => onDown(e, day)}
                  onPointerMove={(e) => onMove(e, day)}
                  onPointerUp={onUp}
                >
                  {hours.map((h) => <div key={h} className="absolute inset-x-0 border-t border-line/70" style={{ top: (h - START) * ROW }} />)}
                  {day === TODAY && <div className="absolute inset-x-0 z-10 flex items-center" style={{ top: (19.2 - START) * ROW }}><span className="-ml-1 size-2 rounded-full bg-clay" /><span className="h-px flex-1 bg-clay" /></div>}
                  {[...blocks.filter((b) => b.day === day)].sort((a, b) => (a.kind === 'notice' ? -1 : b.kind === 'notice' ? 1 : 0)).map((b) => (
                    <motion.button
                      key={b.id}
                      data-block
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={t.base}
                      onClick={() => setSelected(b)}
                      className={cn('absolute left-1 right-1 flex flex-col justify-start overflow-hidden rounded-[8px] border px-2 py-1.5 text-left text-[12px] leading-tight transition-[box-shadow,transform] hover:z-20 hover:shadow-panel active:scale-[0.99]', kindStyle[b.kind], b.kind === 'notice' ? 'left-0.5 right-0.5 z-0' : 'z-10')}
                      style={{ top: (b.start - START) * ROW + 2, height: (Math.min(b.end, END) - b.start) * ROW - 4 }}
                    >
                      <div className="flex items-center justify-between gap-1"><span className="truncate font-semibold">{b.title}</span>{b.kind === 'booking' && b.start === 18.5 && day === TODAY && <Lightbulb size={11} className="glow-light shrink-0 text-sand" />}</div>
                      <div className="num truncate opacity-80">{fmt(b.start)}–{fmt(b.end)}{b.sub ? ` · ${b.sub}` : ''}</div>
                    </motion.button>
                  ))}
                  <AnimatePresence>
                    {drag && drag.day === day && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pointer-events-none absolute left-1 right-1 z-30 rounded-[8px] border-2 border-green bg-green/10 px-2 py-1 text-[12px] font-medium text-green" style={{ top: (Math.min(drag.a, drag.b) - START) * ROW, height: Math.abs(drag.b - drag.a) * ROW }}>
                        {fmt(Math.min(drag.a, drag.b))}–{fmt(Math.max(drag.a, drag.b))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detail side panel */}
      <Modal open={!!selected} onClose={() => setSelected(null)} side>
        {selected && (
          <div className="p-6 pt-14">
            <Pill tone={selected.kind === 'booking' ? 'green' : selected.kind === 'blocked' ? 'neutral' : 'sand'}>{kindLabel[selected.kind]}</Pill>
            <div className="mt-3 text-[24px] font-semibold tracking-[-0.02em]">{selected.title}</div>
            <div className="num text-[15px] text-muted">{dayNames[selected.day]}, {dayNums[selected.day]}. September · {fmt(selected.start)} – {fmt(selected.end)}</div>
            {selected.players && (
              <div className="mt-6"><div className="mb-2 text-[12px] font-medium uppercase tracking-[0.12em] text-muted">Spieler</div><div className="flex items-center gap-2"><div className="flex -space-x-2">{selected.players.map((p, i) => <Avatar key={p} initials={p} tone={i} />)}</div><span className="text-[13px] text-muted">{selected.players.length} Spieler</span></div></div>
            )}
            <dl className="mt-6 divide-y divide-line border-y border-line text-[14px]">
              {[['Court', 'Padel Court 01'], ['Dauer', `${(selected.end - selected.start) * 60} Minuten`], ['Flutlicht', selected.kind === 'booking' ? 'Automatisch' : '–'], ['Notiz', selected.sub ?? '–']].map(([k, v]) => <div key={k} className="flex justify-between py-3"><dt className="text-muted">{k}</dt><dd className="font-medium">{v}</dd></div>)}
            </dl>
            <div className="mt-6 flex gap-2">
              <Button variant="secondary" full onClick={() => { setRange({ day: selected.day, start: selected.start, end: selected.end }); setSelected(null) }}>Bearbeiten</Button>
              <Button variant="ghost" full className="text-[#9A3B3B] hover:bg-[#FBEAEA]" onClick={() => { setBlocks((b) => b.filter((x) => x.id !== selected.id)); setSelected(null); toast('Eintrag entfernt') }}>Entfernen</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Block range modal */}
      <Modal open={!!range} onClose={() => setRange(null)}>
        {range && (
          <div className="p-6 md:p-8">
            <div className="eyebrow">Zeitraum verwalten</div>
            <div className="mt-2 text-[24px] font-semibold tracking-[-0.02em]">{['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'][range.day]}</div>
            <div className="num text-[17px] text-muted">{fmt(range.start)}–{fmt(range.end)} · Padel Court 01</div>
            <div className="mt-6">
              <div className="mb-1.5 text-[13px] font-medium">Grund</div>
              <div className="flex flex-wrap gap-1.5">{['Mannschaftsspiel', 'Jugendturnier', 'Wartung', 'Vereinsevent'].map((r) => <button key={r} onClick={() => setReason(r)} className={cn('pressable h-9 rounded-full border px-3.5 text-[13.5px] font-medium', reason === r ? 'border-ink bg-ink text-white' : 'border-line-2 bg-white hover:border-ink/40')}>{r}</button>)}</div>
            </div>
            <div className="mt-6 space-y-2">
              {([['block', 'Court vollständig sperren', 'Keine Buchungen im Zeitraum möglich.'], ['notice', 'Buchungen erlauben + Hinweis anzeigen', 'Spieler müssen den Hinweis vor der Buchung bestätigen.']] as const).map(([m, title, sub]) => (
                <button key={m} onClick={() => setMode(m)} className={cn('pressable flex w-full items-start gap-3 rounded-[12px] border p-4 text-left transition-colors', mode === m ? 'border-green bg-green-soft/50' : 'border-line bg-white hover:border-ink/30')}>
                  <span className={cn('mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2', mode === m ? 'border-green' : 'border-line-2')}>{mode === m && <motion.span layoutId="mode-dot" className="size-2.5 rounded-full bg-green" transition={t.spring} />}</span>
                  <span><span className="block text-[14.5px] font-medium">{title}</span><span className="block text-[13px] text-muted">{sub}</span></span>
                </button>
              ))}
            </div>
            <AnimatePresence>
              {mode === 'notice' && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: EASE }} className="overflow-hidden">
                  <div className="pt-4"><Textarea label="Hinweistext für Spieler" defaultValue="Parallel findet ein Tennismannschaftsspiel statt. Bitte nehmt besondere Rücksicht." /></div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="mt-6 flex gap-2"><Button variant="secondary" full onClick={() => setRange(null)}>Abbrechen</Button><Button full loading={saving} onClick={save}>{saving ? 'Wird gespeichert…' : 'Speichern'}</Button></div>
          </div>
        )}
      </Modal>
    </div>
  )
}
