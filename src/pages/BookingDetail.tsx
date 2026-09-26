import { useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarPlus, Info, Lightbulb, MapPin, Navigation, Share2, UserPlus, XCircle } from 'lucide-react'
import { Page } from '@/components/site/Page'
import { Button } from '@/components/ui/Button'
import { Pill } from '@/components/ui/Pill'
import { Avatar } from '@/components/ui/Avatar'
import { Modal } from '@/components/ui/Modal'
import { Reveal } from '@/components/ui/Reveal'
import { players } from '@/lib/data'
import { useToast } from '@/lib/toast'
import { EASE } from '@/lib/motion'

export function BookingDetail() {
  const { toast } = useToast()
  const [cancel, setCancel] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const [invite, setInvite] = useState(false)

  return (
    <Page className="pt-[68px] md:pt-[76px]">
      <div className="container-x pb-24 pt-10 md:pt-16">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="eyebrow">Deine Buchung</div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }} className="mt-5 flex items-start gap-6 md:gap-8">
              <div className="num flex flex-col items-center leading-none">
                <span className="text-[72px] font-semibold tracking-[-0.05em] md:text-[104px]">26</span>
                <span className="mt-1 text-[13px] font-medium uppercase tracking-[0.2em] text-muted">Sep</span>
              </div>
              <div className="pt-3 md:pt-5">
                <div className="num text-[26px] font-semibold tracking-[-0.02em] md:text-[34px]">18:30 – 20:00</div>
                <div className="mt-1 text-[17px] text-muted">Padel Court 01 · Samstag</div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {cancelled ? <Pill tone="red" dot>Storniert</Pill> : <Pill tone="green" dot>Bezahlt</Pill>}
                  <Pill tone="neutral">90 Minuten</Pill>
                  <Pill tone="neutral">Doppel</Pill>
                </div>
              </div>
            </motion.div>

            <Reveal className="mt-12">
              <div className="mb-3 text-[13px] font-medium text-muted">Spieler</div>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {players.map((p, i) => (
                  <div key={p.initials} className="flex items-center gap-3 rounded-[14px] border border-line bg-white px-4 py-3">
                    <Avatar initials={p.initials} tone={i} />
                    <div className="min-w-0 flex-1"><div className="truncate text-[15px] font-medium">{p.name}</div><div className="text-[12.5px] text-muted">{p.kind === 'member' ? 'TC Röttenbach Mitglied' : 'Gast'}</div></div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal className="mt-10">
              <div className="mb-3 text-[13px] font-medium text-muted">Extras</div>
              <div className="rounded-[14px] border border-line bg-white px-4 py-3.5">
                <div className="flex items-center gap-3"><Lightbulb size={17} className="glow-light text-sand" /><div className="flex-1"><div className="text-[15px] font-medium">Flutlicht</div><div className="text-[12.5px] text-muted">18:25 automatisch an · 20:05 automatisch aus</div></div><Pill tone="green">Aktiv</Pill></div>
              </div>
            </Reveal>

            <Reveal className="mt-10">
              <div className="flex gap-3.5 rounded-[16px] border border-sand-line bg-sand-soft p-5">
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-white text-sand"><Info size={16} /></span>
                <div><div className="text-[15px] font-semibold">Mannschaftsspiel auf der Tennisanlage</div><p className="mt-1 text-[14px] leading-relaxed text-[#5F4A22]">Parallel findet ein Heimspiel der Herren 30 statt. Bitte nehmt besondere Rücksicht und haltet die Lautstärke gering.</p></div>
              </div>
            </Reveal>

            <Reveal className="mt-10 flex items-center gap-2 text-[14px] text-muted"><MapPin size={15} />Lohmühlweg 11a, 91341 Röttenbach</Reveal>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-[20px] border border-line bg-surface p-5 shadow-panel lg:sticky lg:top-[100px] lg:p-6">
              <div className="eyebrow">Aktionen</div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  { icon: <CalendarPlus size={18} />, l: 'Kalender', on: () => toast('Kalendereintrag erstellt') },
                  { icon: <Navigation size={18} />, l: 'Route', on: () => toast('Route geöffnet', undefined, 'info') },
                  { icon: <Share2 size={18} />, l: 'Teilen', on: () => toast('Link kopiert') },
                ].map((a) => (
                  <button key={a.l} onClick={a.on} className="pressable flex h-[72px] flex-col items-center justify-center gap-1.5 rounded-[12px] border border-line bg-white text-[12.5px] font-medium hover:border-ink/40">{a.icon}{a.l}</button>
                ))}
              </div>
              <div className="mt-3 space-y-2">
                <Button variant="dark" full size="lg" icon={<UserPlus size={16} />} onClick={() => setInvite(true)}>Spieler einladen</Button>
                <Button variant="ghost" full size="lg" icon={<XCircle size={16} />} className="text-[#9A3B3B] hover:bg-[#FBEAEA]" disabled={cancelled} onClick={() => setCancel(true)}>{cancelled ? 'Buchung storniert' : 'Buchung stornieren'}</Button>
              </div>
              <div className="mt-5 space-y-2 border-t border-line pt-5 text-[13.5px]">
                <div className="flex justify-between"><span className="text-muted">Buchungsnummer</span><span className="num font-medium">TCR-2609-1830</span></div>
                <div className="flex justify-between"><span className="text-muted">Bezahlt mit</span><span className="font-medium">Apple Pay</span></div>
                <div className="flex justify-between"><span className="text-muted">Betrag</span><span className="num font-medium">16,00 €</span></div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Modal open={cancel} onClose={() => setCancel(false)}>
        <div className="p-6 md:p-8">
          <div className="text-[22px] font-semibold tracking-[-0.02em]">Buchung stornieren?</div>
          <p className="mt-2 text-[15px] text-muted">Du erhältst 16,00 € vollständig zurück. Die Stornierung ist bis 12 Stunden vor Spielbeginn kostenlos.</p>
          <div className="mt-6 flex gap-2.5">
            <Button variant="secondary" full onClick={() => setCancel(false)}>Behalten</Button>
            <Button variant="dark" full className="!bg-[#9A3B3B] hover:!bg-[#7E2F2F]" onClick={() => { setCancel(false); setCancelled(true); toast('Buchung storniert', 'Rückerstattung in 3–5 Werktagen') }}>Stornieren</Button>
          </div>
        </div>
      </Modal>
      <Modal open={invite} onClose={() => setInvite(false)}>
        <div className="p-6 md:p-8">
          <div className="text-[22px] font-semibold tracking-[-0.02em]">Spieler einladen</div>
          <p className="mt-2 text-[15px] text-muted">Teile den Link. Mitglieder werden beim Beitritt automatisch erkannt.</p>
          <div className="num mt-5 flex items-center justify-between rounded-[12px] border border-line bg-paper px-4 py-3 text-[14px]"><span className="truncate">tc-roettenbach.de/j/TCR-2609-1830</span><button onClick={() => { toast('Link kopiert'); setInvite(false) }} className="pressable ml-3 shrink-0 text-[13px] font-medium text-green">Kopieren</button></div>
        </div>
      </Modal>
    </Page>
  )
}
