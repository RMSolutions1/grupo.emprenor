import Layout from '../components/Layout'
import PageHero from '../components/PageHero'
import { usePageMeta } from '../hooks/usePageMeta'

export default function Terminos() {
  usePageMeta({ title: 'Términos y Condiciones' })

  return (
    <Layout>
      <PageHero title="Términos y Condiciones" subtitle="Última actualización: Junio 2026" image="" breadcrumb={[{ label: 'Términos y Condiciones' }]} />
      <section className="py-20 md:py-28 bg-background-100">
        <div className="w-full px-6 md:px-12">
          <div className="max-w-3xl mx-auto space-y-6 text-base font-body text-foreground-600 leading-relaxed">
            <p>El acceso y uso de este sitio web implica la aceptación de los presentes términos y condiciones de EMPRENOR.</p>
            <h2 className="font-heading text-2xl font-bold text-foreground-950">Uso del sitio</h2>
            <p>El contenido de este sitio es de carácter informativo. Las imágenes, descripciones de proyectos y datos publicados tienen fines ilustrativos y pueden estar sujetos a actualización.</p>
            <h2 className="font-heading text-2xl font-bold text-foreground-950">Propiedad intelectual</h2>
            <p>Todos los contenidos, marcas, logotipos y diseños son propiedad de EMPRENOR y están protegidos por las leyes de propiedad intelectual vigentes.</p>
            <h2 className="font-heading text-2xl font-bold text-foreground-950">Limitación de responsabilidad</h2>
            <h2 className="font-heading text-2xl font-bold text-foreground-950">Formularios y comunicaciones</h2>
            <p>La información enviada a través de formularios de contacto, newsletter o registro de proveedores se utiliza únicamente para responder la consulta o gestionar la relación comercial solicitada.</p>
            <h2 className="font-heading text-2xl font-bold text-foreground-950">Modificaciones</h2>
            <p>EMPRENOR puede actualizar estos términos en cualquier momento. Las modificaciones entrarán en vigencia desde su publicación en este sitio.</p>
          </div>
        </div>
      </section>
    </Layout>
  )
}
