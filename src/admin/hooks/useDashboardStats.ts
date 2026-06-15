import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { fetchContactSubmissions, type ContactSubmission } from '../../lib/cms'
import { useAdminReady } from './useAdminReady'

export type DashboardStats = {
  projects: number
  projectsPublished: number
  services: number
  blog: number
  blogPublished: number
  licitaciones: number
  licitacionesPublished: number
  submissions: number
  unread: number
  siteUpdatedAt: string | null
}

const emptyStats: DashboardStats = {
  projects: 0,
  projectsPublished: 0,
  services: 0,
  blog: 0,
  blogPublished: 0,
  licitaciones: 0,
  licitacionesPublished: 0,
  submissions: 0,
  unread: 0,
  siteUpdatedAt: null,
}

export function useDashboardStats() {
  const { ready } = useAdminReady()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>(emptyStats)
  const [recentSubmissions, setRecentSubmissions] = useState<ContactSubmission[]>([])

  const load = useCallback(async () => {
    if (!supabase) {
      setLoading(false)
      return
    }
    setLoading(true)
    const [
      projects,
      projectsPub,
      services,
      blog,
      blogPub,
      lic,
      licPub,
      submissions,
      settings,
    ] = await Promise.all([
      supabase.from('projects').select('id', { count: 'exact', head: true }),
      supabase.from('projects').select('id', { count: 'exact', head: true }).eq('published', true),
      supabase.from('services').select('id', { count: 'exact', head: true }),
      supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
      supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('published', true),
      supabase.from('licitaciones').select('id', { count: 'exact', head: true }),
      supabase.from('licitaciones').select('id', { count: 'exact', head: true }).eq('published', true),
      fetchContactSubmissions(),
      supabase.from('site_settings').select('updated_at').eq('id', 'main').maybeSingle(),
    ])

    setStats({
      projects: projects.count ?? 0,
      projectsPublished: projectsPub.count ?? 0,
      services: services.count ?? 0,
      blog: blog.count ?? 0,
      blogPublished: blogPub.count ?? 0,
      licitaciones: lic.count ?? 0,
      licitacionesPublished: licPub.count ?? 0,
      submissions: submissions.length,
      unread: submissions.filter((s) => !s.read).length,
      siteUpdatedAt: settings.data?.updated_at ?? null,
    })
    setRecentSubmissions(submissions.slice(0, 6))
    setLoading(false)
  }, [])

  useEffect(() => {
    if (ready) load()
  }, [ready, load])

  return { loading, stats, recentSubmissions, refresh: load }
}
