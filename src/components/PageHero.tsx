import { Link } from 'react-router-dom'
import Breadcrumb, { type BreadcrumbItem } from './Breadcrumb'

interface PageHeroProps {
  label?: string
  title: string
  subtitle?: string
  image: string
  breadcrumb?: BreadcrumbItem[]
  children?: React.ReactNode
}

export default function PageHero({ label, title, subtitle, image, breadcrumb, children }: PageHeroProps) {
  return (
    <>
      {breadcrumb && breadcrumb.length > 0 && (
        <div className="site-header-offset bg-background-100 border-b border-background-200">
          <div className="w-full px-6 md:px-12 py-4 max-w-7xl mx-auto">
            <Breadcrumb items={breadcrumb} className="!mb-0" />
          </div>
        </div>
      )}
    <section className={`relative w-full overflow-hidden ${breadcrumb?.length ? '' : 'site-header-offset'} ${image ? 'min-h-[420px] md:min-h-[520px]' : 'py-16 md:py-20 bg-primary-500'}`}>
      {image && (
        <>
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url("${image}")` }} />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-950/70 via-primary-950/50 to-primary-950/70" />
        </>
      )}
      <div className={`relative z-10 flex flex-col items-center justify-center w-full px-6 md:px-12 text-center ${image ? 'min-h-[420px] md:min-h-[520px]' : ''}`}>
        {label && (
          <p className="text-accent-500 text-sm font-body font-semibold uppercase tracking-wider mb-4">{label}</p>
        )}
        <h1 className={`font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-4xl text-balance ${image ? 'text-white' : 'text-white'}`}>
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 text-base md:text-lg text-white/70 font-body font-light max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
    </>
  )
}

interface CTALink {
  to: string
  label: string
  external?: boolean
}

interface CTASectionProps {
  label?: string
  title: string
  description: string
  primaryLink: CTALink
  secondaryLink?: CTALink
  image?: string
}

export function CTASection({ label, title, description, primaryLink, secondaryLink, image }: CTASectionProps) {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {image && (
        <>
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${image}")` }} />
          <div className="absolute inset-0 bg-primary-950/80" />
        </>
      )}
      {!image && <div className="absolute inset-0 bg-primary-500" />}
      <div className="relative z-10 w-full px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          {label && (
            <p className="text-accent-400 text-sm font-body font-semibold uppercase tracking-wider mb-4">{label}</p>
          )}
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            {title}
          </h2>
          <p className="text-white/70 font-body text-base md:text-lg leading-relaxed mb-10">{description}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {primaryLink.external ? (
              <a href={primaryLink.to} className="whitespace-nowrap px-10 py-3.5 bg-accent-500 hover:bg-accent-600 text-white text-sm md:text-base font-body font-medium rounded-md transition-all duration-300 shadow-lg shadow-accent-500/25">
                {primaryLink.label}
              </a>
            ) : (
              <Link to={primaryLink.to} className="whitespace-nowrap px-10 py-3.5 bg-accent-500 hover:bg-accent-600 text-white text-sm md:text-base font-body font-medium rounded-md transition-all duration-300 shadow-lg shadow-accent-500/25">
                {primaryLink.label}
              </Link>
            )}
            {secondaryLink && (
              secondaryLink.external || secondaryLink.to.startsWith('tel:') || secondaryLink.to.startsWith('mailto:') ? (
                <a href={secondaryLink.to} className="whitespace-nowrap px-10 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white text-sm md:text-base font-body font-medium rounded-md transition-all duration-300">
                  {secondaryLink.label}
                </a>
              ) : (
                <Link to={secondaryLink.to} className="whitespace-nowrap px-10 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white text-sm md:text-base font-body font-medium rounded-md transition-all duration-300">
                  {secondaryLink.label}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
