import { defaultPages, type SitePages, type CtaCopy } from '../data/pages'

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function mergeDeep<T>(base: T, patch?: Partial<T>): T {
  if (!patch) return base
  const out = { ...base }
  for (const key of Object.keys(patch) as (keyof T)[]) {
    const pv = patch[key]
    const bv = base[key]
    if (isPlainObject(pv) && isPlainObject(bv)) {
      out[key] = mergeDeep(bv, pv as Partial<typeof bv>) as T[keyof T]
    } else if (pv !== undefined) {
      out[key] = pv as T[keyof T]
    }
  }
  return out
}

export function mergeSitePages(partial?: Partial<SitePages> | null): SitePages {
  if (!partial) return defaultPages
  return {
    global: mergeDeep(defaultPages.global, partial.global),
    home: mergeDeep(defaultPages.home, partial.home),
    contacto: mergeDeep(defaultPages.contacto, partial.contacto),
    empresa: mergeDeep(defaultPages.empresa, partial.empresa),
    servicios: mergeDeep(defaultPages.servicios, partial.servicios),
    proyectos: mergeDeep(defaultPages.proyectos, partial.proyectos),
    blog: mergeDeep(defaultPages.blog, partial.blog),
    licitaciones: mergeDeep(defaultPages.licitaciones, partial.licitaciones),
  }
}

export function resolveImage(custom?: string, fallback?: string): string {
  const trimmed = custom?.trim()
  return trimmed || fallback || ''
}

export function linkFromUrl(label: string, url: string) {
  return {
    to: url,
    label,
    external: /^https?:\/\//.test(url),
  }
}

export function ctaToLinks(cta: CtaCopy) {
  return {
    primaryLink: linkFromUrl(cta.primaryLabel, cta.primaryUrl),
    secondaryLink: cta.secondaryLabel && cta.secondaryUrl
      ? linkFromUrl(cta.secondaryLabel, cta.secondaryUrl)
      : undefined,
  }
}
