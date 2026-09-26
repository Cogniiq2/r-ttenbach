import { cn } from '@/lib/cn'

export type PhotoVariant = 'tennis' | 'padel' | 'club' | 'youth' | 'people' | 'night' | 'clay' | 'aerial'

interface Props {
  variant?: PhotoVariant
  className?: string
  caption?: string
  zoom?: boolean
  hideCaption?: boolean
}

const bg: Record<PhotoVariant, string> = {
  tennis: 'radial-gradient(120% 90% at 20% 10%, #4A7A5E 0%, #2A4D3B 45%, #17291F 100%)',
  padel: 'radial-gradient(110% 100% at 80% 0%, #3E6B52 0%, #23443A 50%, #12201A 100%)',
  club: 'radial-gradient(120% 100% at 30% 0%, #A79B85 0%, #6C6555 50%, #2E2B25 100%)',
  youth: 'radial-gradient(120% 100% at 60% 0%, #C6906E 0%, #8F5B43 50%, #3B2A22 100%)',
  people: 'radial-gradient(120% 100% at 50% 0%, #6C7C6E 0%, #3C4A40 55%, #1E241F 100%)',
  night: 'radial-gradient(120% 100% at 50% 20%, #23412F 0%, #101B15 55%, #080D0A 100%)',
  clay: 'radial-gradient(120% 100% at 30% 0%, #D7A184 0%, #B8674C 50%, #6A3A2A 100%)',
  aerial: 'radial-gradient(120% 100% at 50% 0%, #7E9B84 0%, #476A55 50%, #223A2C 100%)',
}

/** Court-line graphic that stands in for real club photography. */
function Lines({ variant }: { variant: PhotoVariant }) {
  const stroke = 'rgba(255,255,255,0.55)'
  if (variant === 'padel' || variant === 'night') {
    return (
      <svg viewBox="0 0 1000 620" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <g fill="none" stroke={stroke} strokeWidth="2.5">
          <rect x="140" y="80" width="720" height="460" rx="2" />
          <line x1="500" y1="80" x2="500" y2="540" strokeWidth="4" />
          <line x1="140" y1="310" x2="860" y2="310" />
          <line x1="230" y1="80" x2="230" y2="540" strokeDasharray="6 10" opacity=".5" />
          <line x1="770" y1="80" x2="770" y2="540" strokeDasharray="6 10" opacity=".5" />
        </g>
        <g stroke="rgba(255,255,255,0.18)" strokeWidth="1">
          {Array.from({ length: 11 }).map((_, i) => <line key={i} x1={140 + i * 72} y1="40" x2={140 + i * 72} y2="580" />)}
        </g>
      </svg>
    )
  }
  if (variant === 'tennis' || variant === 'clay' || variant === 'aerial') {
    return (
      <svg viewBox="0 0 1000 620" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <g fill="none" stroke={stroke} strokeWidth="2.5" transform="skewX(-6)">
          <rect x="120" y="60" width="800" height="500" />
          <rect x="120" y="120" width="800" height="380" />
          <line x1="520" y1="60" x2="520" y2="560" strokeWidth="4" />
          <line x1="320" y1="120" x2="320" y2="500" />
          <line x1="720" y1="120" x2="720" y2="500" />
          <line x1="320" y1="310" x2="720" y2="310" />
        </g>
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 1000 620" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <g fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5">
        <circle cx="500" cy="330" r="220" />
        <circle cx="500" cy="330" r="150" />
        <circle cx="500" cy="330" r="80" />
      </g>
    </svg>
  )
}

export function Photo({ variant = 'tennis', className, caption, zoom = true, hideCaption }: Props) {
  return (
    <div className={cn('grain relative isolate overflow-hidden bg-ink', className)} style={{ background: bg[variant] }}>
      <div className={cn('absolute inset-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]', zoom && 'group-hover:scale-[1.03]')}>
        <Lines variant={variant} />
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_100%,rgba(0,0,0,0.35),transparent)]" />
      </div>
      {!hideCaption && (
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-black/25 px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-[0.12em] text-white/70 backdrop-blur-sm">
          <span className="size-1.5 rounded-full bg-white/60" />
          {caption ?? 'Foto folgt · TC Röttenbach'}
        </div>
      )}
    </div>
  )
}
