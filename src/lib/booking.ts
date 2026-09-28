import { players } from './data'
import { FLOODLIGHT_LAG_MIN, FLOODLIGHT_LEAD_MIN, fmt, priceFor } from './time'

export type Player = (typeof players)[number]
export type Verify = 'idle' | 'checking' | 'done'
export type PayMethod = 'applepay' | 'paypal' | 'card' | 'klarna'
export const payLabel: Record<PayMethod, string> = { applepay: 'Apple Pay', paypal: 'PayPal', card: 'Karte', klarna: 'Klarna' }

/** Everything the player has chosen so far. Pure data, no UI. */
export interface BookingDraft {
  dayKey: string
  start: number
  end: number
  roster: Player[]
  verify: Record<string, Verify>
  floodlight: boolean
  rackets: boolean
  balls: boolean
  method: PayMethod
}

export const memberCount = (d: Pick<BookingDraft, 'roster' | 'verify'>) => d.roster.filter((p) => p.kind === 'member' && d.verify[p.initials] === 'done').length
export const extrasTotal = (d: Pick<BookingDraft, 'rackets' | 'balls'>) => (d.rackets ? 4 : 0) + (d.balls ? 3 : 0)
export const priceOf = (d: BookingDraft) => priceFor(d.end - d.start, memberCount(d), extrasTotal(d))
export const floodlightWindow = (start: number, end: number) => ({ on: fmt(start - FLOODLIGHT_LEAD_MIN), off: fmt(end + FLOODLIGHT_LAG_MIN) })
export const BOOKING_ID = 'TCR-2609-1800'
