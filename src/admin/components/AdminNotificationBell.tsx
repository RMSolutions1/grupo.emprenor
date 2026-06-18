import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { AdminNotification } from '../hooks/useAdminNotifications'

const kindIcons: Record<AdminNotification['kind'], string> = {
  contact: 'ri-message-3-line',
  callback: 'ri-phone-line',
  newsletter: 'ri-mail-send-line',
  licitacion: 'ri-file-list-3-line',
}

const kindLabels: Record<AdminNotification['kind'], string> = {
  contact: 'Consulta',
  callback: 'Callback',
  newsletter: 'Newsletter',
  licitacion: 'Licitación',
}

export default function AdminNotificationBell({
  count,
  items,
  loading,
  onRefresh,
}: {
  count: number
  items: AdminNotification[]
  loading?: boolean
  onRefresh: () => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v)
          if (!open) onRefresh()
        }}
        className="relative inline-flex items-center justify-center w-9 h-9 rounded-lg text-foreground-600 hover:bg-background-100 border border-background-200 transition-colors"
        aria-label={count > 0 ? `${count} notificaciones nuevas` : 'Notificaciones'}
      >
        <i className={`ri-notification-3-line text-lg ${loading ? 'opacity-50' : ''}`} />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-white">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[min(100vw-2rem,380px)] rounded-2xl bg-white border border-background-200 shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-background-200 bg-background-50">
            <div>
              <p className="text-sm font-body font-semibold text-foreground-900">Notificaciones</p>
              <p className="text-[11px] font-body text-foreground-500">
                {count > 0 ? `${count} pendientes` : 'Sin pendientes'}
              </p>
            </div>
            <Link
              to="/admin/consultas"
              onClick={() => setOpen(false)}
              className="text-xs font-body text-accent-600 hover:text-accent-700"
            >
              Bandeja →
            </Link>
          </div>

          <div className="max-h-[360px] overflow-y-auto divide-y divide-background-100">
            {items.length === 0 ? (
              <div className="p-8 text-center">
                <i className="ri-inbox-line text-2xl text-foreground-300" />
                <p className="text-sm font-body text-foreground-500 mt-2">No hay actividad reciente</p>
              </div>
            ) : (
              items.map((item) => (
                <Link
                  key={`${item.kind}-${item.id}`}
                  to={item.link}
                  onClick={() => setOpen(false)}
                  className={`flex items-start gap-3 px-4 py-3 hover:bg-background-50 transition-colors ${item.unread ? 'bg-accent-50/30' : ''}`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${item.unread ? 'bg-accent-100' : 'bg-background-200'}`}>
                    <i className={`${kindIcons[item.kind]} text-sm ${item.unread ? 'text-accent-600' : 'text-foreground-500'}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-body font-medium text-foreground-900 truncate">{item.title}</p>
                      {item.unread && <span className="w-2 h-2 rounded-full bg-accent-500 shrink-0" />}
                    </div>
                    <p className="text-xs font-body text-foreground-500 truncate">{item.subtitle}</p>
                    <p className="text-[10px] font-body text-foreground-400 mt-0.5">
                      {kindLabels[item.kind]} · {new Date(item.createdAt).toLocaleString('es-AR')}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
