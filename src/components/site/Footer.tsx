import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Wordmark } from './Navbar'

const cols = [
  { title: 'Verein', items: [['Tennis', '/tennis'], ['Padel', '/padel'], ['Verein', '/verein'], ['Events', '/events'], ['Aktuelles', '/aktuelles']] },
  { title: 'Spielen', items: [['Padel Court buchen', '/padel/buchen'], ['Padel verschenken', '/gutschein'], ['Meine Buchung', '/buchung/TCR-2609-1830'], ['Mitglied werden', '/verein']] },
  { title: 'Kontakt', items: [['info@tc-roettenbach.de', 'mailto:info@tc-roettenbach.de'], ['+49 9195 000 000', 'tel:+499195000000'], ['Instagram', '#'], ['Facebook', '#']] },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div className="container-wide pt-20 md:pt-28">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Wordmark light />
            <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-white/60">
              Tennis & Padel Club in Röttenbach. Sechs Sandplätze, ein Padel Court, 269 Mitglieder und eine Gemeinschaft, die den Court liebt.
            </p>
            <address className="mt-8 text-[14.5px] not-italic leading-relaxed text-white/80">
              TC Röttenbach e.V.<br />Lohmühlweg 11a<br />91341 Röttenbach
            </address>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7">
            {cols.map((c) => (
              <div key={c.title}>
                <div className="eyebrow !text-white/40">{c.title}</div>
                <ul className="mt-4 space-y-2.5">
                  {c.items.map(([label, to]) => (
                    <li key={label}>
                      {to.startsWith('/') ? (
                        <Link to={to} className="group inline-flex items-center gap-1 text-[14.5px] text-white/80 transition-colors hover:text-white">{label}<ArrowUpRight size={13} className="opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-70" /></Link>
                      ) : (
                        <a href={to} className="text-[14.5px] text-white/80 transition-colors hover:text-white">{label}</a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 py-6 text-[13px] text-white/45 md:flex-row md:items-center md:justify-between">
          <span>© 2026 TC Röttenbach e.V. · Demo-Oberfläche, alle Daten beispielhaft.</span>
          <div className="flex gap-5">
            <Link to="#" className="hover:text-white">Impressum</Link>
            <Link to="#" className="hover:text-white">Datenschutz</Link>
            <Link to="/admin" className="hover:text-white">Admin</Link>
          </div>
        </div>
      </div>
      <div aria-hidden className="pointer-events-none select-none overflow-hidden pb-2 pt-4">
        <div className="container-wide">
          <div className="whitespace-nowrap text-[15vw] font-semibold leading-[0.8] tracking-[-0.045em] text-white/[0.06] md:text-[12.5vw]">TC RÖTTENBACH</div>
        </div>
      </div>
    </footer>
  )
}
