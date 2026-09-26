import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

const base = 'w-full rounded-[12px] border border-line-2 bg-white px-3.5 text-[15px] text-ink placeholder:text-muted-2 transition-[border-color,box-shadow] duration-200 hover:border-ink/35 focus:border-green focus:outline-none focus:ring-4 focus:ring-green/10'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string }>(function Input({ label, hint, className, id, ...rest }, ref) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-[13px] font-medium text-ink-2">{label}</span>}
      <input ref={ref} id={id} className={cn(base, 'h-12', className)} {...rest} />
      {hint && <span className="mt-1.5 block text-[12.5px] text-muted">{hint}</span>}
    </label>
  )
})

export function Textarea({ label, className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-[13px] font-medium text-ink-2">{label}</span>}
      <textarea className={cn(base, 'min-h-[110px] py-3 leading-relaxed', className)} {...rest} />
    </label>
  )
}
