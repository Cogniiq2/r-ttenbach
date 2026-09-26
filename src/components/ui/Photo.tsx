import { useId } from 'react'
import { cn } from '@/lib/cn'

/**
 * Art-directed temporary media. Each variant composes court geometry, fence mesh,
 * lighting and soft silhouettes into an editorial sports image. Replace by rendering
 * an <img> in place of <Artwork /> once real TC Röttenbach photography exists.
 */
export type PhotoVariant = 'tennis' | 'padel' | 'club' | 'youth' | 'people' | 'night' | 'clay' | 'aerial'

interface Props {
  variant?: PhotoVariant
  className?: string
  zoom?: boolean
  /** Real photo URL. When set, replaces the artwork. */
  src?: string
  alt?: string
  /** Shift the composition focal point (0–100). */
  focus?: 'left' | 'center' | 'right'
}

const palette: Record<PhotoVariant, { bg: string; line: string; glow: string }> = {
  tennis: { bg: 'radial-gradient(120% 90% at 30% 0%, #4C7A5F 0%, #2C5040 45%, #14241B 100%)', line: 'rgba(246,246,242,0.55)', glow: 'rgba(214,226,204,0.35)' },
  padel: { bg: 'radial-gradient(110% 100% at 75% 0%, #3E6C53 0%, #234437 50%, #0F1B16 100%)', line: 'rgba(246,246,242,0.6)', glow: 'rgba(200,220,205,0.4)' },
  night: { bg: 'radial-gradient(90% 80% at 50% 0%, #26473A 0%, #0F1A14 55%, #070B09 100%)', line: 'rgba(246,246,242,0.5)', glow: 'rgba(255,236,190,0.55)' },
  clay: { bg: 'radial-gradient(120% 100% at 30% 0%, #D39C7E 0%, #B8674C 50%, #5D3226 100%)', line: 'rgba(255,255,255,0.7)', glow: 'rgba(255,230,210,0.45)' },
  club: { bg: 'linear-gradient(160deg, #B9AC94 0%, #7C725F 45%, #2F2A24 100%)', line: 'rgba(255,255,255,0.35)', glow: 'rgba(255,240,215,0.5)' },
  youth: { bg: 'radial-gradient(120% 100% at 65% 0%, #CC9873 0%, #955F47 50%, #3A2921 100%)', line: 'rgba(255,255,255,0.5)', glow: 'rgba(255,225,190,0.5)' },
  people: { bg: 'radial-gradient(120% 100% at 50% 0%, #6E7F72 0%, #3E4C42 55%, #1C221E 100%)', line: 'rgba(255,255,255,0.4)', glow: 'rgba(225,235,225,0.35)' },
  aerial: { bg: 'radial-gradient(120% 100% at 50% 0%, #6F8F77 0%, #3F604D 50%, #1D3126 100%)', line: 'rgba(246,246,242,0.75)', glow: 'rgba(210,228,214,0.35)' },
}

