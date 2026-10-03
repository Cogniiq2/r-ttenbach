import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'
import { images, src as srcFor, srcSet, type ImageName } from '@/lib/images'

interface Props {
  name: ImageName
  alt: string
  className?: string
  imgClassName?: string
  /** CSS object-position, e.g. "60% 30%". */
  focus?: string
  sizes?: string
  priority?: boolean
  /** Subtle zoom on parent .group hover. */
  zoom?: boolean
  /** Full-bleed background: portrait screens crop to height, so request a wider file. */
  cover?: boolean
}

/**
 * Real photography with blur-up: the 24px placeholder shows instantly in the
 * image's own colours, the full image fades and settles in when decoded.
 */
export function Picture({ name, alt, className, imgClassName, focus = '50% 50%', sizes = '100vw', priority, zoom = true, cover }: Props) {
  if (cover) sizes = `(orientation: portrait) ${Math.round((images[name].w / images[name].h) * 100)}vh, 100vw`
  const meta = images[name]
  const ref = useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { if (ref.current?.complete && ref.current.naturalWidth) setLoaded(true) }, [])
  return (
    <div className={cn('relative isolate overflow-hidden', className)} style={{ backgroundColor: meta.color }}>
      <img src={meta.lqip} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl" style={{ objectPosition: focus }} />
      <img
        ref={ref}
        src={srcFor(name, 1280)}
        srcSet={srcSet(name)}
        sizes={sizes}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        className={cn(
          'absolute inset-0 h-full w-full object-cover transition-[opacity,transform,filter] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
          loaded ? 'scale-100 opacity-100 blur-0' : 'scale-[1.04] opacity-0 blur-md',
          zoom && loaded && 'group-hover:scale-[1.035]',
          imgClassName,
        )}
        style={{ objectPosition: focus }}
      />
    </div>
  )
}
