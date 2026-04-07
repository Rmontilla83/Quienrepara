'use client'
import { useAuth } from '@/contexts/AuthContext'
import { SparkleIcon } from '@/components/Icons'
import { Y, YD, PG, D } from '@/lib/theme'

export default function ParaReparadores() {
  const { setShowAuth } = useAuth()
  const handleCTA = () => setShowAuth(true)

  // SVG icon components inline for clean reuse
  const IconPin = ({ c = '#fbbf24', s = 22 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
  const IconChat = ({ c = '#8b5cf6', s = 22 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
  const IconBrain = ({ c = '#f59e0b', s = 22 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 014 4c0 1.95-1.4 3.58-3.25 3.93"/><path d="M8 6a4 4 0 00-4 4c0 1.95 1.4 3.58 3.25 3.93"/><path d="M16 14a4 4 0 014 4c0 1.95-1.4 3.58-3.25 3.93"/><path d="M4 18a4 4 0 014-4"/><circle cx="12" cy="12" r="3"/></svg>
  const IconStar = ({ c = '#f59e0b', s = 22 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.39 4.84 5.34.78-3.87 3.77.91 5.32L12 13.27l-4.77 2.51.91-5.32L4.27 6.69l5.34-.78L12 2z"/></svg>
  const IconChart = ({ c = '#8b5cf6', s = 22 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
  const IconBolt = ({ c = '#fbbf24', s = 22 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
  const IconCheck = ({ c = '#fbbf24', s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  const IconWrench = ({ c = '#fbbf24', s = 22 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
  const IconUsers = ({ c = '#64748b', s = 22 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
  const IconGlobe = ({ c = '#64748b', s = 22 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
  const IconShield = ({ c = '#22c55e', s = 22 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(170deg, #1e293b 0%, #0f172a 100%)',
        padding: '40px 20px', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -60, right: -60, width: 200, height: 200,
          borderRadius: '50%', background: 'rgba(251,191,36,0.06)',
        }} />
        <div style={{
          position: 'absolute', bottom: -40, left: -40, width: 150, height: 150,
          borderRadius: '50%', background: 'rgba(139,92,246,0.04)',
        }} />

        <div className="fade-up" style={{ position: 'relative' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20,
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 25px rgba(251,191,36,0.25)',
          }}>
            <IconWrench c="#fff" s={28} />
          </div>

          <h1 style={{
            color: '#fff', fontSize: 30, fontWeight: 900,
            lineHeight: 1.2, marginBottom: 12, letterSpacing: '-0.5px',
          }}>
            Haz crecer tu negocio con{' '}
            <span style={{ color: Y }}>QuiénRepara</span>
          </h1>
          <p style={{
            color: '#94a3b8', fontSize: 16, lineHeight: 1.6,
            marginBottom: 28, maxWidth: 400, margin: '0 auto 28px',
          }}>
            Regístrate gratis y conecta con clientes que necesitan tus servicios ahora mismo.
          </p>

          <button onClick={handleCTA} className="btn-press" style={{
            padding: '16px 40px', borderRadius: 14, border: 'none',
            background: Y, color: D, fontSize: 17, fontWeight: 800,
            cursor: 'pointer', boxShadow: '0 4px 20px rgba(251,191,36,0.35)',
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>
            Registrarme Gratis
          </button>
          <p style={{ color: '#64748b', fontSize: 12, marginTop: 12 }}>
            Sin tarjeta de crédito — Activa tu perfil en 2 minutos
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: '0 16px', marginTop: -20, position: 'relative', zIndex: 10 }}>
        <div className="fade-up" style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 24,
        }}>
          {[
            { n: '500+', l: 'Clientes buscando', icon: <IconUsers c="#0c4a6e" s={20} />, bg: '#f0f9ff', border: '#bae6fd' },
            { n: '100%', l: 'Gratis para empezar', icon: <IconShield c="#166534" s={20} />, bg: '#f0fdf4', border: '#bbf7d0' },
            { n: '24/7', l: 'Visibilidad online', icon: <IconGlobe c="#6d28d9" s={20} />, bg: '#f5f3ff', border: '#e9d5ff' },
          ].map((s, i) => (
            <div key={i} style={{
              background: '#fff', borderRadius: 16, padding: '18px 12px',
              textAlign: 'center', border: '1px solid #f1f5f9',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: s.bg, border: `1px solid ${s.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 8px',
              }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: D, marginBottom: 2 }}>{s.n}</div>
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16, letterSpacing: '-0.3px' }}>
            ¿Qué obtienes?
          </h2>
          {[
            {
              icon: <IconPin c="#8b5cf6" />, title: 'Perfil profesional',
              desc: 'Tu negocio visible en búsquedas, mapa y diagnósticos IA. Los clientes te encuentran cuando más te necesitan.',
            },
            {
              icon: <IconChat c="#22c55e" />, title: 'Contacto directo por WhatsApp',
              desc: 'Los clientes te escriben directo — sin intermediarios, sin comisiones por trabajo.',
            },
            {
              icon: <SparkleIcon sz={22} c="#f59e0b" fill="none" />, title: 'La IA te recomienda',
              desc: 'Nuestro diagnóstico inteligente analiza el problema del cliente y sugiere técnicos de tu categoría.',
            },
            {
              icon: <IconStar c="#f59e0b" />, title: 'Reputación con opiniones',
              desc: 'Los clientes califican tu trabajo. Buenas opiniones = más clientes. Así de simple.',
            },
            {
              icon: <IconChart c="#8b5cf6" />, title: 'Dashboard de tu negocio',
              desc: 'Edita tu perfil, ve tus estadísticas, activa o desactiva tu visibilidad cuando quieras.',
            },
          ].map((b, i) => (
            <div key={i} className="fade-up" style={{
              display: 'flex', gap: 14, padding: '16px 0',
              borderBottom: i < 4 ? '1px solid #f1f5f9' : 'none',
              animationDelay: `${i * 0.06}s`,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: '#f8fafc', border: '1px solid #f1f5f9',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>{b.icon}</div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 3, color: D }}>{b.title}</h3>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>{b.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Premium */}
        <div className="fade-up" style={{
          background: 'linear-gradient(135deg, #1e293b, #334155)',
          borderRadius: 20, padding: 24, marginBottom: 24,
          border: '1px solid rgba(251,191,36,0.15)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <IconBolt c="#fbbf24" s={22} />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0 }}>Plan Premium</h3>
              <p style={{ color: '#94a3b8', fontSize: 13, margin: 0 }}>Para los que quieren más clientes</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {[
              'Badge "DESTACADO" en tu perfil',
              'Prioridad en resultados de búsqueda',
              'Botón WhatsApp directo en listados',
              'Métricas de visitas a tu perfil',
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 22, height: 22, borderRadius: 6, background: 'rgba(251,191,36,0.15)',
                  border: '1px solid rgba(251,191,36,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}><IconCheck c="#fbbf24" s={12} /></span>
                <span style={{ color: '#e2e8f0', fontSize: 14 }}>{f}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 16 }}>
            <span style={{ fontSize: 36, fontWeight: 900, color: Y }}>$5</span>
            <span style={{ color: '#94a3b8', fontSize: 14 }}>/mes</span>
          </div>
          <button onClick={handleCTA} className="btn-press" style={{
            width: '100%', padding: '14px', borderRadius: 12, border: 'none',
            background: Y, color: D, fontSize: 15, fontWeight: 800, cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(251,191,36,0.25)',
          }}>
            Empezar con Premium
          </button>
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: 11, marginTop: 8 }}>
            Empieza gratis y sube a Premium cuando quieras
          </p>
        </div>

        {/* How it works */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16, letterSpacing: '-0.3px' }}>
            ¿Cómo funciona?
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { n: '1', title: 'Regístrate', desc: 'Crea tu cuenta como reparador. Solo necesitas nombre, email y teléfono.' },
              { n: '2', title: 'Completa tu perfil', desc: 'Agrega tu especialidad, zona, horarios y descripción de servicios.' },
              { n: '3', title: 'Recibe clientes', desc: 'Los clientes te encuentran, te contactan por WhatsApp y tú cierras el trabajo.' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, padding: '16px 0' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: PG, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#fff', fontSize: 16,
                  fontWeight: 800, flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(139,92,246,0.2)',
                }}>{s.n}</div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 3, color: D }}>{s.title}</h3>
                  <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16, letterSpacing: '-0.3px' }}>
            Preguntas frecuentes
          </h2>
          {[
            { q: '¿Es gratis?', a: 'Sí. El perfil básico es gratis para siempre. Solo pagas si quieres las ventajas Premium.' },
            { q: '¿Cobran comisión por trabajo?', a: 'No. El cliente te contacta directo y tú acuerdas el precio. Cero comisiones.' },
            { q: '¿Qué necesito para registrarme?', a: 'Solo tu nombre, email, teléfono y describir tus servicios. En 2 minutos estás listo.' },
            { q: '¿Puedo pausar mi perfil?', a: 'Sí. Desde tu dashboard puedes activar o desactivar tu visibilidad en cualquier momento.' },
          ].map((f, i) => (
            <div key={i} style={{
              background: '#fff', borderRadius: 14, border: '1px solid #f1f5f9',
              padding: '16px', marginBottom: 8,
            }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: D, marginBottom: 4 }}>{f.q}</h4>
              <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>{f.a}</p>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="fade-up" style={{
          background: `linear-gradient(170deg, ${Y} 0%, ${YD} 100%)`,
          borderRadius: 20, padding: '32px 20px', textAlign: 'center',
          marginBottom: 24,
        }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: D, marginBottom: 8, letterSpacing: '-0.3px' }}>
            ¿Listo para más clientes?
          </h2>
          <p style={{ color: '#78350f', fontSize: 14, marginBottom: 20 }}>
            Únete a la red de reparadores más inteligente de Venezuela
          </p>
          <button onClick={handleCTA} className="btn-press" style={{
            padding: '16px 40px', borderRadius: 14, border: 'none',
            background: D, color: '#fff', fontSize: 16, fontWeight: 800,
            cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          }}>
            Crear mi perfil gratis
          </button>
        </div>
      </div>
    </div>
  )
}
