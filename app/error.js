'use client'

export default function Error({ error, reset }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100vh', padding: 20,
      fontFamily: 'system-ui, sans-serif', textAlign: 'center'
    }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <h1 style={{ fontSize: 24, marginBottom: 8, color: '#1e293b', fontWeight: 700 }}>
        Algo salió mal
      </h1>
      <p style={{ color: '#64748b', marginBottom: 24, maxWidth: 400, lineHeight: 1.5 }}>
        Ocurrió un error inesperado. Por favor intenta de nuevo.
      </p>
      <button
        onClick={reset}
        style={{
          padding: '12px 32px', background: '#fbbf24', color: '#0f172a',
          border: 'none', borderRadius: 12, fontSize: 16,
          cursor: 'pointer', fontWeight: 700
        }}
      >
        Intentar de nuevo
      </button>
    </div>
  )
}
