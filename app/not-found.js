import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: 'calc(100vh - 200px)', padding: 20,
      textAlign: 'center'
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: 24,
        background: '#fffbeb', border: '2px solid #fde68a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 20, fontSize: 36,
      }}>🔍</div>
      <h1 style={{ fontSize: 56, margin: '0 0 4px', color: '#fbbf24', fontWeight: 900, letterSpacing: '-2px' }}>404</h1>
      <h2 style={{ fontSize: 22, marginBottom: 8, color: '#0f172a', fontWeight: 800 }}>
        Página no encontrada
      </h2>
      <p style={{ color: '#94a3b8', marginBottom: 24, lineHeight: 1.5, maxWidth: 320 }}>
        La página que buscas no existe o fue movida.
      </p>
      <Link href="/" style={{
        padding: '14px 32px', background: '#fbbf24', color: '#0f172a',
        borderRadius: 14, fontSize: 15, textDecoration: 'none',
        fontWeight: 700, display: 'inline-block',
        boxShadow: '0 2px 8px rgba(251,191,36,0.3)',
      }}>
        Volver al inicio
      </Link>
    </div>
  )
}
