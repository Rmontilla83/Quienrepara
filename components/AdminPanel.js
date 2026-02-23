'use client'
import { useState, useEffect, useRef } from 'react'
import { getSupabaseClient } from '@/lib/supabase'

const Y="#fbbf24",YD="#f59e0b",YL="#fef3c7",PG="linear-gradient(135deg,#8b5cf6,#6d28d9)",PL="#8b5cf6",G="#22c55e",GL="#dcfce7",D="#0f172a",R="#ef4444"

const CATS=[{id:'hogar',n:'Hogar'},{id:'electronica',n:'Electrónica'},{id:'automotriz',n:'Automotriz'},{id:'servicios',n:'Servicios'},{id:'salud',n:'Salud'}]
const STATES=[{id:'an',n:'Anzoátegui'},{id:'dc',n:'Distrito Capital'},{id:'mi',n:'Miranda'},{id:'zu',n:'Zulia'},{id:'ca',n:'Carabobo'},{id:'la',n:'Lara'},{id:'ar',n:'Aragua'},{id:'bo',n:'Bolívar'},{id:'ne',n:'Nueva Esparta'},{id:'ta',n:'Táchira'}]

export default function AdminPanel({ user, onBack }) {
  const [tab, setTab] = useState('overview')
  const [reps, setReps] = useState([])
  const [pending, setPending] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const sb = getSupabaseClient()

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setLoading(true)
    const [allR, pendR] = await Promise.all([
      sb.from('repairers').select('*').order('created_at', { ascending: false }).limit(200),
      sb.from('repairers').select('*').or('verification_status.eq.pending,verification_status.eq.review').order('created_at', { ascending: false }),
    ])
    const all = allR.data || []
    const pend = pendR.data || []
    setReps(all)
    setPending(pend)
    setStats({
      total: all.length,
      active: all.filter(r => r.is_active).length,
      verified: all.filter(r => r.is_verified).length,
      premium: all.filter(r => r.is_premium).length,
      pending: pend.length,
    })
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
      <button onClick={onBack} style={{ border: 'none', background: 'none', color: '#94a3b8', fontSize: 14, cursor: 'pointer', marginBottom: 12, padding: 0 }}>← Volver al perfil</button>

      <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #e5e7eb', padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🛡️</div>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Panel de Administración</h1>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: 13 }}>Gestión de reparadores y verificaciones</p>
          </div>
        </div>

        {!loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8 }}>
            <StatBox n={stats.total} l="Total" c="#3b82f6" />
            <StatBox n={stats.active} l="Activos" c={G} />
            <StatBox n={stats.verified} l="Verificados" c={PL} />
            <StatBox n={stats.premium} l="Premium" c={YD} />
            <StatBox n={stats.pending} l="Pendientes" c={R} />
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, overflowX: 'auto' }}>
        {[['overview','📊 Resumen'],['upload','📤 Carga Masiva'],['verify','✓ Verificaciones'],['manage','📋 Gestionar']].map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ padding: '10px 16px', borderRadius: 10, border: tab === id ? 'none' : '1px solid #e5e7eb', background: tab === id ? D : '#fff', color: tab === id ? '#fff' : '#6b7280', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>{label}</button>
        ))}
      </div>

      {tab === 'overview' && <Overview stats={stats} reps={reps} />}
      {tab === 'upload' && <BulkUpload sb={sb} user={user} onDone={loadData} />}
      {tab === 'verify' && <VerifyQueue pending={pending} sb={sb} onDone={loadData} />}
      {tab === 'manage' && <ManageReps reps={reps} sb={sb} onDone={loadData} />}
    </div>
  )
}

function StatBox({ n, l, c }) {
  return <div style={{ background: '#f8fafc', borderRadius: 12, padding: 12, textAlign: 'center' }}>
    <div style={{ fontSize: 24, fontWeight: 700, color: c }}>{n}</div>
    <div style={{ fontSize: 11, color: '#94a3b8' }}>{l}</div>
  </div>
}

