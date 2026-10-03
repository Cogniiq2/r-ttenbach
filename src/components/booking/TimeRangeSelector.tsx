import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent as RPointerEvent, type KeyboardEvent as RKeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { cn } from '@/lib/cn'
import { EASE } from '@/lib/motion'
import { canEndAt, canStartAt, type DayAvailability, type Segment } from '@/lib/availability'
import { CLOSE_MIN, MAX_BOOKING_MIN, OPEN_MIN, SLOT_MINUTES, fmt, fmtDuration, points as allPoints } from '@/lib/time'

export interface RangeState { start: number | null; end: number | null }

interface Props {
  day: DayAvailability
  value: RangeState
  onChange: (v: RangeState) => void
  /** Hover / drag preview end, for the summary (desktop). */
  onPreview?: (end: number | null) => void
  className?: string
}

const PAD = 20
const SPAN = CLOSE_MIN - OPEN_MIN
const SLOTS = SPAN / SLOT_MINUTES
const tick = () => { try { navigator.vibrate?.(6) } catch { /* not supported */ } }

type Drag = { mode: 'create' | 'start' | 'end'; anchor: number; moved: boolean; pointerId: number } | null

/**
 * One continuous timeline from opening to closing. Tap a start, tap an end,
 * or press and drag across the track. Once a range exists its edges can be
 * dragged (or moved with the arrow keys) and snap to the booking grid.
 * Invalid endpoints are never selectable, so errors cannot happen afterwards.
 */
