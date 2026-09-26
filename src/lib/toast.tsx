import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Info } from 'lucide-react'
import { t } from './motion'

interface Toast { id: number; title: string; description?: string; kind?: 'success' | 'info' }
interface ToastApi { toast: (title: string, description?: string, kind?: Toast['kind']) => void }

const Ctx = createContext<ToastApi>({ toast: () => {} })
export const useToast = () => useContext(Ctx)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([])
  const toast = useCallback((title: string, description?: string, kind: Toast['kind'] = 'success') => {
    const id = Date.now() + Math.random()
    setItems((s) => [...s.slice(-2), { id, title, description, kind }])
    window.setTimeout(() => setItems((s) => s.filter((x) => x.id !== id)), 3200)
  }, [])
  const api = useMemo(() => ({ toast }), [toast])
  return (
    <Ctx.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 p-4 pb-[max(16px,env(safe-area-inset-bottom))] md:inset-x-auto md:bottom-auto md:right-6 md:top-6 md:items-end">
        <AnimatePresence initial={false}>
          {items.map((it) => (
            <motion.div
              key={it.id}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.98, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, scale: 0.98, filter: 'blur(4px)' }}
              transition={t.spring}
              className="pointer-events-auto flex items-center gap-3 rounded-[12px] border border-line bg-surface px-3.5 py-2.5 text-[14px] shadow-panel"
            >
              <span className={it.kind === 'info' ? 'grid size-6 place-items-center rounded-full bg-paper text-ink' : 'grid size-6 place-items-center rounded-full bg-green-soft text-green'}>
                {it.kind === 'info' ? <Info size={13} strokeWidth={2.2} /> : <Check size={13} strokeWidth={2.6} />}
              </span>
              <div>
                <div className="font-medium leading-tight">{it.title}</div>
                {it.description && <div className="text-[12.5px] text-muted">{it.description}</div>}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  )
}
