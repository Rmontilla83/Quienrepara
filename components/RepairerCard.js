'use client'
import Link from 'next/link'
import { track } from '@vercel/analytics'
import StarRating from './StarRating'
import { WhatsappIcon } from './Icons'
import { initials, avatarColor, whatsappUrl, categoryColor } from '@/lib/utils'
import { Y, YL, GL, WA, D } from '@/lib/theme'

export default function RepairerCard({ r, catName, stName }) {
  const catColor = categoryColor(r.category_id)

  return (
    <Link href={`/reparador/${r.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="card-hover" style={{
        background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9',
        padding: 16, cursor: 'pointer',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Top color accent */}
        {r.is_premium && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 3,
            background: `linear-gradient(90deg, ${Y}, ${catColor || Y})`,
          }} />
        )}

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: `linear-gradient(135deg, ${avatarColor(r.business_name)}, ${avatarColor(r.business_name)}dd)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 18, fontWeight: 800, flexShrink: 0,
            boxShadow: `0 2px 8px ${avatarColor(r.business_name)}40`,
          }}>{initials(r.business_name)}</div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', gap: 5, marginBottom: 4, flexWrap: 'wrap' }}>
              {r.is_premium && (
                <span style={{
                  fontSize: 10, padding: '2px 8px', borderRadius: 6,
                  background: '#fffbeb', color: '#92400e', fontWeight: 700,
                  border: '1px solid #fde68a', letterSpacing: '0.3px',
                }}>DESTACADO</span>
              )}
              {r.is_verified && (
                <span style={{
                  fontSize: 10, padding: '2px 8px', borderRadius: 6,
                  background: '#f0fdf4', color: '#166534', fontWeight: 700,
                  border: '1px solid #bbf7d0',
                }}>VERIFICADO</span>
              )}
            </div>
            <h3 style={{
              margin: '0 0 3px', fontSize: 15, fontWeight: 700,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              color: D, letterSpacing: '-0.2px',
            }}>{r.business_name}</h3>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{
                color: catColor, fontWeight: 700, fontSize: 11,
                padding: '1px 6px', borderRadius: 4,
                background: catColor + '12',
              }}>{catName}</span>
              <span style={{ color: '#cbd5e1' }}>·</span>
              <span>{r.city}{stName ? `, ${stName}` : ''}</span>
            </div>
            <StarRating rating={r.avg_rating} reviews={r.total_reviews} sz={12} />
          </div>

          {r.is_premium && r.whatsapp && (
            <a href={whatsappUrl(r.whatsapp, `Hola, encontré "${r.business_name}" en QuiénRepara.`)} target="_blank" rel="noreferrer"
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); track('whatsapp_click', { repairer: r.business_name, category: r.category_id }); window.open(whatsappUrl(r.whatsapp, `Hola, encontré "${r.business_name}" en QuiénRepara.`), '_blank') }}
              style={{
                width: 44, height: 44, borderRadius: 14, background: WA,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, alignSelf: 'center',
                boxShadow: '0 2px 8px rgba(37,211,102,0.3)',
                transition: 'transform 0.15s',
              }}>
              <WhatsappIcon c="#fff" sz={22} />
            </a>
          )}
        </div>

        {r.description && (
          <p style={{
            margin: '10px 0 0', fontSize: 13, color: '#64748b', lineHeight: 1.55,
            overflow: 'hidden', textOverflow: 'ellipsis',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>{r.description}</p>
        )}
      </div>
    </Link>
  )
}
