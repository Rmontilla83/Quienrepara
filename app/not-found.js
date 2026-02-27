import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100vh', padding: 20,
      fontFamily: 'system-ui, sans-serif', textAlign: 'center'
    }}>
      <h1 style={{ fontSize: 72, margin: 0, color: '#fbbf24', fontWeight: 800 }}>404</h1>
      <h2 style={{ fontSize: 24, marginBottom: 8, color: '#1e293b', fontWeight: 700 }}>
        Página no encontrada
      </h2>
      <p style={{ color: '#64748b', marginBottom: 24, lineHeight: 1.5 }}>
        La página que buscas no existe o fue movida.
      </p>
      <Link href="/" style={{
        padding: '12px 32px', background: '#fbbf24', color: '#0f172a',
        borderRadius: 12, fontSize: 16, textDecoration: 'none',
        fontWeight: 700, display: 'inline-block'
      }}>
        Volver al inicio
      </Link>
    </div>
  )
}
