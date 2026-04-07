export function CardSkeleton() {
  return (
    <div style={{
      background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9',
      padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <div className="skeleton" style={{ width: 52, height: 52, borderRadius: 14 }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ height: 14, width: '50%', marginBottom: 8, borderRadius: 6 }} />
          <div className="skeleton" style={{ height: 12, width: '70%', marginBottom: 6, borderRadius: 6 }} />
          <div className="skeleton" style={{ height: 12, width: '30%', borderRadius: 6 }} />
        </div>
      </div>
      <div className="skeleton" style={{ height: 12, width: '90%', marginBottom: 6, borderRadius: 6 }} />
      <div className="skeleton" style={{ height: 12, width: '60%', borderRadius: 6 }} />
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
