import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1)
      const timer = window.setTimeout(() => {
        const target = document.getElementById(id)
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
          return
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      }, 80)
      return () => window.clearTimeout(timer)
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, search, hash])

  return null
}
