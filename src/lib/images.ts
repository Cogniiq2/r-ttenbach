/**
 * Photography registry. Files live in /public/images as responsive WebP
 * (generated from the supplied originals). lqip = 24px blurred placeholder.
 */
export const images = {
  duo: { w: 2000, h: 1333, widths: [640, 1280, 1920], color: 'rgb(8,8,8)', lqip: 'data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAADwAwCdASoYABAAPu1orU6ppiSiMAgBMB2JZAC7ACHfsZNdlYscA9ekAP7yqG6O/9nkuNYO95JBKIAu4QqGmVrBKIxtdzLEa6vQt5kl31fYgAAA' },
  flatlay: { w: 1500, h: 1000, widths: [640, 1280, 1500], color: 'rgb(8,72,120)', lqip: 'data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAADQAwCdASoYABAAPu1iqk2ppaQiMAgBMB2JYgCdMoRwACxelC39PAAA/s3kg1RvqszJmzBH9AM6jREjzdZG15DN7SFjYRJxi2ZJQX04nHuAAA==' },
  overhead: { w: 2000, h: 1333, widths: [640, 1280, 1920], color: 'rgb(24,40,72)', lqip: 'data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAACwAwCdASoYABAAPu1iqk2ppaQiMAgBMB2JQBdgBDlZrbSVL+faAAD+6+jhODZUDUpGC+kvoZ8MWTy6xDUkzptfqqTbfI0IAAA=' },
  rackets: { w: 2000, h: 1333, widths: [640, 1280, 1920], color: 'rgb(8,56,104)', lqip: 'data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAABQBACdASoYABAAPu1iqU2ppaOiMAgBMB2JYgCdMoRwN0AAMRE7hBAvsqAAAP7oz7PBlIRny4Tpp4A1htH3BocKJb/gu5XGAAA=' },
  serve: { w: 1333, h: 2000, widths: [640, 1280, 1333], color: 'rgb(8,8,8)', lqip: 'data:image/webp;base64,UklGRoYAAABXRUJQVlA4IHoAAABwBQCdASoYACQAPtVcok2oJaMiOrZoAQAaiWUAANzp/Yr2ic1BX09xcXmhcvF1dav91JcAAP75EEmZh0btSS8canAxLChRuUTz3ADrhu7smvRlpEPEGZSgUwH+MW/3obDv4gkq5SYdx4ZuHB+v/VR2pia9bHy4SQAAAA==' },
} as const

export type ImageName = keyof typeof images

export const srcSet = (name: ImageName) => images[name].widths.map((w) => `/images/${name}-${w}.webp ${w}w`).join(', ')
export const src = (name: ImageName, w?: number) => { const ws = images[name].widths; const pick = w ? ws.find((x) => x >= w) ?? ws[ws.length - 1] : ws[ws.length - 1]; return `/images/${name}-${pick}.webp` }
