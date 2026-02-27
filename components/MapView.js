'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { whatsappUrl } from '@/lib/utils'
import { Y, D, WA } from '@/lib/theme'
import { CatIcon, WhatsappIcon, PhoneIcon } from './Icons'

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

export default function MapView({ repairers, categories }) {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const markersRef = useRef([])
  const infoRef = useRef(null)
  const [catF, setCatF] = useState('all')
  const [selRep, setSelRep] = useState(null)
  const [mapReady, setMapReady] = useState(false)
  const [search, setSearch] = useState('')

  const cats = [{ id: 'all', name: 'Todas' }, ...(categories || []).map(c => ({ id: c.id, name: c.name }))]
  const catName = (id) => cats.find(c => c.id === id)?.name || id

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
      mapTypeControl: false, streetViewControl: false, fullscreenControl: false,
    })
    infoRef.current = new google.maps.InfoWindow()
  }, [mapReady])

  function seededRand(seed) {
    let x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }

  function getCoords(rep, idx) {
    const base = CITY_COORDS[rep.city] || CITY_COORDS['Barcelona']
    return {
      lat: base.lat + (seededRand(idx * 13 + 7) - 0.5) * 0.025,
      lng: base.lng + (seededRand(idx * 17 + 3) - 0.5) * 0.025,
    }
  }

  useEffect(() => {
    if (!mapInstance.current || !mapReady) return
    markersRef.current.forEach(m => m.setMap(null))
    markersRef.current = []

    const filtered = (repairers || []).filter(r => {
      if (catF !== 'all' && r.category_id !== catF) return false
      if (search) {
        const q = search.toLowerCase()
        return r.business_name?.toLowerCase().includes(q) || r.city?.toLowerCase().includes(q)
      }
      return true
    })

    filtered.forEach((r, i) => {
      const pos = getCoords(r, i)
      const color = CAT_COLORS[r.category_id] || '#6b7280'
      const marker = new google.maps.Marker({
        position: pos, map: mapInstance.current, title: r.business_name,
        icon: { path: google.maps.SymbolPath.CIRCLE, fillColor: color, fillOpacity: 0.9, strokeColor: '#fff', strokeWeight: 2, scale: 10 },
      })
      marker.addListener('click', () => {
        setSelRep(r)
        infoRef.current.setContent(`<div style="font-family:system-ui;padding:4px"><strong>${r.business_name.replace(/</g,'&lt;')}</strong><br><span style="color:#6b7280;font-size:12px">${(r.city||'').replace(/</g,'&lt;')} · ${catName(r.category_id)}</span></div>`)
        infoRef.current.open(mapInstance.current, marker)
        mapInstance.current.panTo(pos)
      })
      markersRef.current.push(marker)
    })

    if (markersRef.current.length > 0 && markersRef.current.length < 100) {
      const bounds = new google.maps.LatLngBounds()
      markersRef.current.forEach(m => bounds.extend(m.getPosition()))
      mapInstance.current.fitBounds(bounds, 60)
    }
  }, [repairers, catF, search, mapReady])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100dvh - 130px)', position: 'relative' }}>
      <div style={{ padding: '10px 16px 0', background: '#fff', zIndex: 10 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o ciudad..." style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 8 }} />
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8 }}>
          {cats.map(c => (
            <button key={c.id} onClick={() => setCatF(c.id === catF ? 'all' : c.id)} style={{
              padding: '6px 12px', borderRadius: 20,
              border: catF === c.id ? 'none' : '1px solid #e5e7eb',
              background: catF === c.id ? (CAT_COLORS[c.id] || D) : '#fff',
              color: catF === c.id ? '#fff' : '#6b7280',
              fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0
            }}>{c.name}</button>
          ))}
        </div>
      </div>

      <div ref={mapRef} style={{ flex: 1, minHeight: 300 }}>
        {!mapReady && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>Cargando mapa...</div>}
      </div>

      {selRep && (
        <div style={{ position: 'absolute', bottom: 20, left: 16, right: 16, background: '#fff', borderRadius: 16, padding: 16, boxShadow: '0 8px 30px rgba(0,0,0,0.15)', zIndex: 20, maxWidth: 500, margin: '0 auto' }}>
          <button onClick={() => setSelRep(null)} style={{ position: 'absolute', top: 8, right: 12, border: 'none', background: 'none', fontSize: 18, cursor: 'pointer', color: '#94a3b8' }}>x</button>
          <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700 }}>{selRep.business_name}</h3>
          <p style={{ margin: '0 0 8px', fontSize: 13, color: '#6b7280' }}>{selRep.city} · {catName(selRep.category_id)}</p>
          {selRep.description && <p style={{ margin: '0 0 10px', fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>{selRep.description.slice(0, 100)}{selRep.description.length > 100 ? '...' : ''}</p>}
          <div style={{ display: 'flex', gap: 8 }}>
            {selRep.phone && <a href={whatsappUrl(selRep.phone)} target="_blank" rel="noreferrer" style={{ flex: 1, padding: 10, borderRadius: 10, background: WA, color: '#fff', textAlign: 'center', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>WhatsApp</a>}
            <Link href={`/reparador/${selRep.id}`} style={{ flex: 1, padding: 10, borderRadius: 10, background: Y, color: D, textAlign: 'center', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>Ver perfil</Link>
          </div>
        </div>
      )}
    </div>
  )
}
