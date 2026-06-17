import { SITE_NAME, SITE_URL, DEFAULT_DESCRIPTION } from '../data/site'

const DEFAULT_OG_IMAGE = `${SITE_URL}/brand/logo-large.png?v=3`

export type PageSeoOptions = {
  title: string
  description?: string
  path?: string
  image?: string
  type?: 'website' | 'article'
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    document.head.appendChild(el)
  }
  el.href = href
}

export function applyPageSeo({ title, description = DEFAULT_DESCRIPTION, path = '/', image, type = 'website' }: PageSeoOptions) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
  const url = `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
  const ogImage = image || DEFAULT_OG_IMAGE

  document.title = fullTitle
  upsertMeta('name', 'description', description)
  upsertLink('canonical', url)

  upsertMeta('property', 'og:title', fullTitle)
  upsertMeta('property', 'og:description', description)
  upsertMeta('property', 'og:type', type)
  upsertMeta('property', 'og:url', url)
  upsertMeta('property', 'og:image', ogImage)
  upsertMeta('property', 'og:locale', 'es_AR')
  upsertMeta('property', 'og:site_name', SITE_NAME)

  upsertMeta('name', 'twitter:card', 'summary_large_image')
  upsertMeta('name', 'twitter:title', fullTitle)
  upsertMeta('name', 'twitter:description', description)
  upsertMeta('name', 'twitter:image', ogImage)
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo-large.png`,
    description: DEFAULT_DESCRIPTION,
    email: 'info@emprenor.com.ar',
    telephone: '+54-11-2758-6521',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. Casiano Casas 3080, Campamento Vespucio',
      addressLocality: 'Salta',
      addressCountry: 'AR',
    },
    areaServed: ['Salta', 'Jujuy', 'Tucumán', 'Formosa'],
  }
}

export function webSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: 'es-AR',
  }
}
