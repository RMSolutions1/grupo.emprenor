import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useScrollHeader } from '../hooks/useCounter'
import { useSiteContact, useGlobalCopy } from '../context/ContentContext'
import Logo from './Logo'

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/empresa', label: 'Empresa' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/proyectos', label: 'Proyectos' },
  { to: '/licitaciones', label: 'Licitaciones' },
  { to: '/blog', label: 'Blog' },
  { to: '/contacto', label: 'Contacto' },
]

function isNavActive(pathname: string, to: string): boolean {
  if (to === '/') return pathname === '/'
  return pathname === to || pathname.startsWith(`${to}/`)
}

export default function Navbar({ transparent = false }: { transparent?: boolean }) {
  const location = useLocation()
  const contact = useSiteContact()
  const global = useGlobalCopy()
  const scrolled = useScrollHeader()
  const [menuOpen, setMenuOpen] = useState(false)
  const isHome = location.pathname === '/'
  const light = transparent && isHome && !scrolled
  const isAdminRoute = location.pathname.startsWith('/admin')

  if (isAdminRoute) return null

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="hidden lg:block bg-primary-600 border-b border-white/10">
        <div className="w-full px-6 md:px-12 h-9 flex items-center justify-between text-xs font-body text-white/80">
          <div className="flex items-center gap-5">
            <a href={contact.primaryPhone.href} className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
              <i className="ri-phone-line" />
              {contact.primaryPhone.display}
            </a>
            <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
              <i className="ri-mail-line" />
              {contact.email}
            </a>
          </div>
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1.5 font-medium text-white hover:text-accent-300 transition-colors"
          >
            <i className="ri-shield-user-line text-sm" />
            Acceso Administrador
          </Link>
        </div>
      </div>

      <nav
        className={`transition-all duration-500 ${
          light ? 'bg-transparent' : 'bg-white/95 backdrop-blur-md shadow-sm'
        }`}
      >
        <div className="w-full px-6 md:px-12">
          <div className="flex items-center justify-between h-20">
            <Logo variant={light ? 'light' : 'dark'} size="md" linkToHome onClick={() => setMenuOpen(false)} />

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative text-sm font-body whitespace-nowrap transition-colors duration-300 ${
                    isNavActive(location.pathname, link.to)
                      ? `${light ? 'text-white' : 'text-foreground-950'} font-medium`
                      : `${light ? 'text-white/80 hover:text-white' : 'text-foreground-600 hover:text-foreground-950'}`
                  }`}
                >
                  {link.label}
                  {isNavActive(location.pathname, link.to) && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent-500 rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <Link
                to="/contacto"
                className="whitespace-nowrap px-6 py-2.5 bg-accent-500 hover:bg-accent-600 text-white text-sm font-body font-medium rounded-md transition-all duration-300"
              >
                {global.navCtaLabel}
              </Link>
            </div>

            <button
              className={`lg:hidden w-10 h-10 flex items-center justify-center transition-colors duration-300 ${light ? 'text-white' : 'text-foreground-950'}`}
              aria-label="Menú"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <i className={`text-2xl ${menuOpen ? 'ri-close-line' : 'ri-menu-line'}`} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div id="mobile-nav" className="lg:hidden bg-white border-t border-background-200 px-6 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block text-base font-body ${isNavActive(location.pathname, link.to) ? 'text-accent-500 font-medium' : 'text-foreground-700'}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/admin/login"
              className="flex items-center gap-2 text-base font-body text-primary-600 font-medium"
              onClick={() => setMenuOpen(false)}
            >
              <i className="ri-shield-user-line" />
              Acceso Administrador
            </Link>
            <Link
              to="/contacto"
              className="block w-full text-center px-6 py-3 bg-accent-500 text-white text-sm font-body font-medium rounded-md"
              onClick={() => setMenuOpen(false)}
            >
              {global.navCtaLabel}
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
