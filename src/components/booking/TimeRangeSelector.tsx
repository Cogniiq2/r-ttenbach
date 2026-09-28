import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { cn } from '@/lib/cn'
import { EASE } from '@/lib/motion'
import { canEndAt, canStartAt, type DayAvailability, type Segment } from '@/lib/availability'
import { MAX_BOOKING_MIN, fmt, fmtDuration, points as allPoints } from '@/lib/time'

export interface RangeState { start: number | null; end: number | null }

interface Props {
  day: DayAvailability
  value: RangeState
  onChange: (v: RangeState) => void
  /** Called with a preview end while hovering a valid end point (desktop). */
  onPreview?: (end: number | null) => void
  className?: string
}

/**
 * Continuous timeline. Time labels are the interaction points: first tap sets the
 * start, second tap the end, and the track fills as one connected range.
 * Rows wrap so touch targets stay ≥ 44px at every width.
 */
export function TimeRangeSelector({ day, value, onChange, onPreview, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [perRow, setPerRow] = useState(14)
  const [hover, setHover] = useState<number | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setPerRow(e.contentRect.width >= 720 ? 14 : 7))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const pts = useMemo(allPoints, [])
  const rows = useMemo(() => {
    const out: number[][] = []
    for (let i = 0; i < pts.length - 1; i += perRow) out.push(pts.slice(i, i + perRow + 1))
    return out
  }, [pts, perRow])

  const { start, end } = value
  const phase: 'start' | 'end' | 'done' = start === null ? 'start' : end === null ? 'end' : 'done'
  const previewEnd = phase === 'end' && hover !== null && canEndAt(day, start!, hover, MAX_BOOKING_MIN) ? hover : null
  const shown = phase === 'done' ? { start: start!, end: end! } : previewEnd !== null ? { start: start!, end: previewEnd } : null

  useEffect(() => { onPreview?.(previewEnd) }, [previewEnd, onPreview])

  const pick = (t: number) => {
    setHover(null)
    if (phase === 'end' && t === start) { onChange({ start: null, end: null }); return }
    if (phase === 'end' && t > start! && canEndAt(day, start!, t, MAX_BOOKING_MIN)) { onChange({ start, end: t }); return }
    if (canStartAt(day, t)) onChange({ start: t, end: null })
  }

  return (
    <div ref={ref} className={cn('select-none', className)} role="group" aria-label="Zeitraum wählen">
      {rows.map((row, ri) => {
        const rowStart = row[0], rowEnd = row[row.length - 1]
        const span = rowEnd - rowStart
        const x = (t: number) => ((t - rowStart) / span) * 100
        const segs = day.segments.filter((s) => s.start >= rowStart && s.end <= rowEnd)
        const overlay = shown && shown.start < rowEnd && shown.end > rowStart ? { a: Math.max(shown.start, rowStart), b: Math.min(shown.end, rowEnd), clipL: shown.start < rowStart, clipR: shown.end > rowEnd } : null
        const pendingStartHere = phase === 'end' && start! >= rowStart && start! < rowEnd
        return (
          <div key={ri} className={cn('px-[22px]', ri > 0 && 'mt-2')}>
            <div className="relative">
              <div className="relative h-5">
                {day.windows.filter((w) => w.kind !== 'notice' && w.start < rowEnd && w.end > rowStart).map((w) => {
                  const a = Math.max(w.start, rowStart), b = Math.min(w.end, rowEnd)
                  return (
                    <div key={w.label + ri} className="absolute top-0 flex h-5 items-center" style={{ left: `${x(a)}%`, width: `${x(b) - x(a)}%` }}>
                      <span className={cn('h-px flex-1', w.kind === 'member' ? 'bg-green/40' : 'bg-line-2')} />
                      {(b - a) / (span / perRow) >= 3 && <span className={cn('mx-2 whitespace-nowrap text-[10.5px] font-medium uppercase tracking-[0.1em]', w.kind === 'member' ? 'text-green' : 'text-muted-2')}>{w.label}</span>}
                      <span className={cn('h-px flex-1', w.kind === 'member' ? 'bg-green/40' : 'bg-line-2')} />
                    </div>
                  )
                })}
              </div>

              <div className="relative mt-1.5 h-9">
                {segs.map((s) => <SegmentView key={s.start} s={s} left={x(s.start)} width={100 / perRow} />)}
                {pendingStartHere && !overlay && (
                  <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.22, ease: EASE }} className="absolute -inset-y-1 z-10 w-3 rounded-full bg-green" style={{ left: `calc(${x(start!)}% - 6px)` }} />
                )}
                <AnimatePresence>
                  {overlay && (
                    <motion.div
                      key={`pill-${ri}`}
                      initial={{ opacity: 0, left: `${x(overlay.a)}%`, width: overlay.clipL ? `${x(overlay.b) - x(overlay.a)}%` : '0%' }}
                      animate={{ opacity: 1, left: `${x(overlay.a)}%`, width: `${x(overlay.b) - x(overlay.a)}%` }}
                      exit={{ opacity: 0, transition: { duration: 0.15 } }}
                      transition={{ duration: 0.32, ease: EASE }}
                      className={cn(
                        'absolute -inset-y-1 z-10 flex items-center justify-center overflow-hidden text-[12px] font-medium',
                        overlay.clipL ? 'rounded-l-[4px]' : 'rounded-l-full', overlay.clipR ? 'rounded-r-[4px]' : 'rounded-r-full',
                        phase === 'done' ? 'bg-green text-white shadow-[0_6px_20px_rgba(49,92,70,0.28)]' : 'bg-green/15 text-green-deep shadow-[inset_0_0_0_1.5px_var(--color-green)]',
                      )}
                    >
                      <span className="num whitespace-nowrap px-3">{shown && overlay.b - overlay.a >= 90 ? fmtDuration(shown.end - shown.start) : ''}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {previewEnd !== null && previewEnd > rowStart && previewEnd <= rowEnd && (
                    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.15 }} className="pointer-events-none absolute -top-10 z-20 -translate-x-1/2 whitespace-nowrap rounded-[8px] bg-ink px-2.5 py-1.5 text-[12px] font-medium text-white shadow-panel" style={{ left: `${x(previewEnd)}%` }}>
                      <span className="num">{fmt(start!)} – {fmt(previewEnd)}</span><span className="text-white/60"> · {fmtDuration(previewEnd - start!)}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative h-3">
                {day.windows.filter((w) => w.kind === 'notice' && w.start < rowEnd && w.end > rowStart).map((w) => {
                  const a = Math.max(w.start, rowStart), b = Math.min(w.end, rowEnd)
                  return <span key={w.label + ri} className="absolute top-1 h-[3px] rounded-full bg-sand/80" style={{ left: `${x(a)}%`, width: `${x(b) - x(a)}%` }} />
                })}
              </div>

              <div className="relative h-11">
                {row.map((t, i) => {
                  const isStart = start === t, isEnd = end === t
                  const inRange = shown ? t > shown.start && t < shown.end : false
                  const validStart = canStartAt(day, t)
                  const validEnd = phase !== 'start' && start !== null && t > start && canEndAt(day, start, t, MAX_BOOKING_MIN)
                  // While choosing the end, points after the start are only enabled when they are valid ends;
                  // earlier points may restart the selection, and the start itself toggles off.
                  const enabled = phase === 'start' ? validStart : phase === 'end' ? (t === start || (t < start! && validStart) || validEnd) : validStart || validEnd
                  const hour = t % 60 === 0
                  const isDup = ri > 0 && i === 0
                  return (
                    <button
                      key={t}
                      type="button"
                      disabled={!enabled}
                      aria-label={`${fmt(t)}${isStart ? ', Startzeit' : isEnd ? ', Endzeit' : phase === 'end' && validEnd ? ', als Endzeit wählen' : ''}`}
                      aria-pressed={isStart || isEnd}
                      onClick={() => pick(t)}
                      onMouseEnter={() => phase === 'end' && setHover(t)}
                      onMouseLeave={() => setHover(null)}
                      className={cn('pressable absolute top-0 flex h-11 w-11 -translate-x-1/2 flex-col items-center justify-center rounded-[10px] transition-colors', enabled ? 'hover:bg-ink/[0.05]' : 'cursor-not-allowed', isDup && 'opacity-50')}
                      style={{ left: `${x(t)}%` }}
                    >
                      <span className={cn('num whitespace-nowrap leading-none transition-colors', hour || isStart || isEnd ? 'text-[12px] font-semibold text-ink' : 'text-[11px] font-medium text-muted', !enabled && '!text-muted-2/60', (isStart || isEnd) && '!text-green-deep !font-semibold', inRange && phase === 'done' && '!text-green')}>
                        {hour || isStart || isEnd || previewEnd === t ? fmt(t) : ':30'}
                      </span>
                      <span className={cn('mt-1 h-1 w-1 rounded-full transition-all', isStart || isEnd ? 'h-1.5 w-1.5 bg-green' : validEnd && phase === 'end' ? 'bg-green/70' : enabled ? 'bg-line-2' : 'bg-transparent')} />
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function SegmentView({ s, left, width }: { s: Segment; left: number; width: number }) {
  return (
    <div className="absolute inset-y-0 px-[1.5px]" style={{ left: `${left}%`, width: `${width}%` }} aria-hidden>
      <div
        className={cn(
          'flex h-full items-center justify-center rounded-[7px] text-[10.5px] font-medium',
          s.status === 'free' && 'bg-white shadow-[inset_0_0_0_1px_var(--color-line)]',
          s.status === 'booked' && 'bg-[#DCDFD8]',
          s.status === 'training' && 'bg-sand-soft text-[#7A5A22]',
          s.status === 'blocked' && 'bg-[repeating-linear-gradient(-45deg,#E1E3DD_0_4px,#F0F1EC_4px_8px)] text-muted',
        )}
      >
        {s.status === 'blocked' ? <Lock size={11} /> : s.status === 'training' ? 'T' : ''}
      </div>
    </div>
  )
}
