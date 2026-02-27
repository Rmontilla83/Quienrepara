'use client'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import RepairerCard from './RepairerCard'
import { CatIcon, CAT_COLORS_FULL, SparkleIcon } from './Icons'
import { Y, YD, PG, D } from '@/lib/theme'

export default function HomeClient({ repairers, categories, ad }) {
  const { user } = useAuth()
  const cats = [{ id: 'all', name: 'Todas', full_name: 'Todas' }, ...(categories || [])]
  const catName = (id) => cats.find(c => c.id === id)?.full_name || cats.find(c => c.id === id)?.name || id
  const premium = repairers.filter(r => r.is_premium)

  return (
    <div>
      {ad && (
        <div style={{ background: D, color: '#fff', padding: '8px 16px', fontSize: 13, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ background: Y, color: D, padding: '1px 8px', borderRadius: 4, fontWeight: 700, fontSize: 11 }}>AD</span>
          <span>{ad.content}</span>
        </div>
      )}

      {/* Hero */}
      <div style={{ background: `linear-gradient(180deg,${Y} 0%,${YD} 100%)`, padding: '28px 16px 52px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', background: '#fff', borderRadius: 20, padding: '36px 24px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}>
          <h1 style={{ textAlign: 'center', fontSize: 26, fontWeight: 800, margin: '0 0 24px', lineHeight: 1.3 }}>¿Qué necesitas reparar hoy?</h1>
          <Link href="/diagnostico" style={{
            width: '100%', padding: '18px 24px', borderRadius: 50, border: 'none',
            background: PG, color: '#fff', fontSize: 17, fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 10, boxShadow: '0 4px 20px rgba(139,92,246,0.35)', textDecoration: 'none'
          }}>
            <SparkleIcon sz={22} c="#fff" fill="#fff" /> Diagnosticar Falla con IA
          </Link>
          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 14, margin: '12px 0 20px' }}>Describe el problema y te decimos a quién llamar</p>

          {/* Categories */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
            {(categories || []).map(cat => (
              <Link key={cat.id} href={`/buscar?cat=${cat.id}`} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                padding: '12px 8px', borderRadius: 12, border: '1px solid #e5e7eb',
                background: '#fff', cursor: 'pointer', textDecoration: 'none', color: 'inherit',
                transition: 'background 0.15s'
              }}>
                <CatIcon id={cat.id} sz={28} />
                <span style={{ fontSize: 11, fontWeight: 600, textAlign: 'center', color: '#6b7280' }}>{cat.full_name || cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Repairers */}
      <div style={{ maxWidth: 600, margin: '-32px auto 0', padding: '0 16px', position: 'relative', zIndex: 10 }}>
        {premium.length > 0 && (
          <>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Destacados</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {premium.slice(0, 5).map(r => (
                <RepairerCard key={r.id} r={r} catName={catName(r.category_id)} />
              ))}
            </div>
          </>
        )}

        <Link href="/buscar" style={{
          display: 'block', padding: '14px', borderRadius: 12,
          border: '2px solid #e5e7eb', textAlign: 'center', textDecoration: 'none',
          color: D, fontWeight: 700, fontSize: 15, marginBottom: 24
        }}>
          Ver todos los reparadores
        </Link>

        {/* Disclaimer IA */}
        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 11, padding: '0 16px 8px', lineHeight: 1.5 }}>
          El diagnóstico IA es orientativo y no reemplaza la evaluación de un profesional.
        </p>
      </div>
    </div>
  )
}
