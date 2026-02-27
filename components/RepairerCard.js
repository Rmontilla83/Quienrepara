'use client'
import Link from 'next/link'
import { track } from '@vercel/analytics'
import StarRating from './StarRating'
import { WhatsappIcon } from './Icons'
import { initials, avatarColor, whatsappUrl, categoryColor } from '@/lib/utils'
import { Y, YL, GL, WA, D } from '@/lib/theme'

export default function RepairerCard({ r, catName, stName }) {
  return (
    <Link href={`/reparador/${r.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="fade-up" style={{
        background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb',
        padding: 14, cursor: 'pointer', transition: 'box-shadow 0.2s',
      }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: avatarColor(r.business_name),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 18, fontWeight: 700, flexShrink: 0
          }}>{initials(r.business_name)}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 3, flexWrap: 'wrap' }}>
              {r.is_premium && <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 4, background: YL, color: '#92400e', fontWeight: 700 }}>DESTACADO</span>}
              {r.is_verified && <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 4, background: GL, color: '#166534', fontWeight: 700 }}>VERIFICADO</span>}
            </div>
            <h3 style={{ margin: '0 0 2px', fontSize: 15, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.business_name}</h3>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
              <span style={{ color: categoryColor(r.category_id), fontWeight: 600 }}>{catName}</span> · {r.city}{stName ? `, ${stName}` : ''}
            </div>
            <StarRating rating={r.avg_rating} reviews={r.total_reviews} sz={12} />
          </div>
          {r.is_premium && r.whatsapp && (
            <a href={whatsappUrl(r.whatsapp, `Hola, encontré "${r.business_name}" en QuiénRepara.`)} target="_blank" rel="noreferrer"
              onClick={(e) => { e.stopPropagation(); track('whatsapp_click', { repairer: r.business_name, category: r.category_id }) }}
              style={{
                width: 40, height: 40, borderRadius: '50%', background: WA,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, alignSelf: 'center'
              }}>
              <WhatsappIcon c="#fff" sz={20} />
            </a>
          )}
        </div>
        {r.description && <p style={{ margin: '8px 0 0', fontSize: 13, color: '#6b7280', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{r.description}</p>}
      </div>
    </Link>
  )
}
