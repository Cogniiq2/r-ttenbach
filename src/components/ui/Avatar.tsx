import { cn } from '@/lib/cn'

const palette = ['bg-green text-white', 'bg-ink text-white', 'bg-clay text-white', 'bg-[#4F6B5C] text-white', 'bg-sand text-white']

export function Avatar({ initials, size = 'md', className, tone }: { initials: string; size?: 'sm' | 'md' | 'lg'; className?: string; tone?: number }) {
  const s = size === 'sm' ? 'size-7 text-[10.5px]' : size === 'lg' ? 'size-12 text-[15px]' : 'size-9 text-[12px]'
  const i = tone ?? (initials.charCodeAt(0) + initials.charCodeAt(1)) % palette.length
  return <span className={cn('grid shrink-0 place-items-center rounded-full font-semibold tracking-wide ring-2 ring-white', s, palette[i], className)}>{initials}</span>
}
