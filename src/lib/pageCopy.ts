import { defaultPages, type SitePages, type CtaCopy, type HeroSlideCopy } from '../data/pages'

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

export function getHomeHeroSlides(home: SitePages['home']): HeroSlideCopy[] {
  if (home.heroSlides?.length) return home.heroSlides
  return [{
    label: home.hero.label,
    title: home.hero.title,
    subtitle: home.hero.subtitle,
    image: home.hero.image,
  }]
}

function isStaleServiciosCopy(servicios?: Partial<SitePages['servicios']>) {
  const title = servicios?.divisions?.title ?? ''
  const label = servicios?.divisions?.label ?? ''
  return /seis\s+áreas|seis\s+areas/i.test(title) || label.toLowerCase() === 'divisiones'
}

function isStaleLicitacionesCopy(licitaciones?: Partial<SitePages['licitaciones']>) {
  const subtitle = licitaciones?.hero?.subtitle ?? ''
  return /santiago del estero/i.test(subtitle) || !licitaciones?.featured?.title
}

export function mergeSitePages(partial?: Partial<SitePages> | null): SitePages {
  if (!partial) return defaultPages
  const merged = {
    global: mergeDeep(defaultPages.global, partial.global),
    home: mergeDeep(defaultPages.home, partial.home),
    contacto: mergeDeep(defaultPages.contacto, partial.contacto),
    empresa: mergeDeep(defaultPages.empresa, partial.empresa),
    servicios: mergeDeep(defaultPages.servicios, partial.servicios),
    proyectos: mergeDeep(defaultPages.proyectos, partial.proyectos),
    blog: mergeDeep(defaultPages.blog, partial.blog),
    licitaciones: mergeDeep(defaultPages.licitaciones, partial.licitaciones),
  }
  if (isStaleServiciosCopy(partial.servicios)) {
    merged.servicios = {
      ...merged.servicios,
      divisions: defaultPages.servicios.divisions,
      grid: defaultPages.servicios.grid,
    }
  }
  if (isStaleLicitacionesCopy(partial.licitaciones)) {
    merged.licitaciones = {
      ...merged.licitaciones,
      hero: defaultPages.licitaciones.hero,
      featured: defaultPages.licitaciones.featured,
      list: defaultPages.licitaciones.list,
    }
  }
  return merged
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
