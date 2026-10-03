import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { scrollToTop, startSmoothScroll, stopSmoothScroll } from '@/lib/smooth'
import { NavThemeCtx } from '@/lib/navTheme'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

const darkHeroRoutes = ['/', '/tennis', '/padel', '/verein', '/padel/buchen']

export function SiteLayout() {
  const location = useLocation()
  useEffect(() => { startSmoothScroll(); return () => stopSmoothScroll() }, [])
  useEffect(() => { scrollToTop() }, [location.pathname])
  const [override, setOverride] = useState<boolean | null>(null)
  const dark = override ?? darkHeroRoutes.includes(location.pathname)
  const ctx = useMemo(() => ({ dark, setOverride }), [dark])
  const hideFooter = location.pathname.startsWith('/padel/buchen')
  return (
    <NavThemeCtx.Provider value={ctx}>
      <Navbar dark={dark} />
      <AnimatePresence mode="wait" initial={false}>
        <Outlet key={location.pathname} />
      </AnimatePresence>
      {!hideFooter && <Footer />}
    </NavThemeCtx.Provider>
  )
}
