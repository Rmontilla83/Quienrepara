'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { track } from '@vercel/analytics'
import { getSupabaseClient } from '@/lib/supabase'
import { localDiagnose } from '@/lib/utils'
import { Y, YL, GL, PG, PL, D, R } from '@/lib/theme'
import { SparkleIcon } from './Icons'

export default function AIDiagnosis() {
  const [msgs, setMsgs] = useState([{
    rl: 'ai',
    tx: '¡Hola! Soy tu asistente de **QuiénRepara**.\n\nCuéntame: **¿qué se dañó?** Te digo qué puede ser y te conecto con el mejor técnico.'
  }])
  const [inp, setInp] = useState('')
  const [typ, setTyp] = useState(false)
  const ref = useRef(null)
  const iRef = useRef(null)
  const histRef = useRef([])

  useEffect(() => { ref.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])
  useEffect(() => { iRef.current?.focus() }, [])

  const catNames = { hogar: 'Hogar', electronica: 'Electrónica', automotriz: 'Automotriz', servicios: 'Servicios', salud: 'Salud' }

  const send = async () => {
    if (!inp.trim() || typ) return
    const t = inp.trim()
    setInp('')
    setMsgs(p => [...p, { rl: 'user', tx: t }])
    setTyp(true)
    histRef.current.push({ role: 'user', text: t })
    track('ai_diagnosis', { query: t.slice(0, 50) })

    try {
      const sb = getSupabaseClient()
      const headers = { 'Content-Type': 'application/json' }
      let isAuth = false
      if (sb) {
        const { data: { session } } = await sb.auth.getSession()
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`
          isAuth = true
        }
      }

      // If not authenticated, use local diagnosis directly (no friction)
      if (!isAuth) {
        const r = localDiagnose(t)
        histRef.current.push({ role: 'ai', text: r.t })
        setMsgs(p => [...p, { rl: 'ai', tx: r.t, tip: r.tip, c: r.c, u: r.u, cost: r.cost }])
        setTyp(false)
        return
      }

      const res = await fetch('/api/diagnose', {
        method: 'POST', headers,
        body: JSON.stringify({ message: t, history: histRef.current.slice(-6) })
      })
      if (res.status === 401 || res.status === 429) {
        const r = localDiagnose(t)
        setMsgs(p => [...p, { rl: 'ai', tx: r.t, tip: r.tip, c: r.c, u: r.u, cost: r.cost }])
        setTyp(false); return
      }
      const data = await res.json()
      if (data.error) { setMsgs(p => [...p, { rl: 'ai', tx: 'Lo siento, hubo un error. Intenta de nuevo.' }]); setTyp(false); return }
      const aiText = data.diagnostico || (data.preguntas || 'Cuéntame más sobre el problema.')
      histRef.current.push({ role: 'ai', text: aiText })
      setMsgs(p => [...p, { rl: 'ai', tx: aiText, tip: data.consejo, c: data.categoria, u: data.urgencia, cost: data.costo_estimado }])
    } catch (e) {
      const r = localDiagnose(t)
      setMsgs(p => [...p, { rl: 'ai', tx: r.t, tip: r.tip, c: r.c, u: r.u, cost: r.cost }])
    }
    setTyp(false)
  }

  const md = t => t.split('\n').map((l, i) => {
    let h = l.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^• /, '&bull; ')
    return <p key={i} style={{ margin: '3px 0', lineHeight: 1.65 }} dangerouslySetInnerHTML={{ __html: h || '&nbsp;' }} />
  })

  const urgencyStyles = {
    alta: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
    media: { bg: '#fffbeb', color: '#92400e', border: '#fde68a' },
    baja: { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', height: 'calc(100dvh - 170px)' }}>
      {/* Header */}
      <div style={{
        padding: '16px 16px 12px', textAlign: 'center',
        borderBottom: '1px solid #f1f5f9', background: '#fff',
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 16, background: PG,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 8px', color: '#fff',
          boxShadow: '0 4px 12px rgba(139,92,246,0.3)',
        }}>
          <SparkleIcon sz={24} c="#fff" fill="#fff" />
        </div>
        <h1 style={{ fontSize: 18, fontWeight: 800, margin: 0, letterSpacing: '-0.3px' }}>Diagnóstico Inteligente</h1>
        <p style={{ color: '#94a3b8', fontSize: 13, margin: '4px 0 0' }}>Describe tu problema con tus propias palabras</p>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {msgs.map((m, i) => (
          <div key={i} className={i > 0 ? 'fade-up' : ''}>
            <div style={{ display: 'flex', justifyContent: m.rl === 'user' ? 'flex-end' : 'flex-start', gap: 8 }}>
              {m.rl === 'ai' && (
                <div style={{
                  width: 30, height: 30, borderRadius: 10, background: PG,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, flexShrink: 0, color: '#fff',
                  boxShadow: '0 2px 6px rgba(139,92,246,0.2)',
                }}>
                  <SparkleIcon sz={14} c="#fff" fill="#fff" />
                </div>
              )}
              <div style={{
                maxWidth: '82%', padding: '12px 16px',
                borderRadius: m.rl === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: m.rl === 'user' ? Y : '#fff',
                color: D, fontSize: 14,
                border: m.rl === 'ai' ? '1px solid #f1f5f9' : 'none',
                boxShadow: m.rl === 'ai' ? '0 1px 3px rgba(0,0,0,0.04)' : 'none',
              }}>{md(m.tx)}</div>
            </div>

            {/* Tip */}
            {m.tip && (
              <div style={{
                marginLeft: 38, marginTop: 8, background: '#fffbeb',
                border: '1px solid #fde68a', borderRadius: 12,
                padding: '12px 16px', fontSize: 13,
              }}>
                <strong style={{ color: '#92400e', fontSize: 12, letterSpacing: '0.3px' }}>CONSEJO</strong>
                <div style={{ color: '#78350f', marginTop: 4, lineHeight: 1.5 }}>{m.tip}</div>
              </div>
            )}

            {/* Category + urgency + CTA */}
            {m.c && (
              <div style={{ marginLeft: 38, marginTop: 8 }}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                  {m.u && (() => {
                    const s = urgencyStyles[m.u] || urgencyStyles.media
                    return (
                      <span style={{
                        padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                        background: s.bg, color: s.color, border: `1px solid ${s.border}`,
                      }}>Urgencia {m.u}</span>
                    )
                  })()}
                  {m.cost && (
                    <span style={{
                      padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                      background: '#f0f9ff', color: '#0c4a6e', border: '1px solid #bae6fd',
                    }}>{m.cost}</span>
                  )}
                </div>
                <Link href={`/buscar?cat=${m.c}`} className="btn-press" style={{
                  display: 'block', padding: '14px 20px', borderRadius: 14,
                  border: 'none', background: Y, color: D,
                  fontSize: 14, fontWeight: 700, textAlign: 'center', textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(251,191,36,0.3)',
                }}>
                  Ver técnicos de {catNames[m.c] || m.c} →
                </Link>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {typ && (
          <div className="fade-in" style={{ display: 'flex', gap: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 10, background: PG,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
            }}>
              <SparkleIcon sz={14} c="#fff" fill="#fff" />
            </div>
            <div style={{
              padding: '12px 18px', borderRadius: '16px 16px 16px 4px',
              background: '#fff', border: '1px solid #f1f5f9',
              display: 'flex', gap: 5, alignItems: 'center',
            }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  width: 7, height: 7, borderRadius: '50%', background: '#cbd5e1',
                  animation: `pulse2 1.2s infinite ${i * .2}s`
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={ref} />
      </div>

      {/* Suggested questions */}
      {msgs.length === 1 && (
        <div style={{ padding: '0 16px 8px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['Mi nevera no enfría', 'El aire bota agua', 'Fuga en el baño', 'Celular no carga'].map(q => (
            <button key={q} onClick={() => setInp(q)} className="btn-press" style={{
              padding: '8px 14px', borderRadius: 10,
              border: '1.5px solid #e2e8f0', background: '#fff', color: '#475569',
              fontSize: 12, fontWeight: 500, cursor: 'pointer',
            }}>{q}</button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div style={{
        padding: '10px 16px', borderTop: '1px solid #f1f5f9',
        background: '#fff', display: 'flex', gap: 8,
      }}>
        <input ref={iRef} value={inp}
          onChange={e => setInp(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ej: mi nevera no enfría..."
          style={{
            flex: 1, padding: '12px 18px', borderRadius: 14,
            border: '1.5px solid #e2e8f0', fontSize: 15, outline: 'none',
            transition: 'border-color 0.2s',
          }} />
        <button onClick={send} disabled={!inp.trim()} className="btn-press" style={{
          width: 48, height: 48, borderRadius: 14, border: 'none',
          background: inp.trim() ? PG : '#e2e8f0',
          color: inp.trim() ? '#fff' : '#94a3b8',
          fontSize: 18, cursor: inp.trim() ? 'pointer' : 'default',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          boxShadow: inp.trim() ? '0 2px 8px rgba(139,92,246,0.3)' : 'none',
          transition: 'all 0.15s',
        }}>↑</button>
      </div>

      <p style={{ textAlign: 'center', color: '#e2e8f0', fontSize: 10, padding: '4px 0' }}>
        Diagnóstico orientativo — consulta siempre a un profesional.
      </p>
    </div>
  )
}
