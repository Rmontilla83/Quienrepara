'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { getSupabaseClient } from '@/lib/supabase'
import AuthModal from './AuthModal'
import Dashboard from './Dashboard'
import AdminPanel from './AdminPanel'

const Y="#fbbf24",YD="#f59e0b",YL="#fef3c7",PG="linear-gradient(135deg,#8b5cf6,#6d28d9)",PL="#8b5cf6",G="#22c55e",GL="#dcfce7",R="#ef4444",D="#0f172a",WA="#25D366"

function cleanPh(p){return(p||'').replace(/[^0-9]/g,'')}
function waUrl(p,m=''){const c=cleanPh(p);const n=c.startsWith('0')?'58'+c.slice(1):c;return`https://wa.me/${n}${m?'?text='+encodeURIComponent(m):''}`}
function ini(n){return(n||'?').split(' ').slice(0,2).map(x=>x[0]).join('').toUpperCase()}
function avc(n){const c=['#e65100','#1565c0','#2e7d32','#6a1b9a','#c62828','#00838f','#4e342e'];let h=0;for(let i=0;i<(n||'').length;i++)h=n.charCodeAt(i)+((h<<5)-h);return c[Math.abs(h)%c.length]}
function catC(id){return id==='hogar'?YD:id==='automotriz'?'#ef4444':id==='electronica'?'#3b82f6':'#6b7280'}

