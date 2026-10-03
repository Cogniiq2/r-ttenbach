import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Picture } from '@/components/ui/Picture'
import { Page } from '@/components/site/Page'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Field'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/cn'
import { t } from '@/lib/motion'
import { useToast } from '@/lib/toast'

const amounts = [25, 50, 100] as const

/** Card that tilts toward a fine pointer and carries a moving light reflection. */
function TiltCard({ children }: { children: ReactNode }) {
  const px = useMotionValue(0.5), py = useMotionValue(0.5)
  const sx = useSpring(px, { stiffness: 180, damping: 20 }), sy = useSpring(py, { stiffness: 180, damping: 20 })
  const rotY = useTransform(sx, [0, 1], [-7, 7]), rotX = useTransform(sy, [0, 1], [6, -6])
  const gx = useTransform(sx, [0, 1], ['10%', '90%']), gy = useTransform(sy, [0, 1], ['0%', '100%'])
  const sheen = useMotionTemplate`radial-gradient(60% 70% at ${gx} ${gy}, rgba(255,255,255,0.22), transparent 60%)`
  return (
    <motion.div
      onPointerMove={(e) => { if (e.pointerType !== 'mouse') return; const r = e.currentTarget.getBoundingClientRect(); px.set((e.clientX - r.left) / r.width); py.set((e.clientY - r.top) / r.height) }}
      onPointerLeave={() => { px.set(0.5); py.set(0.5) }}
      style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1100 }}
      className="relative aspect-[1.586] overflow-hidden rounded-[22px] bg-ink text-white shadow-[0_30px_80px_rgba(9,20,40,0.35)]"
    >
      {children}
      <motion.div className="pointer-events-none absolute inset-0 mix-blend-soft-light" style={{ background: sheen }} />
    </motion.div>
  )
}

export function GiftCard() {
  const { toast } = useToast()
  const [amount, setAmount] = useState<number | 'custom'>(50)
  const [custom, setCustom] = useState('75')
  const [to, setTo] = useState('')
  const [from, setFrom] = useState('')
  const [msg, setMsg] = useState('')
  const value = amount === 'custom' ? Number(custom || 0) : amount

  return (
    <Page className="pt-[68px] md:pt-[76px]">
      <section className="section">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-6">
            <Reveal><div className="eyebrow">Gutschein</div><h1 className="display-lg mt-4">Padel verschenken.</h1><p className="lede mt-5 max-w-md">Ein Gutschein für den Padel Court. Digital, sofort per E-Mail, einlösbar bei jeder Buchung.</p></Reveal>
            <Reveal delay={0.1} className="mt-10 space-y-6">
              <div>
                <div className="mb-2 text-[13px] font-medium text-ink-2">Betrag</div>
                <div className="grid grid-cols-4 gap-2">
                  {[...amounts, 'custom' as const].map((a) => {
                    const active = amount === a
                    return (
                      <button key={String(a)} onClick={() => setAmount(a)} className={cn('pressable num h-14 rounded-[12px] border text-[16px] font-semibold transition-colors', active ? 'border-ink bg-ink text-white' : 'border-line-2 bg-white hover:border-ink/50')}>
                        {a === 'custom' ? <span className="text-[13px] font-medium">Eigener</span> : `${a} €`}
                      </button>
                    )
                  })}
                </div>
                <AnimatePresence>{amount === 'custom' && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={t.fast} className="overflow-hidden"><div className="pt-3"><Input inputMode="numeric" value={custom} onChange={(e) => setCustom(e.target.value.replace(/\D/g, ''))} placeholder="Betrag in €" /></div></motion.div>}</AnimatePresence>
              </div>
              <div className="grid gap-4 sm:grid-cols-2"><Input label="Für" placeholder="Name der Empfängerin / des Empfängers" value={to} onChange={(e) => setTo(e.target.value)} /><Input label="Von" placeholder="Dein Name" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
              <Input label="E-Mail des Empfängers" type="email" placeholder="name@beispiel.de" />
              <Textarea label="Persönliche Nachricht" placeholder="Alles Gute zum Geburtstag – wir sehen uns am Court!" value={msg} onChange={(e) => setMsg(e.target.value.slice(0, 140))} />
              <Button size="xl" full arrow onClick={() => toast('Gutschein in den Warenkorb gelegt', 'Demo · kein Kauf')}>Gutschein kaufen · {value.toFixed(2).replace('.', ',')} €</Button>
            </Reveal>
          </div>

          <div className="lg:sticky lg:top-[110px] lg:col-span-5 lg:col-start-8">
            <Reveal delay={0.15}>
              <div className="eyebrow mb-3">Vorschau</div>
              <TiltCard>
                <div className="absolute inset-0"><Picture name="rackets" alt="" focus="58% 45%" sizes="(min-width: 1024px) 40vw, 100vw" className="h-full w-full" zoom={false} /></div>
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(9,14,24,0.88)_0%,rgba(9,14,24,0.55)_55%,rgba(9,14,24,0.2)_100%)]" />
                <div className="relative flex h-full flex-col justify-between p-6 md:p-8">
                  <div className="flex items-start justify-between"><span className="text-[13px] font-semibold tracking-[-0.01em]">TC Röttenbach</span><span className="text-[11px] uppercase tracking-[0.14em] text-white/60">Padel Gutschein</span></div>
                  <div>
                    <motion.div key={value} initial={{ opacity: 0.4, y: 4 }} animate={{ opacity: 1, y: 0 }} className="num text-[52px] font-semibold leading-none tracking-[-0.04em] md:text-[64px]">{value} €</motion.div>
                    <div className="mt-3 truncate text-[14px] text-white/75">{to ? `Für ${to}` : 'Für …'}{from ? ` · von ${from}` : ''}</div>
                    {msg && <div className="mt-1 line-clamp-2 text-[12.5px] italic text-white/55">„{msg}“</div>}
                  </div>
                  <div className="num flex items-center justify-between text-[11px] text-white/55"><span>GS-2026-XXXX</span><span>Demo-Gutschein</span></div>
                </div>
              </TiltCard>
            </Reveal>
          </div>
        </div>
      </section>
    </Page>
  )
}