function Defs({ id, glow }: { id: string; glow: string }) {
  return (
    <defs>
      <pattern id={`${id}-mesh`} width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <path d="M0 13h26M13 0v26" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
      </pattern>
      <linearGradient id={`${id}-fade-top`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="white" stopOpacity="1" /><stop offset="0.7" stopColor="white" stopOpacity="0" />
      </linearGradient>
      <linearGradient id={`${id}-fade-bottom`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0.3" stopColor="white" stopOpacity="0" /><stop offset="1" stopColor="white" stopOpacity="1" />
      </linearGradient>
      <radialGradient id={`${id}-glow`} cx="0.5" cy="0" r="0.8">
        <stop offset="0" stopColor={glow} /><stop offset="1" stopColor={glow} stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${id}-vignette`} cx="0.5" cy="0.6" r="0.75">
        <stop offset="0.45" stopColor="black" stopOpacity="0" /><stop offset="1" stopColor="black" stopOpacity="0.55" />
      </radialGradient>
      <mask id={`${id}-mask-top`}><rect width="1000" height="620" fill={`url(#${id}-fade-top)`} /></mask>
      <mask id={`${id}-mask-bottom`}><rect width="1000" height="620" fill={`url(#${id}-fade-bottom)`} /></mask>
      <filter id={`${id}-blur`} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6" /></filter>
      <filter id={`${id}-blur-soft`} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14" /></filter>
    </defs>
  )
}

/** Padel court in low perspective: glass back wall, mesh sides, floor lines. */
function PadelCourt({ id, line }: { id: string; line: string }) {
  return (
    <g>
      {/* floodlight glow */}
      <rect width="1000" height="620" fill={`url(#${id}-glow)`} />
      {/* back glass wall */}
      <polygon points="230,150 770,150 770,330 230,330" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" />
      <line x1="500" y1="150" x2="500" y2="330" stroke="rgba(255,255,255,0.22)" />
      <line x1="365" y1="150" x2="365" y2="330" stroke="rgba(255,255,255,0.14)" />
      <line x1="635" y1="150" x2="635" y2="330" stroke="rgba(255,255,255,0.14)" />
      {/* side mesh fences */}
      <polygon points="40,90 230,150 230,330 40,470" fill={`url(#${id}-mesh)`} mask={`url(#${id}-mask-top)`} opacity="0.9" />
      <polygon points="960,90 770,150 770,330 960,470" fill={`url(#${id}-mesh)`} mask={`url(#${id}-mask-top)`} opacity="0.9" />
      <polyline points="40,90 230,150 770,150 960,90" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <line x1="40" y1="90" x2="40" y2="470" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
      <line x1="960" y1="90" x2="960" y2="470" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
      {/* floor */}
      <polygon points="230,330 770,330 1000,620 0,620" fill="rgba(0,0,0,0.18)" />
      <g stroke={line} strokeWidth="3" fill="none" strokeLinecap="round">
        <polyline points="230,330 770,330" />
        <line x1="500" y1="330" x2="500" y2="620" />
        <line x1="150" y1="430" x2="850" y2="430" />
        <line x1="72" y1="530" x2="928" y2="530" strokeWidth="4" opacity="0.9" />
      </g>
      {/* net shadow on floor */}
      <polygon points="60,540 940,540 980,560 20,560" fill="rgba(0,0,0,0.25)" filter={`url(#${id}-blur)`} />
    </g>
  )
}

/** Tennis baseline seen from the side, lines converging. */
function TennisCourt({ id, line, offset = 0 }: { id: string; line: string; offset?: number }) {
  return (
    <g transform={`translate(${offset} 0)`}>
      <rect width="1000" height="620" fill={`url(#${id}-glow)`} />
      <g stroke={line} strokeWidth="3" fill="none" strokeLinecap="round">
        <polygon points="300,220 700,220 940,600 60,600" />
        <polygon points="365,220 635,220 780,600 220,600" strokeWidth="2.4" />
        <line x1="500" y1="220" x2="500" y2="600" strokeWidth="2.4" />
        <line x1="330" y1="330" x2="670" y2="330" strokeWidth="2.4" />
        <line x1="118" y1="500" x2="882" y2="500" strokeWidth="3.5" />
      </g>
      {/* net */}
      <rect x="60" y="150" width="880" height="72" fill={`url(#${id}-mesh)`} opacity="0.8" />
      <line x1="60" y1="150" x2="940" y2="150" stroke="rgba(255,255,255,0.75)" strokeWidth="4" />
      <line x1="60" y1="150" x2="60" y2="230" stroke="rgba(255,255,255,0.5)" strokeWidth="5" />
      <line x1="940" y1="150" x2="940" y2="230" stroke="rgba(255,255,255,0.5)" strokeWidth="5" />
      <rect x="40" y="228" width="920" height="26" fill="rgba(0,0,0,0.28)" filter={`url(#${id}-blur)`} />
    </g>
  )
}

function Silhouettes({ id, figures, opacity = 0.55 }: { id: string; figures: { x: number; y: number; s: number; flip?: boolean }[]; opacity?: number }) {
  return (
    <g filter={`url(#${id}-blur)`} opacity={opacity}>
      {figures.map((f, i) => (
        <g key={i} transform={`translate(${f.x} ${f.y}) scale(${f.flip ? -f.s : f.s} ${f.s})`} fill="#0B120E">
          <circle cx="0" cy="-92" r="14" />
          <path d="M-16 -74 C-30 -60 -30 -20 -22 8 L-20 80 L-8 80 L-4 18 L4 18 L8 80 L20 80 L22 8 C30 -20 30 -60 16 -74 Z" />
          <path d="M14 -66 L58 -104 L64 -96 L24 -52 Z" />
          <ellipse cx="66" cy="-108" rx="12" ry="18" transform="rotate(-40 66 -108)" fill="none" stroke="#0B120E" strokeWidth="5" />
          <ellipse cx="0" cy="84" rx="34" ry="6" opacity="0.6" />
        </g>
      ))}
    </g>
  )
}

function Slats({ id }: { id: string }) {
  return (
    <g mask={`url(#${id}-mask-bottom)`}>
      {Array.from({ length: 14 }).map((_, i) => (
        <rect key={i} x="0" y={40 + i * 42} width="1000" height="18" fill="rgba(0,0,0,0.16)" />
      ))}
      <rect width="1000" height="620" fill={`url(#${id}-glow)`} />
    </g>
  )
}

function Artwork({ variant, id }: { variant: PhotoVariant; id: string }) {
  const p = palette[variant]
  return (
    <svg viewBox="0 0 1000 620" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <Defs id={id} glow={p.glow} />
      {variant === 'padel' && (<><PadelCourt id={id} line={p.line} /><Silhouettes id={id} figures={[{ x: 380, y: 470, s: 1.05 }, { x: 660, y: 400, s: 0.8, flip: true }]} /></>)}
      {variant === 'night' && (<><PadelCourt id={id} line={p.line} /><ellipse cx="500" cy="-40" rx="420" ry="220" fill={p.glow} filter={`url(#${id}-blur-soft)`} opacity="0.5" /><Silhouettes id={id} figures={[{ x: 430, y: 480, s: 1.1 }]} opacity={0.7} /></>)}
      {variant === 'tennis' && (<><TennisCourt id={id} line={p.line} /><Silhouettes id={id} figures={[{ x: 300, y: 520, s: 1.15, flip: true }]} /></>)}
      {variant === 'clay' && (<><TennisCourt id={id} line={p.line} offset={40} /><Silhouettes id={id} figures={[{ x: 700, y: 560, s: 1.2 }]} opacity={0.45} /></>)}
      {variant === 'aerial' && (
        <g>
          <rect width="1000" height="620" fill={`url(#${id}-glow)`} />
          <g stroke={p.line} strokeWidth="3" fill="none" transform="rotate(-8 500 310)">
            <rect x="180" y="90" width="640" height="440" /><rect x="180" y="150" width="640" height="320" /><line x1="500" y1="90" x2="500" y2="530" strokeWidth="4" /><line x1="340" y1="150" x2="340" y2="470" /><line x1="660" y1="150" x2="660" y2="470" /><line x1="340" y1="310" x2="660" y2="310" />
          </g>
          <rect x="-100" y="0" width="1200" height="620" fill={`url(#${id}-mesh)`} opacity="0.35" mask={`url(#${id}-mask-bottom)`} />
        </g>
      )}
      {variant === 'club' && (<><Slats id={id} /><line x1="0" y1="470" x2="1000" y2="470" stroke="rgba(255,255,255,0.35)" strokeWidth="2" /><rect x="0" y="470" width="1000" height="150" fill="rgba(0,0,0,0.25)" /><Silhouettes id={id} figures={[{ x: 720, y: 470, s: 0.9 }, { x: 800, y: 480, s: 0.95, flip: true }]} opacity={0.5} /></>)}
      {variant === 'youth' && (<><TennisCourt id={id} line={p.line} /><Silhouettes id={id} figures={[{ x: 260, y: 540, s: 0.75 }, { x: 520, y: 500, s: 0.7, flip: true }, { x: 760, y: 560, s: 0.8 }]} opacity={0.5} /><g fill="#E9F27A" opacity="0.8">{[[150, 590], [610, 575], [880, 600]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="7" />)}</g></>)}
      {variant === 'people' && (<><rect width="1000" height="620" fill={`url(#${id}-glow)`} /><rect x="0" y="0" width="1000" height="420" fill={`url(#${id}-mesh)`} opacity="0.5" mask={`url(#${id}-mask-top)`} /><line x1="0" y1="420" x2="1000" y2="420" stroke="rgba(255,255,255,0.3)" strokeWidth="2" /><Silhouettes id={id} figures={[{ x: 330, y: 500, s: 1 }, { x: 460, y: 510, s: 1.05, flip: true }, { x: 610, y: 500, s: 0.95 }, { x: 720, y: 515, s: 1, flip: true }]} opacity={0.55} /></>)}
      <rect width="1000" height="620" fill={`url(#${id}-vignette)`} />
    </svg>
  )
}

export function Photo({ variant = 'tennis', className, zoom = true, src, alt = '', focus = 'center' }: Props) {
  const id = useId().replace(/:/g, '')
  const pos = focus === 'left' ? 'object-left' : focus === 'right' ? 'object-right' : 'object-center'
  return (
    <div className={cn('grain relative isolate overflow-hidden bg-ink', className)} style={src ? undefined : { background: palette[variant].bg }}>
      <div className={cn('absolute inset-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]', zoom && 'group-hover:scale-[1.03]')}>
        {src ? <img src={src} alt={alt} className={cn('h-full w-full object-cover', pos)} /> : <Artwork variant={variant} id={id} />}
      </div>
    </div>
  )
}