export function TimeRangeSelector({ day, value, onChange, onPreview, className }: Props) {
  const scroller = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(800)
  const [coarse, setCoarse] = useState(false)
  const [hover, setHover] = useState<number | null>(null)
  const [drag, setDrag] = useState<Drag>(null)
  const suppressClick = useRef(false)

  useLayoutEffect(() => {
    setCoarse(window.matchMedia('(pointer: coarse)').matches)
    const el = scroller.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const minSlot = coarse ? 48 : 24
  const W = Math.max(width, SLOTS * minSlot + PAD * 2)
  const slotW = (W - PAD * 2) / SLOTS
  const scrollable = W > width + 1
  const x = useCallback((t: number) => PAD + ((t - OPEN_MIN) / SPAN) * (W - PAD * 2), [W])
  const pts = useMemo(allPoints, [])

  const { start, end } = value
  const phase: 'start' | 'end' | 'done' = start === null ? 'start' : end === null ? 'end' : 'done'
  const previewEnd = phase === 'end' && hover !== null && canEndAt(day, start!, hover, MAX_BOOKING_MIN) ? hover : null
  const shown = phase === 'done' ? { start: start!, end: end! } : previewEnd !== null ? { start: start!, end: previewEnd } : null
  useEffect(() => { onPreview?.(previewEnd) }, [previewEnd, onPreview])

  // Bring the interesting part of the day into view on narrow screens.
  useEffect(() => {
    const el = scroller.current
    if (!el || !scrollable) return
    const focusT = start ?? 17 * 60
    el.scrollTo({ left: Math.max(0, x(focusT) - el.clientWidth * 0.3), behavior: 'smooth' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollable, day])

  const timeAt = (clientX: number) => {
    const r = track.current!.getBoundingClientRect()
    const raw = OPEN_MIN + ((clientX - r.left - PAD) / (r.width - PAD * 2)) * SPAN
    return Math.min(CLOSE_MIN, Math.max(OPEN_MIN, Math.round(raw / SLOT_MINUTES) * SLOT_MINUTES))
  }

  const pick = (t: number) => {
    setHover(null)
    if (phase === 'end' && t === start) { onChange({ start: null, end: null }); return }
    if (phase === 'end' && t > start! && canEndAt(day, start!, t, MAX_BOOKING_MIN)) { tick(); onChange({ start, end: t }); return }
    if (canStartAt(day, t)) { tick(); onChange({ start: t, end: null }) }
  }

  /* ---------- pointer: drag to create (mouse) and drag handles (all) ---------- */
  const onTrackDown = (e: RPointerEvent) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    const t = timeAt(e.clientX)
    if (!canStartAt(day, t)) return
    track.current!.setPointerCapture(e.pointerId)
    setDrag({ mode: 'create', anchor: t, moved: false, pointerId: e.pointerId })
  }
  const onHandleDown = (mode: 'start' | 'end') => (e: RPointerEvent) => {
    e.stopPropagation()
    track.current!.setPointerCapture(e.pointerId)
    setDrag({ mode, anchor: mode === 'start' ? end! : start!, moved: false, pointerId: e.pointerId })
  }
  const onMove = (e: RPointerEvent) => {
    const t = timeAt(e.clientX)
    if (!drag) { if (phase === 'end' && e.pointerType === 'mouse') setHover(t); return }
    if (drag.mode === 'create') {
      if (t > drag.anchor && canEndAt(day, drag.anchor, t, MAX_BOOKING_MIN)) {
        if (start !== drag.anchor || end !== t) { tick(); onChange({ start: drag.anchor, end: t }) }
        if (!drag.moved) setDrag({ ...drag, moved: true })
      }
    } else if (drag.mode === 'end') {
      if (t > start! && canEndAt(day, start!, t, MAX_BOOKING_MIN) && t !== end) { tick(); onChange({ start, end: t }); setDrag({ ...drag, moved: true }) }
    } else if (t < end! && canStartAt(day, t) && canEndAt(day, t, end!, MAX_BOOKING_MIN) && t !== start) { tick(); onChange({ start: t, end }); setDrag({ ...drag, moved: true }) }
  }
  const onUp = (e: RPointerEvent) => {
    if (!drag) return
    track.current?.releasePointerCapture(drag.pointerId)
    if (drag.mode === 'create') {
      suppressClick.current = true
      if (!drag.moved) pick(timeAt(e.clientX))
    } else suppressClick.current = true
    setDrag(null)
  }
  const onTrackClick = (e: React.MouseEvent) => {
    if (suppressClick.current) { suppressClick.current = false; return }
    pick(timeAt(e.clientX))
  }

  const onHandleKey = (mode: 'start' | 'end') => (e: RKeyboardEvent) => {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!dir || start === null || end === null) return
    e.preventDefault()
    if (mode === 'end') { const t = end + dir * SLOT_MINUTES; if (t > start && canEndAt(day, start, t, MAX_BOOKING_MIN)) onChange({ start, end: t }) }
    else { const t = start + dir * SLOT_MINUTES; if (t < end && canStartAt(day, t) && canEndAt(day, t, end, MAX_BOOKING_MIN)) onChange({ start: t, end }) }
  }

  const dragging = drag !== null && drag.moved
  const pillSpring = dragging ? { type: 'spring' as const, stiffness: 700, damping: 42 } : { duration: 0.34, ease: EASE }

  return (
    <div className={cn('relative select-none', className)}>
      {scrollable && <><div className="pointer-events-none absolute inset-y-0 left-0 z-30 w-6 bg-gradient-to-r from-paper to-transparent" /><div className="pointer-events-none absolute inset-y-0 right-0 z-30 w-8 bg-gradient-to-l from-paper to-transparent" /></>}
      <div ref={scroller} className={cn('no-scrollbar -mx-1 px-1', scrollable && 'overflow-x-auto overscroll-x-contain')} data-lenis-prevent-wheel={scrollable ? '' : undefined}>
        <div className="relative pt-11" style={{ width: W }} role="group" aria-label="Zeitraum wählen">
          {/* allocation windows (demo labels) */}
          <div className="relative h-5">
            {day.windows.filter((w) => w.kind !== 'notice').map((w) => (
              <div key={w.label} className="absolute top-0 flex h-5 items-center" style={{ left: x(w.start), width: x(w.end) - x(w.start) }}>
                <span className={cn('h-px flex-1', w.kind === 'member' ? 'bg-green/35' : 'bg-line-2')} />
                <span className={cn('mx-2.5 whitespace-nowrap text-[10.5px] font-medium uppercase tracking-[0.12em]', w.kind === 'member' ? 'text-green' : 'text-muted-2')}>{w.label}</span>
                <span className={cn('h-px flex-1', w.kind === 'member' ? 'bg-green/35' : 'bg-line-2')} />
              </div>
            ))}
          </div>

          {/* track */}
          <div
            ref={track}
            className={cn('relative mt-2 h-12', phase !== 'done' && 'cursor-pointer', drag && 'cursor-grabbing')}
            style={{ touchAction: drag ? 'none' : 'pan-x pan-y' }}
            onPointerDown={onTrackDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={() => setDrag(null)}
            onPointerLeave={() => !drag && setHover(null)}
            onClick={onTrackClick}
          >
            {day.segments.map((s) => <SegmentView key={s.start} s={s} left={x(s.start)} width={slotW} />)}
            {/* hour gridlines */}
            {pts.filter((t) => t % 60 === 0 && t > OPEN_MIN && t < CLOSE_MIN).map((t) => <span key={t} className="pointer-events-none absolute -bottom-1.5 h-1.5 w-px bg-line-2" style={{ left: x(t) }} />)}

            {/* pending start */}
            <AnimatePresence>
              {phase === 'end' && !shown && (
                <motion.div key="pending" initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={{ duration: 0.22, ease: EASE }} className="pointer-events-none absolute -inset-y-1.5 z-10 w-[14px] rounded-full bg-green shadow-[0_0_0_4px_rgba(49,92,70,0.18)]" style={{ left: x(start!) - 7 }} />
              )}
            </AnimatePresence>

            {/* the range: one object */}
            <AnimatePresence>
              {shown && (
                <motion.div
                  key="range"
                  initial={{ opacity: 0, left: x(shown.start), width: 14 }}
                  animate={{ opacity: 1, left: x(shown.start), width: x(shown.end) - x(shown.start) }}
                  exit={{ opacity: 0, transition: { duration: 0.16 } }}
                  transition={pillSpring}
                  className={cn('pointer-events-none absolute -inset-y-1.5 z-10 overflow-hidden rounded-full',
                    phase === 'done' ? 'bg-green shadow-[0_10px_28px_rgba(49,92,70,0.32),inset_0_1px_0_rgba(255,255,255,0.18)]' : 'bg-green/14 shadow-[inset_0_0_0_1.5px_var(--color-green)]')}
                >
                  {phase === 'done' && <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),transparent_55%)]" />}
                  <span className={cn('num absolute inset-0 flex items-center justify-center whitespace-nowrap text-[12.5px] font-medium transition-opacity', phase === 'done' ? 'text-white' : 'text-green-deep', x(shown.end) - x(shown.start) < 112 && 'opacity-0')}>
                    {fmtDuration(shown.end - shown.start)}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* handles */}
            {phase === 'done' && (['start', 'end'] as const).map((mode) => {
              const t = mode === 'start' ? start! : end!
              const active = drag?.mode === mode
              return (
                <motion.button
                  key={mode}
                  type="button"
                  aria-label={`${mode === 'start' ? 'Startzeit' : 'Endzeit'} ${fmt(t)}. Mit Pfeiltasten verschieben.`}
                  onPointerDown={onHandleDown(mode)}
                  onKeyDown={onHandleKey(mode)}
                  onClick={(e) => e.stopPropagation()}
                  initial={false}
                  animate={{ left: x(t) - 22, scale: active ? 1.12 : 1 }}
                  transition={pillSpring}
                  className="group/h absolute -top-1.5 z-20 grid h-[60px] w-11 cursor-grab touch-none place-items-center focus-visible:outline-none active:cursor-grabbing"
                >
                  <span className={cn('grid h-7 w-7 place-items-center rounded-full bg-white shadow-[0_2px_8px_rgba(17,19,17,0.25)] ring-green transition-[box-shadow] group-hover/h:ring-2 group-focus-visible/h:ring-2', active && 'ring-2')}>
                    <span className="flex gap-[2px]"><span className="h-2.5 w-[1.5px] rounded-full bg-green/60" /><span className="h-2.5 w-[1.5px] rounded-full bg-green/60" /></span>
                  </span>
                  <AnimatePresence>
                    {active && (
                      <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.14 }} className="num pointer-events-none absolute -top-9 whitespace-nowrap rounded-[8px] bg-ink px-2.5 py-1.5 text-[12px] font-medium text-white shadow-panel">
                        {fmt(t)}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              )
            })}

            {/* hover preview tooltip */}
            <AnimatePresence>
              {previewEnd !== null && !drag && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0, left: x(previewEnd) }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.16, ease: EASE }} className="pointer-events-none absolute -top-11 z-30 -translate-x-1/2 whitespace-nowrap rounded-[9px] bg-ink px-3 py-1.5 text-[12px] font-medium text-white shadow-panel">
                  <span className="num">{fmt(start!)} – {fmt(previewEnd)}</span><span className="text-white/55"> · {fmtDuration(previewEnd - start!)}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* notice windows */}
          <div className="relative mt-2 h-2">
            {day.windows.filter((w) => w.kind === 'notice').map((w) => <span key={w.label} className="absolute top-0 h-[3px] rounded-full bg-sand/80" style={{ left: x(w.start) + 2, width: x(w.end) - x(w.start) - 4 }} title={`${w.label} ${fmt(w.start)}–${fmt(w.end)}`} />)}
          </div>

          {/* time points */}
          <div className="relative h-11">
            {pts.map((t) => {
              const isStart = start === t, isEnd = end === t
              const inRange = shown ? t > shown.start && t < shown.end : false
              const validStart = canStartAt(day, t)
              const validEnd = start !== null && t > start && canEndAt(day, start, t, MAX_BOOKING_MIN)
              const enabled = phase === 'start' ? validStart : phase === 'end' ? t === start || (t < start! && validStart) || validEnd : validStart || validEnd
              const hour = t % 60 === 0
              const marked = [start, end, previewEnd].filter((m): m is number => m !== null && m % 60 !== 0)
              const crowded = slotW < 40 && hour && marked.some((m) => Math.abs(m - t) === SLOT_MINUTES)
              const label = isStart || isEnd || previewEnd === t ? fmt(t) : hour && !crowded ? fmt(t) : ''
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
                  className={cn('absolute top-0 flex h-11 -translate-x-1/2 flex-col items-center justify-start rounded-[9px] pt-1.5 transition-colors', enabled ? 'hover:bg-ink/[0.05] active:bg-ink/[0.08]' : 'cursor-not-allowed')}
                  style={{ left: x(t), width: Math.min(48, slotW) }}
                >
                  <span className={cn('mb-1 h-1 w-1 rounded-full transition-all duration-200', isStart || isEnd ? 'h-1.5 w-1.5 bg-green' : phase === 'end' && validEnd ? 'bg-green/70' : enabled ? 'bg-muted-2/60' : 'bg-transparent')} />
                  <span className={cn('num whitespace-nowrap text-[11.5px] leading-none transition-colors duration-200',
                    isStart || isEnd ? 'font-semibold text-green-deep' : hour ? 'font-medium text-ink' : 'text-muted',
                    !enabled && !isStart && !isEnd && '!text-muted-2/55',
                    inRange && phase === 'done' && hour && '!text-green')}>
                    {label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function SegmentView({ s, left, width }: { s: Segment; left: number; width: number }) {
  return (
    <div className="pointer-events-none absolute inset-y-0 px-[1.5px]" style={{ left, width }} aria-hidden>
      <div
        className={cn(
          'flex h-full items-center justify-center rounded-[8px] text-[10.5px] font-medium transition-colors duration-300',
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
