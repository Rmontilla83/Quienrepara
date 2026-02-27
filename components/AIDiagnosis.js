'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { getSupabaseClient } from '@/lib/supabase'
import { localDiagnose } from '@/lib/utils'
import { Y, YL, GL, PG, PL, D, R } from '@/lib/theme'
import { SparkleIcon } from './Icons'

export default function AIDiagnosis() {
  const [msgs, setMsgs] = useState([{ rl: 'ai', tx: '¡Hola! Soy tu asistente de **QuiénRepara**.\n\nCuéntame: **¿qué se dañó?** Te digo qué puede ser y te conecto con el mejor técnico.' }])
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

    try {
      const sb = getSupabaseClient()
      const headers = { 'Content-Type': 'application/json' }
      if (sb) {
        const { data: { session } } = await sb.auth.getSession()
        if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`
      }
      const res = await fetch('/api/diagnose', { method: 'POST', headers, body: JSON.stringify({ message: t, history: histRef.current.slice(-6) }) })
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

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', height: 'calc(100dvh - 170px)' }}>
      <div style={{ padding: 16, textAlign: 'center', borderBottom: '1px solid #e5e7eb', background: '#fff' }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: PG, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', color: '#fff' }}>
          <SparkleIcon sz={22} c="#fff" fill="#fff" />
        </div>
        <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Diagnóstico Inteligente</h1>
        <p style={{ color: '#94a3b8', fontSize: 13, margin: '4px 0 0' }}>Describe tu problema con tus propias palabras</p>
      </div>

      <div style={{ flex: 1, padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {msgs.map((m, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: m.rl === 'user' ? 'flex-end' : 'flex-start', gap: 8 }}>
              {m.rl === 'ai' && <div style={{ width: 28, height: 28, borderRadius: 9, background: PG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0, color: '#fff' }}><SparkleIcon sz={14} c="#fff" fill="#fff" /></div>}
              <div style={{ maxWidth: '82%', padding: '10px 14px', borderRadius: m.rl === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: m.rl === 'user' ? Y : '#fff', color: D, fontSize: 14, border: m.rl === 'ai' ? '1px solid #e5e7eb' : 'none' }}>{md(m.tx)}</div>
            </div>
            {m.tip && <div style={{ marginLeft: 36, marginTop: 8, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '10px 14px', fontSize: 13 }}><strong style={{ color: '#92400e' }}>Consejo rápido:</strong><div style={{ color: '#78350f', marginTop: 4 }}>{m.tip}</div></div>}
            {m.c && (
              <div style={{ marginLeft: 36, marginTop: 8 }}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                  {m.u && <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: m.u === 'alta' ? '#fef2f2' : m.u === 'media' ? YL : GL, color: m.u === 'alta' ? R : m.u === 'media' ? '#92400e' : '#166534' }}>Urgencia {m.u}</span>}
                  {m.cost && <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: '#f0f9ff', color: '#0c4a6e' }}>{m.cost}</span>}
                </div>
                <Link href={`/buscar?cat=${m.c}`} style={{ display: 'block', padding: '12px 20px', borderRadius: 12, border: 'none', background: Y, color: D, fontSize: 14, fontWeight: 700, textAlign: 'center', textDecoration: 'none' }}>
                  Ver técnicos de {catNames[m.c] || m.c}
                </Link>
              </div>
            )}
          </div>
        ))}
        {typ && (
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 9, background: PG, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><SparkleIcon sz={14} c="#fff" fill="#fff" /></div>
            <div style={{ padding: '10px 16px', borderRadius: '14px 14px 14px 4px', background: '#fff', border: '1px solid #e5e7eb', display: 'flex', gap: 4 }}>
              {[0, 1, 2].map(i => <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#cbd5e1', animation: `pulse2 1.2s infinite ${i * .2}s` }} />)}
            </div>
          </div>
        )}
        <div ref={ref} />
      </div>

      {msgs.length === 1 && (
        <div style={{ padding: '0 16px 8px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['Mi nevera no enfría', 'El aire bota agua', 'Fuga en el baño', 'Celular no carga'].map(q => (
            <button key={q} onClick={() => setInp(q)} style={{ padding: '6px 12px', borderRadius: 16, border: '1px solid #e5e7eb', background: '#fff', color: '#6b7280', fontSize: 12, cursor: 'pointer' }}>{q}</button>
          ))}
        </div>
      )}

      <div style={{ padding: '10px 16px', borderTop: '1px solid #e5e7eb', background: '#fff', display: 'flex', gap: 8 }}>
        <input ref={iRef} value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Ej: mi nevera no enfría..." style={{ flex: 1, padding: '12px 16px', borderRadius: 24, border: '1.5px solid #e5e7eb', fontSize: 15, outline: 'none' }} />
        <button onClick={send} disabled={!inp.trim()} style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', background: inp.trim() ? PG : '#e5e7eb', color: inp.trim() ? '#fff' : '#9ca3af', fontSize: 18, cursor: inp.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>↑</button>
      </div>

      <p style={{ textAlign: 'center', color: '#cbd5e1', fontSize: 10, padding: '4px 0' }}>
        Este diagnóstico es orientativo y no reemplaza la evaluación de un profesional.
      </p>
    </div>
  )
}
