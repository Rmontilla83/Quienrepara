'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { initials, avatarColor } from '@/lib/utils'
import { Y, YD, D } from '@/lib/theme'

export default function Header() {
  const router = useRouter()
  const { user, userRole, setShowAuth } = useAuth()

  return (
    <header style={{
      background: Y, position: 'sticky', top: 0, zIndex: 50,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderBottom: `3px solid ${YD}`
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 52
      }}>
        <Link href="/" style={{ cursor: 'pointer', textDecoration: 'none' }}>
          <span style={{ fontWeight: 900, fontSize: 21, color: D }}>QuienRepara</span>
        </Link>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {userRole === 'admin' && <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: '#fef2f2', color: '#dc2626', fontWeight: 700 }}>ADMIN</span>}
              <button onClick={() => router.push('/dashboard')} style={{
                width: 32, height: 32, borderRadius: '50%', border: '2px solid ' + D,
                background: avatarColor(user.email), display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer'
              }}>
                {initials(user.user_metadata?.full_name || user.email)}
              </button>
            </div>
          ) : (
            <button onClick={() => setShowAuth(true)} style={{
              padding: '6px 16px', borderRadius: 20, border: 'none',
              background: D, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer'
            }}>Iniciar Sesión</button>
          )}
        </div>
      </div>
    </header>
  )
}
