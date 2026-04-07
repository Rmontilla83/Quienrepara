'use client'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import RepairerCard from './RepairerCard'
import { CatIcon, CAT_COLORS_FULL, SparkleIcon } from './Icons'
import { Y, YD, YL, PG, PL, D } from '@/lib/theme'

export default function HomeClient({ repairers, categories, ad }) {
  const { user } = useAuth()
  const cats = [{ id: 'all', name: 'Todas', full_name: 'Todas' }, ...(categories || [])]
  const catName = (id) => cats.find(c => c.id === id)?.full_name || cats.find(c => c.id === id)?.name || id
  const premium = repairers.filter(r => r.is_premium)
  const totalRepairers = repairers.length

  const catDescriptions = {
    hogar: 'Aires, plomería, electricidad',
    electronica: 'Celulares, PCs, TVs',
    automotriz: 'Mecánica, frenos, A/C',
    servicios: 'Cerrajería, carpintería',
    salud: 'Equipos médicos',
  }

  return (
    <div>
      {ad && (
        <div style={{
          background: 'linear-gradient(90deg, #1e293b, #334155)', color: '#fff',
          padding: '10px 16px', fontSize: 13, textAlign: 'center',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap'
        }}>
          <span style={{
            background: Y, color: D, padding: '2px 8px', borderRadius: 4,
            fontWeight: 800, fontSize: 10, letterSpacing: '0.5px'
          }}>AD</span>
          <span>{ad.content}</span>
        </div>
      )}

      {/* Hero */}
      <div style={{
        background: `linear-gradient(170deg, ${Y} 0%, ${YD} 50%, #e88d00 100%)`,
        padding: '32px 16px 60px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: -40, right: -40, width: 160, height: 160,
          borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
        }} />
        <div style={{
          position: 'absolute', bottom: -20, left: -30, width: 100, height: 100,
          borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
        }} />

        <div style={{
          maxWidth: 600, margin: '0 auto', background: '#fff',
          borderRadius: 24, padding: '32px 20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          position: 'relative',
        }}>
          {/* Trust badge */}
          <div style={{
            display: 'flex', justifyContent: 'center', marginBottom: 20,
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#f0fdf4', border: '1px solid #bbf7d0',
              padding: '5px 14px', borderRadius: 50, fontSize: 12, color: '#166534', fontWeight: 600,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
              {totalRepairers}+ técnicos verificados activos
            </div>
          </div>

          <h1 style={{
            textAlign: 'center', fontSize: 28, fontWeight: 900,
            margin: '0 0 8px', lineHeight: 1.2, letterSpacing: '-0.5px',
            color: D,
          }}>
            ¿Qué necesitas{' '}
            <span style={{
              background: `linear-gradient(135deg, ${YD}, #d97706)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>reparar</span> hoy?
          </h1>
          <p style={{
            textAlign: 'center', color: '#64748b', fontSize: 15, margin: '0 0 24px',
            lineHeight: 1.5,
          }}>
            Describe tu problema y nuestra IA te conecta con el técnico ideal
          </p>

          {/* Main CTA */}
          <Link href="/diagnostico" className="btn-press" style={{
            width: '100%', padding: '16px 24px', borderRadius: 16, border: 'none',
            background: PG, color: '#fff', fontSize: 16, fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 10, boxShadow: '0 4px 20px rgba(139,92,246,0.35)', textDecoration: 'none',
            marginBottom: 12,
          }}>
            <SparkleIcon sz={20} c="#fff" fill="#fff" /> Diagnosticar con IA
          </Link>

          {/* Secondary CTA */}
          <Link href="/buscar" className="btn-press" style={{
            width: '100%', padding: '14px 24px', borderRadius: 16,
            border: '2px solid #e2e8f0', background: '#fff',
            color: D, fontSize: 15, fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 8, textDecoration: 'none', marginBottom: 24,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Buscar técnico directo
          </Link>

          {/* Categories grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
            {(categories || []).map((cat, i) => (
              <Link key={cat.id} href={`/buscar?cat=${cat.id}`}
                className="card-hover fade-up"
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  padding: '14px 8px', borderRadius: 14,
                  border: '1.5px solid #f1f5f9',
                  background: '#fff', cursor: 'pointer', textDecoration: 'none', color: 'inherit',
                  animationDelay: `${i * 0.05}s`,
                }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: (CAT_COLORS_FULL[cat.id] || '#6b7280') + '12',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <CatIcon id={cat.id} sz={24} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, textAlign: 'center', color: D }}>
                  {cat.name}
                </span>
                <span style={{ fontSize: 10, color: '#94a3b8', textAlign: 'center', lineHeight: 1.3 }}>
                  {catDescriptions[cat.id] || ''}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{
        maxWidth: 600, margin: '-24px auto 0', padding: '0 16px',
        position: 'relative', zIndex: 10,
      }}>
        <div className="fade-up" style={{
          background: '#fff', borderRadius: 20, border: '1px solid #f1f5f9',
          padding: '20px 16px', marginBottom: 16,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 14, color: '#64748b', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Cómo funciona
          </h3>
          <div style={{ display: 'flex', gap: 12 }}>
            {[
              { emoji: '💬', title: 'Describe', sub: 'Cuéntanos qué se dañó' },
              { emoji: '🤖', title: 'IA Analiza', sub: 'Diagnóstico al instante' },
              { emoji: '🔧', title: 'Conecta', sub: 'Te unimos al técnico' },
            ].map((step, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{step.emoji}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: D, marginBottom: 2 }}>{step.title}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.3 }}>{step.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Repairers */}
        {premium.length > 0 && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 8 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.3px' }}>
                Destacados
              </h2>
              <Link href="/buscar" style={{ fontSize: 13, fontWeight: 600, color: PL, textDecoration: 'none' }}>
                Ver todos →
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {premium.slice(0, 5).map((r, i) => (
                <div key={r.id} className="fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                  <RepairerCard r={r} catName={catName(r.category_id)} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* All repairers CTA */}
        <Link href="/buscar" className="btn-press" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '16px', borderRadius: 16,
          border: '2px solid #e2e8f0', background: '#fff',
          textDecoration: 'none', color: D, fontWeight: 700, fontSize: 15,
          marginBottom: 16,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
          </svg>
          Ver todos los reparadores
        </Link>

        {/* Repairer CTA */}
        <Link href="/para-reparadores" className="fade-up" style={{
          display: 'block', padding: '20px', borderRadius: 20,
          background: 'linear-gradient(135deg, #1e293b, #334155)',
          textDecoration: 'none', marginBottom: 16,
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'rgba(251,191,36,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, flexShrink: 0,
            }}>🔧</div>
            <div>
              <div style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 2 }}>
                ¿Eres reparador?
              </div>
              <div style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.4 }}>
                Regístrate gratis y recibe clientes en tu zona
              </div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        </Link>

        {/* Disclaimer */}
        <p style={{
          textAlign: 'center', color: '#cbd5e1', fontSize: 11,
          padding: '0 16px 12px', lineHeight: 1.5
        }}>
          El diagnóstico IA es orientativo y no reemplaza la evaluación de un profesional.
        </p>
      </div>
    </div>
  )
}
