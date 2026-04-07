'use client'
import { useAuth } from '@/contexts/AuthContext'
import { Y, YD, PG, D } from '@/lib/theme'

// Note: metadata must be in a separate layout or use generateMetadata for client components
// SEO is handled via the sitemap.js and layout metadata

export default function ParaReparadores() {
  const { setShowAuth } = useAuth()

  const handleCTA = () => {
    setShowAuth(true)
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      {/* Hero */}
      <div style={{
        background: `linear-gradient(170deg, #1e293b 0%, #0f172a 100%)`,
        padding: '40px 20px', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -60, right: -60, width: 200, height: 200,
          borderRadius: '50%', background: 'rgba(251,191,36,0.08)',
        }} />
        <div style={{
          position: 'absolute', bottom: -40, left: -40, width: 150, height: 150,
          borderRadius: '50%', background: 'rgba(139,92,246,0.06)',
        }} />

        <div className="fade-up" style={{ position: 'relative' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20, background: Y,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', fontSize: 32,
            boxShadow: '0 8px 25px rgba(251,191,36,0.3)',
          }}>🔧</div>

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
            cursor: 'pointer', boxShadow: '0 4px 20px rgba(251,191,36,0.4)',
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>
            Registrarme Gratis
          </button>
          <p style={{ color: '#64748b', fontSize: 12, marginTop: 12 }}>
            Sin tarjeta de crédito · Activa tu perfil en 2 minutos
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: '0 16px', marginTop: -20, position: 'relative', zIndex: 10 }}>
        <div className="fade-up" style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
          marginBottom: 24,
        }}>
          {[
            { n: '500+', l: 'Clientes buscando', emoji: '👥' },
            { n: '100%', l: 'Gratis para empezar', emoji: '✅' },
            { n: '24/7', l: 'Visibilidad online', emoji: '🌐' },
          ].map((s, i) => (
            <div key={i} style={{
              background: '#fff', borderRadius: 16, padding: '18px 12px',
              textAlign: 'center', border: '1px solid #f1f5f9',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{s.emoji}</div>
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
              icon: '📍', title: 'Perfil profesional',
              desc: 'Tu negocio visible en búsquedas, mapa y diagnósticos IA. Los clientes te encuentran cuando más te necesitan.',
            },
            {
              icon: '💬', title: 'Contacto directo por WhatsApp',
              desc: 'Los clientes te escriben directo — sin intermediarios, sin comisiones por trabajo.',
            },
            {
              icon: '🤖', title: 'La IA te recomienda',
              desc: 'Nuestro diagnóstico inteligente analiza el problema del cliente y sugiere técnicos de tu categoría.',
            },
            {
              icon: '⭐', title: 'Reputación con opiniones',
              desc: 'Los clientes califican tu trabajo. Buenas opiniones = más clientes. Así de simple.',
            },
            {
              icon: '📊', title: 'Dashboard de tu negocio',
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
                background: '#f8fafc', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 24, flexShrink: 0,
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
          border: '1px solid rgba(251,191,36,0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 24 }}>⚡</span>
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
                  width: 20, height: 20, borderRadius: 6, background: Y,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800, color: D,
                }}>✓</span>
                <span style={{ color: '#e2e8f0', fontSize: 14 }}>{f}</span>
              </div>
            ))}
          </div>
          <div style={{
            display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 16,
          }}>
            <span style={{ fontSize: 36, fontWeight: 900, color: Y }}>$5</span>
            <span style={{ color: '#94a3b8', fontSize: 14 }}>/mes</span>
          </div>
          <button onClick={handleCTA} className="btn-press" style={{
            width: '100%', padding: '14px', borderRadius: 12, border: 'none',
            background: Y, color: D, fontSize: 15, fontWeight: 800, cursor: 'pointer',
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
