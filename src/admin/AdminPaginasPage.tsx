import { useEffect, useState } from 'react'
import { defaultPages, type SitePages } from '../data/pages'
import { mergeSitePages } from '../lib/pageCopy'
import { fetchSiteSettings, upsertSiteSettings } from '../lib/cms'
import { AdminPage, AdminCard, AdminInput, AdminTextarea, AdminImageField, AdminLoading } from './components/AdminUI'
import { AdminTabs, AdminTabPanel } from './components/AdminTabs'
import { CtaFields, HeroFields, HeroSlideFields, HeroStripFields, ParagraphList, SectionFields, SeoFields } from './components/PageCopyFields'
import { FormSection, SaveBar } from './components/FormHelpers'
import { usePageMeta } from '../hooks/usePageMeta'
import { useAdminReady } from './hooks/useAdminReady'

const tabs = [
  { id: 'global', label: 'Global', icon: 'ri-global-line' },
  { id: 'home', label: 'Inicio', icon: 'ri-home-4-line' },
  { id: 'contacto', label: 'Contacto', icon: 'ri-phone-line' },
  { id: 'empresa', label: 'Empresa', icon: 'ri-team-line' },
  { id: 'servicios', label: 'Servicios', icon: 'ri-tools-line' },
  { id: 'proyectos', label: 'Proyectos', icon: 'ri-building-2-line' },
  { id: 'blog', label: 'Blog', icon: 'ri-article-line' },
  { id: 'licitaciones', label: 'Licitaciones', icon: 'ri-file-list-3-line' },
]

