import { type FormEvent, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAdminAuth } from './AdminAuthContext'

export default function AdminLogin() {
  const { user, configured, signIn, loading } = useAdminAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!loading && user) {
    return <Navigate to="/admin" replace />
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
    <div className="min-h-screen flex items-center justify-center bg-background-100 px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground-950">Panel de administración</h1>
          <p className="mt-2 text-sm font-body text-foreground-500">EMPRENOR GROUP — Editor de contenido</p>
        </div>

        {!configured ? (
          <div className="p-6 rounded-xl border border-amber-200 bg-amber-50">
            <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">Configuración pendiente</h2>
            <p className="text-sm font-body text-foreground-600 leading-relaxed mb-4">
              Para activar el panel, cree un proyecto en Supabase y copie las credenciales a un archivo <code className="text-xs bg-white px-1 py-0.5 rounded">.env</code> basado en <code className="text-xs bg-white px-1 py-0.5 rounded">.env.example</code>.
            </p>
            <ol className="text-sm font-body text-foreground-600 space-y-2 list-decimal list-inside">
              <li>Crear proyecto en supabase.com</li>
              <li>Ejecutar <code className="text-xs">scripts/supabase-schema.sql</code></li>
              <li>Crear usuario admin en Authentication</li>
              <li>Reiniciar <code className="text-xs">npm run dev</code></li>
            </ol>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 rounded-xl border border-background-200 bg-background-50 space-y-4">
            {error && (
              <p className="text-sm font-body text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</p>
            )}
            <div>
              <label htmlFor="admin-email" className="block text-sm font-body text-foreground-600 mb-1">Email</label>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-4 rounded-md border border-background-300 bg-white text-sm font-body focus:outline-none focus:border-accent-500"
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="block text-sm font-body text-foreground-600 mb-1">Contraseña</label>
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-4 rounded-md border border-background-300 bg-white text-sm font-body focus:outline-none focus:border-accent-500"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full h-11 bg-accent-500 hover:bg-accent-600 disabled:opacity-60 text-white text-sm font-body font-medium rounded-md transition-colors"
            >
              {submitting ? 'Ingresando…' : 'Ingresar'}
            </button>
          </form>
        )}

        <p className="text-center mt-6">
          <Link to="/" className="text-sm font-body text-foreground-500 hover:text-accent-500">← Volver al sitio</Link>
        </p>
      </div>
    </div>
  )
}
