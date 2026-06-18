import { type FormEvent, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { useAdminAuth } from './AdminAuthContext'

export default function AdminLogin() {
  const { user, configured, signIn, loading, isStaff, signOut } = useAdminAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!loading && user && isStaff) {
    return <Navigate to="/admin" replace />
  }

  if (!loading && user && !isStaff) {
    void signOut()
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const result = await signIn(email, password)
    if (result.error) setError(result.error)
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-primary-500">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Logo variant="light" size="lg" />
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-white">Panel Administrativo</h1>
            <p className="mt-2 text-sm font-body text-white/70">EMPRENOR GROUP</p>
          </div>

          {!configured ? (
            <div className="p-6 rounded-xl border border-amber-200/30 bg-white/95 shadow-xl">
              <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">Configuración pendiente</h2>
              <p className="text-sm font-body text-foreground-600 leading-relaxed mb-4">
                El panel requiere conexión a Supabase. Configure las variables de entorno en el servidor de producción.
              </p>
              <ol className="text-sm font-body text-foreground-600 space-y-2 list-decimal list-inside">
                <li>Crear proyecto en supabase.com</li>
                <li>Ejecutar <code className="text-xs bg-background-100 px-1 py-0.5 rounded">scripts/supabase-schema.sql</code></li>
                <li>Crear usuario admin en Authentication</li>
              </ol>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 rounded-xl bg-white shadow-2xl shadow-black/20 space-y-5">
              {error && (
                <p className="text-sm font-body text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</p>
              )}
              <div>
                <label htmlFor="admin-email" className="block text-sm font-body font-medium text-foreground-700 mb-1.5">Email</label>
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="username"
                  placeholder="admin@emprenor.com.ar"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-4 rounded-md border border-background-300 bg-white text-sm font-body focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
                />
              </div>
              <div>
                <label htmlFor="admin-password" className="block text-sm font-body font-medium text-foreground-700 mb-1.5">Contraseña</label>
                <input
                  id="admin-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 px-4 rounded-md border border-background-300 bg-white text-sm font-body focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 bg-accent-500 hover:bg-accent-600 disabled:opacity-60 text-white text-sm font-body font-semibold rounded-md transition-colors shadow-lg shadow-accent-500/25"
              >
                {submitting ? 'Ingresando…' : 'Iniciar sesión'}
              </button>
            </form>
          )}

          <p className="text-center mt-8">
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-body text-white/70 hover:text-white transition-colors">
              <i className="ri-arrow-left-line" />
              Volver al sitio web
            </Link>
          </p>
        </div>
      </div>

      <p className="text-center pb-6 text-xs font-body text-white/40">
        Sistema de gestión de contenido — EMPRENOR GROUP
      </p>
    </div>
  )
}
