export type SlotStatus = 'free' | 'booked' | 'training' | 'blocked' | 'notice'

export interface Slot {
  id: string
  start: string
  end: string
  status: SlotStatus
  label?: string
  noticeTitle?: string
}

export interface DayOption {
  key: string
  weekday: string
  day: number
  month: string
  label?: string
  full: string
  short: string
}

export const days: DayOption[] = [
  { key: '2026-09-26', weekday: 'Sa', day: 26, month: 'Sep', label: 'Heute', full: 'Samstag, 26. September', short: 'Sa, 26. Sep' },
  { key: '2026-09-27', weekday: 'So', day: 27, month: 'Sep', full: 'Sonntag, 27. September', short: 'So, 27. Sep' },
  { key: '2026-09-28', weekday: 'Mo', day: 28, month: 'Sep', full: 'Montag, 28. September', short: 'Mo, 28. Sep' },
  { key: '2026-09-29', weekday: 'Di', day: 29, month: 'Sep', full: 'Dienstag, 29. September', short: 'Di, 29. Sep' },
  { key: '2026-09-30', weekday: 'Mi', day: 30, month: 'Sep', full: 'Mittwoch, 30. September', short: 'Mi, 30. Sep' },
  { key: '2026-10-01', weekday: 'Do', day: 1, month: 'Okt', full: 'Donnerstag, 1. Oktober', short: 'Do, 1. Okt' },
  { key: '2026-10-02', weekday: 'Fr', day: 2, month: 'Okt', full: 'Freitag, 2. Oktober', short: 'Fr, 2. Okt' },
  { key: '2026-10-03', weekday: 'Sa', day: 3, month: 'Okt', full: 'Samstag, 3. Oktober', short: 'Sa, 3. Okt' },
]

const base: Omit<Slot, 'id'>[] = [
  { start: '08:00', end: '09:30', status: 'booked' },
  { start: '09:30', end: '11:00', status: 'free' },
  { start: '11:00', end: '12:30', status: 'free' },
  { start: '12:30', end: '14:00', status: 'training', label: 'Training' },
  { start: '14:00', end: '15:30', status: 'free' },
  { start: '15:30', end: '17:00', status: 'booked' },
  { start: '17:00', end: '18:30', status: 'free' },
  { start: '18:30', end: '20:00', status: 'notice', noticeTitle: 'Mannschaftsspiel' },
  { start: '20:00', end: '21:30', status: 'free' },
]

export function slotsFor(dayKey: string): Slot[] {
  const idx = Math.max(0, days.findIndex((d) => d.key === dayKey))
  return base.map((s, i) => {
    let status = s.status
    let label = s.label
    let noticeTitle = s.noticeTitle
    // Sunday: youth tournament blocks the court in the afternoon
    if (idx === 1 && (i === 4 || i === 5 || i === 6)) { status = 'blocked'; label = 'Jugendturnier'; noticeTitle = undefined }
    if (idx === 1 && i === 7) { status = 'free'; noticeTitle = undefined }
    // weekdays: shift booked pattern so grid feels alive
    if (idx >= 2 && idx <= 4) {
      if (i === 1) status = 'booked'
      if (i === 0) status = 'free'
      if (i === 7) { status = 'free'; noticeTitle = undefined }
      if (i === 8) status = idx === 3 ? 'booked' : 'free'
    }
    if (idx === 5 || idx === 6) {
      if (i === 3) { status = 'free'; label = undefined }
      if (i === 7) { status = 'free'; noticeTitle = undefined }
      if (i === 2) status = 'booked'
    }
    // Empty-state day: all gone (Saturday next week)
    if (idx === 7) status = i === 8 ? 'booked' : i % 2 ? 'booked' : 'booked'
    return { id: `${dayKey}-${i}`, ...s, status, label, noticeTitle }
  })
}

export const players = [
  { initials: 'LP', name: 'Lazar Popovic', kind: 'member' as const },
  { initials: 'MM', name: 'Max Mustermann', kind: 'guest' as const },
  { initials: 'JS', name: 'Jonas Schäfer', kind: 'guest' as const },
  { initials: 'TH', name: 'Tobias Herzog', kind: 'member' as const },
]

export type EventCategory = 'Tennis' | 'Padel' | 'Jugend' | 'Verein'

export interface ClubEvent {
  id: string
  title: string
  date: string
  time: string
  category: EventCategory
  location: string
  tone: 'green' | 'clay' | 'dark' | 'sand' | 'moss'
  description: string
  occupancy: { label: string; value: string; kind: 'blocked' | 'notice' | 'open' }[]
  featured?: boolean
}

