import { IMAGES } from './images'
import { DEFAULT_DESCRIPTION, SITE_NAME } from './site'

export type SeoCopy = {
  title: string
  description: string
}

export type HeroCopy = {
  label?: string
  title: string
  subtitle?: string
  image?: string
}

export type SectionCopy = {
  label?: string
  title: string
  subtitle?: string
}

export type CtaCopy = {
  label?: string
  title: string
  description: string
  primaryLabel: string
  primaryUrl: string
  secondaryLabel?: string
  secondaryUrl?: string
  image?: string
}

export type HeroSlideCopy = {
  label?: string
  title: string
  subtitle?: string
  image?: string
}

export type HeroStripStatCopy = {
  value: string
  label: string
}

export type WhatsAppCopy = {
  enabled: boolean
  phone: string
  message: string
}

export type GlobalCopy = {
  siteName: string
  siteDescription: string
  footerTagline: string
  footerCopyright: string
  newsletterTitle: string
  newsletterText: string
  navCtaLabel: string
  whatsapp: WhatsAppCopy
  social: {
    instagram: string
    youtube: string
    facebook: string
    linkedin: string
  }
}

export type HomePageCopy = {
  seo: SeoCopy
  hero: HeroCopy & { ctaPrimary: string; ctaSecondary: string; ctaSecondaryUrl: string }
  heroSlides: HeroSlideCopy[]
  heroStrip: HeroStripStatCopy[]
  statsIntro: string
  statsImage: string
  services: SectionCopy
  projects: SectionCopy & { linkLabel: string }
  sectors: SectionCopy
  certifications: SectionCopy
  testimonials: SectionCopy
  cta: CtaCopy
}

export type ContactoPageCopy = {
  seo: SeoCopy
  hero: HeroCopy
  form: SectionCopy
  formSuccessTitle: string
  formSuccessText: string
  sidebarTitle: string
  areas: SectionCopy
  callback: SectionCopy
  callbackSuccess: string
}

export type EmpresaPageCopy = {
  seo: SeoCopy
  hero: HeroCopy
  history: SectionCopy & { paragraphs: string[] }
  mission: string
  vision: string
  valuesTitle: string
  team: SectionCopy
  regions: SectionCopy
  cta: CtaCopy
}

export type ServiciosPageCopy = {
  seo: SeoCopy
  hero: HeroCopy
  divisions: SectionCopy
  grid: SectionCopy
  cta: CtaCopy
}

export type ProyectosPageCopy = {
  seo: SeoCopy
  hero: HeroCopy
  cta: CtaCopy
}

export type BlogPageCopy = {
  seo: SeoCopy
}

export type LicitacionesPageCopy = {
  seo: SeoCopy
  hero: HeroCopy
  provider: SectionCopy & {
    ctaPrimary: string
    ctaPrimaryUrl: string
    ctaSecondary: string
    ctaSecondaryUrl: string
  }
}

export type SitePages = {
  global: GlobalCopy
  home: HomePageCopy
  contacto: ContactoPageCopy
  empresa: EmpresaPageCopy
  servicios: ServiciosPageCopy
  proyectos: ProyectosPageCopy
  blog: BlogPageCopy
  licitaciones: LicitacionesPageCopy
}

