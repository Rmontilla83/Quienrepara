export function CardSkeleton() {
  return (
    <div style={{
      background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb',
      padding: 16, animation: 'pulse 1.5s infinite ease-in-out'
    }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: '#e2e8f0' }} />
        <div style={{ flex: 1 }}>
          <div style={{ height: 16, background: '#e2e8f0', borderRadius: 4, width: '60%', marginBottom: 8 }} />
          <div style={{ height: 12, background: '#e2e8f0', borderRadius: 4, width: '40%' }} />
        </div>
      </div>
      <div style={{ height: 12, background: '#e2e8f0', borderRadius: 4, width: '80%', marginBottom: 8 }} />
      <div style={{ height: 12, background: '#e2e8f0', borderRadius: 4, width: '50%' }} />
      <style jsx>{`@keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: 0.5 } }`}</style>
    </div>
  )
}

export function ListSkeleton({ count = 3 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {Array.from({ length: count }, (_, i) => <CardSkeleton key={i} />)}
    </div>
  )
}
