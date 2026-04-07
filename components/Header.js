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
      background: '#fff', position: 'sticky', top: 0, zIndex: 50,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderBottom: '1px solid #f1f5f9',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56
      }}>
        <Link href="/" style={{ cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: Y, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 900, color: D
          }}>Q</div>
          <span style={{ fontWeight: 800, fontSize: 18, color: D, letterSpacing: '-0.3px' }}>
            Quién<span style={{ color: YD }}>Repara</span>
          </span>
        </Link>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link href="/para-reparadores" style={{
            padding: '7px 14px', borderRadius: 8,
            border: `1.5px solid ${Y}`, background: '#fffbeb',
            color: '#92400e', fontSize: 12, fontWeight: 700,
            cursor: 'pointer', textDecoration: 'none',
            transition: 'all 0.15s',
            display: 'none',
          }}
          className="header-repairer-link"
          >
            Soy Reparador
          </Link>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {userRole === 'admin' && (
                <span style={{
                  fontSize: 10, padding: '3px 8px', borderRadius: 6,
                  background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                  color: '#dc2626', fontWeight: 700, letterSpacing: '0.5px'
                }}>ADMIN</span>
              )}
              <button onClick={() => router.push('/dashboard')} style={{
                width: 36, height: 36, borderRadius: 12,
                border: '2px solid ' + avatarColor(user.email),
                background: avatarColor(user.email), display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 700,
                cursor: 'pointer', transition: 'transform 0.15s',
              }}>
                {initials(user.user_metadata?.full_name || user.email)}
              </button>
            </div>
          ) : (
            <button onClick={() => setShowAuth(true)} className="btn-press" style={{
              padding: '8px 18px', borderRadius: 10, border: 'none',
              background: D, color: '#fff', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.15s',
            }}>Entrar</button>
          )}
        </div>
      </div>
      <style>{`
        @media (min-width: 640px) {
          .header-repairer-link { display: inline-flex !important; }
        }
      `}</style>
    </header>
  )
}
