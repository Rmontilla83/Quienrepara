'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAuth, setShowAuth] = useState(false)

  useEffect(() => {
    const sb = getSupabaseClient()
    if (!sb) { setLoading(false); return }

    sb.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        loadRole(session.user.id)
      }
      setLoading(false)
    })

    const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        loadRole(session.user.id)
      } else {
        setUser(null)
        setUserRole(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadRole(uid) {
    const sb = getSupabaseClient()
    if (!sb) return
    const { data } = await sb.from('profiles').select('role').eq('id', uid).single()
    if (data) setUserRole(data.role)
  }

  async function logout() {
    const sb = getSupabaseClient()
    if (!sb) return
    await sb.auth.signOut()
    setUser(null)
    setUserRole(null)
  }

  return (
    <AuthContext.Provider value={{ user, userRole, loading, showAuth, setShowAuth, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
