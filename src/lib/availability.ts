/**
 * DEMO availability model. Each day is a list of 30-minute segments between
 * consecutive time points. Segment status decides what can be booked; windows
 * (notice, allocation) are overlays that add context but do not block.
 */
import { CLOSE_MIN, OPEN_MIN, SLOT_MINUTES, slotCount, toMin } from './time'

export type SegmentStatus = 'free' | 'booked' | 'training' | 'blocked'
export interface Segment { start: number; end: number; status: SegmentStatus; label?: string }
export interface Window { start: number; end: number; kind: 'notice' | 'member' | 'public'; label: string; text?: string }
export interface DayAvailability { segments: Segment[]; windows: Window[] }
export interface Range { start: number; end: number }

type Block = [string, string, SegmentStatus, string?]

const base: Block[] = [
  ['08:00', '09:30', 'booked'],
  ['12:30', '14:00', 'training', 'Training'],
  ['15:30', '17:00', 'booked'],
  ['20:30', '21:00', 'booked'],
  ['21:30', '22:00', 'booked'],
]

const perDay: Record<number, Block[]> = {
  0: base,
  1: [['08:00', '09:00', 'booked'], ['14:00', '18:30', 'blocked', 'Jugendturnier'], ['20:30', '22:00', 'booked']],
  2: [['09:30', '11:00', 'booked'], ['12:30', '14:00', 'training', 'Training'], ['17:00', '18:30', 'booked'], ['20:00', '21:30', 'booked']],
  3: [['08:00', '09:30', 'booked'], ['16:00', '17:30', 'booked'], ['19:00', '21:00', 'booked']],
  4: [['12:30', '14:00', 'training', 'Training'], ['18:00', '19:00', 'booked'], ['20:00', '21:30', 'booked']],
  5: [['18:00', '21:00', 'blocked', 'Wartung Kunstrasen'], ['09:00', '10:30', 'booked']],
  6: [['19:00', '22:00', 'blocked', 'Padel Night'], ['10:00', '11:00', 'booked'], ['15:30', '17:00', 'booked']],
  7: [['08:00', '22:00', 'booked']], // empty-state day
}

const windowsFor = (idx: number): Window[] => {
  const w: Window[] = [
    { start: toMin('08:00'), end: toMin('17:00'), kind: 'public', label: 'Öffentliche Spielzeit' },
    { start: toMin('17:00'), end: toMin('22:00'), kind: 'member', label: 'TC-Mitgliederzeit' },
  ]
  if (idx === 0) w.push({ start: toMin('17:00'), end: toMin('20:00'), kind: 'notice', label: 'Mannschaftsspiel', text: 'Mannschaftsspiel auf der Tennisanlage' })
  if (idx === 3) w.push({ start: toMin('13:00'), end: toMin('16:00'), kind: 'notice', label: 'Vereinsmeisterschaft', text: 'Vereinsmeisterschaft auf der Tennisanlage' })
  return w
}

export function availabilityFor(dayIndex: number): DayAvailability {
  const blocks = perDay[dayIndex] ?? base
  const segments: Segment[] = []
  for (let i = 0; i < slotCount; i++) {
    const start = OPEN_MIN + i * SLOT_MINUTES, end = start + SLOT_MINUTES
    const hit = blocks.find(([a, b]) => toMin(a) <= start && end <= toMin(b))
    segments.push({ start, end, status: hit ? hit[2] : 'free', label: hit?.[3] })
  }
  return { segments, windows: windowsFor(dayIndex) }
}

export const segmentAt = (day: DayAvailability, start: number) => day.segments.find((s) => s.start === start)
export const canStartAt = (day: DayAvailability, t: number) => t < CLOSE_MIN && segmentAt(day, t)?.status === 'free'
/** End point is valid when every segment between start and end is free (and within max duration). */
export function canEndAt(day: DayAvailability, start: number, end: number, maxMin: number) {
  if (end <= start || end - start > maxMin) return false
  for (let t = start; t < end; t += SLOT_MINUTES) if (segmentAt(day, t)?.status !== 'free') return false
  return true
}
export const freeSlotCount = (day: DayAvailability) => day.segments.filter((s) => s.status === 'free').length
export const overlaps = (r: Range, w: { start: number; end: number }) => r.start < w.end && r.end > w.start
export const noticeFor = (day: DayAvailability, r: Range | null) => (r ? day.windows.find((w) => w.kind === 'notice' && overlaps(r, w)) ?? null : null)
/** Demo: pick a "snatched" slot to show a conflict after the fact (Saturday 14:00). */
export const SNATCH_START = toMin('14:00')