export const defaultPages: SitePages = {
  global: {
    siteName: SITE_NAME,
    siteDescription: DEFAULT_DESCRIPTION,
    footerTagline: 'Construcción e instalaciones integradas en el NOA. Doce especialidades, un solo equipo.',
    footerCopyright: '© 2026 EMPRENOR. Todos los derechos reservados.',
    newsletterTitle: 'Newsletter',
    newsletterText: 'Recibí novedades sobre proyectos, licitaciones y el sector de la construcción.',
    navCtaLabel: 'Solicitar Cotización',
    whatsapp: {
      enabled: true,
      phone: '541127586521',
      message: 'Hola, quisiera consultar sobre un proyecto con EMPRENOR.',
    },
    social: {
      instagram: 'https://instagram.com/emprenorgroup',
      youtube: 'https://youtube.com/@emprenorgroup',
      facebook: 'https://facebook.com/emprenorgroup',
      linkedin: 'https://www.linkedin.com/company/emprenor',
    },
  },
  home: {
    seo: { title: 'Inicio', description: DEFAULT_DESCRIPTION },
    hero: {
      label: 'Desde 2018 · NOA',
      title: 'Construcción e instalaciones integradas en el NOA',
      subtitle: 'Doce especialidades técnicas coordinadas por un solo equipo, con presupuesto y alcance por escrito. Salta, Jujuy, Tucumán y Formosa.',
      image: IMAGES.hero,
      ctaPrimary: 'Solicitar Cotización',
      ctaSecondary: 'Ver Proyectos',
      ctaSecondaryUrl: '/proyectos',
    },
    heroSlides: [
      {
        label: 'Desde 2018 · NOA',
        title: 'Construcción e instalaciones integradas en el NOA',
        subtitle: 'Doce especialidades técnicas coordinadas por un solo equipo, con presupuesto y alcance por escrito. Salta, Jujuy, Tucumán y Formosa.',
        image: IMAGES.hero,
      },
      {
        label: 'Sector industrial e institucional',
        title: 'Infraestructura con gestión documentada y SST',
        subtitle: 'Naves, plantas y obra pública con cronograma, controles de calidad y entregables según contrato.',
        image: IMAGES.serviciosHero,
      },
    ],
    heroStrip: [
      { value: '12', label: 'Especialidades integradas' },
      { value: '4', label: 'Provincias del NOA' },
      { value: '2018', label: 'Operación documentada' },
      { value: '5', label: 'Tipos de obra' },
    ],
    statsIntro: 'Doce especialidades integradas, operación documentada desde 2018 y presencia en Salta, Jujuy, Tucumán y Formosa.',
    statsImage: IMAGES.statsAerial,
    services: {
      title: 'Nuestros servicios',
      subtitle: 'Doce especialidades técnicas integradas para obra civil, instalaciones y mantenimiento en el NOA.',
    },
    projects: {
      label: 'Portafolio',
      title: 'Proyectos destacados',
      linkLabel: 'Ver todos',
    },
    sectors: { title: 'Sectores que confían en nosotros' },
    certifications: {
      label: 'Calidad Garantizada',
      title: 'Certificaciones',
      subtitle: 'Nuestros procesos y estándares están respaldados por las certificaciones más exigentes a nivel nacional e internacional.',
    },
    testimonials: {
      label: 'Testimonios',
      title: 'Lo que dicen nuestros clientes',
    },
    cta: {
      label: 'Comencemos su proyecto',
      title: 'Solicite una reunión técnica con nuestro equipo de ingeniería',
      description: 'Analizaremos los requerimientos de su proyecto y le presentaremos una propuesta técnica y económica a medida.',
      primaryLabel: 'Solicitar Reunión Técnica',
      primaryUrl: '/contacto',
      secondaryLabel: 'Llamar por Teléfono',
      secondaryUrl: 'tel:+541127586521',
      image: IMAGES.cta,
    },
  },
  contacto: {
    seo: {
      title: 'Contacto',
      description: 'Comuníquese con EMPRENOR para consultas de construcción, instalaciones y licitaciones en el NOA.',
    },
    hero: {
      label: 'Contacto',
      title: 'Hablemos de su próximo proyecto',
      subtitle: 'Estamos listos para escuchar sus necesidades y encontrar la mejor solución de ingeniería, construcción o energía para su organización.',
      image: IMAGES.contactoHero,
    },
    form: {
      title: 'Envíenos su consulta',
      subtitle: 'Complete el formulario y un asesor especializado se pondrá en contacto a la brevedad.',
    },
    formSuccessTitle: '¡Consulta enviada!',
    formSuccessText: 'Un asesor especializado se pondrá en contacto a la brevedad.',
    sidebarTitle: 'Información de Contacto',
    areas: {
      title: 'Áreas de Contacto Directo',
      subtitle: 'Comuníquese directamente con el área que mejor se adapte a su necesidad.',
    },
    callback: {
      title: '¿Prefiere que lo llamemos?',
      subtitle: 'Déjenos sus datos y un representante se comunicará en el horario que usted indique.',
    },
    callbackSuccess: '¡Gracias! Nos comunicaremos con usted pronto.',
  },
  empresa: {
    seo: {
      title: 'Empresa',
      description: 'Conozca la historia, valores y equipo de EMPRENOR en el Norte Argentino.',
    },
    hero: {
      label: 'Desde 2018 · NOA',
      title: 'Somos EMPRENOR',
      subtitle: 'Construcción e instalaciones integradas. Doce especialidades técnicas con operación documentada en Salta, Jujuy, Tucumán y Formosa.',
      image: IMAGES.empresaHero,
    },
    history: {
      label: 'Trayectoria',
      title: 'Nuestra Historia',
      paragraphs: [
        'EMPRENOR inició su operación documentada en 2018 en Salta, con la visión de ofrecer construcción e instalaciones integradas bajo un solo equipo técnico en el NOA.',
        'Desde los primeros proyectos de obra civil e instalaciones eléctricas y sanitarias, fuimos incorporando especialidades hasta alcanzar doce rubros coordinados con presupuesto y alcance por escrito.',
        'Hoy operamos en cuatro provincias del Norte Argentino con más de 500 proyectos ejecutados, equipos locales y compromiso con la calidad, la seguridad y el cumplimiento normativo.',
      ],
    },
    mission: 'Desarrollar proyectos de construcción e instalaciones de excelencia que impulsen el desarrollo del NOA, con un solo interlocutor técnico y entregables documentados.',
    vision: 'Ser la empresa de referencia en construcción e instalaciones integradas del NOA, reconocida por calidad técnica, cumplimiento y operación documentada.',
    valuesTitle: 'Nuestros Valores',
    team: {
      label: 'Liderazgo',
      title: 'Equipo Directivo',
      subtitle: 'Profesionales con amplia trayectoria que lideran cada área con excelencia y compromiso.',
    },
    regions: {
      label: 'Presencia Regional',
      title: 'Cobertura Geográfica',
      subtitle: 'Operamos en 4 provincias del Norte Argentino, con oficinas centrales en Salta y capacidad de despliegue en toda la región.',
    },
    cta: {
      title: 'Formá parte del equipo líder en construcción del NOA',
      description: 'Buscamos profesionales comprometidos con la excelencia. Conocé nuestras oportunidades.',
      primaryLabel: 'Trabajá con Nosotros',
      primaryUrl: '/contacto',
      image: IMAGES.empresaCta,
    },
  },
  servicios: {
    seo: {
      title: 'Servicios',
      description: 'Doce especialidades de construcción, instalaciones y mantenimiento para proyectos de cualquier escala en el NOA.',
    },
    hero: {
      label: 'Desde 2018 · NOA',
      title: 'Servicios Integrales de Construcción',
      subtitle: 'Doce especialidades técnicas coordinadas por un solo equipo. Calidad, seguridad y cumplimiento normativo en Salta, Jujuy, Tucumán y Formosa.',
      image: IMAGES.serviciosHero,
    },
    divisions: {
      label: 'Especialidades',
      title: 'Doce áreas de especialización para todo tipo de proyecto',
    },
    grid: {
      label: 'Soluciones Integrales',
      title: 'Todas nuestras especialidades',
    },
    cta: {
      label: '¿No encuentra lo que busca?',
      title: 'Desarrollamos soluciones a medida para su proyecto',
      description: 'Cuéntenos sobre su proyecto y nuestro equipo técnico le presentará una propuesta personalizada sin cargo.',
      primaryLabel: 'Solicitar Asesoramiento',
      primaryUrl: '/contacto',
      image: IMAGES.serviciosCta,
    },
  },
  proyectos: {
    seo: {
      title: 'Proyectos',
      description: 'Más de 500 proyectos ejecutados en 4 provincias para organismos públicos, industrias y clientes privados.',
    },
    hero: {
      title: 'Proyectos que transforman el Norte Argentino',
      subtitle: 'Más de 500 proyectos ejecutados en 4 provincias para organismos públicos, industrias y clientes privados. Conocé nuestra trayectoria.',
      image: IMAGES.proyectosHero,
    },
    cta: {
      title: 'Convertimos sus necesidades en soluciones de ingeniería',
      description: 'Nuestro equipo técnico está listo para analizar su proyecto y elaborar una propuesta a medida sin compromiso.',
      primaryLabel: 'Solicitar Cotización',
      primaryUrl: '/contacto',
      secondaryLabel: 'Ver Servicios',
      secondaryUrl: '/servicios',
      image: IMAGES.proyectosCta,
    },
  },
  blog: {
    seo: {
      title: 'Blog',
      description: 'Artículos técnicos sobre ingeniería, construcción, energía y licitaciones en el Norte Argentino.',
    },
  },
  licitaciones: {
    seo: {
      title: 'Licitaciones',
      description: 'Portal de licitaciones vigentes de EMPRENOR. Acceda a documentación, consultas y ofertas.',
    },
    hero: {
      label: 'Transparencia y Gestión',
      title: 'Portal de Licitaciones',
      subtitle: 'Acceda a llamados vigentes, descargue documentación, realice consultas y presente sus ofertas. Interactuamos con organismos públicos y privados con total transparencia.',
      image: IMAGES.licitacionesHero,
    },
    provider: {
      label: '¿Quiere participar?',
      title: 'Registre su empresa como proveedor',
      subtitle: 'Al registrarse en nuestro portal de proveedores recibirá notificaciones automáticas de nuevos llamados, podrá descargar pliegos, realizar consultas técnicas y presentar sus ofertas de manera digital.',
      ctaPrimary: 'Registrarme como Proveedor',
      ctaPrimaryUrl: '/contacto',
      ctaSecondary: 'Conocer nuestros servicios',
      ctaSecondaryUrl: '/servicios',
    },
  },
}
