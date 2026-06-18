import { Link } from 'react-router-dom'
import { useLicitacionesData } from '../../context/ContentContext'

export default function ProveedorLicitaciones() {
  const { licitaciones } = useLicitacionesData()
  const abiertas = licitaciones.filter((l) => l.status === 'Publicada')

  return (
    <div className="p-4 md:p-8">
      <header className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground-950">Licitaciones abiertas</h1>
        <p className="text-sm font-body text-foreground-500 mt-1">Llamados vigentes para presentar oferta digital</p>
      </header>

      {abiertas.length === 0 ? (
        <p className="text-sm font-body text-foreground-500">No hay licitaciones publicadas en este momento.</p>
      ) : (
        <ul className="space-y-3">
          {abiertas.map((lic) => (
            <li key={lic.id}>
              <Link
                to={`/licitaciones/${lic.id}`}
                className="block p-4 rounded-xl bg-white border border-background-200 hover:border-accent-300 transition-colors"
              >
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-foreground-400">{lic.code}</span>
                  <span className="text-xs font-body text-accent-600">{lic.category}</span>
                </div>
                <h2 className="font-heading font-semibold text-foreground-950">{lic.title}</h2>
                <p className="text-sm font-body text-foreground-500 mt-1">Cierre: {lic.cierre} · {lic.location}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
