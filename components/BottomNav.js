'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { HomeIcon, SearchIcon, MapIcon, UserIcon, SparkleIcon } from './Icons'
import { D, PG } from '@/lib/theme'

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
      background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(0,0,0,0.06)',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      padding: '4px 0 max(env(safe-area-inset-bottom),6px)',
      zIndex: 50,
    }}>
      <NavBtn href="/" icon={<HomeIcon sz={22} c={isActive('/') ? D : '#94a3b8'} />} label="Inicio" active={isActive('/')} />
      <NavBtn href="/buscar" icon={<SearchIcon sz={22} c={isActive('/buscar') ? D : '#94a3b8'} />} label="Buscar" active={isActive('/buscar')} />
      <div style={{ position: 'relative', top: -14 }}>
        <Link href="/diagnostico" className="btn-press" style={{
          width: 52, height: 52, borderRadius: '50%',
          border: '3px solid #fff', background: PG, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: '0 4px 15px rgba(139,92,246,0.4)',
          textDecoration: 'none',
          animation: isActive('/diagnostico') ? 'none' : 'glow 3s infinite',
        }}>
          <SparkleIcon sz={24} c="#fff" fill="#fff" />
        </Link>
        <div style={{
          textAlign: 'center', fontSize: 10, fontWeight: 700,
          color: isActive('/diagnostico') ? '#8b5cf6' : '#94a3b8',
          marginTop: 2, letterSpacing: '0.5px'
        }}>IA</div>
      </div>
      <NavBtn href="/mapa" icon={<MapIcon sz={22} c={isActive('/mapa') ? D : '#94a3b8'} />} label="Mapa" active={isActive('/mapa')} />
      <button onClick={handleProfile} style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
        border: 'none', background: 'none', cursor: 'pointer',
        color: isActive('/dashboard') ? D : '#94a3b8', padding: '6px 14px'
      }}>
        <UserIcon sz={22} c={isActive('/dashboard') ? D : '#94a3b8'} />
        <span style={{ fontSize: 10, fontWeight: isActive('/dashboard') ? 700 : 500 }}>Perfil</span>
      </button>
    </nav>
  )
}

function NavBtn({ href, icon, label, active }) {
  return (
    <Link href={href} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
      textDecoration: 'none', color: active ? D : '#94a3b8', padding: '6px 14px',
      transition: 'color 0.15s',
    }}>
      {icon}
      <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{label}</span>
    </Link>
  )
}
