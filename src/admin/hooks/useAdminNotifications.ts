import { useCallback, useEffect, useRef, useState } from 'react'
import {
  fetchAllLicitacionConsultas,
  fetchContactSubmissions,
  type ContactSubmission,
  type LicitacionConsulta,
} from '../../lib/cms'
import { useAdminReady } from './useAdminReady'

export type AdminNotification = {
  id: string
  kind: 'contact' | 'callback' | 'newsletter' | 'licitacion'
  title: string
  subtitle: string
  createdAt: string
  unread: boolean
  link: string
}

export type AdminNotificationCounts = {
  total: number
  contactUnread: number
  licitacionPending: number
  contactTotal: number
  licitacionTotal: number
}

const POLL_MS = 45_000

function buildNotifications(
  contacts: ContactSubmission[],
  licitaciones: LicitacionConsulta[],
): AdminNotification[] {
  const contactItems: AdminNotification[] = contacts.map((c) => ({
    id: c.id,
    kind: c.type,
    title: c.name || c.email || 'Sin nombre',
    subtitle:
      c.type === 'newsletter'
        ? 'Suscripción newsletter'
        : c.type === 'callback'
          ? 'Solicitud de llamada'
          : c.message?.slice(0, 80) || 'Consulta de contacto',
    createdAt: c.created_at,
    unread: !c.read,
    link: `/admin/consultas?tab=${c.type}&id=${c.id}`,
  }))

  const licItems: AdminNotification[] = licitaciones.map((l) => ({
    id: l.id,
    kind: 'licitacion',
    title: `${l.name} · ${l.licitacion_id}`,
    subtitle: l.question.slice(0, 80),
    createdAt: l.created_at,
    unread: !l.read && l.status === 'pending',
    link: `/admin/consultas?tab=licitaciones&id=${l.id}`,
  }))

  return [...contactItems, ...licItems]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 20)
}

function computeCounts(contacts: ContactSubmission[], licitaciones: LicitacionConsulta[]): AdminNotificationCounts {
  const contactUnread = contacts.filter((c) => !c.read).length
  const licitacionPending = licitaciones.filter((l) => !l.read && l.status === 'pending').length
  return {
    total: contactUnread + licitacionPending,
    contactUnread,
    licitacionPending,
    contactTotal: contacts.length,
    licitacionTotal: licitaciones.length,
  }
}

export function useAdminNotifications() {
  const { ready } = useAdminReady()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<AdminNotification[]>([])
  const [counts, setCounts] = useState<AdminNotificationCounts>({
    total: 0,
    contactUnread: 0,
    licitacionPending: 0,
    contactTotal: 0,
    licitacionTotal: 0,
  })
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [licitaciones, setLicitaciones] = useState<LicitacionConsulta[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const load = useCallback(async () => {
    const [c, l] = await Promise.all([fetchContactSubmissions(), fetchAllLicitacionConsultas()])
    setContacts(c)
    setLicitaciones(l)
    setItems(buildNotifications(c, l))
    setCounts(computeCounts(c, l))
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!ready) return
    load()
    intervalRef.current = setInterval(load, POLL_MS)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [ready, load])

  return { loading, items, counts, contacts, licitaciones, refresh: load }
}
