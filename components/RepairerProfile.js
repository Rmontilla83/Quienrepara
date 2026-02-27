'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { getSupabaseClient } from '@/lib/supabase'
import StarRating from './StarRating'
import { WhatsappIcon, PhoneIcon, MapIcon } from './Icons'
import { initials, avatarColor, whatsappUrl, cleanPhone, categoryColor } from '@/lib/utils'
import { Y, YL, GL, WA, D, PL, R } from '@/lib/theme'

export default function RepairerProfile({ repairer: r, catName, stName, reviews: initialReviews }) {
  const { user, setShowAuth } = useAuth()
  const [reviews, setReviews] = useState(initialReviews || [])
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [reviewMsg, setReviewMsg] = useState(null)

  const handleReview = async () => {
    if (rating === 0) return
    if (!user) { setShowAuth(true); return }
    setSubmitting(true)
    const sb = getSupabaseClient()
    if (!sb) { setSubmitting(false); return }

    const { error } = await sb.from('reviews').upsert({
      repairer_id: r.id,
      user_id: user.id,
      rating,
      comment: comment.trim() || null,
    }, { onConflict: 'repairer_id,user_id' })

    if (error) {
      setReviewMsg('No se pudo enviar tu opinión. Intenta de nuevo.')
    } else {
      setReviewMsg('Opinión enviada correctamente')
      setRating(0)
      setComment('')
      // Reload reviews
      const { data } = await sb.from('reviews')
        .select('id,rating,comment,created_at,user_id,profiles(full_name)')
        .eq('repairer_id', r.id).order('created_at', { ascending: false }).limit(20)
      if (data) setReviews(data)
    }
    setSubmitting(false)
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 16 }}>
      <Link href="/buscar" style={{ border: 'none', background: 'none', color: '#94a3b8', fontSize: 14, cursor: 'pointer', marginBottom: 12, padding: 0, display: 'inline-block', textDecoration: 'none' }}>← Volver</Link>

      <div className="fade-up" style={{ background: '#fff', borderRadius: 18, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <div style={{ height: 5, background: r.is_premium ? Y : categoryColor(r.category_id) }} />
        <div style={{ padding: 24 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: avatarColor(r.business_name), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 24, fontWeight: 700, flexShrink: 0 }}>{initials(r.business_name)}</div>
            <div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                {r.is_premium && <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: YL, color: '#92400e', fontWeight: 700 }}>DESTACADO</span>}
                {r.is_verified && <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: GL, color: '#166534', fontWeight: 700 }}>VERIFICADO</span>}
              </div>
              <h1 style={{ margin: '0 0 2px', fontSize: 20, fontWeight: 700 }}>{r.business_name}</h1>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: 13 }}>{catName}</p>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}><StarRating rating={r.avg_rating} reviews={r.total_reviews} sz={18} /></div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20, fontSize: 14 }}>
            <div><strong>Contacto:</strong> {r.contact_name}</div>
            <div style={{ color: R, display: 'flex', alignItems: 'center', gap: 4 }}><MapIcon sz={14} c={R} /> {r.city}, {stName}</div>
            {r.email && <div>{r.email}</div>}
            {r.phone && <div>{r.phone}</div>}
            {r.hours && <div>Horario: {r.hours}</div>}
          </div>

          <p style={{ color: '#6b7280', lineHeight: 1.7, marginBottom: 20, fontSize: 15 }}>{r.description}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {r.phone ? (
              <>
                <a href={whatsappUrl(r.whatsapp || r.phone, `Hola, encontré "${r.business_name}" en QuiénRepara. ¿Info sobre sus servicios?`)} target="_blank" rel="noreferrer" style={{ padding: 14, borderRadius: 12, background: WA, color: '#fff', fontSize: 16, fontWeight: 700, textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <WhatsappIcon c="#fff" /> Contactar por WhatsApp
                </a>
                <a href={`tel:${cleanPhone(r.phone)}`} style={{ padding: 14, borderRadius: 12, border: `2px solid ${D}`, color: D, fontSize: 16, fontWeight: 700, textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <PhoneIcon c={D} /> Llamar: {r.phone}
                </a>
              </>
            ) : r.email ? (
              <a href={`mailto:${r.email}`} style={{ padding: 14, borderRadius: 12, background: PL, color: '#fff', fontSize: 16, fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>
                Contactar por email
              </a>
            ) : null}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="fade-up" style={{ background: '#fff', borderRadius: 18, border: '1px solid #e5e7eb', padding: 20, marginTop: 12, animationDelay: '.15s' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Opiniones ({reviews.length || r.total_reviews || 0})</h3>

        {reviews.length > 0 ? reviews.map((rv) => (
          <div key={rv.id} style={{ padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: avatarColor(rv.profiles?.full_name || 'U'), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700 }}>{initials(rv.profiles?.full_name || 'Usuario')}</div>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{rv.profiles?.full_name || 'Usuario'}</span>
                <StarRating rating={rv.rating} reviews={1} sz={11} />
              </div>
              <span style={{ fontSize: 11, color: '#cbd5e1' }}>{new Date(rv.created_at).toLocaleDateString('es-VE')}</span>
            </div>
            {rv.comment && <p style={{ margin: 0, color: '#6b7280', fontSize: 13, paddingLeft: 36 }}>{rv.comment}</p>}
          </div>
        )) : (
          <div style={{ textAlign: 'center', padding: '20px 0', color: '#94a3b8' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" style={{ margin: '0 auto 12px', display: 'block' }}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <p style={{ fontSize: 14, marginBottom: 4 }}>Aún no hay opiniones</p>
            <p style={{ fontSize: 12 }}>Sé el primero en compartir tu experiencia</p>
          </div>
        )}

        {/* Review form */}
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Deja tu opinión</h4>
          <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} onClick={() => user ? setRating(n) : setShowAuth(true)} style={{ fontSize: 28, background: 'none', border: 'none', cursor: 'pointer', color: n <= rating ? '#f59e0b' : '#d1d5db', padding: 0 }}>★</button>
            ))}
          </div>
          {user && rating > 0 && (
            <>
              <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="¿Cómo fue tu experiencia? (opcional)" maxLength={500} rows={3} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e2e8f0', resize: 'vertical', fontSize: 14, boxSizing: 'border-box', marginBottom: 8 }} />
              <button onClick={handleReview} disabled={submitting} style={{ width: '100%', padding: 10, borderRadius: 8, border: 'none', background: Y, color: D, fontWeight: 700, fontSize: 14, cursor: submitting ? 'default' : 'pointer' }}>
                {submitting ? 'Enviando...' : 'Enviar opinión'}
              </button>
            </>
          )}
          {!user && <p style={{ color: '#94a3b8', fontSize: 13 }}>Inicia sesión para dejar tu opinión</p>}
          {reviewMsg && <p style={{ color: reviewMsg.includes('correctamente') ? '#166534' : R, fontSize: 13, marginTop: 8 }}>{reviewMsg}</p>}
        </div>
      </div>
    </div>
  )
}
