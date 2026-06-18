export default function ProveedorMisOfertas() {
  return (
    <div className="p-4 md:p-8">
      <header className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground-950">Mis ofertas</h1>
        <p className="text-sm font-body text-foreground-500 mt-1">Historial de propuestas enviadas</p>
      </header>
      <div className="rounded-2xl bg-white border border-background-200 p-8 text-center">
        <i className="ri-inbox-line text-4xl text-foreground-300 mb-3" />
        <p className="text-sm font-body text-foreground-500">
          Aún no tiene ofertas enviadas. Disponible en Sprint 2 con carga de itemizado y documentación.
        </p>
      </div>
    </div>
  )
}
