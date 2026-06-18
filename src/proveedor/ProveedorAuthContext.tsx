import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { fetchMyOrganizacion, type Organizacion } from '../lib/proveedor'

interface ProveedorAuthContextValue {
  user: User | null
  session: Session | null
  organizacion: Organizacion | null
  isProvider: boolean
  isApproved: boolean
  needsOrg: boolean
  loading: boolean
  configured: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string) => Promise<{ error: string | null; needsEmailConfirm: boolean }>
  signOut: () => Promise<void>
  refreshOrg: () => Promise<void>
}

const ProveedorAuthContext = createContext<ProveedorAuthContextValue | null>(null)

async function fetchProviderProfile(userId: string): Promise<boolean> {
  if (!supabase) return false
  const { data } = await supabase.from('profiles').select('role').eq('id', userId).maybeSingle()
  return data?.role === 'provider'
}

export function ProveedorAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [organizacion, setOrganizacion] = useState<Organizacion | null>(null)
  const [isProvider, setIsProvider] = useState(false)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  const loadOrg = async (provider: boolean) => {
    if (!provider) {
      setOrganizacion(null)
      return
    }
    const org = await fetchMyOrganizacion()
    setOrganizacion(org)
  }

  useEffect(() => {
    if (!supabase) return

    let cancelled = false

    async function applySession(next: Session | null) {
      setSession(next)
      setUser(next?.user ?? null)
      if (!next?.user) {
        setIsProvider(false)
        setOrganizacion(null)
        setLoading(false)
        return
      }
      const provider = await fetchProviderProfile(next.user.id)
      if (cancelled) return
      setIsProvider(provider)
      await loadOrg(provider)
      if (!cancelled) setLoading(false)
    }

    supabase.auth.getSession().then(({ data }) => void applySession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, next) => {
      setLoading(true)
      void applySession(next)
    })

    return () => {
      cancelled = true
      listener.subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!supabase) return { error: 'Supabase no configurado' }
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setLoading(false)
      return { error: error.message }
    }
    const provider = data.user ? await fetchProviderProfile(data.user.id) : false
    setIsProvider(provider)
    await loadOrg(provider)
    setLoading(false)
    if (data.user && !provider) {
      await supabase.auth.signOut()
      return { error: 'Esta cuenta no es de proveedor. Use el panel de administración si es staff.' }
    }
    return { error: null }
  }

  const signUp = async (email: string, password: string) => {
    if (!supabase) return { error: 'Supabase no configurado', needsEmailConfirm: false }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role: 'provider' } },
    })
    if (error) return { error: error.message, needsEmailConfirm: false }
    const needsEmailConfirm = !data.session
    if (data.session) {
      setSession(data.session)
      setUser(data.user)
      setIsProvider(true)
    }
    return { error: null, needsEmailConfirm }
  }

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut()
    setOrganizacion(null)
    setIsProvider(false)
  }

  const refreshOrg = async () => {
    await loadOrg(isProvider)
  }

  const isApproved = organizacion?.status === 'aprobado'
  const needsOrg = isProvider && !organizacion

  return (
    <ProveedorAuthContext.Provider
      value={{
        user,
        session,
        organizacion,
        isProvider,
        isApproved,
        needsOrg,
        loading,
        configured: isSupabaseConfigured,
        signIn,
        signUp,
        signOut,
        refreshOrg,
      }}
    >
      {children}
    </ProveedorAuthContext.Provider>
  )
}

export function useProveedorAuth() {
  const ctx = useContext(ProveedorAuthContext)
  if (!ctx) throw new Error('useProveedorAuth debe usarse dentro de ProveedorAuthProvider')
  return ctx
}