function Stars({rating,reviews,sz=14}){
  if(!reviews)return<span style={{fontSize:10,padding:'2px 8px',borderRadius:12,background:'#eff6ff',color:'#2563eb',fontWeight:700}}>NUEVO</span>
  const f=Math.floor(Number(rating))
  return<span style={{display:'inline-flex',alignItems:'center',gap:4}}>
    <span style={{fontWeight:700,fontSize:13}}>{Number(rating).toFixed(1)}</span>
    <span style={{display:'inline-flex'}}>{Array.from({length:5},(_,i)=><svg key={i} width={sz} height={sz} viewBox="0 0 20 20" fill={i<f?'#f59e0b':'#e5e7eb'}><path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.51.91-5.32L2.27 6.69l5.34-.78L10 1z"/></svg>)}</span>
    <span style={{fontSize:12,color:'#9ca3af'}}>({reviews})</span>
  </span>
}

function diagnose(m){const l=m.toLowerCase()
  if(l.match(/nevera|refrigerador|enfr[ií]a|congelador/))return{t:'Parece un problema de **refrigeración** — puede ser compresor, termostato o gas refrigerante.',c:'hogar',tip:'Desconecta la nevera 30 min y vuelve a encender. Si persiste, necesitas un técnico.',u:'media',cost:'$25–$80'}
  if(l.match(/aire|acondicionado|split|bota agua/))return{t:'Problema de **aire acondicionado**. Bota agua: drenaje tapado. No enfría: gas o compresor.',c:'hogar',tip:'Limpia los filtros y verifica que el drenaje no esté obstruido.',u:'media',cost:'$20–$100'}
  if(l.match(/celular|pantalla|iphone|samsung|carga|bater/))return{t:'Problema de **celular**. Pantalla rota, puerto de carga o batería.',c:'electronica',tip:'Si no carga, prueba otro cable y limpia el puerto con cepillo suave.',u:'baja',cost:'$10–$60'}
  if(l.match(/tuber|agua|grifo|ba[ñn]o|inodoro|plomer|fuga|gotea/))return{t:'**¡Urgente!** Problema de plomería. Cierra la llave de paso AHORA.',c:'hogar',tip:'Cierra la llave de paso y coloca un recipiente bajo la fuga.',u:'alta',cost:'$15–$80'}
  if(l.match(/electric|corriente|enchufe|breaker|corto|luz/))return{t:'**⚠️ Precaución** — Problema eléctrico. No toques cables expuestos.',c:'hogar',tip:'Revisa si algún breaker se disparó. Desconecta equipos sospechosos.',u:'alta',cost:'$20–$100'}
  if(l.match(/comput|laptop|pc|virus|lent|wifi/))return{t:'Problema de **computación**. Hardware (disco, RAM) o software (virus).',c:'electronica',tip:'Reinicia el equipo. Si está lento, verifica espacio en disco.',u:'baja',cost:'$15–$80'}
  if(l.match(/carro|motor|freno|mec[aá]nic|arranc|aceite/))return{t:'Problema **mecánico**. No arranca: batería. Ruidos: frenos o suspensión.',c:'automotriz',tip:'Verifica si las luces del tablero encienden al girar la llave.',u:'media',cost:'$30–$200'}
  if(l.match(/tv|televisor|sonido|audio/))return{t:'Problema de **TV/Audio**. No enciende: fuente de poder. Sin imagen: backlight.',c:'electronica',tip:'Desconecta 30 segundos y reconecta.',u:'baja',cost:'$20–$100'}
  if(l.match(/lavadora|secadora|microondas|licuadora/))return{t:'Problema de **electrodoméstico**. Puede necesitar repuesto o reparación.',c:'hogar',tip:'Prueba en otro enchufe para descartar problema eléctrico.',u:'baja',cost:'$15–$60'}
  return{t:'Cuéntame más para darte un diagnóstico:\n\n• **¿Qué equipo o área?**\n• **¿Qué síntomas tiene?**\n• **¿Desde cuándo?**',c:null,tip:null,u:null,cost:null}
}

// ============================================================
// MAIN APP
// ============================================================
export default function ClientApp({repairers:initReps,categories:initCats,states:initStates,ad}){
  const[tab,setTab]=useState('home')
  const[catF,setCatF]=useState('all')
  const[stF,setStF]=useState('all')
  const[q,setQ]=useState('')
  const[selR,setSelR]=useState(null)
  const[showAuth,setShowAuth]=useState(false)
  const[user,setUser]=useState(null)
  const[userRole,setUserRole]=useState(null)

  const sb=getSupabaseClient()

  async function loadRole(uid){
    const{data}=await sb.from('profiles').select('role').eq('id',uid).single()
    if(data)setUserRole(data.role)
  }

  // Check auth on mount
  useEffect(()=>{
    sb.auth.getSession().then(({data:{session}})=>{
      if(session?.user){setUser(session.user);loadRole(session.user.id)}
    })
    const{data:{subscription}}=sb.auth.onAuthStateChange((_,session)=>{
      setUser(session?.user||null)
      if(session?.user)loadRole(session.user.id)
      else setUserRole(null)
    })
    return()=>subscription.unsubscribe()
  },[])

  const cats=[{id:'all',name:'Todas',full_name:'Todas',icon:'🔍'},...(initCats||[]).map(c=>({...c,icon:c.id==='hogar'?'🏠':c.id==='electronica'?'📱':c.id==='automotriz'?'🚗':c.id==='servicios'?'🔧':c.id==='salud'?'🏥':'📋'}))]
  const states=[{id:'all',name:'Todo el País'},...(initStates||[])]
  const catN=(id)=>cats.find(c=>c.id===id)?.full_name||cats.find(c=>c.id===id)?.name||id
  const stN=(id)=>states.find(s=>s.id===id)?.name||id

  const nav=useCallback((t,d)=>{setTab(t);if(d?.r)setSelR(d.r);if(d?.cat)setCatF(d.cat);window.scrollTo(0,0)},[])

  let reps=[...(initReps||[])]
  if(catF!=='all')reps=reps.filter(r=>r.category_id===catF)
  if(stF!=='all')reps=reps.filter(r=>r.state_id===stF)
  if(q){const ql=q.toLowerCase();reps=reps.filter(r=>(r.business_name||'').toLowerCase().includes(ql)||(r.description||'').toLowerCase().includes(ql)||(r.contact_name||'').toLowerCase().includes(ql)||(r.city||'').toLowerCase().includes(ql))}
  reps.sort((a,b)=>(b.is_premium?1:0)-(a.is_premium?1:0)||(Number(b.avg_rating)||0)-(Number(a.avg_rating)||0))

  const handleProfile=()=>{
    if(user)setTab('dashboard')
    else setShowAuth(true)
  }

  return(
    <div style={{minHeight:'100vh',paddingBottom:80}}>
      {/* Header */}
      <header style={{background:Y,position:'sticky',top:0,zIndex:50,boxShadow:'0 2px 8px rgba(0,0,0,0.1)',borderBottom:`3px solid ${YD}`}}>
        <div style={{maxWidth:1200,margin:'0 auto',padding:'0 16px',display:'flex',alignItems:'center',justifyContent:'space-between',height:52}}>
          <div onClick={()=>{setTab('home');setCatF('all');setQ('')}} style={{cursor:'pointer'}}><span style={{fontWeight:900,fontSize:21,color:D}}>QuienRepara</span></div>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            {user?<div style={{display:'flex',alignItems:'center',gap:6}}>
              {userRole==='admin'&&<span style={{fontSize:10,padding:'2px 6px',borderRadius:4,background:'#fef2f2',color:'#dc2626',fontWeight:700}}>ADMIN</span>}
              <button onClick={()=>setTab('dashboard')} style={{width:32,height:32,borderRadius:'50%',border:'2px solid '+D,background:avc(user.email),display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer'}}>{ini(user.user_metadata?.full_name||user.email)}</button>
            </div>
            :<button onClick={()=>setShowAuth(true)} style={{padding:'6px 16px',borderRadius:20,border:'none',background:D,color:'#fff',fontSize:12,fontWeight:700,cursor:'pointer'}}>Iniciar Sesión</button>}
          </div>
        </div>
      </header>

      {ad&&<div style={{background:D,color:'#fff',padding:'8px 16px',fontSize:13,textAlign:'center',display:'flex',alignItems:'center',justifyContent:'center',gap:6,flexWrap:'wrap'}}>
        <span style={{background:Y,color:D,padding:'1px 8px',borderRadius:4,fontWeight:700,fontSize:11}}>📢</span>
        <span>{ad.content}</span>
      </div>}

      {tab==='home'&&<HomePage nav={nav} reps={reps} cats={cats}/>}
      {tab==='ai'&&<AIPage nav={nav} catN={catN}/>}
      {tab==='search'&&<SearchPage nav={nav} reps={reps} q={q} setQ={setQ} catF={catF} setCatF={setCatF} stF={stF} setStF={setStF} cats={cats} states={states} catN={catN} stN={stN}/>}
      {tab==='map'&&<MapPage reps={reps} cats={cats} nav={nav} catN={catN} stN={stN}/>}
      {tab==='profile'&&selR&&<ProfilePage r={selR} nav={nav} catN={catN} stN={stN} user={user} onLogin={()=>setShowAuth(true)}/>}
      {tab==='dashboard'&&user&&<Dashboard user={user} role={userRole} onBack={()=>setTab('home')} onLogout={async()=>{await sb.auth.signOut();setUser(null);setUserRole(null);setTab('home')}} onAdmin={()=>setTab('admin')}/>}
      {tab==='admin'&&user&&userRole==='admin'&&<AdminPanel user={user} onBack={()=>setTab('dashboard')}/>}

      {/* Auth Modal */}
      {showAuth&&<AuthModal onClose={()=>setShowAuth(false)} onAuth={(u)=>{setUser(u);setShowAuth(false)}}/>}

      {/* Bottom Nav */}
      <nav style={{position:'fixed',bottom:0,left:0,right:0,background:'#fff',borderTop:'1px solid #e5e7eb',display:'flex',justifyContent:'space-around',alignItems:'center',padding:'6px 0 max(env(safe-area-inset-bottom),8px)',zIndex:50,boxShadow:'0 -2px 10px rgba(0,0,0,0.05)'}}>
        <BN icon={<HomeIcon sz={22} c={tab==='home'?D:'#9ca3af'}/>} l="Inicio" on={tab==='home'} ck={()=>{setTab('home');setCatF('all');setQ('')}}/>
        <BN icon={<SearchIcon sz={22} c={tab==='search'?D:'#9ca3af'}/>} l="Buscar" on={tab==='search'} ck={()=>setTab('search')}/>
        <div style={{position:'relative',top:-18}}>
          <button onClick={()=>setTab('ai')} style={{width:56,height:56,borderRadius:'50%',border:'4px solid #f8fafc',background:PG,color:'#fff',fontSize:24,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',boxShadow:'0 4px 15px rgba(139,92,246,0.4)'}}><SparkleIcon sz={26} c="#fff" fill="#fff"/></button>
          <div style={{textAlign:'center',fontSize:10,fontWeight:600,color:tab==='ai'?PL:'#9ca3af',marginTop:2}}>IA</div>
        </div>
        <BN icon={<MapIcon sz={22} c={tab==='map'?D:'#9ca3af'}/>} l="Mapa" on={tab==='map'} ck={()=>setTab('map')}/>
        <BN icon={<UserIcon sz={22} c={tab==='dashboard'?D:'#9ca3af'}/>} l="Perfil" on={tab==='dashboard'} ck={handleProfile}/>
      </nav>
    </div>
  )
}

// SVG Icons
const Icon = ({ d, sz = 24, c = 'currentColor', ...p }) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}><path d={d} /></svg>
const HomeIcon = (p) => <svg width={p.sz||24} height={p.sz||24} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
const SearchIcon = (p) => <svg width={p.sz||24} height={p.sz||24} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const MapIcon = (p) => <svg width={p.sz||24} height={p.sz||24} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
const UserIcon = (p) => <svg width={p.sz||24} height={p.sz||24} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const SparkleIcon = (p) => <svg width={p.sz||24} height={p.sz||24} viewBox="0 0 24 24" fill={p.fill||'none'} stroke={p.c||'currentColor'} strokeWidth={2}><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z"/></svg>
const PhoneIcon = (p) => <svg width={p.sz||18} height={p.sz||18} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
const WhatsappIcon = (p) => <svg width={p.sz||18} height={p.sz||18} viewBox="0 0 24 24" fill={p.c||'currentColor'}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>

function BN({icon,l,on,ck}){return<button onClick={ck} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2,border:'none',background:'none',cursor:'pointer',color:on?D:'#9ca3af',padding:'4px 14px'}}>{icon}<span style={{fontSize:10,fontWeight:on?700:500}}>{l}</span></button>}

// ============================================================
// HOME
// ============================================================
function HomePage({nav,reps,cats}){
  const premium=reps.filter(r=>r.is_premium)
  return<div>
    <div style={{background:`linear-gradient(180deg,${Y} 0%,${YD} 100%)`,padding:'28px 16px 52px'}}>
      <div style={{maxWidth:600,margin:'0 auto',background:'#fff',borderRadius:20,padding:'36px 24px',boxShadow:'0 8px 30px rgba(0,0,0,0.12)'}}>
        <h1 style={{textAlign:'center',fontSize:26,fontWeight:800,margin:'0 0 24px',lineHeight:1.3}}>¿Qué necesitas reparar hoy?</h1>
        <button onClick={()=>nav('ai')} style={{width:'100%',padding:'18px 24px',borderRadius:50,border:'none',background:PG,color:'#fff',fontSize:17,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:10,boxShadow:'0 4px 20px rgba(139,92,246,0.35)'}}><SparkleIcon sz={22} c="#fff" fill="#fff"/> Diagnosticar Falla con IA</button>
        <p style={{textAlign:'center',color:'#94a3b8',fontSize:14,margin:'12px 0 20px'}}>Describe el problema y te decimos a quién llamar</p>
        <div style={{display:'flex',alignItems:'center',gap:12,margin:'0 0 16px'}}><div style={{flex:1,height:1,background:'#e5e7eb'}}/><span style={{color:'#cbd5e1',fontSize:11,fontWeight:700,letterSpacing:1,whiteSpace:'nowrap'}}>O BUSCA MANUALMENTE</span><div style={{flex:1,height:1,background:'#e5e7eb'}}/></div>
        <button onClick={()=>nav('search')} style={{width:'100%',padding:'14px 16px',borderRadius:12,border:'1.5px solid #e5e7eb',background:'#f8fafc',color:'#94a3b8',fontSize:15,cursor:'pointer',textAlign:'left',display:'flex',alignItems:'center',gap:10}}>🔍 Ej: Electricista, Nevera, Plomero...</button>
      </div>
    </div>
    <div style={{maxWidth:600,margin:'-28px auto 0',padding:'0 16px',position:'relative',zIndex:2}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
        {cats.filter(c=>c.id!=='all').map((c,i)=><button key={c.id} onClick={()=>nav('search',{cat:c.id})} className="fade-up" style={{background:'#fff',borderRadius:14,padding:'14px 8px',border:'1px solid #e5e7eb',cursor:'pointer',textAlign:'center',boxShadow:'0 1px 4px rgba(0,0,0,0.04)',transition:'all .15s',animationDelay:`${i*.05}s`}} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='0 4px 12px rgba(0,0,0,0.08)'}} onMouseOut={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='0 1px 4px rgba(0,0,0,0.04)'}}>
          <div style={{fontSize:28,marginBottom:4}}>{c.icon}</div><div style={{fontSize:12,fontWeight:600,color:'#374151'}}>{c.name}</div>
        </button>)}
      </div>
    </div>
    <div style={{maxWidth:600,margin:'24px auto',padding:'0 16px'}}>
      <h2 style={{fontSize:16,fontWeight:700,marginBottom:10}}>💡 Problemas comunes</h2>
      <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
        {['Mi nevera no enfría','El aire bota agua','Se dañó mi celular','Fuga de agua','Se fue la luz','Carro no arranca'].map(q=><button key={q} onClick={()=>nav('ai')} style={{padding:'8px 14px',borderRadius:20,border:'1px solid #e5e7eb',background:'#fff',color:'#374151',fontSize:13,cursor:'pointer'}}>{q}</button>)}
      </div>
    </div>
    <div style={{maxWidth:600,margin:'20px auto',padding:'0 16px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
        <h2 style={{fontSize:16,fontWeight:700,margin:0}}>⭐ Destacados</h2>
        <button onClick={()=>nav('search')} style={{border:'none',background:'none',color:PL,fontSize:13,fontWeight:600,cursor:'pointer'}}>Ver todos →</button>
      </div>
      {(premium.length?premium:reps).slice(0,4).map((r,i)=><div key={r.id} className="fade-up" style={{marginBottom:10,animationDelay:`${i*.08}s`}}>
        <MiniCard r={r} ck={()=>nav('profile',{r})}/>
      </div>)}
      {!reps.length&&<p style={{color:'#94a3b8',textAlign:'center',padding:40}}>Cargando reparadores...</p>}
    </div>
    <div style={{maxWidth:600,margin:'32px auto 24px',padding:'0 16px'}}>
      <div style={{background:D,borderRadius:20,padding:'36px 24px',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-30,right:-30,width:120,height:120,borderRadius:'50%',background:'rgba(251,191,36,0.15)'}}/>
        <h3 style={{color:'#fff',fontSize:20,fontWeight:800,marginBottom:8,position:'relative'}}>¿Eres técnico o reparador?</h3>
        <p style={{color:'#94a3b8',fontSize:14,marginBottom:20,position:'relative'}}>Regístrate gratis y recibe clientes</p>
        <button style={{padding:'14px 36px',borderRadius:50,border:'none',background:Y,color:D,fontSize:16,fontWeight:800,cursor:'pointer',position:'relative'}}>Registrarme gratis →</button>
      </div>
    </div>
  </div>
}

function MiniCard({r,ck}){
  return<div onClick={ck} style={{background:'#fff',borderRadius:12,padding:'14px 16px',border:'1px solid #e5e7eb',cursor:'pointer',display:'flex',gap:12,alignItems:'center',transition:'all .15s'}} onMouseOver={e=>e.currentTarget.style.boxShadow='0 2px 12px rgba(0,0,0,0.06)'} onMouseOut={e=>e.currentTarget.style.boxShadow='none'}>
    <div style={{width:48,height:48,borderRadius:12,background:avc(r.business_name),display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:18,fontWeight:700,flexShrink:0}}>{ini(r.business_name)}</div>
    <div style={{flex:1,minWidth:0}}>
      <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:2}}><span style={{fontWeight:700,fontSize:14,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.business_name}</span>{r.is_premium&&<span style={{fontSize:9,padding:'1px 6px',borderRadius:4,background:YL,color:'#92400e',fontWeight:700,flexShrink:0}}>⚡</span>}</div>
      <Stars rating={r.avg_rating} reviews={r.total_reviews} sz={12}/>
      <div style={{fontSize:12,color:R,marginTop:2}}>📍 {r.city}</div>
    </div>
    <span style={{color:'#d1d5db',fontSize:20,flexShrink:0}}>›</span>
  </div>
}

// ============================================================
// AI CHAT
// ============================================================
function AIPage({nav,catN}){
  const[msgs,setMsgs]=useState([{rl:'ai',tx:'¡Hola! 👋 Soy tu asistente de **QuiénRepara**.\n\nCuéntame: **¿qué se dañó?** Te digo qué puede ser y te conecto con el mejor técnico.'}])
  const[inp,setInp]=useState('');const[typ,setTyp]=useState(false);const ref=useRef(null);const iRef=useRef(null)
  const histRef=useRef([])
  useEffect(()=>{ref.current?.scrollIntoView({behavior:'smooth'})},[msgs])
  useEffect(()=>{iRef.current?.focus()},[])

  const send=async()=>{if(!inp.trim()||typ)return;const t=inp.trim();setInp('');setMsgs(p=>[...p,{rl:'user',tx:t}]);setTyp(true)
    histRef.current.push({role:'user',text:t})
    try{
      const res=await fetch('/api/diagnose',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:t,history:histRef.current.slice(-6)})})
      const data=await res.json()
      if(data.error){setMsgs(p=>[...p,{rl:'ai',tx:'Lo siento, hubo un error. Intenta de nuevo.'}]);setTyp(false);return}
      const aiText=data.diagnostico||(data.preguntas||'Cuéntame más sobre el problema.')
      histRef.current.push({role:'ai',text:aiText})
      setMsgs(p=>[...p,{rl:'ai',tx:aiText,tip:data.consejo,c:data.categoria,u:data.urgencia,cost:data.costo_estimado}])
    }catch(e){
      // Fallback to local diagnosis
      const r=diagnose(t)
      setMsgs(p=>[...p,{rl:'ai',tx:r.t,tip:r.tip,c:r.c,u:r.u,cost:r.cost}])
    }
    setTyp(false)
  }
  const md=t=>t.split('\n').map((l,i)=>{let h=l.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*(.+?)\*/g,'<em>$1</em>').replace(/^• /,'&bull; ');return<p key={i} style={{margin:'3px 0',lineHeight:1.65}} dangerouslySetInnerHTML={{__html:h||'&nbsp;'}}/>})

  return<div style={{maxWidth:600,margin:'0 auto',display:'flex',flexDirection:'column',height:'calc(100dvh - 170px)'}}>
    <div style={{padding:16,textAlign:'center',borderBottom:'1px solid #e5e7eb',background:'#fff'}}>
      <div style={{width:44,height:44,borderRadius:14,background:PG,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 8px',fontSize:22,color:'#fff'}}>✨</div>
      <h1 style={{fontSize:18,fontWeight:700,margin:0}}>Diagnóstico Inteligente</h1>
      <p style={{color:'#94a3b8',fontSize:13,margin:'4px 0 0'}}>Describe tu problema con tus propias palabras</p>
    </div>
    <div style={{flex:1,padding:16,overflowY:'auto',display:'flex',flexDirection:'column',gap:10}}>
      {msgs.map((m,i)=><div key={i}>
        <div style={{display:'flex',justifyContent:m.rl==='user'?'flex-end':'flex-start',gap:8}}>
          {m.rl==='ai'&&<div style={{width:28,height:28,borderRadius:9,background:PG,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,flexShrink:0,color:'#fff'}}>✨</div>}
          <div style={{maxWidth:'82%',padding:'10px 14px',borderRadius:m.rl==='user'?'14px 14px 4px 14px':'14px 14px 14px 4px',background:m.rl==='user'?Y:'#fff',color:D,fontSize:14,border:m.rl==='ai'?'1px solid #e5e7eb':'none'}}>{md(m.tx)}</div>
        </div>
        {m.tip&&<div style={{marginLeft:36,marginTop:8,background:'#fffbeb',border:'1px solid #fde68a',borderRadius:10,padding:'10px 14px',fontSize:13}}><strong style={{color:'#92400e'}}>💡 Consejo rápido</strong><div style={{color:'#78350f',marginTop:4}}>{m.tip}</div></div>}
        {m.c&&<div style={{marginLeft:36,marginTop:8}}>
          <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:8}}>
            {m.u&&<span style={{padding:'4px 10px',borderRadius:20,fontSize:12,fontWeight:700,background:m.u==='alta'?'#fef2f2':m.u==='media'?YL:GL,color:m.u==='alta'?R:m.u==='media'?'#92400e':'#166534'}}>{m.u==='alta'?'🔴':m.u==='media'?'🟡':'🟢'} Urgencia {m.u}</span>}
            {m.cost&&<span style={{padding:'4px 10px',borderRadius:20,fontSize:12,fontWeight:700,background:'#f0f9ff',color:'#0c4a6e'}}>💰 {m.cost}</span>}
          </div>
          <button onClick={()=>nav('search',{cat:m.c})} style={{padding:'12px 20px',borderRadius:12,border:'none',background:Y,color:D,fontSize:14,fontWeight:700,cursor:'pointer',width:'100%'}}>📍 Ver técnicos de {catN(m.c)}</button>
        </div>}
      </div>)}
      {typ&&<div style={{display:'flex',gap:8}}><div style={{width:28,height:28,borderRadius:9,background:PG,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,color:'#fff'}}>✨</div><div style={{padding:'10px 16px',borderRadius:'14px 14px 14px 4px',background:'#fff',border:'1px solid #e5e7eb',display:'flex',gap:4}}>{[0,1,2].map(i=><span key={i} style={{width:7,height:7,borderRadius:'50%',background:'#cbd5e1',animation:`pulse2 1.2s infinite ${i*.2}s`}}/>)}</div></div>}
      <div ref={ref}/>
    </div>
    {msgs.length===1&&<div style={{padding:'0 16px 8px',display:'flex',gap:6,flexWrap:'wrap'}}>{['Mi nevera no enfría','El aire bota agua','Fuga en el baño','Celular no carga'].map(q=><button key={q} onClick={()=>setInp(q)} style={{padding:'6px 12px',borderRadius:16,border:'1px solid #e5e7eb',background:'#fff',color:'#6b7280',fontSize:12,cursor:'pointer'}}>{q}</button>)}</div>}
    <div style={{padding:'10px 16px',borderTop:'1px solid #e5e7eb',background:'#fff',display:'flex',gap:8}}>
      <input ref={iRef} value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ej: mi nevera no enfría..." style={{flex:1,padding:'12px 16px',borderRadius:24,border:'1.5px solid #e5e7eb',fontSize:15,outline:'none'}} onFocus={e=>e.target.style.borderColor=PL} onBlur={e=>e.target.style.borderColor='#e5e7eb'}/>
      <button onClick={send} disabled={!inp.trim()} style={{width:44,height:44,borderRadius:'50%',border:'none',background:inp.trim()?PG:'#e5e7eb',color:inp.trim()?'#fff':'#9ca3af',fontSize:18,cursor:inp.trim()?'pointer':'default',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>↑</button>
    </div>
  </div>
}

// ============================================================
// MAP
// ============================================================
const CITY_COORDS = {
  'Barcelona': { lat: 10.1364, lng: -64.6867 },
  'Puerto La Cruz': { lat: 10.2176, lng: -64.6322 },
  'Lechería': { lat: 10.1925, lng: -64.6943 },
  'El Tigre': { lat: 8.8855, lng: -64.2539 },
  'Anaco': { lat: 9.4309, lng: -64.4661 },
  'Guanta': { lat: 10.2333, lng: -64.5833 },
  'Puerto Píritu': { lat: 10.0603, lng: -65.0372 },
  'Clarines': { lat: 9.9333, lng: -65.1667 },
  'Caracas': { lat: 10.4806, lng: -66.9036 },
  'Valencia': { lat: 10.1620, lng: -67.9946 },
  'Maracaibo': { lat: 10.6544, lng: -71.6297 },
  'Barquisimeto': { lat: 10.0647, lng: -69.3570 },
  'Maracay': { lat: 10.2442, lng: -67.5978 },
  'Ciudad Bolívar': { lat: 8.1165, lng: -63.5360 },
  'Porlamar': { lat: 11.0020, lng: -63.8500 },
  'San Cristóbal': { lat: 7.7667, lng: -72.2250 },
  'Maturín': { lat: 9.7500, lng: -63.1833 },
  'Cumaná': { lat: 10.4500, lng: -64.1667 },
}
const CAT_COLORS = { hogar: '#3b82f6', electronica: '#8b5cf6', automotriz: '#ef4444', servicios: '#f59e0b', salud: '#22c55e' }
const CAT_ICONS = { hogar: '🏠', electronica: '📱', automotriz: '🚗', servicios: '🔧', salud: '🏥' }

function MapPage({ reps, cats, nav, catN, stN }) {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const markersRef = useRef([])
  const infoRef = useRef(null)
  const [catF, setCatF] = useState('all')
  const [selRep, setSelRep] = useState(null)
  const [mapReady, setMapReady] = useState(false)
  const [search, setSearch] = useState('')

  // Load Google Maps script
  useEffect(() => {
    if (window.google?.maps) { setMapReady(true); return }
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
    if (!key) return
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => setMapReady(true)
    document.head.appendChild(script)
  }, [])

  // Init map
  useEffect(() => {
    if (!mapReady || !mapRef.current || mapInstance.current) return
    mapInstance.current = new google.maps.Map(mapRef.current, {
      center: { lat: 10.18, lng: -64.68 },
      zoom: 12,
      styles: [
        { featureType: 'poi', stylers: [{ visibility: 'off' }] },
        { featureType: 'transit', stylers: [{ visibility: 'off' }] },
        { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    })
    infoRef.current = new google.maps.InfoWindow()
  }, [mapReady])

  // seed-based pseudo-random
  function seededRand(seed) {
    let x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }

  function getCoords(rep, idx) {
    const base = CITY_COORDS[rep.city] || CITY_COORDS['Barcelona']
    const offsetLat = (seededRand(idx * 13 + 7) - 0.5) * 0.025
    const offsetLng = (seededRand(idx * 17 + 3) - 0.5) * 0.025
    return { lat: base.lat + offsetLat, lng: base.lng + offsetLng }
  }

  // Update markers when filter changes
  useEffect(() => {
    if (!mapInstance.current || !mapReady) return
    // Clear existing markers
    markersRef.current.forEach(m => m.setMap(null))
    markersRef.current = []

    const filtered = reps.filter(r => {
      if (catF !== 'all' && r.category_id !== catF) return false
      if (search) {
        const q = search.toLowerCase()
        return r.business_name?.toLowerCase().includes(q) || r.city?.toLowerCase().includes(q) || r.contact_name?.toLowerCase().includes(q)
      }
      return true
    })

    filtered.forEach((r, i) => {
      const pos = getCoords(r, i)
      const color = CAT_COLORS[r.category_id] || '#6b7280'
      const icon = CAT_ICONS[r.category_id] || '📍'
      
      const marker = new google.maps.Marker({
        position: pos,
        map: mapInstance.current,
        title: r.business_name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: color,
          fillOpacity: 0.9,
          strokeColor: '#fff',
          strokeWeight: 2,
          scale: 10,
        },
        label: { text: icon, fontSize: '14px' },
      })

      marker.addListener('click', () => {
        setSelRep(r)
        infoRef.current.setContent(`<div style="font-family:system-ui;padding:4px"><strong>${r.business_name}</strong><br><span style="color:#6b7280;font-size:12px">${r.city} · ${catN(r.category_id)}</span></div>`)
        infoRef.current.open(mapInstance.current, marker)
        mapInstance.current.panTo(pos)
      })

      markersRef.current.push(marker)
    })

    // Fit bounds if markers exist
    if (markersRef.current.length > 0 && markersRef.current.length < 100) {
      const bounds = new google.maps.LatLngBounds()
      markersRef.current.forEach(m => bounds.extend(m.getPosition()))
      mapInstance.current.fitBounds(bounds, 60)
    }
  }, [reps, catF, search, mapReady])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100dvh - 130px)' }}>
      {/* Search + filters */}
      <div style={{ padding: '10px 16px 0', background: '#fff', zIndex: 10 }}>
        <div style={{ position: 'relative', marginBottom: 8 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o ciudad..." style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none' }}>
          {cats.map(c => (
            <button key={c.id} onClick={() => setCatF(c.id === catF ? 'all' : c.id)} style={{ padding: '6px 12px', borderRadius: 20, border: catF === c.id ? 'none' : '1px solid #e5e7eb', background: catF === c.id ? CAT_COLORS[c.id] || D : '#fff', color: catF === c.id ? '#fff' : '#6b7280', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {c.icon} {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div ref={mapRef} style={{ flex: 1, minHeight: 300 }}>
        {!mapReady && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>Cargando mapa...</div>}
      </div>

      {/* Selected repairer card */}
      {selRep && (
        <div style={{ position: 'absolute', bottom: 80, left: 16, right: 16, background: '#fff', borderRadius: 16, padding: 16, boxShadow: '0 8px 30px rgba(0,0,0,0.15)', zIndex: 20, maxWidth: 500, margin: '0 auto' }}>
          <button onClick={() => setSelRep(null)} style={{ position: 'absolute', top: 8, right: 12, border: 'none', background: 'none', fontSize: 18, cursor: 'pointer', color: '#94a3b8' }}>✕</button>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: CAT_COLORS[selRep.category_id] || '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
              {CAT_ICONS[selRep.category_id] || '📍'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selRep.business_name}</h3>
                {selRep.is_verified && <span style={{ fontSize: 14 }}>✓</span>}
                {selRep.is_premium && <span style={{ fontSize: 14 }}>⭐</span>}
              </div>
              <p style={{ margin: '2px 0 0', fontSize: 13, color: '#6b7280' }}>📍 {selRep.city} · {catN(selRep.category_id)}</p>
              {selRep.avg_rating && <p style={{ margin: '2px 0 0', fontSize: 13, color: '#f59e0b', fontWeight: 700 }}>⭐ {Number(selRep.avg_rating).toFixed(1)} ({selRep.review_count})</p>}
            </div>
          </div>
          <p style={{ margin: '8px 0', fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>{selRep.description?.slice(0, 100)}{selRep.description?.length > 100 ? '...' : ''}</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {selRep.phone && selRep.phone !== 'verificar' && (
              <a href={`tel:${selRep.phone}`} style={{ flex: 1, padding: '10px', borderRadius: 10, background: '#22c55e', color: '#fff', textAlign: 'center', textDecoration: 'none', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><PhoneIcon c="#fff"/> Llamar</a>
            )}
            {selRep.whatsapp && (
              <a href={`https://wa.me/${selRep.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" style={{ flex: 1, padding: '10px', borderRadius: 10, background: '#25d366', color: '#fff', textAlign: 'center', textDecoration: 'none', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><WhatsappIcon c="#fff"/> WhatsApp</a>
            )}
            <button onClick={() => nav('profile', { r: selRep })} style={{ flex: 1, padding: '10px', borderRadius: 10, border: 'none', background: Y, color: D, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Ver perfil</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// SEARCH
// ============================================================
function SearchPage({nav,reps,q,setQ,catF,setCatF,stF,setStF,cats,states,catN,stN}){
  const iRef=useRef(null)
  useEffect(()=>{iRef.current?.focus()},[])
  return<div style={{maxWidth:900,margin:'0 auto',padding:'0 16px'}}>
    <div style={{padding:'14px 0 8px',position:'relative'}}>
      <span style={{position:'absolute',left:14,top:'50%',transform:'translateY(calc(-50% + 3px))',fontSize:18,color:'#9ca3af'}}>🔍</span>
      <input ref={iRef} value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar servicio, nombre, ciudad..." style={{width:'100%',padding:'14px 14px 14px 44px',borderRadius:12,border:'1.5px solid #e5e7eb',fontSize:15,outline:'none',boxSizing:'border-box',background:'#fff'}} onFocus={e=>e.target.style.borderColor=Y} onBlur={e=>e.target.style.borderColor='#e5e7eb'}/>
    </div>
    <div style={{display:'flex',gap:6,overflowX:'auto',paddingBottom:8,scrollbarWidth:'none'}}>
      {cats.map(c=><button key={c.id} onClick={()=>setCatF(c.id===catF?'all':c.id)} style={{padding:'8px 14px',borderRadius:20,border:catF===c.id?'none':'1px solid #e5e7eb',background:catF===c.id?D:'#fff',color:catF===c.id?'#fff':'#6b7280',fontSize:13,fontWeight:600,cursor:'pointer',whiteSpace:'nowrap',flexShrink:0}}>{c.icon} {c.name}</button>)}
    </div>
    <div style={{padding:'6px 0',display:'flex',alignItems:'center',gap:10}}>
      <select value={stF} onChange={e=>setStF(e.target.value)} style={{padding:'7px 12px',borderRadius:8,border:'1px solid #e5e7eb',fontSize:13,outline:'none',background:'#fff'}}>{states.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select>
      <span style={{fontSize:14,fontWeight:700,color:'#64748b'}}><span style={{color:YD,fontWeight:800}}>{reps.length}</span> resultados</span>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:12,padding:'8px 0 24px'}}>
      {reps.map((r,i)=><div key={r.id} className="fade-up" style={{animationDelay:`${i*.04}s`}}><RepCard r={r} nav={nav} catN={catN} stN={stN}/></div>)}
    </div>
    {!reps.length&&<div style={{textAlign:'center',padding:60,color:'#9ca3af'}}><p style={{fontSize:40}}>🔍</p><p style={{fontWeight:600}}>No se encontraron resultados</p></div>}
  </div>
}

function RepCard({r,nav,catN,stN}){
  return<div style={{background:'#fff',borderRadius:14,border:'1px solid #e5e7eb',overflow:'hidden',transition:'all .2s',position:'relative'}} onMouseOver={e=>{e.currentTarget.style.boxShadow='0 4px 15px rgba(0,0,0,0.07)';e.currentTarget.style.transform='translateY(-2px)'}} onMouseOut={e=>{e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform=''}}>
    <div style={{height:3,background:r.is_premium?Y:catC(r.category_id)}}/>
    <div style={{position:'absolute',top:10,right:10,display:'flex',gap:4,flexDirection:'column',alignItems:'flex-end'}}>
      {r.is_premium&&<span style={{fontSize:10,padding:'2px 8px',borderRadius:4,background:YL,color:'#92400e',fontWeight:700,border:'1px solid #fde68a'}}>⚡ DESTACADO</span>}
      {r.is_verified&&<span style={{fontSize:10,padding:'2px 8px',borderRadius:4,background:GL,color:'#166534',fontWeight:700,border:'1px solid #bbf7d0'}}>✓ VERIFICADO</span>}
    </div>
    <div style={{padding:'14px 16px 16px'}}>
      <div style={{fontSize:10,fontWeight:700,color:'#9ca3af',letterSpacing:.5,textTransform:'uppercase',marginBottom:4}}>{catN(r.category_id)}</div>
      <h3 onClick={()=>nav('profile',{r})} style={{margin:'0 0 6px',fontSize:16,fontWeight:700,cursor:'pointer',paddingRight:85}}>{r.business_name}</h3>
      <div style={{marginBottom:6}}><Stars rating={r.avg_rating} reviews={r.total_reviews}/></div>
      <div style={{fontSize:13,color:'#6b7280',marginBottom:4}}>👤 {r.contact_name}</div>
      <p style={{margin:'0 0 8px',color:'#6b7280',fontSize:13,lineHeight:1.5}}>{r.description}</p>
      <div style={{fontSize:13,color:R,marginBottom:12}}>📍 {r.city}, {stN(r.state_id)}</div>
      <div style={{display:'flex',gap:8}}>
        {r.is_premium?<a href={waUrl(r.phone,`Hola, encontré "${r.business_name}" en QuiénRepara.`)} target="_blank" rel="noreferrer" style={{flex:1,padding:10,borderRadius:10,background:WA,color:'#fff',fontSize:14,fontWeight:700,textDecoration:'none',textAlign:'center',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}><WhatsappIcon c="#fff" sz={16}/> WhatsApp</a>
        :<div style={{flex:1,padding:10,borderRadius:10,background:'#f1f5f9',color:'#94a3b8',fontSize:13,fontWeight:600,textAlign:'center'}}>Contacto premium</div>}
        <button onClick={()=>nav('profile',{r})} style={{padding:'10px 14px',borderRadius:10,border:'1px solid #e5e7eb',background:'#fff',color:D,fontSize:13,fontWeight:600,cursor:'pointer'}}>Ver perfil</button>
      </div>
    </div>
  </div>
}

// ============================================================
// PROFILE
// ============================================================
function ProfilePage({r,nav,catN,stN,user,onLogin}){
  return<div style={{maxWidth:600,margin:'0 auto',padding:16}}>
    <button onClick={()=>nav('search')} style={{border:'none',background:'none',color:'#94a3b8',fontSize:14,cursor:'pointer',marginBottom:12,padding:0}}>← Volver</button>
    <div className="fade-up" style={{background:'#fff',borderRadius:18,border:'1px solid #e5e7eb',overflow:'hidden'}}>
      <div style={{height:5,background:r.is_premium?Y:catC(r.category_id)}}/>
      <div style={{padding:24}}>
        <div style={{display:'flex',gap:14,alignItems:'center',marginBottom:16}}>
          <div style={{width:64,height:64,borderRadius:16,background:avc(r.business_name),display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:24,fontWeight:700,flexShrink:0}}>{ini(r.business_name)}</div>
          <div>
            <div style={{display:'flex',gap:6,marginBottom:4,flexWrap:'wrap'}}>
              {r.is_premium&&<span style={{fontSize:10,padding:'2px 7px',borderRadius:4,background:YL,color:'#92400e',fontWeight:700}}>⚡ DESTACADO</span>}
              {r.is_verified&&<span style={{fontSize:10,padding:'2px 7px',borderRadius:4,background:GL,color:'#166534',fontWeight:700}}>✓ VERIFICADO</span>}
            </div>
            <h1 style={{margin:'0 0 2px',fontSize:20,fontWeight:700}}>{r.business_name}</h1>
            <p style={{margin:0,color:'#94a3b8',fontSize:13}}>{catN(r.category_id)}</p>
          </div>
        </div>
        <div style={{marginBottom:16}}><Stars rating={r.avg_rating} reviews={r.total_reviews} sz={18}/></div>
        <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:20,fontSize:14}}>
          <div>👤 <strong>Contacto:</strong> {r.contact_name}</div>
          <div style={{color:R}}>📍 {r.city}, {stN(r.state_id)}</div>
          {r.email&&<div>✉️ {r.email}</div>}
          {r.is_premium&&r.phone&&<div>📞 {r.phone}</div>}
        </div>
        <p style={{color:'#6b7280',lineHeight:1.7,marginBottom:20,fontSize:15}}>{r.description}</p>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {r.is_premium&&r.phone?<>
            <a href={waUrl(r.phone,`Hola, encontré "${r.business_name}" en QuiénRepara. ¿Info sobre sus servicios?`)} target="_blank" rel="noreferrer" style={{padding:14,borderRadius:12,background:WA,color:'#fff',fontSize:16,fontWeight:700,textDecoration:'none',textAlign:'center',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}><WhatsappIcon c="#fff"/> Contactar por WhatsApp</a>
            <a href={`tel:${cleanPh(r.phone)}`} style={{padding:14,borderRadius:12,border:`2px solid ${D}`,color:D,fontSize:16,fontWeight:700,textDecoration:'none',textAlign:'center',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}><PhoneIcon c={D}/> Llamar: {r.phone}</a>
          </>:<div style={{padding:16,borderRadius:12,background:'#f8fafc',border:'1px solid #e5e7eb',textAlign:'center'}}>
            <p style={{fontWeight:700,marginBottom:4}}>🔒 Contacto restringido</p>
            <p style={{color:'#94a3b8',fontSize:13,marginBottom:8}}>Contacta por email:</p>
            {r.email&&<a href={`mailto:${r.email}`} style={{color:PL,fontWeight:600}}>{r.email}</a>}
          </div>}
        </div>
      </div>
    </div>
    {/* Reviews placeholder */}
    <div className="fade-up" style={{background:'#fff',borderRadius:18,border:'1px solid #e5e7eb',padding:20,marginTop:12,animationDelay:'.15s'}}>
      <h3 style={{fontSize:16,fontWeight:700,marginBottom:14}}>💬 Opiniones ({r.total_reviews||0})</h3>
      {[{n:'Laura M.',s:5,t:'Excelente servicio, muy puntual y profesional.',d:'Hace 3 días'},{n:'Roberto C.',s:4,t:'Buen trabajo, resolvió rápido.',d:'Hace 1 semana'},{n:'Patricia S.',s:5,t:'100% recomendado. Honesto con precios.',d:'Hace 2 semanas'}].map((rv,i)=><div key={i} style={{padding:'12px 0',borderBottom:i<2?'1px solid #f1f5f9':'none'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:28,height:28,borderRadius:'50%',background:avc(rv.n),display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:11,fontWeight:700}}>{ini(rv.n)}</div>
            <span style={{fontWeight:600,fontSize:13}}>{rv.n}</span><Stars rating={rv.s} reviews={1} sz={11}/>
          </div>
          <span style={{fontSize:11,color:'#cbd5e1'}}>{rv.d}</span>
        </div>
        <p style={{margin:0,color:'#6b7280',fontSize:13,paddingLeft:36}}>{rv.t}</p>
      </div>)}
      {/* Leave review CTA */}
      <div style={{marginTop:16,textAlign:'center'}}>
        {user?<button style={{padding:'10px 20px',borderRadius:10,border:`1.5px solid ${Y}`,background:'#fff',color:D,fontSize:13,fontWeight:600,cursor:'pointer'}}>⭐ Dejar una opinión</button>
        :<button onClick={onLogin} style={{padding:'10px 20px',borderRadius:10,border:'1.5px solid #e5e7eb',background:'#fff',color:'#94a3b8',fontSize:13,fontWeight:600,cursor:'pointer'}}>Inicia sesión para opinar</button>}
      </div>
    </div>
  </div>
}
