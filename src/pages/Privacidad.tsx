import Layout from '../components/Layout'
import PageHero from '../components/PageHero'
import { siteContact } from '../data/contacto'
import { usePageMeta } from '../hooks/usePageMeta'

export default function Privacidad() {
  usePageMeta({ title: 'Política de Privacidad' })

  return (
    <Layout>
      <PageHero title="Política de Privacidad" subtitle="Última actualización: Junio 2026" image="" />
      <section className="py-20 md:py-28 bg-background-100">
        <div className="w-full px-6 md:px-12">
          <div className="max-w-3xl mx-auto space-y-6 text-base font-body text-foreground-600 leading-relaxed">
            <p>EMPRENOR GROUP se compromete a proteger la privacidad de los datos personales de sus usuarios, clientes y proveedores, conforme a la Ley 25.326 de Protección de Datos Personales de la República Argentina.</p>
            <h2 className="font-heading text-2xl font-bold text-foreground-950">Recopilación de datos</h2>
            <p>Recopilamos información que usted nos proporciona voluntariamente a través de formularios de contacto, suscripción al newsletter y registro como proveedor.</p>
            <h2 className="font-heading text-2xl font-bold text-foreground-950">Uso de la información</h2>
            <p>Los datos recopilados se utilizan exclusivamente para responder consultas, enviar información sobre proyectos y licitaciones, y mejorar nuestros servicios.</p>
            <h2 className="font-heading text-2xl font-bold text-foreground-950">Conservación y seguridad</h2>
            <p>Los datos se almacenan en servidores con medidas de seguridad razonables. No compartimos información personal con terceros salvo obligación legal o consentimiento expreso del titular.</p>
            <h2 className="font-heading text-2xl font-bold text-foreground-950">Contacto</h2>
            <p>Para ejercer sus derechos de acceso, rectificación o supresión de datos, contacte a <a href={`mailto:${siteContact.email}`} className="text-accent-500 hover:text-accent-600">{siteContact.email}</a>.</p>
          </div>
        </div>
      </section>
    </Layout>
  )
}
