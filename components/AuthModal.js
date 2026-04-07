'use client'
import { useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase'
import { translateError } from '@/lib/errors'

const Y="#fbbf24",PG="linear-gradient(135deg,#8b5cf6,#6d28d9)",PL="#8b5cf6",D="#0f172a",R="#ef4444"

export default function AuthModal({ onClose, onAuth }) {
  const [mode, setMode] = useState('login')
  const [role, setRole] = useState('client')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const sb = getSupabaseClient()

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true); setError(null)
    const { data, error: err } = await sb.auth.signInWithPassword({ email, password: pass })
    if (err) { setError(translateError(err)); setLoading(false); return }
    onAuth(data.user)
  }

  async function handleRegister(e) {
    e.preventDefault()
    setLoading(true); setError(null)

    const { data, error: err } = await sb.auth.signUp({
      email,
      password: pass,
      options: { data: { full_name: name, role } }
    })
    if (err) { setError(translateError(err)); setLoading(false); return }

    if (data.user) {
      await sb.from('profiles').upsert({
        id: data.user.id,
        email,
        full_name: name,
        phone: phone || null,
        role,
      })

      if (role === 'repairer') {
        await sb.from('repairers').insert({
          user_id: data.user.id,
          business_name: name,
          contact_name: name,
          category_id: 'hogar',
          description: '',
          state_id: 'an',
          city: 'Barcelona',
          phone: phone || '',
          is_active: false,
          verification_status: 'pending',
        })
      }
    }

    setSuccess('¡Cuenta creada! Revisa tu email para confirmar.')
    setLoading(false)
  }

  async function handleForgot(e) {
    e.preventDefault()
    setLoading(true); setError(null)
    const { error: err } = await sb.auth.resetPasswordForEmail(email)
    if (err) { setError(translateError(err)); setLoading(false); return }
    setSuccess('Te enviamos un link para restablecer tu contraseña.')
    setLoading(false)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
      zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16, animation: 'fadeIn 0.2s ease',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="scale-in" style={{
        background: '#fff', borderRadius: 24, padding: '32px 24px', maxWidth: 420,
        width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 12, right: 16, border: 'none',
          background: 'none', fontSize: 24, cursor: 'pointer', color: '#cbd5e1',
          width: 32, height: 32, borderRadius: 8, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.15s',
        }}>×</button>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 16, background: PG,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
            boxShadow: '0 4px 12px rgba(139,92,246,0.3)',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: '-0.3px' }}>
            {mode === 'login' ? 'Bienvenido' : mode === 'register' ? 'Crear Cuenta' : 'Recuperar Contraseña'}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 14, margin: '6px 0 0' }}>
            {mode === 'login' ? 'Accede a tu cuenta en QuiénRepara' : mode === 'register' ? 'Únete como cliente o reparador' : 'Te enviaremos un email para restablecer'}
          </p>
        </div>

        {/* Google OAuth */}
        {!success && (
          <button onClick={async () => {
            setLoading(true); setError(null)
            const { error: e } = await sb.auth.signInWithOAuth({
              provider: 'google',
              options: { redirectTo: window.location.origin }
            })
            if (e) { setError(translateError(e)); setLoading(false) }
          }} className="btn-press" style={{
            width: '100%', padding: 14, borderRadius: 14,
            border: '1.5px solid #e2e8f0', background: '#fff', fontSize: 15,
            fontWeight: 600, cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continuar con Google
          </button>
        )}

        {!success && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            <span style={{ color: '#cbd5e1', fontSize: 11, fontWeight: 700, letterSpacing: '0.5px' }}>O CON EMAIL</span>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
          </div>
        )}

        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12,
            padding: '10px 14px', marginBottom: 16, color: R, fontSize: 13,
          }}>{error}</div>
        )}
        {success && (
          <div style={{
            background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12,
            padding: '14px 16px', marginBottom: 16, color: '#166534', fontSize: 14,
            textAlign: 'center', fontWeight: 500,
          }}>{success}</div>
        )}

        {mode === 'register' && !success && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <button onClick={() => setRole('client')} className="btn-press" style={{
              flex: 1, padding: '14px', borderRadius: 14,
              border: role === 'client' ? `2px solid ${PL}` : '2px solid #e2e8f0',
              background: role === 'client' ? '#f5f3ff' : '#fff',
              cursor: 'pointer', textAlign: 'center',
            }}>
              <div style={{ marginBottom: 4, display: 'flex', justifyContent: 'center' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={role === 'client' ? PL : '#94a3b8'} strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: role === 'client' ? PL : D }}>Busco reparador</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>Soy cliente</div>
            </button>
            <button onClick={() => setRole('repairer')} className="btn-press" style={{
              flex: 1, padding: '14px', borderRadius: 14,
              border: role === 'repairer' ? `2px solid ${Y}` : '2px solid #e2e8f0',
              background: role === 'repairer' ? '#fffbeb' : '#fff',
              cursor: 'pointer', textAlign: 'center',
            }}>
              <div style={{ marginBottom: 4, display: 'flex', justifyContent: 'center' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={role === 'repairer' ? '#92400e' : '#94a3b8'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: role === 'repairer' ? '#92400e' : D }}>Soy reparador</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>Quiero clientes</div>
            </button>
          </div>
        )}

        {!success && (
          <form onSubmit={mode === 'login' ? handleLogin : mode === 'register' ? handleRegister : handleForgot}>
            {mode === 'register' && <>
              <label style={labelS}>Nombre completo</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder={role === 'repairer' ? 'Nombre o empresa' : 'Tu nombre'} required style={inputS} />

              <label style={{ ...labelS, marginTop: 12 }}>Teléfono (WhatsApp)</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="0414-000-0000" style={inputS} />
            </>}

            <label style={{ ...labelS, marginTop: mode === 'register' ? 12 : 0 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required style={inputS} />

            {mode !== 'forgot' && <>
              <label style={{ ...labelS, marginTop: 12 }}>Contraseña</label>
              <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Mínimo 6 caracteres" required minLength={6} style={inputS} />
            </>}

            {mode === 'login' && (
              <div style={{ textAlign: 'right', marginTop: 8 }}>
                <button type="button" onClick={() => { setMode('forgot'); setError(null); setSuccess(null) }}
                  style={{ border: 'none', background: 'none', color: PL, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-press" style={{
              width: '100%', padding: 15, borderRadius: 14, border: 'none',
              background: loading ? '#e2e8f0' : mode === 'register' && role === 'repairer' ? Y : PG,
              color: loading ? '#94a3b8' : mode === 'register' && role === 'repairer' ? D : '#fff',
              fontSize: 16, fontWeight: 700, cursor: loading ? 'default' : 'pointer', marginTop: 20,
              boxShadow: loading ? 'none' : mode === 'register' && role === 'repairer'
                ? '0 4px 12px rgba(251,191,36,0.3)'
                : '0 4px 12px rgba(139,92,246,0.3)',
            }}>
              {loading ? 'Cargando...' : mode === 'login' ? 'Iniciar Sesión' : mode === 'register' ? (role === 'repairer' ? 'Registrarme como Reparador' : 'Crear Cuenta') : 'Enviar Link'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14 }}>
          {mode === 'login' ? <>
            ¿No tienes cuenta?{' '}
            <button onClick={() => { setMode('register'); setError(null); setSuccess(null) }}
              style={{ border: 'none', background: 'none', color: PL, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>Regístrate</button>
          </> : <>
            ¿Ya tienes cuenta?{' '}
            <button onClick={() => { setMode('login'); setError(null); setSuccess(null) }}
              style={{ border: 'none', background: 'none', color: PL, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>Inicia Sesión</button>
          </>}
        </div>
      </div>
    </div>
  )
}

const labelS = { fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }
const inputS = {
  width: '100%', padding: '13px 16px', borderRadius: 12,
  border: '1.5px solid #e2e8f0', fontSize: 15, outline: 'none',
  boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s',
}
