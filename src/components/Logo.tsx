import { Link } from 'react-router-dom'
import { BRAND } from '../data/brand'

type LogoVariant = 'light' | 'dark'
type LogoSize = 'sm' | 'md' | 'lg'

const sizeClasses: Record<LogoSize, string> = {
  sm: 'h-8',
  md: 'h-10',
  lg: 'h-14',
}

const sources: Record<LogoVariant, string> = {
  light: BRAND.logoWhiteLarge,
  dark: BRAND.logoLarge,
}

interface LogoProps {
  variant?: LogoVariant
  size?: LogoSize
  className?: string
  linkToHome?: boolean
  onClick?: () => void
}

export default function Logo({ variant = 'dark', size = 'md', className = '', linkToHome = false, onClick }: LogoProps) {
  const img = (
    <img
      src={sources[variant]}
      alt="EMPRENOR"
      className={`${sizeClasses[size]} w-auto object-contain ${className}`}
    />
  )

  if (linkToHome) {
    return (
      <Link to="/" className="inline-flex items-center shrink-0" aria-label="EMPRENOR — Inicio" onClick={onClick}>
        {img}
      </Link>
    )
  }

  return img
}
