import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Bell, CalendarDays, CreditCard, Gift, LayoutGrid, Menu, Search, Settings, Ticket, Users, Workflow, X, Zap, ExternalLink, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { EASE, t } from '@/lib/motion'
import { Modal } from '@/components/ui/Modal'

const nav = [
  { to: '/admin', label: 'Übersicht', icon: LayoutGrid, end: true },
  { to: '/admin/buchungen', label: 'Buchungen', icon: Ticket },
  { to: '/admin/kalender', label: 'Kalender', icon: CalendarDays },
  { to: '/admin/mitglieder', label: 'Mitglieder', icon: Users },
  { to: '/admin/events', label: 'Events', icon: Zap },
  { to: '/admin/zahlungen', label: 'Zahlungen', icon: CreditCard },
  { to: '/admin/gutscheine', label: 'Gutscheine', icon: Gift },
  { to: '/admin/automationen', label: 'Automationen', icon: Workflow },
  { to: '/admin/einstellungen', label: 'Einstellungen', icon: Settings },
]

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 px-5">
        <span className="grid size-7 place-items-center rounded-[8px] bg-green text-white"><svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="M6 7h12M12 7v11" /></svg></span>
        <div className="leading-tight"><div className="text-[14px] font-semibold">TC Röttenbach</div><div className="text-[11px] text-muted">Anlage · Admin</div></div>
      </div>
      <nav className="mt-2 flex-1 space-y-0.5 px-3">
        {nav.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end} onClick={onNavigate} className={({ isActive }) => cn('group relative flex h-10 items-center gap-3 rounded-[10px] px-3 text-[14px] font-medium transition-colors', isActive ? 'text-ink' : 'text-muted hover:bg-ink/[0.04] hover:text-ink')}>
            {({ isActive }) => (
              <>
                {isActive && <motion.span layoutId="admin-nav" className="absolute inset-0 rounded-[10px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06),inset_0_0_0_1px_rgba(0,0,0,0.04)]" transition={t.spring} />}
                <n.icon size={17} strokeWidth={1.9} className={cn('relative', isActive ? 'text-green' : 'text-muted-2 group-hover:text-ink')} />
                <span className="relative">{n.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-line p-3">
        <Link to="/" className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13px] text-muted hover:bg-ink/[0.04] hover:text-ink"><ExternalLink size={15} />Zur Website</Link>
        <div className="mt-1 flex items-center gap-3 rounded-[10px] px-3 py-2.5"><span className="grid size-8 place-items-center rounded-full bg-ink text-[11px] font-semibold text-white">GR</span><div className="leading-tight"><div className="text-[13px] font-medium">Günter Rottmann</div><div className="text-[11px] text-muted">Vorstand</div></div></div>
      </div>
    </div>
  )
}

export function AdminLayout() {
  const [open, setOpen] = useState(false)
  const [cmd, setCmd] = useState(false)
  const loc = useLocation()
  const current = nav.find((n) => (n.end ? loc.pathname === n.to : loc.pathname.startsWith(n.to)))
  useEffect(() => { setOpen(false) }, [loc.pathname])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setCmd((c) => !c) } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="min-h-dvh bg-[#F3F4F0] text-ink">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[240px] border-r border-line bg-[#F3F4F0] lg:block"><Sidebar /></aside>

      <div className="lg:pl-[240px]">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-line bg-[#F3F4F0]/85 px-4 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="pressable grid size-10 place-items-center rounded-[10px] hover:bg-ink/[0.05] lg:hidden" aria-label="Menü"><Menu size={19} /></button>
            <div className="flex items-center gap-1.5 text-[13.5px]"><span className="text-muted">Anlage</span><ChevronRight size={13} className="text-muted-2" /><span className="font-medium">{current?.label ?? 'Übersicht'}</span></div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCmd(true)} className="pressable hidden h-9 items-center gap-2 rounded-[10px] border border-line bg-white pl-3 pr-2 text-[13px] text-muted hover:border-ink/30 sm:flex"><Search size={14} />Suchen…<kbd className="ml-4 rounded-[5px] bg-paper px-1.5 py-0.5 text-[11px] font-medium text-muted">⌘K</kbd></button>
            <button onClick={() => setCmd(true)} className="pressable grid size-9 place-items-center rounded-[10px] hover:bg-ink/[0.05] sm:hidden" aria-label="Suche"><Search size={17} /></button>
            <button className="pressable relative grid size-9 place-items-center rounded-[10px] hover:bg-ink/[0.05]" aria-label="Benachrichtigungen"><Bell size={17} /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-clay" /></button>
          </div>
        </header>
        <main className="px-4 py-6 md:px-8 md:py-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={loc.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4, transition: { duration: 0.15 } }} transition={{ duration: 0.35, ease: EASE }}>
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
            <motion.div initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }} transition={t.springSoft} className="absolute inset-y-0 left-0 w-[260px] bg-[#F3F4F0] shadow-panel">
              <button onClick={() => setOpen(false)} className="pressable absolute right-3 top-4 grid size-9 place-items-center rounded-full hover:bg-ink/[0.05]" aria-label="Schließen"><X size={16} /></button>
              <Sidebar onNavigate={() => setOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal open={cmd} onClose={() => setCmd(false)} className="sm:max-w-[560px]">
        <div className="p-2">
          <div className="flex items-center gap-3 border-b border-line px-3 py-3"><Search size={16} className="text-muted" /><input autoFocus placeholder="Buchung, Mitglied oder Seite suchen…" className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-2" /></div>
          <div className="p-2">
            <div className="px-2 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-muted">Seiten</div>
            {nav.slice(0, 6).map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setCmd(false)} className="flex items-center gap-3 rounded-[8px] px-2 py-2 text-[14px] hover:bg-paper"><n.icon size={15} className="text-muted" />{n.label}</Link>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  )
}
