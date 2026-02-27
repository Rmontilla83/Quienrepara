'use client'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import RepairerCard from './RepairerCard'
import { CatIcon } from './Icons'
import { D } from '@/lib/theme'
import { normalizeText } from '@/lib/utils'

export default function SearchClient({ repairers, categories, states }) {
  const searchParams = useSearchParams()
  const initialCat = searchParams.get('cat') || 'all'

  const [catF, setCatF] = useState(initialCat)
  const [stF, setStF] = useState('all')
  const [q, setQ] = useState('')

  const cats = [{ id: 'all', name: 'Todas', full_name: 'Todas' }, ...(categories || [])]
  const sts = [{ id: 'all', name: 'Todo el País' }, ...(states || [])]
  const catName = (id) => cats.find(c => c.id === id)?.full_name || cats.find(c => c.id === id)?.name || id
  const stName = (id) => sts.find(s => s.id === id)?.name || id

  let reps = [...(repairers || [])]
  if (catF !== 'all') reps = reps.filter(r => r.category_id === catF)
  if (stF !== 'all') reps = reps.filter(r => r.state_id === stF)
  if (q) {
    const nq = normalizeText(q)
    reps = reps.filter(r =>
      normalizeText(r.business_name || '').includes(nq) ||
      normalizeText(r.description || '').includes(nq) ||
      normalizeText(r.contact_name || '').includes(nq) ||
      normalizeText(r.city || '').includes(nq)
    )
  }
  reps.sort((a, b) => (b.is_premium ? 1 : 0) - (a.is_premium ? 1 : 0) || (Number(b.avg_rating) || 0) - (Number(a.avg_rating) || 0))

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
      {/* Search bar */}
      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Buscar por nombre, servicio, ciudad..."
        style={{
          width: '100%', padding: '14px 16px', borderRadius: 14,
          border: '1.5px solid #e5e7eb', fontSize: 15, outline: 'none',
          boxSizing: 'border-box', marginBottom: 12
        }}
      />

      {/* Category pills */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 12, paddingBottom: 4 }}>
        {cats.map(c => (
          <button key={c.id} onClick={() => setCatF(c.id)} style={{
            padding: '8px 14px', borderRadius: 20, border: catF === c.id ? 'none' : '1px solid #e5e7eb',
            background: catF === c.id ? D : '#fff', color: catF === c.id ? '#fff' : '#6b7280',
            fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
            display: 'flex', alignItems: 'center', gap: 6
          }}>
            <CatIcon id={c.id} sz={16} c={catF === c.id ? '#fff' : undefined} />
            {c.name}
          </button>
        ))}
      </div>

      {/* State filter */}
      <select value={stF} onChange={e => setStF(e.target.value)} style={{
        padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e5e7eb',
        fontSize: 14, outline: 'none', marginBottom: 16, width: '100%', boxSizing: 'border-box'
      }}>
        {sts.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>

      {/* Results count */}
      <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 12 }}>{reps.length} reparador{reps.length !== 1 ? 'es' : ''} encontrado{reps.length !== 1 ? 's' : ''}</p>

      {/* Results */}
      {reps.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {reps.map(r => (
            <RepairerCard key={r.id} r={r} catName={catName(r.category_id)} stName={stName(r.state_id)} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" style={{ margin: '0 auto 16px', display: 'block' }} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No se encontraron resultados</h3>
          <p style={{ color: '#94a3b8', fontSize: 14 }}>Intenta con otros filtros o términos de búsqueda</p>
        </div>
      )}
    </div>
  )
}
