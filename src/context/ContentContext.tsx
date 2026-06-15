import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { projects as staticProjects, projectsList as staticProjectsList, featuredProjects as staticFeatured, projectCategories as staticProjectCategories } from '../data/projects'
import { services as staticServices, serviceDetails as staticServiceDetails } from '../data/services'
import { blogPosts as staticBlogPosts, blogCategories as staticBlogCategories } from '../data/blog'
import { licitaciones as staticLicitaciones, licitacionStatuses, licitacionCategories } from '../data/licitaciones'
import { siteContact, contactAreas } from '../data/contacto'
import { sectors, certifications, stats } from '../data/home'
import { testimonials } from '../data/testimonials'
import { timeline, values, team, regions } from '../data/empresa'
import { getBlogContent } from '../data/blogContent'
import { isSupabaseConfigured } from '../lib/supabase'
import {
  fetchSiteSettings,
  fetchProjects,
  fetchServices,
  fetchBlogPosts,
  fetchLicitaciones,
  type SiteSettings,
} from '../lib/cms'
import type { Project } from '../data/projects'
import type { Service } from '../data/services'
import type { BlogPost } from '../data/blog'
import type { Licitacion } from '../data/licitaciones'

type ContentState = {
  loading: boolean
  fromDb: boolean
  settings: SiteSettings | null
  projects: Project[]
  projectsList: Project[]
  featuredProjects: Project[]
  services: Service[]
  serviceDetails: Record<string, { intro: string; items: { title: string; description: string }[] }>
  blogPosts: BlogPost[]
  licitaciones: Licitacion[]
  getBlogPostContent: (id: string) => string | undefined
}

const ContentContext = createContext<ContentState | null>(null)

function buildServiceDetails(services: (Service & { details?: Record<string, unknown> })[]) {
  const details: ContentState['serviceDetails'] = { ...staticServiceDetails }
  for (const s of services) {
    if (s.details && typeof s.details === 'object' && 'intro' in s.details) {
      details[s.id] = s.details as ContentState['serviceDetails'][string]
    }
  }
  return details
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ContentState>({
    loading: isSupabaseConfigured,
    fromDb: false,
    settings: null,
    projects: staticProjects,
    projectsList: staticProjectsList,
    featuredProjects: staticFeatured,
    services: staticServices,
    serviceDetails: staticServiceDetails,
    blogPosts: staticBlogPosts,
    licitaciones: staticLicitaciones,
    getBlogPostContent: getBlogContent,
  })

  useEffect(() => {
    if (!isSupabaseConfigured) return

    let cancelled = false

    async function load() {
      const [settings, dbProjects, dbServices, dbBlog, dbLicitaciones] = await Promise.all([
        fetchSiteSettings(),
        fetchProjects(true),
        fetchServices(true),
        fetchBlogPosts(true),
        fetchLicitaciones(true),
      ])

      if (cancelled) return

      const hasDb = dbProjects.length > 0 || dbServices.length > 0 || dbBlog.length > 0 || dbLicitaciones.length > 0

      const projects = dbProjects.length ? dbProjects : staticProjects
      const listOrder = staticProjectsList.map((p) => p.id)
      const projectsList = listOrder.map((id) => projects.find((p) => p.id === id)).filter(Boolean) as Project[]
      const orderedList = projectsList.length ? projectsList : projects

      const blogPosts = dbBlog.length ? dbBlog : staticBlogPosts

      setState({
        loading: false,
        fromDb: hasDb,
        settings,
        projects,
        projectsList: orderedList,
        featuredProjects: projects.filter((p) => p.featured),
        services: dbServices.length ? dbServices : staticServices,
        serviceDetails: buildServiceDetails(dbServices.length ? dbServices : staticServices),
        blogPosts,
        licitaciones: dbLicitaciones.length ? dbLicitaciones : staticLicitaciones,
        getBlogPostContent: (id: string) => {
          const post = blogPosts.find((p) => p.id === id)
          if (post?.content) return post.content
          return getBlogContent(id)
        },
      })
    }

    load()
    return () => { cancelled = true }
  }, [])

  return <ContentContext.Provider value={state}>{children}</ContentContext.Provider>
}

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent debe usarse dentro de ContentProvider')
  return ctx
}

export function useSiteContact() {
  const { settings } = useContent()
  return settings?.contact ?? siteContact
}

export function useContactAreas() {
  const { settings } = useContent()
  return settings?.contact_areas ?? contactAreas
}

export function useHomeData() {
  const { settings } = useContent()
  return {
    sectors: settings?.home.sectors ?? sectors,
    certifications: settings?.home.certifications ?? certifications,
    stats: settings?.stats ?? stats,
    testimonials: settings?.testimonials ?? testimonials,
  }
}

export function useEmpresaData() {
  const { settings } = useContent()
  return {
    timeline: settings?.empresa.timeline ?? timeline,
    values: settings?.empresa.values ?? values,
    team: settings?.empresa.team ?? team,
    regions: settings?.empresa.regions ?? regions,
  }
}

export function useProjectsData() {
  const { projects, projectsList, featuredProjects, loading } = useContent()
  return { projects, projectsList, featuredProjects, projectCategories: staticProjectCategories, loading }
}

export function useServicesData() {
  const { services, serviceDetails, loading } = useContent()
  return { services, serviceDetails, loading }
}

export function useBlogData() {
  const { blogPosts, loading } = useContent()
  return { blogPosts, blogCategories: staticBlogCategories, loading }
}

export function useLicitacionesData() {
  const { licitaciones, loading } = useContent()
  return { licitaciones, licitacionStatuses, licitacionCategories, loading }
}

export function useBlogPostContent(id: string) {
  const { getBlogPostContent } = useContent()
  return getBlogPostContent(id)
}
