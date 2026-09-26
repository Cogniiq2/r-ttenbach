# TC Röttenbach · Tennis & Padel

Interactive UI concept for the TC Röttenbach website, padel booking flow and admin dashboard.

**UI-only demo.** There is no backend, authentication, payment, database or hardware integration. All data is mock data and every interaction is simulated client-side.

## Stack

- Vite 8 · React 19 · TypeScript
- Tailwind CSS 4 (design tokens in `src/styles/index.css`)
- Framer Motion (page transitions, layout animations, micro-interactions)
- React Router 7
- Lucide icons · Geist variable font (bundled, no runtime network needed)

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build to dist/
npm run preview
```

## Routes

| Route | Page |
| --- | --- |
| `/` | Homepage with hero sequence and live availability module |
| `/padel/buchen` | Padel booking flow: date → slots → players → extras → checkout → success |
| `/buchung/:id` | Booking detail |
| `/events`, `/events/:id` | Events with animated filters and detail modal |
| `/tennis`, `/padel`, `/verein`, `/aktuelles` | Editorial club pages |
| `/gutschein` | Gift card configurator with live preview |
| `/admin/*` | Admin dashboard: overview, bookings, calendar (drag to block/notice), members, events, payments, vouchers, automations, settings |

## Demo states worth trying

- Booking → select **18:30** (Saturday) for the matchday notice with acknowledgement.
- Booking → select **14:00** (Saturday) for the “slot just taken” inline error.
- Booking → switch to **Sunday 27** for blocked Jugendturnier slots, **Saturday 3 Oct** for the empty state.
- Admin → Kalender: drag a range on any day column to open the “Zeitraum verwalten” modal.
- Admin → Automationen: toggle Flutlicht to see the glow state.

Photography is represented by designed placeholders intended to be replaced with real club imagery.