export const events: ClubEvent[] = [
  {
    id: 'jugendturnier',
    title: '42. Röttenbacher Jugendturnier',
    date: '18.–20. September 2026',
    time: '08:00 – 18:00',
    category: 'Jugend',
    location: 'Gesamte Anlage',
    tone: 'green',
    featured: true,
    description:
      'Drei Tage Nachwuchstennis auf allen Plätzen. Über 120 Spielerinnen und Spieler aus der Region, Verpflegung am Clubhaus, Finals am Sonntagnachmittag.',
    occupancy: [
      { label: 'Tennisplätze 1–6', value: '08:00–18:00 belegt', kind: 'blocked' },
      { label: 'Padel Court', value: '12:00–16:00 gesperrt', kind: 'blocked' },
    ],
  },
  {
    id: 'saisoneroeffnung',
    title: 'Saisoneröffnung',
    date: '25. April 2027',
    time: '11:00 – 18:00',
    category: 'Verein',
    location: 'Clubhaus & Plätze',
    tone: 'clay',
    description: 'Gemeinsamer Start in die Freiluftsaison mit Schnuppertennis, Padel-Einführung und Grillabend.',
    occupancy: [
      { label: 'Tennisplätze 1–3', value: '11:00–15:00 Schnuppertennis', kind: 'notice' },
      { label: 'Padel Court', value: 'Padel verfügbar', kind: 'open' },
    ],
  },
  {
    id: 'afterwork',
    title: 'After Work Tennis',
    date: 'Jeden Donnerstag',
    time: '18:00 – 21:00',
    category: 'Tennis',
    location: 'Plätze 4–6',
    tone: 'dark',
    description: 'Lockeres Doppel nach Feierabend. Ohne Anmeldung, offen für alle Spielstärken.',
    occupancy: [
      { label: 'Tennisplätze 4–6', value: '18:00–21:00 belegt', kind: 'blocked' },
      { label: 'Padel Court', value: 'Padel verfügbar', kind: 'open' },
    ],
  },
  {
    id: 'mannschaft',
    title: 'Mannschaftsspiele Herren 30',
    date: '26. September 2026',
    time: '13:00 – 18:00',
    category: 'Tennis',
    location: 'Plätze 1–4',
    tone: 'moss',
    description: 'Heimspieltag der Herren 30 gegen TSV Herzogenaurach. Zuschauer willkommen.',
    occupancy: [
      { label: 'Tennisplätze 1–4', value: '13:00–18:00 belegt', kind: 'blocked' },
      { label: 'Padel Court', value: 'Padel verfügbar · Hinweis erforderlich', kind: 'notice' },
    ],
  },
  {
    id: 'vereinsmeisterschaft',
    title: 'Vereinsmeisterschaft',
    date: '10.–11. Oktober 2026',
    time: '09:00 – 19:00',
    category: 'Verein',
    location: 'Gesamte Anlage',
    tone: 'sand',
    description: 'Die clubinterne Meisterschaft in Einzel und Doppel. Siegerehrung am Sonntagabend im Clubhaus.',
    occupancy: [
      { label: 'Tennisplätze 1–6', value: '09:00–19:00 belegt', kind: 'blocked' },
      { label: 'Padel Court', value: 'Padel verfügbar · Hinweis erforderlich', kind: 'notice' },
    ],
  },
  {
    id: 'padelnight',
    title: 'Padel Night',
    date: '2. Oktober 2026',
    time: '19:00 – 23:00',
    category: 'Padel',
    location: 'Padel Court 01',
    tone: 'green',
    description: 'Americano-Format unter Flutlicht. Rotierende Partner, kurze Matches, Musik am Court.',
    occupancy: [
      { label: 'Padel Court', value: '19:00–23:00 gesperrt', kind: 'blocked' },
      { label: 'Tennisplätze', value: 'Frei buchbar', kind: 'open' },
    ],
  },
]

export const members = [
  { id: 'm1', name: 'Tobias Herzog', type: 'TC Mitglied', status: 'Aktiv', bookings: 18, since: 2021, padel: true, email: 't.herzog@example.de' },
  { id: 'm2', name: 'Lazar Popovic', type: 'TC Mitglied', status: 'Aktiv', bookings: 24, since: 2019, padel: true, email: 'l.popovic@example.de' },
  { id: 'm3', name: 'Anna Weber', type: 'TC Mitglied', status: 'Aktiv', bookings: 11, since: 2023, padel: true, email: 'a.weber@example.de' },
  { id: 'm4', name: 'Jonas Schäfer', type: 'Jugend', status: 'Aktiv', bookings: 7, since: 2024, padel: false, email: 'j.schaefer@example.de' },
  { id: 'm5', name: 'Max Mustermann', type: 'Gast', status: 'Gast', bookings: 3, since: 2026, padel: true, email: 'max@example.de' },
  { id: 'm6', name: 'Sabine Kraus', type: 'TC Mitglied', status: 'Ruhend', bookings: 0, since: 2016, padel: false, email: 's.kraus@example.de' },
  { id: 'm7', name: 'Günter Rottmann', type: 'Vorstand', status: 'Aktiv', bookings: 14, since: 2008, padel: true, email: 'g.rottmann@example.de' },
  { id: 'm8', name: 'Lena Hofmann', type: 'TC Mitglied', status: 'Aktiv', bookings: 9, since: 2022, padel: true, email: 'l.hofmann@example.de' },
]

export const adminBookings = [
  { id: 'b1', time: '18:30 – 20:00', court: 'Padel Court 01', name: 'Lazar Popovic', players: 4, status: 'Bezahlt', amount: '16,00 €', method: 'Apple Pay' },
  { id: 'b2', time: '20:00 – 21:30', court: 'Padel Court 01', name: 'Max Mustermann', players: 4, status: 'Bezahlt', amount: '24,00 €', method: 'PayPal' },
  { id: 'b3', time: '17:00 – 18:30', court: 'Padel Court 01', name: 'Anna Weber', players: 2, status: 'Bezahlt', amount: '12,00 €', method: 'Karte' },
  { id: 'b4', time: '14:00 – 15:30', court: 'Padel Court 01', name: 'Lena Hofmann', players: 4, status: 'Offen', amount: '16,00 €', method: 'Klarna' },
  { id: 'b5', time: '09:30 – 11:00', court: 'Padel Court 01', name: 'Tobias Herzog', players: 4, status: 'Bezahlt', amount: '8,00 €', method: 'Karte' },
  { id: 'b6', time: '08:00 – 09:30', court: 'Padel Court 01', name: 'Jonas Schäfer', players: 2, status: 'Storniert', amount: '0,00 €', method: '–' },
]