// ============================================================
// OVERVIEW
// ============================================================
function Overview({ stats, reps }) {
  const byCat = CATS.map(c => ({ ...c, count: reps.filter(r => r.category_id === c.id).length }))
  const byCity = [...new Set(reps.map(r => r.city))].map(city => ({ city, count: reps.filter(r => r.city === city).length })).sort((a, b) => b.count - a.count).slice(0, 10)

  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb', padding: 20 }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Por Categoría</h3>
      {byCat.map(c => <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
        <span style={{ fontSize: 13 }}>{c.n}</span>
        <span style={{ fontSize: 13, fontWeight: 700 }}>{c.count}</span>
      </div>)}
    </div>
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb', padding: 20 }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Por Ciudad</h3>
      {byCity.map(c => <div key={c.city} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
        <span style={{ fontSize: 13 }}>{c.city}</span>
        <span style={{ fontSize: 13, fontWeight: 700 }}>{c.count}</span>
      </div>)}
    </div>
  </div>
}

// ============================================================
// BULK UPLOAD
// ============================================================
function BulkUpload({ sb, user, onDone }) {
  const [text, setText] = useState('')
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const fileRef = useRef(null)

  function parseData(raw) {
    let data = null
    // Try JSON first
    try {
      const parsed = JSON.parse(raw)
      data = Array.isArray(parsed) ? parsed : [parsed]
    } catch {
      // Try CSV
      const lines = raw.trim().split('\n')
      if (lines.length < 2) return null
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
      data = lines.slice(1).map(line => {
        // Handle quoted CSV fields
        const vals = []
        let current = ''
        let inQuotes = false
        for (const ch of line) {
          if (ch === '"') { inQuotes = !inQuotes }
          else if (ch === ',' && !inQuotes) { vals.push(current.trim()); current = '' }
          else { current += ch }
        }
        vals.push(current.trim())
        const obj = {}
        headers.forEach((h, i) => { obj[h] = vals[i] || '' })
        return obj
      })
    }
    return data
  }

  function mapToRepairer(row) {
    const stateMap = {'Anzoátegui':'an','Distrito Capital':'dc','Miranda':'mi','Zulia':'zu','Carabobo':'ca','Lara':'la','Aragua':'ar','Bolívar':'bo','Monagas':'mo','Sucre':'su'}
    return {
      business_name: row.nombre_empresa || row.business_name || row.nombre || '',
      contact_name: row.nombre_contacto || row.contact_name || row.contacto || '',
      category_id: row.categoria || row.category_id || 'hogar',
      subcategory_id: row.subcategoria || row.subcategory_id || null,
      description: row.descripcion || row.description || '',
      state_id: stateMap[row.estado] || row.state_id || 'an',
      city: row.ciudad || row.city || '',
      phone: row.telefono || row.phone || '',
      email: row.email || null,
      whatsapp: row.whatsapp || null,
      instagram: row.instagram || null,
      hours: row.horario || row.hours || null,
      is_verified: row.verificado === 'true' || row.verificado === true || false,
      is_active: true,
      verification_status: 'pending',
      source: row.fuente || row.source || 'bulk_import',
    }
  }

  function handlePreview() {
    const data = parseData(text)
    if (!data || !data.length) {
      setResult({ type: 'error', text: 'No se pudo parsear los datos. Verifica el formato JSON o CSV.' })
      return
    }
    const mapped = data.map(mapToRepairer).filter(r => r.business_name && r.city)
    setPreview(mapped)
    setResult(null)
  }

  async function handleUpload() {
    if (!preview?.length) return
    setUploading(true); setResult(null)
    let created = 0, updated = 0, errors = [], errDetails = []

    for (let i = 0; i < preview.length; i++) {
      const row = preview[i]
      // Check if repairer already exists by business_name + city
      const { data: existing } = await sb.from('repairers')
        .select('id, business_name, contact_name, phone, email, whatsapp, instagram, hours, description, subcategory_id')
        .eq('business_name', row.business_name)
        .eq('city', row.city)
        .limit(1)
        .single()

      if (existing) {
        // Update only empty/null fields
        const updates = {}
        if (!existing.contact_name && row.contact_name) updates.contact_name = row.contact_name
        if (!existing.phone && row.phone) updates.phone = row.phone
        if (!existing.email && row.email) updates.email = row.email
        if (!existing.whatsapp && row.whatsapp) updates.whatsapp = row.whatsapp
        if (!existing.instagram && row.instagram) updates.instagram = row.instagram
        if (!existing.hours && row.hours) updates.hours = row.hours
        if (!existing.description && row.description) updates.description = row.description
        if (!existing.subcategory_id && row.subcategory_id) updates.subcategory_id = row.subcategory_id

        if (Object.keys(updates).length > 0) {
          const { error } = await sb.from('repairers').update(updates).eq('id', existing.id)
          if (error) { errors.push(i); errDetails.push({ row: i, msg: error.message }) }
          else updated++
        }
      } else {
        // Insert new
        const { error } = await sb.from('repairers').insert(row)
        if (error) { errors.push(i); errDetails.push({ row: i, msg: error.message }) }
        else created++
      }
    }

    // Log import
    await sb.from('bulk_imports').insert({
      admin_id: user.id,
      filename: 'manual_paste',
      total_rows: preview.length,
      success_count: created + updated,
      error_count: errors.length,
      errors: errDetails.length ? errDetails : null,
    }).catch(() => {})

    setResult({
      type: errors.length && !created && !updated ? 'error' : errors.length ? 'partial' : 'ok',
      text: `✅ ${created} nuevos, 🔄 ${updated} actualizados${errors.length ? `. ⚠️ ${errors.length} errores.` : '.'}`
    })
    setUploading(false)
    setPreview(null)
    setText('')
    if (created > 0 || updated > 0) onDone()
  }

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setText(ev.target.result)
    reader.readAsText(file)
  }

  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb', padding: 24 }}>
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>📤 Carga Masiva de Reparadores</h3>
      <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 16 }}>Sube un archivo CSV/JSON o pega los datos directamente</p>

      {/* Format guide */}
      <div style={{ background: '#f8fafc', borderRadius: 10, padding: 14, marginBottom: 16, fontSize: 12 }}>
        <strong>Formato JSON esperado:</strong>
        <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: 10, borderRadius: 6, marginTop: 8, overflow: 'auto', fontSize: 11 }}>{`[{
  "nombre_empresa": "Refrigeración Norte",
  "nombre_contacto": "Juan Pérez",
  "categoria": "hogar",
  "descripcion": "Reparación de aires y neveras",
  "estado": "Anzoátegui",
  "ciudad": "Barcelona",
  "telefono": "0414-000-0000",
  "email": "contacto@ejemplo.com",
  "whatsapp": "0414-000-0000",
  "instagram": "@refrignorte",
  "verificado": false,
  "fuente": "Google Maps"
}]`}</pre>
        <div style={{ marginTop: 8 }}>
          <strong>CSV:</strong> Primera fila = headers con los mismos campos
        </div>
      </div>

      {/* File upload */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input ref={fileRef} type="file" accept=".json,.csv,.txt" onChange={handleFile} style={{ display: 'none' }} />
        <button onClick={() => fileRef.current?.click()} style={{ padding: '10px 20px', borderRadius: 10, border: '1.5px dashed #e5e7eb', background: '#fff', color: '#6b7280', fontSize: 13, fontWeight: 600, cursor: 'pointer', flex: 1 }}>📁 Seleccionar archivo CSV/JSON</button>
      </div>

      {/* Text area */}
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="O pega aquí los datos en formato JSON o CSV..."
        rows={10}
        style={{ width: '100%', padding: 14, borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 13, fontFamily: 'monospace', outline: 'none', resize: 'vertical', boxSizing: 'border-box', marginBottom: 12 }}
      />

      {result && <div style={{ padding: '10px 14px', borderRadius: 10, marginBottom: 12, background: result.type === 'ok' ? '#f0fdf4' : result.type === 'error' ? '#fef2f2' : '#fffbeb', color: result.type === 'ok' ? '#166534' : result.type === 'error' ? R : '#92400e', fontSize: 13, border: `1px solid ${result.type === 'ok' ? '#bbf7d0' : result.type === 'error' ? '#fecaca' : '#fde68a'}` }}>{result.text}</div>}

      {!preview ? (
        <button onClick={handlePreview} disabled={!text.trim()} style={{ padding: '12px 24px', borderRadius: 10, border: 'none', background: text.trim() ? D : '#e5e7eb', color: text.trim() ? '#fff' : '#94a3b8', fontSize: 14, fontWeight: 700, cursor: text.trim() ? 'pointer' : 'default' }}>👁️ Vista Previa</button>
      ) : (
        <div>
          <div style={{ background: '#f0fdf4', borderRadius: 10, padding: 12, marginBottom: 12, fontSize: 13, color: '#166534', border: '1px solid #bbf7d0' }}>
            ✅ {preview.length} reparadores listos para importar
          </div>
          <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: 12 }}>
            <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={thS}>#</th><th style={thS}>Negocio</th><th style={thS}>Contacto</th><th style={thS}>Cat</th><th style={thS}>Ciudad</th><th style={thS}>Teléfono</th>
                </tr>
              </thead>
              <tbody>
                {preview.slice(0, 20).map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={tdS}>{i + 1}</td>
                    <td style={tdS}>{r.business_name}</td>
                    <td style={tdS}>{r.contact_name}</td>
                    <td style={tdS}>{r.category_id}</td>
                    <td style={tdS}>{r.city}</td>
                    <td style={tdS}>{r.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {preview.length > 20 && <p style={{ color: '#94a3b8', fontSize: 12, textAlign: 'center', padding: 8 }}>...y {preview.length - 20} más</p>}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => { setPreview(null); setResult(null) }} style={{ padding: '12px 24px', borderRadius: 10, border: '1px solid #e5e7eb', background: '#fff', color: '#6b7280', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancelar</button>
            <button onClick={handleUpload} disabled={uploading} style={{ flex: 1, padding: '12px 24px', borderRadius: 10, border: 'none', background: uploading ? '#e5e7eb' : G, color: '#fff', fontSize: 14, fontWeight: 700, cursor: uploading ? 'default' : 'pointer' }}>
              {uploading ? 'Importando...' : `✅ Importar ${preview.length} reparadores`}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// VERIFY QUEUE
// ============================================================
function VerifyQueue({ pending, sb, onDone }) {
  const [acting, setActing] = useState(null)

  async function verify(id, status) {
    setActing(id)
    await sb.from('repairers').update({
      verification_status: status,
      is_verified: status === 'verified',
      verified_at: status === 'verified' ? new Date().toISOString() : null,
    }).eq('id', id)
    setActing(null)
    onDone()
  }

  if (!pending.length) return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb', padding: 40, textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
      <h3 style={{ fontSize: 18, fontWeight: 700 }}>No hay verificaciones pendientes</h3>
      <p style={{ color: '#94a3b8', fontSize: 14 }}>Todos los reparadores han sido revisados</p>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p style={{ color: '#94a3b8', fontSize: 13 }}>{pending.length} reparador{pending.length > 1 ? 'es' : ''} pendiente{pending.length > 1 ? 's' : ''} de verificación</p>
      {pending.map(r => (
        <div key={r.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb', padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div>
              <h4 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700 }}>{r.business_name}</h4>
              <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>👤 {r.contact_name} · 📍 {r.city}</p>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>📞 {r.phone} {r.email ? `· ✉️ ${r.email}` : ''}</p>
              {r.instagram && <p style={{ margin: '2px 0 0', fontSize: 13, color: '#6b7280' }}>📸 {r.instagram}</p>}
            </div>
            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: r.verification_status === 'review' ? '#fffbeb' : '#f8fafc', color: r.verification_status === 'review' ? '#92400e' : '#6b7280', fontWeight: 700 }}>
              {r.verification_status === 'review' ? '🔍 REVISAR' : '⏳ PENDIENTE'}
            </span>
          </div>
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>{r.description}</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => verify(r.id, 'verified')} disabled={acting === r.id} style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: G, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>✓ Verificar</button>
            <button onClick={() => verify(r.id, 'rejected')} disabled={acting === r.id} style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #fecaca', background: '#fff', color: R, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>✗ Rechazar</button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================================
// MANAGE REPS
// ============================================================
function ManageReps({ reps, sb, onDone }) {
  const [search, setSearch] = useState('')
  const [acting, setActing] = useState(null)

  const filtered = reps.filter(r => {
    const q = search.toLowerCase()
    return !q || r.business_name?.toLowerCase().includes(q) || r.contact_name?.toLowerCase().includes(q) || r.city?.toLowerCase().includes(q)
  })

  async function toggle(id, field, val) {
    setActing(id)
    await sb.from('repairers').update({ [field]: val }).eq('id', id)
    setActing(null)
    onDone()
  }

  async function deleteRep(id) {
    if (!confirm('¿Eliminar este reparador?')) return
    setActing(id)
    await sb.from('repairers').delete().eq('id', id)
    setActing(null)
    onDone()
  }

  return (
    <div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre, contacto, ciudad..." style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 12 }} />
      <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 8 }}>{filtered.length} reparadores</p>
      <div style={{ maxHeight: 600, overflowY: 'auto' }}>
        <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', position: 'sticky', top: 0 }}>
              <th style={thS}>Negocio</th><th style={thS}>Ciudad</th><th style={thS}>Cat</th><th style={thS}>Rating</th><th style={thS}>Estado</th><th style={thS}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={tdS}>
                  <div style={{ fontWeight: 600 }}>{r.business_name}</div>
                  <div style={{ color: '#94a3b8', fontSize: 11 }}>{r.contact_name}</div>
                </td>
                <td style={tdS}>{r.city}</td>
                <td style={tdS}>{r.category_id}</td>
                <td style={tdS}>{r.avg_rating ? Number(r.avg_rating).toFixed(1) : '—'}</td>
                <td style={tdS}>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {r.is_active && <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, background: GL, color: '#166534', fontWeight: 700 }}>ACTIVO</span>}
                    {r.is_premium && <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, background: YL, color: '#92400e', fontWeight: 700 }}>PREMIUM</span>}
                    {r.is_verified && <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, background: '#eff6ff', color: '#2563eb', fontWeight: 700 }}>VERIFICADO</span>}
                  </div>
                </td>
                <td style={tdS}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={() => toggle(r.id, 'is_premium', !r.is_premium)} disabled={acting === r.id} style={btnSmS} title={r.is_premium ? 'Quitar Premium' : 'Hacer Premium'}>{r.is_premium ? '⭐' : '☆'}</button>
                    <button onClick={() => toggle(r.id, 'is_active', !r.is_active)} disabled={acting === r.id} style={btnSmS} title={r.is_active ? 'Desactivar' : 'Activar'}>{r.is_active ? '🟢' : '🔴'}</button>
                    <button onClick={() => toggle(r.id, 'is_verified', !r.is_verified)} disabled={acting === r.id} style={btnSmS} title={r.is_verified ? 'Quitar Verificación' : 'Verificar'}>{r.is_verified ? '✓' : '○'}</button>
                    <button onClick={() => deleteRep(r.id)} disabled={acting === r.id} style={{ ...btnSmS, color: R }} title="Eliminar">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const thS = { padding: '8px 10px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }
const tdS = { padding: '8px 10px', verticalAlign: 'top' }
const btnSmS = { padding: '4px 8px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: 14 }