export default function AdminPaginasPage() {
  usePageMeta({ title: 'Textos del sitio — Admin' })
  const { ready } = useAdminReady()
  const [pages, setPages] = useState<SitePages>(defaultPages)
  const [tab, setTab] = useState('global')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!ready) return
    fetchSiteSettings().then((s) => {
      setPages(mergeSitePages(s?.pages))
      setLoading(false)
    })
  }, [ready])

  const save = async () => {
    setSaving(true)
    setSaved(false)
    setError(null)
    const ok = await upsertSiteSettings({
      pages,
      social: pages.global.social,
    })
    setSaving(false)
    if (ok) setSaved(true)
    else setError('No se pudo guardar. Intente nuevamente.')
  }

  const set = <K extends keyof SitePages>(key: K, value: SitePages[K]) => {
    setPages((prev) => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <AdminPage title="Textos del sitio" description="Editá títulos, párrafos, héroes e imágenes de cada página.">
        <AdminCard className="p-8"><AdminLoading /></AdminCard>
      </AdminPage>
    )
  }

  return (
    <AdminPage
      title="Textos del sitio"
      description="Editá títulos, párrafos, héroes, CTAs e imágenes de fondo. Los cambios se reflejan en el sitio público al recargar."
    >
      <AdminCard className="p-6 md:p-8">
        <AdminTabs tabs={tabs} active={tab} onChange={setTab} />

        <AdminTabPanel active={tab} id="global">
          <FormSection title="Identidad del sitio">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminInput label="Nombre del sitio" value={pages.global.siteName} onChange={(e) => set('global', { ...pages.global, siteName: e.target.value })} />
              <AdminTextarea label="Descripción general" rows={2} value={pages.global.siteDescription} onChange={(e) => set('global', { ...pages.global, siteDescription: e.target.value })} className="md:col-span-2" />
            </div>
          </FormSection>
          <FormSection title="Footer y navegación">
            <div className="grid grid-cols-1 gap-4">
              <AdminTextarea label="Tagline del footer" rows={2} value={pages.global.footerTagline} onChange={(e) => set('global', { ...pages.global, footerTagline: e.target.value })} />
              <AdminInput label="Copyright" value={pages.global.footerCopyright} onChange={(e) => set('global', { ...pages.global, footerCopyright: e.target.value })} />
              <AdminInput label="Texto botón navbar" value={pages.global.navCtaLabel} onChange={(e) => set('global', { ...pages.global, navCtaLabel: e.target.value })} />
              <AdminInput label="Newsletter — título" value={pages.global.newsletterTitle} onChange={(e) => set('global', { ...pages.global, newsletterTitle: e.target.value })} />
              <AdminTextarea label="Newsletter — texto" rows={2} value={pages.global.newsletterText} onChange={(e) => set('global', { ...pages.global, newsletterText: e.target.value })} />
            </div>
          </FormSection>
          <FormSection title="Redes sociales">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminInput label="Instagram" value={pages.global.social.instagram} onChange={(e) => set('global', { ...pages.global, social: { ...pages.global.social, instagram: e.target.value } })} />
              <AdminInput label="LinkedIn" value={pages.global.social.linkedin ?? ''} onChange={(e) => set('global', { ...pages.global, social: { ...pages.global.social, linkedin: e.target.value } })} />
              <AdminInput label="YouTube" value={pages.global.social.youtube} onChange={(e) => set('global', { ...pages.global, social: { ...pages.global.social, youtube: e.target.value } })} />
              <AdminInput label="Facebook" value={pages.global.social.facebook} onChange={(e) => set('global', { ...pages.global, social: { ...pages.global.social, facebook: e.target.value } })} />
            </div>
          </FormSection>
          <FormSection title="WhatsApp flotante">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center gap-2 text-sm font-body text-foreground-700 md:col-span-2">
                <input
                  type="checkbox"
                  checked={pages.global.whatsapp?.enabled ?? false}
                  onChange={(e) => set('global', { ...pages.global, whatsapp: { ...pages.global.whatsapp, enabled: e.target.checked } })}
                  className="rounded border-background-300"
                />
                Mostrar botón flotante
              </label>
              <AdminInput label="Teléfono (solo dígitos, con código país)" value={pages.global.whatsapp?.phone ?? ''} onChange={(e) => set('global', { ...pages.global, whatsapp: { ...pages.global.whatsapp, phone: e.target.value } })} />
              <AdminTextarea label="Mensaje predeterminado" rows={2} value={pages.global.whatsapp?.message ?? ''} onChange={(e) => set('global', { ...pages.global, whatsapp: { ...pages.global.whatsapp, message: e.target.value } })} />
            </div>
          </FormSection>
        </AdminTabPanel>

        <AdminTabPanel active={tab} id="home">
          <SeoFields seo={pages.home.seo} onChange={(seo) => set('home', { ...pages.home, seo })} />
          <HeroFields hero={pages.home.hero} onChange={(hero) => set('home', { ...pages.home, hero: { ...pages.home.hero, ...hero } })} />
          <HeroSlideFields slides={pages.home.heroSlides ?? []} onChange={(heroSlides) => set('home', { ...pages.home, heroSlides })} />
          <HeroStripFields strip={pages.home.heroStrip ?? []} onChange={(heroStrip) => set('home', { ...pages.home, heroStrip })} />
          <FormSection title="Botones del hero">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AdminInput label="Botón principal" value={pages.home.hero.ctaPrimary} onChange={(e) => set('home', { ...pages.home, hero: { ...pages.home.hero, ctaPrimary: e.target.value } })} />
              <AdminInput label="Botón secundario" value={pages.home.hero.ctaSecondary} onChange={(e) => set('home', { ...pages.home, hero: { ...pages.home.hero, ctaSecondary: e.target.value } })} />
              <AdminInput label="Enlace secundario" value={pages.home.hero.ctaSecondaryUrl} onChange={(e) => set('home', { ...pages.home, hero: { ...pages.home.hero, ctaSecondaryUrl: e.target.value } })} />
            </div>
          </FormSection>
          <FormSection title="Sección estadísticas">
            <AdminTextarea label="Texto introductorio" rows={3} value={pages.home.statsIntro} onChange={(e) => set('home', { ...pages.home, statsIntro: e.target.value })} />
            <AdminImageField label="Imagen aérea" value={pages.home.statsImage} onChange={(url) => set('home', { ...pages.home, statsImage: url })} />
          </FormSection>
          <SectionFields title="Sección servicios" section={pages.home.services} onChange={(services) => set('home', { ...pages.home, services })} />
          <SectionFields title="Sección proyectos" section={pages.home.projects} onChange={(projects) => set('home', { ...pages.home, projects: { ...pages.home.projects, ...projects } })} />
          <AdminInput label="Enlace «Ver todos» proyectos" value={pages.home.projects.linkLabel} onChange={(e) => set('home', { ...pages.home, projects: { ...pages.home.projects, linkLabel: e.target.value } })} />
          <SectionFields title="Sección sectores" section={pages.home.sectors} onChange={(sectors) => set('home', { ...pages.home, sectors })} />
          <SectionFields title="Sección certificaciones" section={pages.home.certifications} onChange={(certifications) => set('home', { ...pages.home, certifications })} />
          <SectionFields title="Sección testimonios" section={pages.home.testimonials} onChange={(testimonials) => set('home', { ...pages.home, testimonials })} />
          <CtaFields cta={pages.home.cta} onChange={(cta) => set('home', { ...pages.home, cta })} />
        </AdminTabPanel>

        <AdminTabPanel active={tab} id="contacto">
          <SeoFields seo={pages.contacto.seo} onChange={(seo) => set('contacto', { ...pages.contacto, seo })} />
          <HeroFields hero={pages.contacto.hero} onChange={(hero) => set('contacto', { ...pages.contacto, hero })} />
          <SectionFields title="Formulario principal" section={pages.contacto.form} onChange={(form) => set('contacto', { ...pages.contacto, form })} />
          <FormSection title="Mensaje de éxito">
            <AdminInput label="Título" value={pages.contacto.formSuccessTitle} onChange={(e) => set('contacto', { ...pages.contacto, formSuccessTitle: e.target.value })} />
            <AdminTextarea label="Texto" rows={2} value={pages.contacto.formSuccessText} onChange={(e) => set('contacto', { ...pages.contacto, formSuccessText: e.target.value })} />
          </FormSection>
          <AdminInput label="Título sidebar contacto" value={pages.contacto.sidebarTitle} onChange={(e) => set('contacto', { ...pages.contacto, sidebarTitle: e.target.value })} />
          <SectionFields title="Áreas de contacto" section={pages.contacto.areas} onChange={(areas) => set('contacto', { ...pages.contacto, areas })} />
          <SectionFields title="Formulario callback" section={pages.contacto.callback} onChange={(callback) => set('contacto', { ...pages.contacto, callback })} />
          <AdminInput label="Mensaje éxito callback" value={pages.contacto.callbackSuccess} onChange={(e) => set('contacto', { ...pages.contacto, callbackSuccess: e.target.value })} />
        </AdminTabPanel>

        <AdminTabPanel active={tab} id="empresa">
          <SeoFields seo={pages.empresa.seo} onChange={(seo) => set('empresa', { ...pages.empresa, seo })} />
          <HeroFields hero={pages.empresa.hero} onChange={(hero) => set('empresa', { ...pages.empresa, hero })} />
          <SectionFields title="Historia — encabezado" section={{ label: pages.empresa.history.label, title: pages.empresa.history.title }} onChange={(h) => set('empresa', { ...pages.empresa, history: { ...pages.empresa.history, ...h } })} />
          <ParagraphList label="Historia — párrafos" paragraphs={pages.empresa.history.paragraphs} onChange={(paragraphs) => set('empresa', { ...pages.empresa, history: { ...pages.empresa.history, paragraphs } })} />
          <FormSection title="Misión y visión">
            <AdminTextarea label="Misión" rows={3} value={pages.empresa.mission} onChange={(e) => set('empresa', { ...pages.empresa, mission: e.target.value })} />
            <AdminTextarea label="Visión" rows={3} value={pages.empresa.vision} onChange={(e) => set('empresa', { ...pages.empresa, vision: e.target.value })} />
            <AdminInput label="Título sección valores" value={pages.empresa.valuesTitle} onChange={(e) => set('empresa', { ...pages.empresa, valuesTitle: e.target.value })} />
          </FormSection>
          <SectionFields title="Equipo" section={pages.empresa.team} onChange={(team) => set('empresa', { ...pages.empresa, team })} />
          <SectionFields title="Regiones" section={pages.empresa.regions} onChange={(regions) => set('empresa', { ...pages.empresa, regions })} />
          <CtaFields cta={pages.empresa.cta} onChange={(cta) => set('empresa', { ...pages.empresa, cta })} />
        </AdminTabPanel>

        <AdminTabPanel active={tab} id="servicios">
          <SeoFields seo={pages.servicios.seo} onChange={(seo) => set('servicios', { ...pages.servicios, seo })} />
          <HeroFields hero={pages.servicios.hero} onChange={(hero) => set('servicios', { ...pages.servicios, hero })} />
          <SectionFields title="Divisiones" section={pages.servicios.divisions} onChange={(divisions) => set('servicios', { ...pages.servicios, divisions })} />
          <SectionFields title="Grilla de servicios" section={pages.servicios.grid} onChange={(grid) => set('servicios', { ...pages.servicios, grid })} />
          <CtaFields cta={pages.servicios.cta} onChange={(cta) => set('servicios', { ...pages.servicios, cta })} />
        </AdminTabPanel>

        <AdminTabPanel active={tab} id="proyectos">
          <SeoFields seo={pages.proyectos.seo} onChange={(seo) => set('proyectos', { ...pages.proyectos, seo })} />
          <HeroFields hero={pages.proyectos.hero} onChange={(hero) => set('proyectos', { ...pages.proyectos, hero })} />
          <CtaFields cta={pages.proyectos.cta} onChange={(cta) => set('proyectos', { ...pages.proyectos, cta })} />
        </AdminTabPanel>

        <AdminTabPanel active={tab} id="blog">
          <SeoFields seo={pages.blog.seo} onChange={(seo) => set('blog', { ...pages.blog, seo })} />
          <p className="text-sm font-body text-foreground-500">Los artículos se editan en el módulo Blog. Aquí solo configurás el SEO de la página listado.</p>
        </AdminTabPanel>

        <AdminTabPanel active={tab} id="licitaciones">
          <SeoFields seo={pages.licitaciones.seo} onChange={(seo) => set('licitaciones', { ...pages.licitaciones, seo })} />
          <HeroFields hero={pages.licitaciones.hero} onChange={(hero) => set('licitaciones', { ...pages.licitaciones, hero })} />
          <SectionFields title="Registro proveedores" section={pages.licitaciones.provider} onChange={(provider) => set('licitaciones', { ...pages.licitaciones, provider: { ...pages.licitaciones.provider, ...provider } })} />
          <FormSection title="Botones registro proveedor">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminInput label="Botón principal" value={pages.licitaciones.provider.ctaPrimary} onChange={(e) => set('licitaciones', { ...pages.licitaciones, provider: { ...pages.licitaciones.provider, ctaPrimary: e.target.value } })} />
              <AdminInput label="Enlace principal" value={pages.licitaciones.provider.ctaPrimaryUrl} onChange={(e) => set('licitaciones', { ...pages.licitaciones, provider: { ...pages.licitaciones.provider, ctaPrimaryUrl: e.target.value } })} />
              <AdminInput label="Botón secundario" value={pages.licitaciones.provider.ctaSecondary} onChange={(e) => set('licitaciones', { ...pages.licitaciones, provider: { ...pages.licitaciones.provider, ctaSecondary: e.target.value } })} />
              <AdminInput label="Enlace secundario" value={pages.licitaciones.provider.ctaSecondaryUrl} onChange={(e) => set('licitaciones', { ...pages.licitaciones, provider: { ...pages.licitaciones.provider, ctaSecondaryUrl: e.target.value } })} />
            </div>
          </FormSection>
        </AdminTabPanel>

        <SaveBar saving={saving} saved={saved} error={error} onSave={save} />
      </AdminCard>
    </AdminPage>
  )
}
