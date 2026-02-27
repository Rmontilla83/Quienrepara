'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { HomeIcon, SearchIcon, MapIcon, UserIcon, SparkleIcon } from './Icons'
import { D, PL, PG } from '@/lib/theme'

export default function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, setShowAuth } = useAuth()

  const isActive = (path) => pathname === path

  const handleProfile = () => {
    if (user) router.push('/dashboard')
    else setShowAuth(true)
  }

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#fff', borderTop: '1px solid #e5e7eb',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      padding: '6px 0 max(env(safe-area-inset-bottom),8px)',
      zIndex: 50, boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
    }}>
      <NavBtn href="/" icon={<HomeIcon sz={22} c={isActive('/') ? D : '#9ca3af'} />} label="Inicio" active={isActive('/')} />
      <NavBtn href="/buscar" icon={<SearchIcon sz={22} c={isActive('/buscar') ? D : '#9ca3af'} />} label="Buscar" active={isActive('/buscar')} />
      <div style={{ position: 'relative', top: -18 }}>
        <Link href="/diagnostico" style={{
          width: 56, height: 56, borderRadius: '50%',
          border: '4px solid #f8fafc', background: PG, color: '#fff',
          fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: '0 4px 15px rgba(139,92,246,0.4)', textDecoration: 'none'
        }}>
          <SparkleIcon sz={26} c="#fff" fill="#fff" />
        </Link>
        <div style={{ textAlign: 'center', fontSize: 10, fontWeight: 600, color: isActive('/diagnostico') ? PL : '#9ca3af', marginTop: 2 }}>IA</div>
      </div>
      <NavBtn href="/mapa" icon={<MapIcon sz={22} c={isActive('/mapa') ? D : '#9ca3af'} />} label="Mapa" active={isActive('/mapa')} />
      <button onClick={handleProfile} style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
        border: 'none', background: 'none', cursor: 'pointer',
        color: isActive('/dashboard') ? D : '#9ca3af', padding: '4px 14px'
      }}>
        <UserIcon sz={22} c={isActive('/dashboard') ? D : '#9ca3af'} />
        <span style={{ fontSize: 10, fontWeight: isActive('/dashboard') ? 700 : 500 }}>Perfil</span>
      </button>
    </nav>
  )
}

function NavBtn({ href, icon, label, active }) {
  return (
    <Link href={href} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
      textDecoration: 'none', color: active ? D : '#9ca3af', padding: '4px 14px'
    }}>
      {icon}
      <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{label}</span>
    </Link>
  )
}
