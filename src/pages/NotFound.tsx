import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { usePageMeta } from '../hooks/usePageMeta'

export default function NotFound() {
  usePageMeta({ title: 'Página no encontrada' })

  return (
    <Layout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 pt-20 text-center">
        <p className="text-accent-500 text-sm font-body font-semibold uppercase tracking-wider mb-3">Error 404</p>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground-950 mb-4">Página no encontrada</h1>
        <p className="text-base font-body text-foreground-600 max-w-md mb-8">
          La ruta que buscás no existe o fue movida.
        </p>
        <Link to="/" className="px-8 py-3 bg-accent-500 hover:bg-accent-600 text-white text-sm font-body font-medium rounded-md transition-colors">
          Volver al inicio
        </Link>
      </div>
    </Layout>
  )
}
