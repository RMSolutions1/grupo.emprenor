import { useEffect } from 'react'
import { DEFAULT_DESCRIPTION, SITE_NAME } from '../data/site'

interface PageMetaOptions {
  title: string
  description?: string
}

export function usePageMeta({ title, description = DEFAULT_DESCRIPTION }: PageMetaOptions) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`

    const descriptionTag = document.querySelector('meta[name="description"]')
    const previousDescription = descriptionTag?.getAttribute('content') ?? ''
    descriptionTag?.setAttribute('content', description)

    return () => {
      document.title = previousTitle
      descriptionTag?.setAttribute('content', previousDescription)
    }
  }, [title, description])
}
