import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../../components/Logo'
import { PROVEEDOR_RUBROS, registerProveedor, type RegisterProveedorInput } from '../../lib/proveedor'
import { useProveedorAuth } from '../../proveedor/ProveedorAuthContext'

type Props = {
  mode: 'register' | 'complete'
  defaultEmail?: string
}

export default function ProveedorRegistroForm({ mode, defaultEmail = '' }: Props) {
  const { signUp, refreshOrg } = useProveedorAuth()
  const [form, setForm] = useState({
    razonSocial: '',
    cuit: '',
    email: defaultEmail,
    phone: '',
    address: '',
    city: '',
    province: 'Salta',
    contactName: '',
    website: '',
    password: '',
    password2: '',
    rubros: [] as string[],
  })
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const toggleRubro = (r: string) => {
    setForm((f) => ({
      ...f,
      rubros: f.rubros.includes(r) ? f.rubros.filter((x) => x !== r) : [...f.rubros, r],
    }))
  }

  const buildInput = (): RegisterProveedorInput => ({
    razonSocial: form.razonSocial,
    cuit: form.cuit,
    email: form.email,
    phone: form.phone,
    address: form.address,
    city: form.city,
    province: form.province,
    rubros: form.rubros,
    contactName: form.contactName,
    website: form.website,
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setInfo(null)

    if (form.rubros.length === 0) {
      setError('Seleccione al menos un rubro.')
      return
    }

    if (mode === 'register') {
      if (form.password.length < 8) {
        setError('La contraseña debe tener al menos 8 caracteres.')
        return
      }
      if (form.password !== form.password2) {
        setError('Las contraseñas no coinciden.')
        return
      }
    }

    setSubmitting(true)

    if (mode === 'register') {
      const sign = await signUp(form.email, form.password)
      if (sign.error) {
        setSubmitting(false)
        setError(sign.error)
        return
      }
      if (sign.needsEmailConfirm) {
        setSubmitting(false)
        setInfo('Revise su correo para confirmar la cuenta. Luego inicie sesión y complete el registro de su empresa.')
        return
      }
    }

    const result = await registerProveedor(buildInput())
    setSubmitting(false)

    if (!result.ok) {
      setError(result.error ?? 'Error al registrar')
      return
    }

    await refreshOrg()
    window.location.href = '/proveedor/pendiente'
  }

  return (
    <div className="min-h-screen flex flex-col bg-primary-500">
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo variant="light" size="lg" />
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-white">
              {mode === 'register' ? 'Registro de proveedor' : 'Complete su empresa'}
            </h1>
            <p className="mt-2 text-sm font-body text-white/70">
              Participe en licitaciones y presente ofertas digitales
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-2xl bg-white shadow-2xl space-y-5">
            {error && (
              <p className="text-sm font-body text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
            )}
            {info && (
              <p className="text-sm font-body text-primary-700 bg-primary-50 border border-primary-200 rounded-lg px-3 py-2">{info}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block md:col-span-2">
                <span className="text-xs font-body font-medium text-foreground-600">Razón social *</span>
                <input
                  required
                  value={form.razonSocial}
                  onChange={(e) => setForm({ ...form, razonSocial: e.target.value })}
                  className="mt-1 w-full h-10 px-3 rounded-lg border border-background-300 text-sm font-body"
                />
              </label>
              <label className="block">
                <span className="text-xs font-body font-medium text-foreground-600">CUIT *</span>
                <input
                  required
                  placeholder="30-12345678-9"
                  value={form.cuit}
                  onChange={(e) => setForm({ ...form, cuit: e.target.value })}
                  className="mt-1 w-full h-10 px-3 rounded-lg border border-background-300 text-sm font-body"
                />
              </label>
              <label className="block">
                <span className="text-xs font-body font-medium text-foreground-600">Email *</span>
                <input
                  required
                  type="email"
                  readOnly={mode === 'complete'}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 w-full h-10 px-3 rounded-lg border border-background-300 text-sm font-body read-only:bg-background-100"
                />
              </label>
              <label className="block">
                <span className="text-xs font-body font-medium text-foreground-600">Teléfono</span>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1 w-full h-10 px-3 rounded-lg border border-background-300 text-sm font-body"
                />
              </label>
              <label className="block">
                <span className="text-xs font-body font-medium text-foreground-600">Contacto</span>
                <input
                  value={form.contactName}
                  onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                  className="mt-1 w-full h-10 px-3 rounded-lg border border-background-300 text-sm font-body"
                />
              </label>
              <label className="block md:col-span-2">
                <span className="text-xs font-body font-medium text-foreground-600">Dirección</span>
                <input
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="mt-1 w-full h-10 px-3 rounded-lg border border-background-300 text-sm font-body"
                />
              </label>
              <label className="block">
                <span className="text-xs font-body font-medium text-foreground-600">Ciudad</span>
                <input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="mt-1 w-full h-10 px-3 rounded-lg border border-background-300 text-sm font-body"
                />
              </label>
              <label className="block">
                <span className="text-xs font-body font-medium text-foreground-600">Provincia</span>
                <input
                  value={form.province}
                  onChange={(e) => setForm({ ...form, province: e.target.value })}
                  className="mt-1 w-full h-10 px-3 rounded-lg border border-background-300 text-sm font-body"
                />
              </label>
            </div>

            <fieldset>
              <legend className="text-xs font-body font-medium text-foreground-600 mb-2">Rubros *</legend>
              <div className="flex flex-wrap gap-2">
                {PROVEEDOR_RUBROS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => toggleRubro(r)}
                    className={`px-3 py-1.5 rounded-full text-xs font-body border transition-colors ${
                      form.rubros.includes(r)
                        ? 'bg-accent-500 text-white border-accent-500'
                        : 'bg-white text-foreground-600 border-background-300 hover:border-accent-400'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </fieldset>

            {mode === 'register' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-background-200">
                <label className="block">
                  <span className="text-xs font-body font-medium text-foreground-600">Contraseña *</span>
                  <input
                    required
                    type="password"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="mt-1 w-full h-10 px-3 rounded-lg border border-background-300 text-sm font-body"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-body font-medium text-foreground-600">Confirmar contraseña *</span>
                  <input
                    required
                    type="password"
                    autoComplete="new-password"
                    value={form.password2}
                    onChange={(e) => setForm({ ...form, password2: e.target.value })}
                    className="mt-1 w-full h-10 px-3 rounded-lg border border-background-300 text-sm font-body"
                  />
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-11 bg-accent-500 hover:bg-accent-600 disabled:opacity-60 text-white text-sm font-body font-semibold rounded-lg"
            >
              {submitting ? 'Enviando…' : mode === 'register' ? 'Registrar empresa' : 'Guardar y continuar'}
            </button>

            <p className="text-center text-sm font-body text-foreground-500">
              ¿Ya tiene cuenta?{' '}
              <Link to="/proveedor/login" className="text-accent-600 hover:underline">
                Iniciar sesión
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
