import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { DEFAULT_DESCRIPTION } from '../data/site'
import { applyPageSeo, type PageSeoOptions } from '../lib/seo'

interface PageMetaOptions extends PageSeoOptions {
  description?: string
}

export function usePageMeta({ title, description = DEFAULT_DESCRIPTION, path, image, type }: PageMetaOptions) {
  const location = useLocation()
  const resolvedPath = path ?? location.pathname

  useEffect(() => {
    applyPageSeo({ title, description, path: resolvedPath, image, type })
  }, [title, description, resolvedPath, image, type])
}
