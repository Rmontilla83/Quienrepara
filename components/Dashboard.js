'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Y, YD, YL, PG, PL, G, GL, D, R } from '@/lib/theme'

const CATS=[{id:'hogar',n:'Hogar'},{id:'electronica',n:'Electrónica'},{id:'automotriz',n:'Automotriz'},{id:'servicios',n:'Servicios'},{id:'salud',n:'Eq. Médicos'}]
const STATES=[{id:'an',n:'Anzoátegui'},{id:'dc',n:'Distrito Capital'},{id:'mi',n:'Miranda'},{id:'zu',n:'Zulia'},{id:'ca',n:'Carabobo'},{id:'la',n:'Lara'},{id:'ar',n:'Aragua'},{id:'bo',n:'Bolívar'},{id:'ne',n:'Nueva Esparta'},{id:'ta',n:'Táchira'}]

export default function Dashboard() {
  const { user, userRole: role, logout } = useAuth()
  const router = useRouter()
  const [rep, setRep] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)
  const [profile, setProfile] = useState(null)
  const sb = getSupabaseClient()

  useEffect(() => {
    async function load() {
      const { data: p } = await sb.from('profiles').select('*').eq('id', user.id).single()
      setProfile(p)
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
    else setMsg({ type: 'ok', text: 'Perfil actualizado correctamente' })
    setSaving(false)
  }

  function upd(k, v) { setRep(prev => ({ ...prev, [k]: v })) }

  if (!user) { router.push('/'); return null }
  if (loading) return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 14, margin: '0 auto 12px' }} />
      <div className="skeleton" style={{ width: 160, height: 16, borderRadius: 6, margin: '0 auto' }} />
    </div>
  )

  const isRepairer = profile?.role === 'repairer'

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 16 }}>
      {/* User Card */}
      <div className="fade-up" style={{
        background: '#fff', borderRadius: 20, border: '1px solid #f1f5f9',
        padding: 24, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 18, background: PG,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 22, fontWeight: 800,
            boxShadow: '0 4px 12px rgba(139,92,246,0.25)',
          }}>
            {(profile?.full_name || user.email)?.[0]?.toUpperCase() || '?'}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, letterSpacing: '-0.3px' }}>{profile?.full_name || 'Usuario'}</h2>
            <p style={{ margin: '2px 0 6px', color: '#94a3b8', fontSize: 13 }}>{user.email}</p>
            <span style={{
              fontSize: 11, padding: '3px 10px', borderRadius: 6,
              background: isRepairer ? '#fffbeb' : '#f0f9ff',
              color: isRepairer ? '#92400e' : '#0c4a6e',
              fontWeight: 700, border: `1px solid ${isRepairer ? '#fde68a' : '#bae6fd'}`,
            }}>
              {isRepairer ? '🔧 Reparador' : '🔍 Cliente'}
            </span>
          </div>
        </div>
        {role === 'admin' && (
          <Link href="/admin" className="btn-press" style={{
            padding: '12px 20px', borderRadius: 12,
            border: '2px solid #fecaca', background: '#fff', color: '#dc2626',
            fontSize: 13, fontWeight: 700, cursor: 'pointer', width: '100%',
            marginBottom: 10, display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 6, textDecoration: 'none',
          }}>
            Panel de Administración
          </Link>
        )}
        <button onClick={() => { logout(); router.push('/') }} className="btn-press" style={{
          padding: '12px 20px', borderRadius: 12,
          border: '1px solid #fecaca', background: '#fff', color: R,
          fontSize: 13, fontWeight: 600, cursor: 'pointer', width: '100%',
        }}>Cerrar Sesión</button>
      </div>

      {/* Repairer Dashboard */}
      {isRepairer && rep && (
        <div className="fade-up" style={{
          background: '#fff', borderRadius: 20, border: '1px solid #f1f5f9',
          padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          animationDelay: '.08s',
        }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4, letterSpacing: '-0.3px' }}>Mi Negocio</h3>
          <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 20 }}>Edita tu perfil visible para los clientes</p>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 20 }}>
            <div style={{ background: '#fffbeb', borderRadius: 14, padding: '14px 12px', textAlign: 'center', border: '1px solid #fde68a' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: YD }}>{rep.avg_rating ? Number(rep.avg_rating).toFixed(1) : '—'}</div>
              <div style={{ fontSize: 11, color: '#92400e', fontWeight: 500 }}>Rating</div>
            </div>
            <div style={{ background: '#f5f3ff', borderRadius: 14, padding: '14px 12px', textAlign: 'center', border: '1px solid #e9d5ff' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: PL }}>{rep.total_reviews || 0}</div>
              <div style={{ fontSize: 11, color: '#6d28d9', fontWeight: 500 }}>Opiniones</div>
            </div>
            <div style={{ background: rep.is_active ? '#f0fdf4' : '#fef2f2', borderRadius: 14, padding: '14px 12px', textAlign: 'center', border: `1px solid ${rep.is_active ? '#bbf7d0' : '#fecaca'}` }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: rep.is_active ? G : R }}>{rep.is_active ? '✓' : '✗'}</div>
              <div style={{ fontSize: 11, color: rep.is_active ? '#166534' : '#dc2626', fontWeight: 500 }}>Activo</div>
            </div>
          </div>

          {/* Visibility toggle */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', background: rep.is_active ? GL : '#fef2f2',
            borderRadius: 14, marginBottom: 20,
            border: `1px solid ${rep.is_active ? '#bbf7d0' : '#fecaca'}`,
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{rep.is_active ? 'Visible para clientes' : 'Perfil oculto'}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{rep.is_active ? 'Tu perfil aparece en búsquedas' : 'Completa tu perfil para activar'}</div>
            </div>
            <button onClick={() => upd('is_active', !rep.is_active)} className="btn-press" style={{
              padding: '8px 16px', borderRadius: 10, border: 'none',
              background: rep.is_active ? '#fff' : G,
              color: rep.is_active ? '#64748b' : '#fff',
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              boxShadow: rep.is_active ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
            }}>
              {rep.is_active ? 'Desactivar' : 'Activar'}
            </button>
          </div>

          {msg && (
            <div style={{
              padding: '12px 16px', borderRadius: 12, marginBottom: 16,
              background: msg.type === 'ok' ? '#f0fdf4' : '#fef2f2',
              color: msg.type === 'ok' ? '#166534' : R, fontSize: 13, fontWeight: 500,
              border: `1px solid ${msg.type === 'ok' ? '#bbf7d0' : '#fecaca'}`,
            }}>{msg.text}</div>
          )}

          <form onSubmit={saveRepairer}>
            <Field l="Nombre del negocio *" v={rep.business_name} set={v => upd('business_name', v)} ph="Ej: Refrigeración Mardelli" req />
            <Field l="Nombre de contacto *" v={rep.contact_name} set={v => upd('contact_name', v)} ph="Tu nombre completo" req />

            <label style={labelS}>Categoría *</label>
            <select value={rep.category_id} onChange={e => upd('category_id', e.target.value)} style={{ ...inpS, marginBottom: 14 }}>
              {CATS.map(c => <option key={c.id} value={c.id}>{c.n}</option>)}
            </select>

            <Field l="Descripción *" v={rep.description} set={v => upd('description', v)} ph="Describe tus servicios, especialidades, experiencia..." area req />

            <label style={labelS}>Estado *</label>
            <select value={rep.state_id} onChange={e => upd('state_id', e.target.value)} style={{ ...inpS, marginBottom: 14 }}>
              {STATES.map(s => <option key={s.id} value={s.id}>{s.n}</option>)}
            </select>

            <Field l="Ciudad *" v={rep.city} set={v => upd('city', v)} ph="Ej: Barcelona, Lechería" req />
            <Field l="Teléfono principal *" v={rep.phone} set={v => upd('phone', v)} ph="0414-000-0000" req />
            <Field l="Email de contacto" v={rep.email || ''} set={v => upd('email', v)} ph="tu@email.com" />
            <Field l="WhatsApp (si es diferente)" v={rep.whatsapp || ''} set={v => upd('whatsapp', v)} ph="0414-000-0000" />
            <Field l="Instagram" v={rep.instagram || ''} set={v => upd('instagram', v)} ph="@tunegocio" />
            <Field l="Horario" v={rep.hours || ''} set={v => upd('hours', v)} ph="Lun-Vie 8am-5pm, Sáb 8am-12pm" />

            <button type="submit" disabled={saving} className="btn-press" style={{
              width: '100%', padding: 15, borderRadius: 14, border: 'none',
              background: saving ? '#e2e8f0' : Y, color: D,
              fontSize: 16, fontWeight: 700, cursor: saving ? 'default' : 'pointer',
              marginTop: 8, boxShadow: saving ? 'none' : '0 2px 8px rgba(251,191,36,0.3)',
            }}>
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </form>

          {/* Premium CTA */}
          {!rep.is_premium && (
            <div style={{
              background: 'linear-gradient(135deg, #1e293b, #334155)',
              borderRadius: 18, padding: 22, marginTop: 20, textAlign: 'center',
              border: '1px solid rgba(251,191,36,0.15)',
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>⚡</div>
              <h4 style={{ color: '#fff', fontSize: 18, fontWeight: 800, marginBottom: 4, letterSpacing: '-0.3px' }}>Hazte Premium</h4>
              <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 14, lineHeight: 1.5 }}>WhatsApp directo, badge destacado y más visibilidad en búsquedas</p>
              <button className="btn-press" style={{
                padding: '12px 28px', borderRadius: 12, border: 'none',
                background: Y, color: D, fontWeight: 700, fontSize: 14, cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(251,191,36,0.3)',
              }}>Planes desde $5/mes</button>
            </div>
          )}
        </div>
      )}

      {/* Client view */}
      {!isRepairer && (
        <div className="fade-up" style={{
          background: '#fff', borderRadius: 20, border: '1px solid #f1f5f9',
          padding: 24, textAlign: 'center', animationDelay: '.08s',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20, background: '#f0f9ff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px', fontSize: 28,
          }}>🔍</div>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6, letterSpacing: '-0.3px' }}>Cuenta de Cliente</h3>
          <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 20, lineHeight: 1.5 }}>
            Usa el diagnóstico IA para encontrar al técnico ideal, o busca directamente por categoría.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link href="/diagnostico" className="btn-press" style={{
              padding: '14px', borderRadius: 14, background: PG, color: '#fff',
              fontWeight: 700, fontSize: 15, textDecoration: 'none', textAlign: 'center',
              boxShadow: '0 4px 12px rgba(139,92,246,0.25)',
            }}>
              Diagnosticar con IA
            </Link>
            <Link href="/buscar" className="btn-press" style={{
              padding: '14px', borderRadius: 14, border: '2px solid #e2e8f0',
              background: '#fff', color: D, fontWeight: 700, fontSize: 15,
              textDecoration: 'none', textAlign: 'center',
            }}>
              Buscar reparadores
            </Link>
          </div>
          <div style={{
            background: '#f8fafc', borderRadius: 14, padding: 18, marginTop: 20,
            textAlign: 'left', border: '1px solid #f1f5f9',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: '#64748b' }}>Próximamente:</div>
            <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 2 }}>
              Guardar reparadores favoritos<br />
              Historial de solicitudes<br />
              Notificaciones de disponibilidad
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
    {area ? <textarea value={v} onChange={e => set(e.target.value)} placeholder={ph} required={req} rows={3} style={{ ...inpS, resize: 'vertical', marginBottom: 14 }} />
    : <input value={v} onChange={e => set(e.target.value)} placeholder={ph} required={req} style={{ ...inpS, marginBottom: 14 }} />}
  </>
}

const labelS = { fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }
const inpS = {
  width: '100%', padding: '12px 16px', borderRadius: 12,
  border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none',
  boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s',
}
