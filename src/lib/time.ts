/**
 * Time architecture for bookings. DEMO configuration: 30-minute granularity,
 * 08:00–22:00. Production rules can change these constants without touching the UI.
 */
export const SLOT_MINUTES = 30
export const OPEN_MIN = 8 * 60
export const CLOSE_MIN = 22 * 60
export const MAX_BOOKING_MIN = 180
export const FLOODLIGHT_LEAD_MIN = 5
export const FLOODLIGHT_LAG_MIN = 5

export const toMin = (hhmm: string) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m }
export const fmt = (min: number) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`
export const fmtRange = (start: number, end: number) => `${fmt(start)} – ${fmt(end)}`

/** Natural German duration: 60 → "1 Std.", 90 → "1 Std. 30 Min.", 30 → "30 Min." */
export function fmtDuration(min: number) {
  const h = Math.floor(min / 60), m = min % 60
  if (h === 0) return `${m} Min.`
  if (m === 0) return `${h} Std.`
  return `${h} Std. ${m} Min.`
}

/** All time points from open to close inclusive (e.g. 08:00 … 22:00). */
export const points = (): number[] => { const out: number[] = []; for (let t = OPEN_MIN; t <= CLOSE_MIN; t += SLOT_MINUTES) out.push(t); return out }
export const slotCount = (CLOSE_MIN - OPEN_MIN) / SLOT_MINUTES
export const slotIndex = (min: number) => (min - OPEN_MIN) / SLOT_MINUTES

/* DEMO pricing */
export const PRICE_PER_SLOT = 8
export const MEMBER_DISCOUNT_PER_SLOT = 1

export function priceFor(durationMin: number, members: number, extras = 0) {
  const slots = durationMin / SLOT_MINUTES
  const court = slots * PRICE_PER_SLOT
  const discount = -slots * MEMBER_DISCOUNT_PER_SLOT * members
  return { court, discount, extras, total: court + discount + extras }
}
