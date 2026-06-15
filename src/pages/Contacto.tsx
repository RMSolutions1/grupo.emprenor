import { type FormEvent, useState } from 'react'
import Layout, { SectionHeading } from '../components/Layout'
import PageHero from '../components/PageHero'
import FormNotice from '../components/FormNotice'
import { IMAGES } from '../data/images'
import { interestAreas } from '../data/contacto'
import { useSiteContact, useContactAreas } from '../context/ContentContext'
import { submitContact, submitCallback } from '../lib/contact'
import { usePageMeta } from '../hooks/usePageMeta'

export default function Contacto() {
  const siteContact = useSiteContact()
  const contactAreas = useContactAreas()
  const [submitted, setSubmitted] = useState(false)
  const [callbackSubmitted, setCallbackSubmitted] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  usePageMeta({
    title: 'Contacto',
    description: 'Comuníquese con EMPRENOR GROUP para consultas de ingeniería, construcción, energía y licitaciones.',
  })

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const form = new FormData(e.currentTarget)
    const result = await submitContact({
      name: String(form.get('name') ?? ''),
      email: String(form.get('email') ?? ''),
      phone: String(form.get('phone') ?? '') || undefined,
      organization: String(form.get('organization') ?? '') || undefined,
      area: String(form.get('area') ?? ''),
      message: String(form.get('message') ?? ''),
    })
    setSubmitting(false)
    if (result.ok) setSubmitted(true)
    else setError(result.error ?? 'No se pudo enviar la consulta')
  }

  const handleCallback = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const form = new FormData(e.currentTarget)
    const result = await submitCallback({
      name: String(form.get('name') ?? ''),
      phone: String(form.get('phone') ?? ''),
      schedule: String(form.get('schedule') ?? '') || undefined,
    })
    setSubmitting(false)
    if (result.ok) setCallbackSubmitted(true)
    else setError(result.error ?? 'No se pudo enviar la solicitud')
  }

  return (
    <Layout>
      <PageHero
        label="Contacto"
        title="Hablemos de su próximo proyecto"
        subtitle="Estamos listos para escuchar sus necesidades y encontrar la mejor solución de ingeniería, construcción o energía para su organización."
        image={IMAGES.contactoHero}
      />

      <section className="py-20 md:py-28 bg-background-100">
        <div className="w-full px-6 md:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <SectionHeading
                title="Envíenos su consulta"
                subtitle="Complete el formulario y un asesor especializado se pondrá en contacto a la brevedad."
              />
              <div className="p-8 rounded-xl border border-background-200 bg-background-50">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-accent-100 mx-auto mb-6">
                      <i className="ri-check-line text-2xl text-accent-500" />
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-foreground-950 mb-3">¡Consulta enviada!</h3>
                    <p className="text-base font-body text-foreground-600">Un asesor especializado se pondrá en contacto a la brevedad.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5" aria-label="Formulario de contacto">
                    {error && <p className="text-sm font-body text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</p>}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact-name" className="block text-sm font-body text-foreground-600 mb-1">Nombre completo *</label>
                        <input id="contact-name" name="name" required type="text" placeholder="Ing. Juan Pérez" className="w-full h-11 px-4 rounded-md border border-background-300 bg-background-100 text-sm font-body focus:outline-none focus:border-accent-500 transition-colors" />
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="block text-sm font-body text-foreground-600 mb-1">Correo electrónico *</label>
                        <input id="contact-email" name="email" required type="email" placeholder="juan@empresa.com.ar" className="w-full h-11 px-4 rounded-md border border-background-300 bg-background-100 text-sm font-body focus:outline-none focus:border-accent-500 transition-colors" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact-phone" className="block text-sm font-body text-foreground-600 mb-1">Teléfono</label>
                        <input id="contact-phone" name="phone" type="tel" placeholder={siteContact.primaryPhone.display} className="w-full h-11 px-4 rounded-md border border-background-300 bg-background-100 text-sm font-body focus:outline-none focus:border-accent-500 transition-colors" />
                      </div>
                      <div>
                        <label htmlFor="contact-org" className="block text-sm font-body text-foreground-600 mb-1">Organización</label>
                        <input id="contact-org" name="organization" type="text" placeholder="Nombre de su empresa u organismo" className="w-full h-11 px-4 rounded-md border border-background-300 bg-background-100 text-sm font-body focus:outline-none focus:border-accent-500 transition-colors" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="contact-area" className="block text-sm font-body text-foreground-600 mb-1">Área de interés *</label>
                      <select id="contact-area" name="area" required defaultValue="" className="w-full h-11 px-4 rounded-md border border-background-300 bg-background-100 text-sm font-body focus:outline-none focus:border-accent-500 transition-colors">
                        <option value="" disabled>Seleccione un área</option>
                        {interestAreas.map((area) => (
                          <option key={area.value} value={area.value}>{area.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="contact-message" className="block text-sm font-body text-foreground-600 mb-1">Mensaje *</label>
                      <textarea
                        id="contact-message"
                        name="message"
                        required
                        rows={5}
                        maxLength={500}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-4 py-3 rounded-md border border-background-300 bg-background-100 text-sm font-body focus:outline-none focus:border-accent-500 transition-colors resize-none"
                        placeholder="Describa brevemente su proyecto o consulta. Máximo 500 caracteres."
                        aria-describedby="contact-message-count"
                      />
                      <p id="contact-message-count" className="text-xs font-body text-foreground-400 mt-1">{message.length} / 500 caracteres</p>
                    </div>
                    <button type="submit" disabled={submitting} className="w-full sm:w-auto px-10 h-12 bg-accent-500 hover:bg-accent-600 disabled:opacity-60 text-white text-sm font-body font-medium rounded-md transition-all duration-300">
                      {submitting ? 'Enviando…' : 'Enviar consulta'}
                    </button>
                    <FormNotice />
                  </form>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-heading text-2xl font-bold text-foreground-950 mb-6">Información de Contacto</h3>
              <div className="space-y-6 p-6 rounded-xl border border-background-200 bg-background-50">
                <div>
                  <p className="text-sm font-body font-medium text-foreground-500 mb-1">Dirección</p>
                  <p className="text-sm font-body text-foreground-700 leading-relaxed">
                    {siteContact.address.lines.map((line) => (
                      <span key={line} className="block">{line}</span>
                    ))}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-body font-medium text-foreground-500 mb-2">Teléfonos</p>
                  {siteContact.phones.map((phone) => (
                    <a key={phone.href} href={phone.href} className="block text-sm font-body text-foreground-700 hover:text-accent-500 transition-colors mt-1 first:mt-0">{phone.display}</a>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-body font-medium text-foreground-500 mb-2">Correo Electrónico</p>
                  <a href={`mailto:${siteContact.email}`} className="block text-sm font-body text-foreground-700 hover:text-accent-500 transition-colors">{siteContact.email}</a>
                  <a href={`mailto:${siteContact.licitacionesEmail}`} className="block text-sm font-body text-foreground-700 hover:text-accent-500 transition-colors mt-1">{siteContact.licitacionesEmail}</a>
                </div>
                <div>
                  <p className="text-sm font-body font-medium text-foreground-500 mb-1">Horario de Atención</p>
                  <p className="text-sm font-body text-foreground-700">{siteContact.hours.weekdays}</p>
                  <p className="text-sm font-body text-foreground-700">{siteContact.hours.saturday}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-background-50">
        <div className="w-full px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <SectionHeading
              title="Áreas de Contacto Directo"
              subtitle="Comuníquese directamente con el área que mejor se adapte a su necesidad."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactAreas.map((area) => (
                <a
                  key={area.title}
                  href={`mailto:${area.email}`}
                  className="group p-6 rounded-xl border border-background-200 bg-background-100 hover:border-accent-300 transition-all duration-300"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-accent-100/70 mb-4 group-hover:bg-accent-500 transition-colors duration-300">
                    <i className={`${area.icon} text-lg text-accent-500 group-hover:text-white transition-colors duration-300`} />
                  </div>
                  <h4 className="font-heading text-lg font-semibold text-foreground-950 mb-2">{area.title}</h4>
                  <p className="text-sm font-body text-foreground-600 leading-relaxed mb-3">{area.description}</p>
                  <span className="text-sm font-body text-accent-500 group-hover:text-accent-600">{area.email}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-background-100">
        <div className="w-full px-6 md:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <SectionHeading
              title="¿Prefiere que lo llamemos?"
              subtitle="Déjenos sus datos y un representante se comunicará en el horario que usted indique."
              align="center"
            />
            {callbackSubmitted ? (
              <p className="text-base font-body text-accent-500">¡Gracias! Nos comunicaremos con usted pronto.</p>
            ) : (
              <form onSubmit={handleCallback} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left" aria-label="Formulario de callback">
                {error && !submitted && <p className="sm:col-span-2 text-sm font-body text-red-600">{error}</p>}
                <div>
                  <label htmlFor="callback-name" className="sr-only">Nombre</label>
                  <input id="callback-name" name="name" required type="text" placeholder="Nombre" className="w-full h-11 px-4 rounded-md border border-background-300 bg-background-50 text-sm font-body focus:outline-none focus:border-accent-500" />
                </div>
                <div>
                  <label htmlFor="callback-phone" className="sr-only">Teléfono</label>
                  <input id="callback-phone" name="phone" required type="tel" placeholder="Teléfono" className="w-full h-11 px-4 rounded-md border border-background-300 bg-background-50 text-sm font-body focus:outline-none focus:border-accent-500" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="callback-schedule" className="sr-only">Horario preferido</label>
                  <input id="callback-schedule" name="schedule" type="text" placeholder="Horario preferido" className="w-full h-11 px-4 rounded-md border border-background-300 bg-background-50 text-sm font-body focus:outline-none focus:border-accent-500" />
                </div>
                <button type="submit" disabled={submitting} className="sm:col-span-2 h-12 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white text-sm font-body font-medium rounded-md transition-all duration-300">
                  {submitting ? 'Enviando…' : 'Solicitar llamada'}
                </button>
                <div className="sm:col-span-2">
                  <FormNotice />
                </div>
              </form>
            )}
            <p className="mt-8 text-sm font-body text-foreground-500">
              {siteContact.hours.weekdays} | {siteContact.hours.saturday}
            </p>
          </div>
        </div>
      </section>
    </Layout>
  )
}
