import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { EASE } from '@/lib/motion'
import { Button } from '@/components/ui/Button'

const links = [
  { to: '/tennis', label: 'Tennis' },
  { to: '/padel', label: 'Padel' },
  { to: '/verein', label: 'Verein' },
  { to: '/events', label: 'Events' },
  { to: '/aktuelles', label: 'Aktuelles' },
]

export function Wordmark({ light, className }: { light?: boolean; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5 font-semibold tracking-[-0.01em]', light ? 'text-white' : 'text-ink', className)}>
      <span className={cn('grid size-7 place-items-center rounded-[8px]', light ? 'bg-white text-ink' : 'bg-green text-white')}>
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="M6 7h12M12 7v11" /></svg>
      </span>
      <span className="text-[15px]">TC Röttenbach</span>
    </span>
  )
}

export function Navbar({ dark }: { dark?: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => { setOpen(false) }, [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const onDark = dark && !scrolled && !open

  return (
    <>
      <header className={cn('fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300', scrolled || open ? 'border-b border-line/80 bg-paper/85 backdrop-blur-xl' : 'border-b border-transparent bg-transparent')}>
        <div className="container-wide flex h-[68px] items-center justify-between md:h-[76px]">
          <Link to="/" className="pressable rounded-md" aria-label="TC Röttenbach – Startseite">
            <Wordmark light={onDark} />
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Hauptnavigation">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  cn('relative rounded-btn px-3.5 py-2 text-[14.5px] font-medium transition-colors duration-200',
                    onDark ? 'text-white/80 hover:text-white' : 'text-ink-2/80 hover:text-ink',
                    isActive && (onDark ? 'text-white' : 'text-ink'))
                }
              >
                {({ isActive }) => (
                  <>
                    {l.label}
                    {isActive && <motion.span layoutId="nav-dot" className={cn('absolute -bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full', onDark ? 'bg-white' : 'bg-green')} transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden md:block"><Button to="/padel/buchen" variant={onDark ? 'light' : 'dark'} size="sm" className="h-10 px-4">Platz buchen</Button></div>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
              aria-expanded={open}
              className={cn('pressable relative grid size-11 place-items-center rounded-btn md:hidden', onDark ? 'text-white' : 'text-ink')}
            >
              <span className="relative block h-3.5 w-5">
                <motion.span animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} transition={{ duration: 0.28, ease: EASE }} className="absolute left-0 top-0 block h-[1.6px] w-full bg-current" />
                <motion.span animate={open ? { opacity: 0, scaleX: 0.3 } : { opacity: 1, scaleX: 1 }} transition={{ duration: 0.2 }} className="absolute left-0 top-[6px] block h-[1.6px] w-full bg-current" />
                <motion.span animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} transition={{ duration: 0.28, ease: EASE }} className="absolute left-0 top-[12px] block h-[1.6px] w-full bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col bg-paper pt-[68px] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <nav className="container-x flex flex-1 flex-col justify-center gap-1 pb-16" aria-label="Mobile Navigation">
              {[{ to: '/', label: 'Start' }, ...links].map((l, i) => (
                <motion.div key={l.to} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.5, ease: EASE, delay: 0.06 + i * 0.05 }}>
                  <NavLink to={l.to} className={({ isActive }) => cn('group flex items-center justify-between border-b border-line py-4 text-[34px] font-semibold tracking-[-0.03em]', isActive ? 'text-green' : 'text-ink')}>
                    {l.label}
                    <ArrowUpRight size={22} className="text-muted-2 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </NavLink>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.42 }} className="mt-8 flex flex-col gap-3">
                <Button to="/padel/buchen" variant="primary" size="lg" arrow full>Padelplatz buchen</Button>
                <div className="flex items-center justify-between text-[13px] text-muted">
                  <span>Lohmühlweg 11a · 91341 Röttenbach</span>
                  <Link to="/admin" className="underline-offset-4 hover:underline">Admin</Link>
                </div>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
