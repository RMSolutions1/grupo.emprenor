import { useGlobalCopy } from '../context/ContentContext'

export default function WhatsAppButton() {
  const global = useGlobalCopy()
  const wa = global.whatsapp

  if (!wa?.enabled || !wa.phone) return null

  const href = `https://wa.me/${wa.phone.replace(/\D/g, '')}?text=${encodeURIComponent(wa.message || '')}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg shadow-black/20 transition-all duration-300 hover:scale-105"
      aria-label="Contactar por WhatsApp"
    >
      <i className="ri-whatsapp-line text-2xl" />
    </a>
  )
}
