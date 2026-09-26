import { createContext, useContext, useEffect } from 'react'

export const NavThemeCtx = createContext<{ dark: boolean; setOverride: (v: boolean | null) => void }>({ dark: false, setOverride: () => {} })

/** Force the navbar into its on-dark variant while the calling component is mounted. */
export function useDarkNav(active = true) {
  const { setOverride } = useContext(NavThemeCtx)
  useEffect(() => {
    if (!active) return
    setOverride(true)
    return () => setOverride(null)
  }, [active, setOverride])
}
