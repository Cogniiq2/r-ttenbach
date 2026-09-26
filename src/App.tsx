import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { SiteLayout } from './components/site/SiteLayout'
import { Home } from './pages/Home'
import { Booking } from './pages/Booking'
import { BookingDetail } from './pages/BookingDetail'
import { Events } from './pages/Events'
import { Tennis } from './pages/Tennis'
import { Padel } from './pages/Padel'
import { Verein } from './pages/Verein'
import { Aktuelles } from './pages/Aktuelles'
import { GiftCard } from './pages/GiftCard'
const AdminLayout = lazy(() => import('./admin/AdminLayout').then((m) => ({ default: m.AdminLayout })))
const Overview = lazy(() => import('./admin/Overview').then((m) => ({ default: m.Overview })))
const Bookings = lazy(() => import('./admin/Bookings').then((m) => ({ default: m.Bookings })))
const Calendar = lazy(() => import('./admin/Calendar').then((m) => ({ default: m.Calendar })))
const Members = lazy(() => import('./admin/Members').then((m) => ({ default: m.Members })))
const AdminEvents = lazy(() => import('./admin/AdminEvents').then((m) => ({ default: m.AdminEvents })))
const Payments = lazy(() => import('./admin/Payments').then((m) => ({ default: m.Payments })))
const Vouchers = lazy(() => import('./admin/Vouchers').then((m) => ({ default: m.Vouchers })))
const Automations = lazy(() => import('./admin/Automations').then((m) => ({ default: m.Automations })))
const Settings = lazy(() => import('./admin/Settings').then((m) => ({ default: m.Settings })))

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/tennis" element={<Tennis />} />
        <Route path="/padel" element={<Padel />} />
        <Route path="/padel/buchen" element={<Booking />} />
        <Route path="/verein" element={<Verein />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<Events />} />
        <Route path="/aktuelles" element={<Aktuelles />} />
        <Route path="/gutschein" element={<GiftCard />} />
        <Route path="/buchung/:id" element={<BookingDetail />} />
      </Route>
      <Route path="/admin" element={<Suspense fallback={<div className="min-h-dvh bg-[#F3F4F0]" />}><AdminLayout /></Suspense>}>
        <Route index element={<Overview />} />
        <Route path="buchungen" element={<Bookings />} />
        <Route path="kalender" element={<Calendar />} />
        <Route path="mitglieder" element={<Members />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="zahlungen" element={<Payments />} />
        <Route path="gutscheine" element={<Vouchers />} />
        <Route path="automationen" element={<Automations />} />
        <Route path="einstellungen" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
