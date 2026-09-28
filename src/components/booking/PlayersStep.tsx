import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Lightbulb, Plus } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { AnimatedCheck } from '@/components/ui/AnimatedCheck'
import { Toggle } from '@/components/ui/Toggle'
import { cn } from '@/lib/cn'
import { EASE, t } from '@/lib/motion'
import { players } from '@/lib/data'
import { floodlightWindow, type Player, type Verify } from '@/lib/booking'
import { useToast } from '@/lib/toast'

export function Dots() {
  return (
    <span className="flex items-center gap-[3px]" aria-hidden>
      {[0, 1, 2].map((i) => <motion.span key={i} className="size-[4px] rounded-full bg-current" animate={{ opacity: [0.25, 1, 0.25] }} transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }} />)}
    </span>
  )
}

function PlayerRow({ p, index, state }: { p: Player; index: number; state: Verify }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={t.base} className="flex items-center gap-4 py-4">
      <Avatar initials={p.initials} tone={index} />
      <div className="min-w-0 flex-1"><div className="truncate text-[15.5px] font-medium">{p.name}</div><div className="text-[12.5px] text-muted">Spieler {index + 1}</div></div>
      <div className="min-w-[150px] text-right" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {state === 'checking' ? (
            <motion.span key="c" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-2.5 text-[12.5px] text-muted"><Dots />Mitgliedschaft wird geprüft</motion.span>
          ) : state === 'done' && p.kind === 'member' ? (
            <motion.span key="m" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={t.fast} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-green"><span className="grid size-5 place-items-center rounded-full bg-green-soft"><AnimatedCheck size={12} strokeWidth={3} /></span>TC Röttenbach Mitglied</motion.span>
          ) : state === 'done' ? (
            <motion.span key="g" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={t.fast} className="text-[13px] text-muted">Gast · regulärer Preis</motion.span>
          ) : <motion.span key="i" className="text-[13px] text-muted-2">–</motion.span>}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function ExtraRow({ icon, title, sub, checked, onChange, price }: { icon: ReactNode; title: string; sub?: ReactNode; checked: boolean; onChange: (v: boolean) => void; price?: string }) {
  return (
    <div className="flex items-center gap-4 py-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-paper text-muted">{icon}</span>
      <div className="min-w-0 flex-1"><div className="flex items-baseline gap-2 text-[15.5px] font-medium">{title}{price && <span className="num text-[12.5px] font-normal text-muted">{price}</span>}</div>{sub && <div className="text-[13px] text-muted">{sub}</div>}</div>
      <Toggle checked={checked} onChange={onChange} label={title} />
    </div>
  )
}

export function Floodlight({ on, onChange, start, end }: { on: boolean; onChange: (v: boolean) => void; start: number; end: number }) {
  const w = floodlightWindow(start, end)
  return (
    <div className="flex items-center gap-4 py-4">
      <span className="relative grid size-10 shrink-0 place-items-center rounded-full bg-paper">
        <motion.span className="absolute inset-0 rounded-full bg-sand" animate={{ opacity: on ? 0.28 : 0, scale: on ? 1.25 : 0.9 }} transition={{ duration: 0.7, ease: EASE }} style={{ filter: 'blur(5px)' }} />
        <motion.span animate={{ color: on ? '#B98A3E' : '#737770' }} transition={{ duration: 0.5 }} className="relative"><Lightbulb size={18} className={cn('transition-[filter] duration-700', on && 'glow-light')} /></motion.span>
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2 text-[15.5px] font-medium">Flutlicht<span className="text-[12.5px] font-normal text-muted">inklusive</span></div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={on ? `${w.on}-${w.off}` : 'off'} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }} transition={{ duration: 0.22 }} className={cn('text-[13px]', on ? 'text-[#7A5A22]' : 'text-muted')}>
            {on ? <>Automatisch <span className="num font-medium">{w.on} – {w.off}</span> Uhr.</> : 'Aus. Der Court bleibt unbeleuchtet.'}
          </motion.div>
        </AnimatePresence>
      </div>
      <Toggle checked={on} onChange={onChange} label="Flutlicht" />
    </div>
  )
}

interface Props {
  roster: Player[]; verify: Record<string, Verify>; onAdd: () => void
  start: number; end: number
  floodlight: boolean; rackets: boolean; balls: boolean
  set: (patch: { floodlight?: boolean; rackets?: boolean; balls?: boolean }) => void
}

export function PlayersStep({ roster, verify, onAdd, start, end, floodlight, rackets, balls, set }: Props) {
  const { toast } = useToast()
  return (
    <div>
      <section>
        <div className="flex items-end justify-between border-b border-line pb-3"><h2 className="text-[17px] font-semibold">Spieler</h2><span className="num text-[13px] text-muted">{roster.length} / 4</span></div>
        <div className="divide-y divide-line">{roster.map((p, i) => <PlayerRow key={p.initials} p={p} index={i} state={verify[p.initials] ?? 'idle'} />)}</div>
        <AnimatePresence>
          {roster.length < 4 && (
            <motion.div exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[13.5px]">
                <span className="text-muted">Vorschlag:</span>
                <button onClick={onAdd} className="pressable group inline-flex h-10 items-center gap-2 rounded-full bg-white pl-1.5 pr-4 font-medium hairline hover:shadow-[inset_0_0_0_1px_var(--color-ink)]"><Avatar initials={players[3].initials} size="sm" tone={3} />{players[3].name}<Plus size={14} className="text-muted transition-transform group-hover:rotate-90" /></button>
                <button onClick={() => toast('Einladungslink kopiert', 'Demo')} className="pressable h-10 rounded-full px-4 font-medium text-muted hover:text-ink">Link teilen</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
      <section className="mt-12">
        <div className="border-b border-line pb-3"><h2 className="text-[17px] font-semibold">Extras</h2></div>
        <div className="divide-y divide-line">
          <Floodlight on={floodlight} onChange={(v) => set({ floodlight: v })} start={start} end={end} />
          <ExtraRow icon={<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><ellipse cx="12" cy="9" rx="6" ry="7" /><path d="M12 16v6M9 19h6" /></svg>} title="Leihschläger" sub="2 Schläger liegen am Court bereit." price="+ 4,00 €" checked={rackets} onChange={(v) => set({ rackets: v })} />
          <ExtraRow icon={<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M5 6.5c4 1.5 6 5 6 9.5M19 6.5c-4 1.5-6 5-6 9.5" /></svg>} title="Bälle" sub="Neue Dose, 3 Bälle." price="+ 3,00 €" checked={balls} onChange={(v) => set({ balls: v })} />
        </div>
      </section>
    </div>
  )
}
