export default function StarRating({ rating, reviews, sz = 14 }) {
  if (!reviews) return <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 12, background: '#eff6ff', color: '#2563eb', fontWeight: 700 }}>NUEVO</span>
  const f = Math.floor(Number(rating))
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
    <span style={{ fontWeight: 700, fontSize: 13 }}>{Number(rating).toFixed(1)}</span>
    <span style={{ display: 'inline-flex' }}>{Array.from({ length: 5 }, (_, i) => <svg key={i} width={sz} height={sz} viewBox="0 0 20 20" fill={i < f ? '#f59e0b' : '#e5e7eb'}><path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.51.91-5.32L2.27 6.69l5.34-.78L10 1z" /></svg>)}</span>
    <span style={{ fontSize: 12, color: '#9ca3af' }}>({reviews})</span>
  </span>
}
