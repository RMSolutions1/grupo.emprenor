import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppButton from './WhatsAppButton'

export default function Layout({ children, transparentNav = false }: { children: React.ReactNode; transparentNav?: boolean }) {
  return (
    <>
      <Navbar transparent={transparentNav} />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}

export function SectionHeading({
  label,
  title,
  subtitle,
  align = 'left',
}: {
  label?: string
  title: React.ReactNode
  subtitle?: string
  align?: 'left' | 'center'
}) {
  return (
    <div className={`mb-14 md:mb-16 ${align === 'center' ? 'text-center' : ''}`}>
      {label && (
        <p className="text-accent-500 text-sm font-body font-semibold uppercase tracking-wider mb-3">{label}</p>
      )}
      <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground-950 leading-tight">{title}</h2>
      {subtitle && (
        <p className={`mt-4 text-base font-body text-foreground-600 max-w-xl leading-relaxed ${align === 'center' ? 'mx-auto max-w-2xl' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

export function AccentButton({ to, children, className = '' }: { to: string; children: React.ReactNode; className?: string }) {
  return (
    <Link to={to} className={`whitespace-nowrap px-10 py-3.5 bg-accent-500 hover:bg-accent-600 text-white text-sm md:text-base font-body font-medium rounded-md transition-all duration-300 shadow-lg shadow-accent-500/25 ${className}`}>
      {children}
    </Link>
  )
}
