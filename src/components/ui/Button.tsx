import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'dark' | 'secondary' | 'ghost' | 'light' | 'outline-light'
type Size = 'sm' | 'md' | 'lg' | 'xl'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  arrow?: boolean
  loading?: boolean
  to?: string
  icon?: ReactNode
  full?: boolean
}

const variants: Record<Variant, string> = {
  primary: 'bg-green text-white hover:bg-green-deep shadow-[0_1px_0_rgba(0,0,0,0.06)]',
  dark: 'bg-ink text-white hover:bg-ink-2',
  secondary: 'bg-surface text-ink border border-line-2 hover:border-ink/40 hover:bg-white',
  ghost: 'bg-transparent text-ink hover:bg-ink/[0.05]',
  light: 'bg-white text-ink hover:bg-paper',
  'outline-light': 'bg-white/0 text-white border border-white/35 hover:bg-white/10 hover:border-white/60 backdrop-blur-sm',
}
const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-[13.5px] gap-1.5',
  md: 'h-11 px-5 text-[14.5px] gap-2',
  lg: 'h-[52px] px-6 text-[15.5px] gap-2',
  xl: 'h-14 px-7 text-[16px] gap-2.5',
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className, variant = 'primary', size = 'md', arrow, loading, to, icon, full, children, disabled, ...rest },
  ref,
) {
  const cls = cn(
    'pressable group/btn relative inline-flex select-none items-center justify-center whitespace-nowrap rounded-btn font-medium leading-none',
    'disabled:opacity-50 disabled:pointer-events-none',
    variants[variant],
    sizes[size],
    full && 'w-full',
    className,
  )
  const inner = (
    <>
      {loading ? <Loader2 size={16} className="animate-spin" /> : icon}
      <span>{children}</span>
      {arrow && (
        <ArrowRight size={16} strokeWidth={2.2} className="transition-transform duration-200 ease-out group-hover/btn:translate-x-[3px]" />
      )}
    </>
  )
  if (to) return <Link to={to} className={cls}>{inner}</Link>
  return (
    <button ref={ref} className={cls} disabled={disabled || loading} {...rest}>
      {inner}
    </button>
  )
})
