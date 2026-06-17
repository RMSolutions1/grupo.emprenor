import { organizationJsonLd, webSiteJsonLd } from '../lib/seo'

export default function StructuredData() {
  const payload = [organizationJsonLd(), webSiteJsonLd()]

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  )
}
