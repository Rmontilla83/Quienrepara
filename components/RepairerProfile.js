'use client'
import { useState } from 'react'
import Link from 'next/link'
import { track } from '@vercel/analytics'
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
  const catColor = categoryColor(r.category_id)

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
      const { data } = await sb.from('reviews')
        .select('id,rating,comment,created_at,user_id,profiles(full_name)')
        .eq('repairer_id', r.id).order('created_at', { ascending: false }).limit(20)
      if (data) setReviews(data)
    }
    setSubmitting(false)
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 16 }}>
      <Link href="/buscar" style={{
        border: 'none', background: 'none', color: '#94a3b8', fontSize: 13,
        cursor: 'pointer', marginBottom: 12, padding: '4px 0', display: 'inline-flex',
        alignItems: 'center', gap: 4, textDecoration: 'none', fontWeight: 500,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Volver
      </Link>

      {/* Main card */}
      <div className="fade-up" style={{
        background: '#fff', borderRadius: 20, border: '1px solid #f1f5f9',
        overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        {/* Gradient header */}
        <div style={{
          height: 6,
          background: r.is_premium
            ? `linear-gradient(90deg, ${Y}, ${catColor || Y})`
            : catColor || '#e2e8f0',
        }} />

        <div style={{ padding: '24px 20px' }}>
          {/* Profile header */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20 }}>
            <div style={{
              width: 72, height: 72, borderRadius: 20,
              background: `linear-gradient(135deg, ${avatarColor(r.business_name)}, ${avatarColor(r.business_name)}cc)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 26, fontWeight: 800, flexShrink: 0,
              boxShadow: `0 4px 12px ${avatarColor(r.business_name)}30`,
            }}>{initials(r.business_name)}</div>
            <div>
              <div style={{ display: 'flex', gap: 5, marginBottom: 5, flexWrap: 'wrap' }}>
                {r.is_premium && (
                  <span style={{
                    fontSize: 10, padding: '3px 8px', borderRadius: 6,
                    background: '#fffbeb', color: '#92400e', fontWeight: 700,
                    border: '1px solid #fde68a',
                  }}>DESTACADO</span>
                )}
                {r.is_verified && (
                  <span style={{
                    fontSize: 10, padding: '3px 8px', borderRadius: 6,
                    background: '#f0fdf4', color: '#166534', fontWeight: 700,
                    border: '1px solid #bbf7d0',
                  }}>VERIFICADO</span>
                )}
              </div>
              <h1 style={{ margin: '0 0 3px', fontSize: 22, fontWeight: 800, letterSpacing: '-0.3px' }}>{r.business_name}</h1>
              <span style={{
                fontSize: 12, fontWeight: 700, color: catColor,
                padding: '2px 8px', borderRadius: 6,
                background: catColor + '12',
              }}>{catName}</span>
            </div>
          </div>

          {/* Rating */}
          <div style={{
            marginBottom: 20, padding: '12px 16px', borderRadius: 12,
            background: '#f8fafc', display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <StarRating rating={r.avg_rating} reviews={r.total_reviews} sz={20} />
          </div>

          {/* Info */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20,
            fontSize: 14, color: '#475569',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <span>{r.contact_name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapIcon sz={16} c="#ef4444" />
              </div>
              <span>{r.city}, {stName}</span>
            </div>
            {r.email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <span>{r.email}</span>
              </div>
            )}
            {r.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PhoneIcon sz={16} c="#64748b" />
                </div>
                <span>{r.phone}</span>
              </div>
            )}
            {r.hours && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <span>{r.hours}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {r.description && (
            <div style={{
              padding: '16px', borderRadius: 14, background: '#f8fafc',
              marginBottom: 20, border: '1px solid #f1f5f9',
            }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Acerca de</h3>
              <p style={{ color: '#475569', lineHeight: 1.7, fontSize: 14 }}>{r.description}</p>
            </div>
          )}

          {/* Contact CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {r.phone ? (
              <>
                <a href={whatsappUrl(r.whatsapp || r.phone, `Hola, encontré "${r.business_name}" en QuiénRepara. ¿Info sobre sus servicios?`)}
                  target="_blank" rel="noreferrer" className="btn-press"
                  onClick={() => track('whatsapp_contact', { repairer: r.business_name, category: catName })}
                  style={{
                    padding: '15px 20px', borderRadius: 14, background: WA, color: '#fff',
                    fontSize: 16, fontWeight: 700, textDecoration: 'none', textAlign: 'center',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    boxShadow: '0 4px 12px rgba(37,211,102,0.3)',
                  }}>
                  <WhatsappIcon c="#fff" sz={22} /> Contactar por WhatsApp
                </a>
                <a href={`tel:${cleanPhone(r.phone)}`} className="btn-press"
                  onClick={() => track('phone_contact', { repairer: r.business_name })}
                  style={{
                    padding: '15px 20px', borderRadius: 14,
                    border: `2px solid #e2e8f0`, color: D,
                    fontSize: 16, fontWeight: 700, textDecoration: 'none', textAlign: 'center',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    background: '#fff',
                  }}>
                  <PhoneIcon c={D} sz={20} /> Llamar: {r.phone}
                </a>
              </>
            ) : r.email ? (
              <a href={`mailto:${r.email}`} className="btn-press" style={{
                padding: '15px 20px', borderRadius: 14, background: PL, color: '#fff',
                fontSize: 16, fontWeight: 700, textDecoration: 'none', textAlign: 'center',
              }}>
                Contactar por email
              </a>
            ) : null}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="fade-up" style={{
        background: '#fff', borderRadius: 20, border: '1px solid #f1f5f9',
        padding: 20, marginTop: 12, animationDelay: '.12s',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 16, letterSpacing: '-0.2px' }}>
          Opiniones <span style={{ color: '#94a3b8', fontWeight: 500 }}>({reviews.length || r.total_reviews || 0})</span>
        </h3>

        {reviews.length > 0 ? reviews.map((rv) => (
          <div key={rv.id} style={{ padding: '14px 0', borderBottom: '1px solid #f8fafc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 10,
                  background: avatarColor(rv.profiles?.full_name || 'U'),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 11, fontWeight: 700
                }}>{initials(rv.profiles?.full_name || 'Usuario')}</div>
                <span style={{ fontWeight: 600, fontSize: 13, color: D }}>{rv.profiles?.full_name || 'Usuario'}</span>
                <StarRating rating={rv.rating} reviews={1} sz={11} />
              </div>
              <span style={{ fontSize: 11, color: '#cbd5e1' }}>{new Date(rv.created_at).toLocaleDateString('es-VE')}</span>
            </div>
            {rv.comment && <p style={{ margin: 0, color: '#64748b', fontSize: 13, paddingLeft: 38, lineHeight: 1.5 }}>{rv.comment}</p>}
          </div>
        )) : (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#94a3b8' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16, background: '#f8fafc',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 12px',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>Aún no hay opiniones</p>
            <p style={{ fontSize: 12 }}>Sé el primero en compartir tu experiencia</p>
          </div>
        )}

        {/* Review form */}
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Deja tu opinión</h4>
          <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} onClick={() => user ? setRating(n) : setShowAuth(true)}
                style={{
                  fontSize: 32, background: 'none', border: 'none', cursor: 'pointer',
                  color: n <= rating ? '#f59e0b' : '#e2e8f0', padding: 0,
                  transition: 'transform 0.1s, color 0.15s',
                  transform: n <= rating ? 'scale(1.1)' : 'scale(1)',
                }}>★</button>
            ))}
          </div>
          {user && rating > 0 && (
            <>
              <textarea value={comment} onChange={e => setComment(e.target.value)}
                placeholder="¿Cómo fue tu experiencia? (opcional)" maxLength={500} rows={3}
                style={{
                  width: '100%', padding: 12, borderRadius: 12,
                  border: '1.5px solid #e2e8f0', resize: 'vertical', fontSize: 14,
                  boxSizing: 'border-box', marginBottom: 8, outline: 'none',
                }} />
              <button onClick={handleReview} disabled={submitting} className="btn-press" style={{
                width: '100%', padding: 12, borderRadius: 12, border: 'none',
                background: submitting ? '#e2e8f0' : Y, color: D, fontWeight: 700,
                fontSize: 14, cursor: submitting ? 'default' : 'pointer',
              }}>
                {submitting ? 'Enviando...' : 'Enviar opinión'}
              </button>
            </>
          )}
          {!user && <p style={{ color: '#94a3b8', fontSize: 13 }}>Inicia sesión para dejar tu opinión</p>}
          {reviewMsg && (
            <div style={{
              padding: '10px 14px', borderRadius: 10, marginTop: 8,
              background: reviewMsg.includes('correctamente') ? '#f0fdf4' : '#fef2f2',
              color: reviewMsg.includes('correctamente') ? '#166534' : R,
              fontSize: 13, border: `1px solid ${reviewMsg.includes('correctamente') ? '#bbf7d0' : '#fecaca'}`,
            }}>{reviewMsg}</div>
          )}
        </div>
      </div>
    </div>
  )
}
