'use client'
import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/supabase'

const Y="#fbbf24",YD="#f59e0b",YL="#fef3c7",PG="linear-gradient(135deg,#8b5cf6,#6d28d9)",PL="#8b5cf6",G="#22c55e",GL="#dcfce7",D="#0f172a",R="#ef4444",WA="#25D366"

const CATS=[{id:'hogar',n:'Hogar 🏠'},{id:'electronica',n:'Electrónica 📱'},{id:'automotriz',n:'Automotriz 🚗'},{id:'servicios',n:'Servicios 🔧'},{id:'salud',n:'Eq. Médicos 🏥'}]
const STATES=[{id:'an',n:'Anzoátegui'},{id:'dc',n:'Distrito Capital'},{id:'mi',n:'Miranda'},{id:'zu',n:'Zulia'},{id:'ca',n:'Carabobo'},{id:'la',n:'Lara'},{id:'ar',n:'Aragua'},{id:'bo',n:'Bolívar'},{id:'ne',n:'Nueva Esparta'},{id:'ta',n:'Táchira'}]

export default function Dashboard({ user, role, onBack, onLogout, onAdmin }) {
  const [rep, setRep] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)
  const [profile, setProfile] = useState(null)
  const sb = getSupabaseClient()

  useEffect(() => {
    async function load() {
      // Load profile
      const { data: p } = await sb.from('profiles').select('*').eq('id', user.id).single()
      setProfile(p)

      // Load repairer if exists
      const { data: r } = await sb.from('repairers').select('*').eq('user_id', user.id).single()
      if (r) setRep(r)
      else setRep(null)
      setLoading(false)
    }
    load()
  }, [user.id])

  async function saveRepairer(e) {
    e.preventDefault()
    setSaving(true); setMsg(null)
    const { error } = await sb.from('repairers').update({
      business_name: rep.business_name,
      contact_name: rep.contact_name,
      category_id: rep.category_id,
      description: rep.description,
      state_id: rep.state_id,
      city: rep.city,
      phone: rep.phone,
      email: rep.email || null,
      whatsapp: rep.whatsapp || null,
      instagram: rep.instagram || null,
      hours: rep.hours || null,
      is_active: rep.is_active,
    }).eq('id', rep.id)
    if (error) setMsg({ type: 'error', text: error.message })
    else setMsg({ type: 'ok', text: '✅ Perfil actualizado correctamente' })
    setSaving(false)
  }

  function upd(k, v) { setRep(prev => ({ ...prev, [k]: v })) }

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Cargando...</div>

  const isRepairer = profile?.role === 'repairer'

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 16 }}>
      <button onClick={onBack} style={{ border: 'none', background: 'none', color: '#94a3b8', fontSize: 14, cursor: 'pointer', marginBottom: 12, padding: 0 }}>← Volver</button>

      {/* User Card */}
      <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #e5e7eb', padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: PG, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 22, fontWeight: 700 }}>
            {(profile?.full_name || user.email)?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{profile?.full_name || 'Usuario'}</h2>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: 13 }}>{user.email}</p>
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: isRepairer ? YL : '#f0f9ff', color: isRepairer ? '#92400e' : '#0c4a6e', fontWeight: 700, marginTop: 4, display: 'inline-block' }}>
              {isRepairer ? '🔧 Reparador' : '🔍 Cliente'}
            </span>
          </div>
        </div>
        {role==='admin'&&<button onClick={onAdmin} style={{ padding: '10px 20px', borderRadius: 10, border: '2px solid #dc2626', background: '#fff', color: '#dc2626', fontSize: 13, fontWeight: 600, cursor: 'pointer', width: '100%', marginBottom: 10, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>🛡️ Panel de Administración</button>}
        <button onClick={onLogout} style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid #fecaca', background: '#fff', color: R, fontSize: 13, fontWeight: 600, cursor: 'pointer', width: '100%' }}>Cerrar Sesión</button>
      </div>

      {/* Repairer Dashboard */}
      {isRepairer && rep && (
        <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #e5e7eb', padding: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>🔧 Mi Negocio</h3>
          <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 20 }}>Edita tu perfil visible para los clientes</p>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 20 }}>
            <div style={{ background: '#f8fafc', borderRadius: 12, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: YD }}>{rep.avg_rating ? Number(rep.avg_rating).toFixed(1) : '—'}</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>Rating</div>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: 12, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: PL }}>{rep.total_reviews || 0}</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>Opiniones</div>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: 12, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: rep.is_active ? G : R }}>{rep.is_active ? '✓' : '✗'}</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>Activo</div>
            </div>
          </div>

          {/* Visibility toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: rep.is_active ? GL : '#fef2f2', borderRadius: 12, marginBottom: 20, border: `1px solid ${rep.is_active ? '#bbf7d0' : '#fecaca'}` }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{rep.is_active ? '🟢 Visible para clientes' : '🔴 Perfil oculto'}</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>{rep.is_active ? 'Tu perfil aparece en búsquedas' : 'Completa tu perfil para activar'}</div>
            </div>
            <button onClick={() => upd('is_active', !rep.is_active)} style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: rep.is_active ? '#fff' : G, color: rep.is_active ? '#6b7280' : '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
              {rep.is_active ? 'Desactivar' : 'Activar'}
            </button>
          </div>

          {msg && <div style={{ padding: '10px 14px', borderRadius: 10, marginBottom: 16, background: msg.type === 'ok' ? '#f0fdf4' : '#fef2f2', color: msg.type === 'ok' ? '#166534' : R, fontSize: 13, border: `1px solid ${msg.type === 'ok' ? '#bbf7d0' : '#fecaca'}` }}>{msg.text}</div>}

          <form onSubmit={saveRepairer}>
            <Field l="Nombre del negocio *" v={rep.business_name} set={v=>upd('business_name',v)} ph="Ej: Refrigeración Mardelli" req />
            <Field l="Nombre de contacto *" v={rep.contact_name} set={v=>upd('contact_name',v)} ph="Tu nombre completo" req />
            
            <label style={labelS}>Categoría *</label>
            <select value={rep.category_id} onChange={e=>upd('category_id',e.target.value)} style={{...inpS, marginBottom: 12}}>
              {CATS.map(c=><option key={c.id} value={c.id}>{c.n}</option>)}
            </select>

            <Field l="Descripción *" v={rep.description} set={v=>upd('description',v)} ph="Describe tus servicios, especialidades, experiencia..." area req />

            <label style={labelS}>Estado *</label>
            <select value={rep.state_id} onChange={e=>upd('state_id',e.target.value)} style={{...inpS, marginBottom: 12}}>
              {STATES.map(s=><option key={s.id} value={s.id}>{s.n}</option>)}
            </select>

            <Field l="Ciudad *" v={rep.city} set={v=>upd('city',v)} ph="Ej: Barcelona, Lechería" req />
            <Field l="Teléfono principal *" v={rep.phone} set={v=>upd('phone',v)} ph="0414-000-0000" req />
            <Field l="Email de contacto" v={rep.email||''} set={v=>upd('email',v)} ph="tu@email.com" />
            <Field l="WhatsApp (si es diferente)" v={rep.whatsapp||''} set={v=>upd('whatsapp',v)} ph="0414-000-0000" />
            <Field l="Instagram" v={rep.instagram||''} set={v=>upd('instagram',v)} ph="@tunegocio" />
            <Field l="Horario" v={rep.hours||''} set={v=>upd('hours',v)} ph="Lun-Vie 8am-5pm, Sáb 8am-12pm" />

            <button type="submit" disabled={saving} style={{ width: '100%', padding: 14, borderRadius: 12, border: 'none', background: saving ? '#e5e7eb' : Y, color: D, fontSize: 16, fontWeight: 700, cursor: saving ? 'default' : 'pointer', marginTop: 8 }}>
              {saving ? 'Guardando...' : '💾 Guardar Cambios'}
            </button>
          </form>

          {/* Premium CTA */}
          {!rep.is_premium && (
            <div style={{ background: D, borderRadius: 14, padding: 20, marginTop: 20, textAlign: 'center' }}>
              <h4 style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>⚡ Hazte Premium</h4>
              <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 12 }}>WhatsApp directo, badge destacado y más visibilidad</p>
              <button style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: Y, color: D, fontWeight: 700, cursor: 'pointer' }}>Planes desde $5/mes</button>
            </div>
          )}
        </div>
      )}

      {/* Client view */}
      {!isRepairer && (
        <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #e5e7eb', padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Cuenta de Cliente</h3>
          <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 20 }}>Pronto podrás guardar favoritos, dejar opiniones y más.</p>
          <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16, textAlign: 'left' }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Próximamente:</div>
            <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 2 }}>
              ⭐ Guardar reparadores favoritos<br/>
              💬 Dejar opiniones y calificaciones<br/>
              📋 Historial de solicitudes<br/>
              🔔 Notificaciones de disponibilidad
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ l, v, set, ph, req, area }) {
  return <>
    <label style={labelS}>{l}</label>
    {area ? <textarea value={v} onChange={e=>set(e.target.value)} placeholder={ph} required={req} rows={3} style={{...inpS, resize:'vertical', marginBottom:12}} />
    : <input value={v} onChange={e=>set(e.target.value)} placeholder={ph} required={req} style={{...inpS, marginBottom:12}} />}
  </>
}

const labelS = { fontSize:13, fontWeight:600, color:'#374151', display:'block', marginBottom:4 }
const inpS = { width:'100%', padding:'11px 14px', borderRadius:10, border:'1.5px solid #e5e7eb', fontSize:14, outline:'none', boxSizing:'border-box' }
