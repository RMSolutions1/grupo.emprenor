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
  const heroSub = servicios?.hero?.subtitle ?? ''
  const heroTitle = servicios?.hero?.title ?? ''
  return /seis\s+áreas|seis\s+areas|seis\s+divisiones/i.test(`${title} ${heroSub}`)
    || label.toLowerCase() === 'divisiones'
    || /ingeniería y construcción/i.test(heroTitle)
}

function isStaleLicitacionesCopy(licitaciones?: Partial<SitePages['licitaciones']>) {
  const subtitle = licitaciones?.hero?.subtitle ?? ''
  return /santiago del estero/i.test(subtitle) || !licitaciones?.featured?.title
}

function isStaleHomeCopy(home?: Partial<SitePages['home']>) {
  const servicesTitle = home?.services?.title ?? ''
  const statsIntro = home?.statsIntro ?? ''
  return /divisiones de servicio/i.test(servicesTitle)
    || /15\s+años|más de 15/i.test(statsIntro)
}

function isStaleEmpresaCopy(empresa?: Partial<SitePages['empresa']>) {
  const subtitle = empresa?.hero?.subtitle ?? ''
  const history = empresa?.history?.paragraphs?.[0] ?? ''
  const ctaTitle = empresa?.cta?.title ?? ''
  return /15\s+años|más de 15/i.test(subtitle)
    || /2008/i.test(history)
    || /grupo emprenor/i.test(empresa?.hero?.title ?? '')
    || /ingeniería, construcción y energía/i.test(subtitle)
    || /ingeniería del norte/i.test(ctaTitle)
}

function isStaleGlobalCopy(global?: Partial<SitePages['global']>) {
  const copyright = global?.footerCopyright ?? ''
  return /grupo emprenor|emprenor group/i.test(copyright)
}

export function isStaleStats(dbStats: { label: string }[]) {
  return dbStats.some((s) => /años de experiencia/i.test(s.label))
}

export function isStaleTestimonials(dbTestimonials: { quote: string }[]) {
  return dbTestimonials.some((t) => /emprenor group/i.test(t.quote))
}

export function isStaleTimeline(dbTimeline: { year: string; title: string }[]) {
  return dbTimeline.some((t) => t.year === '2008' || /fundación/i.test(t.title) || /división energía/i.test(t.title))
}

export function isStaleRegions(dbRegions: { name: string }[]) {
  return dbRegions.some((r) => /santiago del estero/i.test(r.name))
}

export function isStaleTeam(dbTeam: { description?: string; role?: string }[]) {
  return dbTeam.some((t) => /emprenor group/i.test(t.description ?? '') || t.role === 'Director de Energía')
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
  if (isStaleGlobalCopy(partial.global)) {
    merged.global = { ...merged.global, footerCopyright: defaultPages.global.footerCopyright }
  }
  if (isStaleHomeCopy(partial.home)) {
    merged.home = {
      ...merged.home,
      services: defaultPages.home.services,
      statsIntro: defaultPages.home.statsIntro,
      heroStrip: defaultPages.home.heroStrip,
    }
  }
  if (isStaleEmpresaCopy(partial.empresa)) {
    merged.empresa = {
      ...merged.empresa,
      hero: defaultPages.empresa.hero,
      history: defaultPages.empresa.history,
      mission: defaultPages.empresa.mission,
      vision: defaultPages.empresa.vision,
      cta: defaultPages.empresa.cta,
    }
  }
  if (isStaleServiciosCopy(partial.servicios)) {
    merged.servicios = {
      ...merged.servicios,
      hero: defaultPages.servicios.hero,
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
