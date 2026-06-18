import { type FormEvent, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import Logo from '../../components/Logo'
import { useProveedorAuth } from '../../proveedor/ProveedorAuthContext'

export default function ProveedorLogin() {
  const { user, isProvider, isApproved, signIn, loading, configured, signOut } = useProveedorAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!loading && user && isProvider && isApproved) {
    return <Navigate to="/proveedor" replace />
  }

  if (!loading && user && isProvider && !isApproved) {
    return <Navigate to="/proveedor/pendiente" replace />
  }

  if (!loading && user && !isProvider) {
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
            <h1 className="font-heading text-2xl font-bold text-white">Portal de Proveedores</h1>
            <p className="mt-2 text-sm font-body text-white/70">Acceda a licitaciones y ofertas digitales</p>
          </div>

          {!configured ? (
            <div className="p-6 rounded-xl bg-white/95 text-sm font-body text-foreground-600">Supabase no configurado.</div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 rounded-xl bg-white shadow-2xl space-y-5">
              {error && (
                <p className="text-sm font-body text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</p>
              )}
              <div>
                <label htmlFor="prov-email" className="block text-sm font-body font-medium text-foreground-700 mb-1.5">Email</label>
                <input
                  id="prov-email"
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-4 rounded-md border border-background-300 text-sm font-body focus:outline-none focus:border-accent-500"
                />
              </div>
              <div>
                <label htmlFor="prov-pass" className="block text-sm font-body font-medium text-foreground-700 mb-1.5">Contraseña</label>
                <input
                  id="prov-pass"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 px-4 rounded-md border border-background-300 text-sm font-body focus:outline-none focus:border-accent-500"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 bg-accent-500 hover:bg-accent-600 disabled:opacity-60 text-white text-sm font-body font-semibold rounded-md"
              >
                {submitting ? 'Ingresando…' : 'Iniciar sesión'}
              </button>
              <p className="text-center text-sm font-body text-foreground-500">
                ¿No tiene cuenta?{' '}
                <Link to="/proveedor/registro" className="text-accent-600 hover:underline">
                  Registrarse
                </Link>
              </p>
            </form>
          )}

          <p className="text-center mt-8">
            <Link to="/licitaciones" className="text-sm font-body text-white/70 hover:text-white">
              ← Volver a licitaciones
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
