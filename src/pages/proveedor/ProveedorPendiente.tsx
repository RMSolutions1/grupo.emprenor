import { Link } from 'react-router-dom'
import { ORG_STATUS_LABELS } from '../../lib/proveedor'
import { useProveedorAuth } from '../../proveedor/ProveedorAuthContext'

export default function ProveedorPendiente() {
  const { organizacion, signOut } = useProveedorAuth()

  const status = organizacion?.status ?? 'pendiente'
  const isRejected = status === 'rechazado' || status === 'suspendido'

  return (
    <div className="min-h-screen flex flex-col bg-background-50">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg text-center">
          <div
            className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
              isRejected ? 'bg-red-100 text-red-600' : 'bg-secondary-100 text-secondary-600'
            }`}
          >
            <i className={`text-3xl ${isRejected ? 'ri-close-circle-line' : 'ri-time-line'}`} />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground-950 mb-2">
            {isRejected ? 'Registro no aprobado' : 'Registro en revisión'}
          </h1>
          <p className="text-sm font-body text-foreground-600 leading-relaxed mb-4">
            {organizacion ? (
              <>
                <strong>{organizacion.razon_social}</strong> — {ORG_STATUS_LABELS[status]}.
              </>
            ) : (
              'Complete los datos de su empresa para continuar.'
            )}
          </p>
          {organizacion?.status_note && (
            <p className="text-sm font-body text-foreground-500 bg-background-100 rounded-lg px-4 py-3 mb-4">
              {organizacion.status_note}
            </p>
          )}
          {!isRejected && (
            <p className="text-sm font-body text-foreground-500 mb-6">
              EMPRENOR revisará su documentación. Recibirá acceso al portal cuando su empresa sea aprobada.
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {!organizacion && (
              <Link
                to="/proveedor/completar-registro"
                className="inline-flex h-10 items-center justify-center px-5 rounded-lg bg-accent-500 text-white text-sm font-body font-medium"
              >
                Completar registro
              </Link>
            )}
            <button
              type="button"
              onClick={() => void signOut()}
              className="inline-flex h-10 items-center justify-center px-5 rounded-lg border border-background-300 text-sm font-body text-foreground-700"
            >
              Cerrar sesión
            </button>
            <Link
              to="/licitaciones"
              className="inline-flex h-10 items-center justify-center px-5 rounded-lg border border-background-300 text-sm font-body text-foreground-700"
            >
              Ver licitaciones públicas
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
