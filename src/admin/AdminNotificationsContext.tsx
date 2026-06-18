import { createContext, useContext, type ReactNode } from 'react'
import { useAdminNotifications, type AdminNotification, type AdminNotificationCounts } from './hooks/useAdminNotifications'
import type { ContactSubmission, LicitacionConsulta } from '../lib/cms'

type AdminNotificationsContextValue = {
  loading: boolean
  items: AdminNotification[]
  counts: AdminNotificationCounts
  contacts: ContactSubmission[]
  licitaciones: LicitacionConsulta[]
  refresh: () => Promise<void>
}

const AdminNotificationsContext = createContext<AdminNotificationsContextValue | null>(null)

export function AdminNotificationsProvider({ children }: { children: ReactNode }) {
  const value = useAdminNotifications()
  return <AdminNotificationsContext.Provider value={value}>{children}</AdminNotificationsContext.Provider>
}

export function useAdminNotificationsContext() {
  const ctx = useContext(AdminNotificationsContext)
  if (!ctx) {
    throw new Error('useAdminNotificationsContext debe usarse dentro de AdminNotificationsProvider')
  }
  return ctx
}
