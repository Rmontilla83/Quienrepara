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

      {/* === HERO === */}
      <div className="hero-warm" style={{ padding: '48px 16px 40px', minHeight: 500 }}>
        {/* Floating geometric shapes */}
        <div style={{
          position: 'absolute', top: '12%', left: '6%',
          width: 40, height: 40, borderRadius: 10, border: '2px solid rgba(255,255,255,0.08)',
          animation: 'orbFloat 8s ease-in-out infinite', transform: 'rotate(15deg)',
        }} />
        <div style={{
          position: 'absolute', top: '20%', right: '10%',
          width: 24, height: 24, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.06)',
          animation: 'orbFloat 10s ease-in-out infinite 1s',
        }} />
        <div style={{
          position: 'absolute', bottom: '25%', left: '12%',
          width: 16, height: 16, borderRadius: 4, background: 'rgba(255,255,255,0.04)',
          animation: 'orbFloat 7s ease-in-out infinite 2s', transform: 'rotate(45deg)',
        }} />
        <div style={{
          position: 'absolute', top: '55%', right: '8%',
          width: 32, height: 32, borderRadius: 8, border: '1.5px solid rgba(255,255,255,0.05)',
          animation: 'orbFloat 9s ease-in-out infinite 0.5s', transform: 'rotate(-10deg)',
        }} />

        <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          {/* Trust counter */}
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.12)',
              padding: '8px 18px', borderRadius: 50,
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%', background: '#22c55e',
                display: 'inline-block', position: 'relative',
              }}>
                <span style={{
                  position: 'absolute', inset: -3,
                  borderRadius: '50%', border: '2px solid #22c55e',
                  animation: 'pulseRing 2s ease-out infinite', opacity: 0.6,
                }} />
              </span>
              <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 600 }}>
                {totalRepairers}+ técnicos activos ahora
              </span>
            </div>
          </div>

          {/* Main heading */}
          <div className="fade-up" style={{ textAlign: 'center', animationDelay: '0.1s' }}>
            <h1 style={{
              fontSize: 40, fontWeight: 900, lineHeight: 1.1,
              letterSpacing: '-1.5px', margin: '0 0 16px',
              color: '#fff',
            }}>
              Se dañó algo.
              <br />
              <span style={{ color: D }}>Nosotros lo resolvemos.</span>
            </h1>
            <p style={{
              color: 'rgba(255,255,255,0.55)', fontSize: 16, lineHeight: 1.6,
              maxWidth: 380, margin: '0 auto 32px',
            }}>
              Diagnóstico inteligente con IA y acceso directo a los mejores técnicos de Venezuela.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="fade-up" style={{
            display: 'flex', flexDirection: 'column', gap: 10,
            maxWidth: 380, margin: '0 auto 36px', animationDelay: '0.2s',
          }}>
            <Link href="/diagnostico" className="btn-press" style={{
              padding: '18px 24px', borderRadius: 16, border: 'none',
              background: D, color: '#fff', fontSize: 16, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 10, textDecoration: 'none',
              boxShadow: '0 8px 30px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.1)',
              position: 'relative', overflow: 'hidden',
            }}>
              <span style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.06) 50%, transparent 70%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 2.5s infinite',
              }} />
              <SparkleIcon sz={20} c="#fff" fill="#fff" /> Diagnosticar con IA
            </Link>
            <Link href="/buscar" className="btn-press" style={{
              padding: '16px 24px', borderRadius: 16,
              border: '1.5px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
              color: '#fff', fontSize: 15, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 8, textDecoration: 'none',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              Buscar técnico directo
            </Link>
          </div>

          {/* Categories — glassmorphism grid */}
          <div className="fade-up" style={{ animationDelay: '0.3s' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: (categories || []).length > 4 ? 'repeat(3,1fr)' : `repeat(${(categories || []).length},1fr)`,
              gap: 8,
            }}>
              {(categories || []).map((cat) => {
                const cc = CAT_COLORS_FULL[cat.id] || '#6b7280'
                return (
                  <Link key={cat.id} href={`/buscar?cat=${cat.id}`} className="cat-glass" style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: 8, padding: '16px 8px', borderRadius: 16,
                    cursor: 'pointer', textDecoration: 'none',
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: `${cc}20`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: `0 0 20px ${cc}15`,
                    }}>
                      <CatIcon id={cat.id} sz={22} c={cc} />
                    </div>
                    <span style={{
                      fontSize: 12, fontWeight: 700, textAlign: 'center',
                      color: 'rgba(255,255,255,0.9)',
                    }}>
                      {cat.name}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* === POST-HERO === */}
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 16px' }}>

        {/* How it works */}
        <div style={{ margin: '-20px 0 20px', position: 'relative', zIndex: 10 }}>
          <div className="fade-up" style={{
            background: '#fff', borderRadius: 20, padding: '22px 18px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <span style={{
                fontSize: 12, fontWeight: 700, color: '#94a3b8',
                letterSpacing: '1px', textTransform: 'uppercase',
              }}>Cómo funciona</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { num: '01', title: 'Describe', sub: 'Cuéntanos qué se dañó', color: '#8b5cf6', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> },
                { num: '02', title: 'IA Analiza', sub: 'Diagnóstico al instante', color: '#f59e0b', icon: <SparkleIcon sz={18} c="#f59e0b" fill="none" /> },
                { num: '03', title: 'Conecta', sub: 'Contacta al técnico', color: '#22c55e', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
              ].map((step, i) => (
                <div key={i} style={{
                  flex: 1, textAlign: 'center', padding: '14px 6px',
                  background: '#f8fafc', borderRadius: 14,
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: `${step.color}10`, margin: '0 auto 8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{step.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: D, marginBottom: 2 }}>{step.title}</div>
                  <div style={{ fontSize: 10, color: '#94a3b8', lineHeight: 1.3 }}>{step.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Repairers */}
        {premium.length > 0 && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 8 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.3px' }}>Destacados</h2>
              <Link href="/buscar" style={{ fontSize: 13, fontWeight: 600, color: PL, textDecoration: 'none' }}>Ver todos →</Link>
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
          textDecoration: 'none', color: D, fontWeight: 700, fontSize: 15, marginBottom: 16,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
          </svg>
          Ver todos los reparadores
        </Link>

        {/* Repairer CTA */}
        <Link href="/para-reparadores" className="card-hover" style={{
          display: 'block', padding: '20px', borderRadius: 20,
          background: 'linear-gradient(135deg, #0f172a, #1e293b)',
          textDecoration: 'none', marginBottom: 16,
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(251,191,36,0.05))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, border: '1px solid rgba(251,191,36,0.15)',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#fff', fontSize: 15, fontWeight: 700, marginBottom: 2 }}>
                ¿Eres reparador?
              </div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                Regístrate gratis y recibe clientes
              </div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </Link>

        <p style={{ textAlign: 'center', color: '#cbd5e1', fontSize: 11, padding: '0 16px 12px', lineHeight: 1.5 }}>
          El diagnóstico IA es orientativo y no reemplaza la evaluación de un profesional.
        </p>
      </div>
    </div>
  )
}
