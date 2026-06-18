import { Link } from 'react-router-dom'
import { useProveedorAuth } from '../../proveedor/ProveedorAuthContext'

export default function ProveedorDashboard() {
  const { organizacion } = useProveedorAuth()

  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-foreground-950">Bienvenido</h1>
        <p className="text-sm font-body text-foreground-500 mt-1">{organizacion?.razon_social}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link
          to="/proveedor/licitaciones"
          className="p-6 rounded-2xl bg-white border border-background-200 shadow-sm hover:border-accent-300 transition-colors group"
        >
          <i className="ri-file-list-3-line text-2xl text-accent-500 mb-3 block" />
          <h2 className="font-heading font-semibold text-foreground-950 group-hover:text-accent-600">Licitaciones abiertas</h2>
          <p className="text-sm font-body text-foreground-500 mt-1">Descargue pliegos y presente ofertas</p>
        </Link>
        <Link
          to="/proveedor/mis-ofertas"
          className="p-6 rounded-2xl bg-white border border-background-200 shadow-sm hover:border-accent-300 transition-colors group"
        >
          <i className="ri-send-plane-line text-2xl text-secondary-500 mb-3 block" />
          <h2 className="font-heading font-semibold text-foreground-950 group-hover:text-accent-600">Mis ofertas</h2>
          <p className="text-sm font-body text-foreground-500 mt-1">Seguimiento de propuestas enviadas</p>
        </Link>
        <div className="p-6 rounded-2xl bg-primary-50 border border-primary-100">
          <i className="ri-shield-check-line text-2xl text-primary-600 mb-3 block" />
          <h2 className="font-heading font-semibold text-foreground-950">Empresa aprobada</h2>
          <p className="text-sm font-body text-foreground-500 mt-1">CUIT {organizacion?.cuit}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-background-200 p-6">
        <h3 className="font-heading font-semibold text-foreground-950 mb-2">Próximamente — Sprint 2</h3>
        <p className="text-sm font-body text-foreground-600">
          Envío de ofertas con itemizado, Gantt y anexos técnicos desde este portal. Por ahora puede consultar licitaciones públicas.
        </p>
      </div>
    </div>
  )
}
