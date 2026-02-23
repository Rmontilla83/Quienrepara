'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { getSupabaseClient } from '@/lib/supabase'
import AuthModal from './AuthModal'
import Dashboard from './Dashboard'

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

  const sb=getSupabaseClient()

  // Check auth on mount
  useEffect(()=>{
    sb.auth.getSession().then(({data:{session}})=>{
      if(session?.user)setUser(session.user)
    })
    const{data:{subscription}}=sb.auth.onAuthStateChange((_,session)=>{
      setUser(session?.user||null)
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
            {user?<button onClick={()=>setTab('dashboard')} style={{width:32,height:32,borderRadius:'50%',border:'2px solid '+D,background:avc(user.email),display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer'}}>{ini(user.user_metadata?.full_name||user.email)}</button>
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
      {tab==='profile'&&selR&&<ProfilePage r={selR} nav={nav} catN={catN} stN={stN} user={user} onLogin={()=>setShowAuth(true)}/>}
      {tab==='dashboard'&&user&&<Dashboard user={user} onBack={()=>setTab('home')} onLogout={async()=>{await sb.auth.signOut();setUser(null);setTab('home')}}/>}

      {/* Auth Modal */}
      {showAuth&&<AuthModal onClose={()=>setShowAuth(false)} onAuth={(u)=>{setUser(u);setShowAuth(false)}}/>}

      {/* Bottom Nav */}
      <nav style={{position:'fixed',bottom:0,left:0,right:0,background:'#fff',borderTop:'1px solid #e5e7eb',display:'flex',justifyContent:'space-around',alignItems:'center',padding:'6px 0 max(env(safe-area-inset-bottom),8px)',zIndex:50,boxShadow:'0 -2px 10px rgba(0,0,0,0.05)'}}>
        <BN i="🏠" l="Inicio" on={tab==='home'} ck={()=>{setTab('home');setCatF('all');setQ('')}}/>
        <BN i="🔍" l="Buscar" on={tab==='search'} ck={()=>setTab('search')}/>
        <div style={{position:'relative',top:-18}}>
          <button onClick={()=>setTab('ai')} style={{width:56,height:56,borderRadius:'50%',border:'4px solid #f8fafc',background:PG,color:'#fff',fontSize:24,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',boxShadow:'0 4px 15px rgba(139,92,246,0.4)'}}>✨</button>
          <div style={{textAlign:'center',fontSize:10,fontWeight:600,color:tab==='ai'?PL:'#9ca3af',marginTop:2}}>IA</div>
        </div>
        <BN i="📍" l="Mapa" on={false} ck={()=>setTab('search')}/>
        <BN i="👤" l="Perfil" on={tab==='dashboard'} ck={handleProfile}/>
      </nav>
    </div>
  )
}

function BN({i,l,on,ck}){return<button onClick={ck} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:1,border:'none',background:'none',cursor:'pointer',color:on?D:'#9ca3af',padding:'4px 14px'}}><span style={{fontSize:22}}>{i}</span><span style={{fontSize:10,fontWeight:on?700:500}}>{l}</span></button>}

// ============================================================
// HOME
// ============================================================
function HomePage({nav,reps,cats}){
  const premium=reps.filter(r=>r.is_premium)
  return<div>
    <div style={{background:`linear-gradient(180deg,${Y} 0%,${YD} 100%)`,padding:'28px 16px 52px'}}>
      <div style={{maxWidth:600,margin:'0 auto',background:'#fff',borderRadius:20,padding:'36px 24px',boxShadow:'0 8px 30px rgba(0,0,0,0.12)'}}>
        <h1 style={{textAlign:'center',fontSize:26,fontWeight:800,margin:'0 0 24px',lineHeight:1.3}}>¿Qué necesitas reparar hoy?</h1>
        <button onClick={()=>nav('ai')} style={{width:'100%',padding:'18px 24px',borderRadius:50,border:'none',background:PG,color:'#fff',fontSize:17,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:10,boxShadow:'0 4px 20px rgba(139,92,246,0.35)'}}>✨ Diagnosticar Falla con IA</button>
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
  useEffect(()=>{ref.current?.scrollIntoView({behavior:'smooth'})},[msgs])
  useEffect(()=>{iRef.current?.focus()},[])
  const send=()=>{if(!inp.trim()||typ)return;const t=inp.trim();setInp('');setMsgs(p=>[...p,{rl:'user',tx:t}]);setTyp(true)
    setTimeout(()=>{const r=diagnose(t);setMsgs(p=>[...p,{rl:'ai',tx:r.t,tip:r.tip,c:r.c,u:r.u,cost:r.cost}]);setTyp(false)},800+Math.random()*600)}
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
        {r.is_premium?<a href={waUrl(r.phone,`Hola, encontré "${r.business_name}" en QuiénRepara.`)} target="_blank" rel="noreferrer" style={{flex:1,padding:10,borderRadius:10,background:WA,color:'#fff',fontSize:14,fontWeight:700,textDecoration:'none',textAlign:'center'}}>💬 WhatsApp</a>
        :<div style={{flex:1,padding:10,borderRadius:10,background:'#f1f5f9',color:'#94a3b8',fontSize:13,fontWeight:600,textAlign:'center'}}>🔒 Contacto premium</div>}
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
            <a href={waUrl(r.phone,`Hola, encontré "${r.business_name}" en QuiénRepara. ¿Info sobre sus servicios?`)} target="_blank" rel="noreferrer" style={{padding:14,borderRadius:12,background:WA,color:'#fff',fontSize:16,fontWeight:700,textDecoration:'none',textAlign:'center'}}>💬 Contactar por WhatsApp</a>
            <a href={`tel:${cleanPh(r.phone)}`} style={{padding:14,borderRadius:12,border:`2px solid ${D}`,color:D,fontSize:16,fontWeight:700,textDecoration:'none',textAlign:'center'}}>📞 Llamar: {r.phone}</a>
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
