'use client'
import { useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { track } from '@vercel/analytics'
import RepairerCard from './RepairerCard'
import { CatIcon } from './Icons'
import { D, PL } from '@/lib/theme'
import { normalizeText } from '@/lib/utils'

export default function SearchClient({ repairers, categories, states }) {
  const searchParams = useSearchParams()
  const initialCat = searchParams.get('cat') || 'all'

  const [catF, setCatF] = useState(initialCat)
  const [stF, setStF] = useState('all')
  const [q, setQ] = useState('')

  const trackSearch = useCallback((query) => {
    if (query.length >= 3) track('search', { query: query.slice(0, 50) })
  }, [])

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
      {/* Page title */}
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 4 }}>
          Buscar reparadores
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 14 }}>
          Encuentra al técnico ideal para tu problema
        </p>
      </div>

      {/* Search bar */}
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }}>
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          value={q}
          onChange={e => { setQ(e.target.value); trackSearch(e.target.value) }}
          placeholder="Buscar por nombre, servicio, ciudad..."
          style={{
            width: '100%', padding: '14px 16px 14px 44px', borderRadius: 14,
            border: '1.5px solid #e2e8f0', fontSize: 15, outline: 'none',
            boxSizing: 'border-box', background: '#fff',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
        />
      </div>

      {/* Category pills */}
      <div className="pills-scroll" style={{ display: 'flex', gap: 6, marginBottom: 12, paddingBottom: 4 }}>
        {cats.map(c => (
          <button key={c.id} onClick={() => setCatF(c.id)} className="btn-press" style={{
            padding: '8px 14px', borderRadius: 10, border: catF === c.id ? 'none' : '1.5px solid #e2e8f0',
            background: catF === c.id ? D : '#fff', color: catF === c.id ? '#fff' : '#64748b',
            fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
            display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: catF === c.id ? '0 2px 8px rgba(15,23,42,0.2)' : 'none',
          }}>
            <CatIcon id={c.id} sz={16} c={catF === c.id ? '#fff' : undefined} />
            {c.name}
          </button>
        ))}
      </div>

      {/* State filter */}
      <select value={stF} onChange={e => setStF(e.target.value)} style={{
        padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0',
        fontSize: 14, outline: 'none', marginBottom: 16, width: '100%',
        boxSizing: 'border-box', background: '#fff', color: D,
        cursor: 'pointer',
      }}>
        {sts.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>

      {/* Results count */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <p style={{ color: '#64748b', fontSize: 13, fontWeight: 500 }}>
          <strong style={{ color: D }}>{reps.length}</strong> reparador{reps.length !== 1 ? 'es' : ''} encontrado{reps.length !== 1 ? 's' : ''}
        </p>
        {q && (
          <button onClick={() => setQ('')} style={{
            border: 'none', background: 'none', color: PL, fontSize: 12,
            fontWeight: 600, cursor: 'pointer',
          }}>Limpiar</button>
        )}
      </div>

      {/* Results */}
      {reps.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {reps.map((r, i) => (
            <div key={r.id} className="fade-up" style={{ animationDelay: `${Math.min(i * 0.04, 0.3)}s` }}>
              <RepairerCard r={r} catName={catName(r.category_id)} stName={stName(r.state_id)} />
            </div>
          ))}
        </div>
      ) : (
        <div className="fade-in" style={{
          textAlign: 'center', padding: '48px 20px',
          background: '#fff', borderRadius: 20, border: '1px solid #f1f5f9',
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20, background: '#f8fafc',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: D }}>No se encontraron resultados</h3>
          <p style={{ color: '#94a3b8', fontSize: 14 }}>Intenta con otros filtros o términos de búsqueda</p>
        </div>
      )}
    </div>
  )
}
