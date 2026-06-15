/** Imágenes locales descargadas del sitio original Readdy (public/images/) */
export function image(seq: string): string {
  return `/images/${seq}.jpg`
}

export const IMAGES = {
  hero: image('hero-bg-2026'),
  statsAerial: image('stats-aerial-2026'),
  empresaHero: image('emp-hero-2026'),
  serviciosHero: image('serv-hero-2026'),
  proyectosHero: image('proj-hero-bg-2026'),
  licitacionesHero: image('lic-hero-bg-2026'),
  contactoHero: image('contacto-hero-2026'),
  cta: image('cta-bg-2026'),
  empresaCta: image('emp-cta-2026'),
  proyectosCta: image('proj-cta-bg-2026'),
  serviciosCta: image('serv-cta-2026'),
  mapaCobertura: image('mapa-cobertura-2026'),
} as const
