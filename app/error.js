'use client'

export default function Error({ error, reset }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: 'calc(100vh - 200px)', padding: 20,
      textAlign: 'center'
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: 24,
        background: '#fef2f2', border: '2px solid #fecaca',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 20,
      }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <h1 style={{ fontSize: 22, marginBottom: 8, color: '#0f172a', fontWeight: 800 }}>
        Algo salió mal
      </h1>
      <p style={{ color: '#94a3b8', marginBottom: 24, maxWidth: 360, lineHeight: 1.5, fontSize: 14 }}>
        Ocurrió un error inesperado. Por favor intenta de nuevo.
      </p>
      <button
        onClick={reset}
        className="btn-press"
        style={{
          padding: '14px 32px', background: '#fbbf24', color: '#0f172a',
          border: 'none', borderRadius: 14, fontSize: 15,
          cursor: 'pointer', fontWeight: 700,
          boxShadow: '0 2px 8px rgba(251,191,36,0.3)',
        }}
      >
        Intentar de nuevo
      </button>
    </div>
  )
}
