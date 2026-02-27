'use client'
import { Analytics } from '@vercel/analytics/react'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import Header from './Header'
import BottomNav from './BottomNav'
import AuthModal from './AuthModal'

function LayoutInner({ children }) {
  const { showAuth, setShowAuth, setUser } = useAuth()

  return (
    <>
      <Header />
      <main style={{ paddingBottom: 80 }}>{children}</main>
      <BottomNav />
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onAuth={(u) => { setUser(u); setShowAuth(false) }}
        />
      )}
      <Analytics />
    </>
  )
}

export default function LayoutClient({ children }) {
  return (
    <AuthProvider>
      <LayoutInner>{children}</LayoutInner>
    </AuthProvider>
  )
}
