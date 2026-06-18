import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

export type StaffRole = 'admin' | 'editor'

interface AdminAuthContextValue {
  user: User | null
  session: Session | null
  role: StaffRole | null
  isStaff: boolean
  loading: boolean
  configured: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

async function fetchStaffRole(userId: string): Promise<StaffRole | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle()
  if (error || !data?.role) return null
  return data.role === 'admin' || data.role === 'editor' ? data.role : null
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [role, setRole] = useState<StaffRole | null>(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!supabase) return

    let cancelled = false

    async function applySession(nextSession: Session | null) {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      if (!nextSession?.user) {
        setRole(null)
        setLoading(false)
        return
      }
      const staffRole = await fetchStaffRole(nextSession.user.id)
      if (!cancelled) {
        setRole(staffRole)
        setLoading(false)
      }
    }

    supabase.auth.getSession().then(({ data }) => {
      void applySession(data.session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setLoading(true)
      void applySession(nextSession)
    })

    return () => {
      cancelled = true
      listener.subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { error: 'Supabase no está configurado. Agregue VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env' }
    }
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setLoading(false)
      return { error: error.message }
    }
    const staffRole = data.user ? await fetchStaffRole(data.user.id) : null
    setRole(staffRole)
    setLoading(false)
    if (!staffRole) {
      await supabase.auth.signOut()
      return { error: 'Su cuenta no tiene permisos para acceder al panel.' }
    }
    return { error: null }
  }

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut()
    setRole(null)
  }

  const isStaff = role === 'admin' || role === 'editor'

  return (
    <AdminAuthContext.Provider
      value={{ user, session, role, isStaff, loading, configured: isSupabaseConfigured, signIn, signOut }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth debe usarse dentro de AdminAuthProvider')
  return ctx
}
