import { Link } from 'react-router-dom'
import { type FormEvent, useState } from 'react'
import Logo from './Logo'
import FormNotice from './FormNotice'
import { useSiteContact } from '../context/ContentContext'
import { submitNewsletter } from '../lib/contact'

const navLinks = [
  { to: '/empresa', label: 'Empresa' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/proyectos', label: 'Proyectos' },
  { to: '/licitaciones', label: 'Licitaciones' },
  { to: '/blog', label: 'Blog' },
  { to: '/contacto', label: 'Contacto' },
]

export default function Footer() {
  const contact = useSiteContact()
  const [subscribed, setSubscribed] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleNewsletter = async (e: FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const result = await submitNewsletter(email)
    if (result.ok) setSubscribed(true)
    else setError(result.error ?? 'Error al suscribirse')
  }

  return (
    <footer className="bg-primary-500">
      <div className="relative w-full px-6 md:px-12 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          <div className="lg:col-span-1">
            <div className="mb-8">
              <Logo variant="light" size="md" />
            </div>
            <p className="text-white/60 text-sm font-body leading-relaxed mb-6 max-w-xs">
              Construimos la infraestructura que impulsa el crecimiento del Norte Argentino.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://instagram.com/emprenorgroup" target="_blank" rel="nofollow noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-accent-500 text-white/70 hover:text-white transition-all duration-300" aria-label="Instagram">
                <i className="ri-instagram-line text-base" />
              </a>
              <a href="https://youtube.com/@emprenorgroup" target="_blank" rel="nofollow noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-accent-500 text-white/70 hover:text-white transition-all duration-300" aria-label="YouTube">
                <i className="ri-youtube-line text-base" />
              </a>
              <a href="https://facebook.com/emprenorgroup" target="_blank" rel="nofollow noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-accent-500 text-white/70 hover:text-white transition-all duration-300" aria-label="Facebook">
                <i className="ri-facebook-line text-base" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white text-sm font-body font-semibold mb-5 uppercase tracking-wider">Navegación</h4>
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} className="text-white/50 hover:text-white text-sm font-body transition-colors duration-200">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white text-sm font-body font-semibold mb-5 uppercase tracking-wider">Contacto</h4>
            <div className="flex flex-col gap-3">
              <a href={contact.primaryPhone.href} className="text-white/50 hover:text-white text-sm font-body transition-colors duration-200 flex items-center gap-2">
                <i className="ri-phone-line text-sm w-4 h-4 flex items-center justify-center" />
                {contact.primaryPhone.display}
              </a>
              <a href={`mailto:${contact.email}`} className="text-white/50 hover:text-white text-sm font-body transition-colors duration-200 flex items-center gap-2">
                <i className="ri-mail-line text-sm w-4 h-4 flex items-center justify-center" />
                {contact.email}
              </a>
              <span className="text-white/50 text-sm font-body flex items-start gap-2">
                <i className="ri-map-pin-line text-sm w-4 h-4 flex items-center justify-center mt-0.5" />
                {contact.address.short}
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-white text-sm font-body font-semibold mb-5 uppercase tracking-wider">Newsletter</h4>
            <p className="text-white/50 text-sm font-body leading-relaxed mb-4">
              Recibí novedades sobre proyectos, licitaciones y el sector de la construcción.
            </p>
            {subscribed ? (
              <p className="text-accent-300 text-sm font-body">¡Gracias por suscribirte!</p>
            ) : (
              <form className="flex flex-col gap-0" onSubmit={handleNewsletter}>
                {error && <p className="text-red-300 text-xs mb-2">{error}</p>}
                <div className="flex items-center gap-0">
                  <input
                    id="newsletter-email"
                    name="email"
                    placeholder="Tu email"
                    required
                    type="email"
                    className="flex-1 h-11 px-4 bg-white/10 border border-white/10 rounded-l-md text-white text-sm font-body placeholder:text-white/30 focus:outline-none focus:border-accent-500/50 transition-colors"
                  />
                  <button type="submit" className="h-11 w-11 flex items-center justify-center bg-accent-500 hover:bg-accent-600 text-white rounded-r-md transition-all duration-300" aria-label="Suscribirse">
                    <i className="ri-send-plane-fill text-sm" />
                  </button>
                </div>
                <FormNotice variant="inverse" />
              </form>
            )}
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs font-body">© 2026 GRUPO EMPRENOR. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacidad" className="text-white/30 hover:text-white/50 text-xs font-body transition-colors">Privacidad</Link>
            <Link to="/terminos" className="text-white/30 hover:text-white/50 text-xs font-body transition-colors">Términos</Link>
          </div>
        </div>
      </div>

      <div className="relative px-6 md:px-12 pb-4 overflow-hidden select-none pointer-events-none">
        <span className="block text-center text-[5rem] md:text-[7rem] font-heading font-bold text-white/[0.03] leading-none whitespace-nowrap">
          GRUPO EMPRENOR
        </span>
      </div>
    </footer>
  )
}
