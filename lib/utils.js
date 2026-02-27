// Limpiar teléfono: solo dígitos
export function cleanPhone(p) {
  return (p || '').replace(/[^0-9]/g, '')
}

// Generar URL de WhatsApp con formato venezolano
export function whatsappUrl(phone, message = '') {
  const clean = cleanPhone(phone)
  const intl = clean.startsWith('0') ? '58' + clean.slice(1) : clean
  return `https://wa.me/${intl}${message ? '?text=' + encodeURIComponent(message) : ''}`
}

// Iniciales de un nombre
export function initials(name) {
  return (name || '?').split(' ').slice(0, 2).map(x => x[0]).join('').toUpperCase()
}

// Color de avatar basado en hash del nombre
export function avatarColor(name) {
  const palette = ['#e65100', '#1565c0', '#2e7d32', '#6a1b9a', '#c62828', '#00838f', '#4e342e']
  let h = 0
  for (let i = 0; i < (name || '').length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return palette[Math.abs(h) % palette.length]
}

// Color por categoría
export function categoryColor(id) {
  return id === 'hogar' ? '#f59e0b' : id === 'automotriz' ? '#ef4444' : id === 'electronica' ? '#3b82f6' : '#6b7280'
}

// Diagnóstico local (fallback cuando Gemini no está disponible)
export function localDiagnose(m) {
  const l = m.toLowerCase()
  if (l.match(/nevera|refrigerador|enfr[ií]a|congelador/)) return { t: 'Parece un problema de **refrigeración** — puede ser compresor, termostato o gas refrigerante.', c: 'hogar', tip: 'Desconecta la nevera 30 min y vuelve a encender. Si persiste, necesitas un técnico.', u: 'media', cost: '$25–$80' }
  if (l.match(/aire|acondicionado|split|bota agua/)) return { t: 'Problema de **aire acondicionado**. Bota agua: drenaje tapado. No enfría: gas o compresor.', c: 'hogar', tip: 'Limpia los filtros y verifica que el drenaje no esté obstruido.', u: 'media', cost: '$20–$100' }
  if (l.match(/celular|pantalla|iphone|samsung|carga|bater/)) return { t: 'Problema de **celular**. Pantalla rota, puerto de carga o batería.', c: 'electronica', tip: 'Si no carga, prueba otro cable y limpia el puerto con cepillo suave.', u: 'baja', cost: '$10–$60' }
  if (l.match(/tuber|agua|grifo|ba[ñn]o|inodoro|plomer|fuga|gotea/)) return { t: '**Urgente** Problema de plomería. Cierra la llave de paso AHORA.', c: 'hogar', tip: 'Cierra la llave de paso y coloca un recipiente bajo la fuga.', u: 'alta', cost: '$15–$80' }
  if (l.match(/electric|corriente|enchufe|breaker|corto|luz/)) return { t: '**Precaución** — Problema eléctrico. No toques cables expuestos.', c: 'hogar', tip: 'Revisa si algún breaker se disparó. Desconecta equipos sospechosos.', u: 'alta', cost: '$20–$100' }
  if (l.match(/comput|laptop|pc|virus|lent|wifi/)) return { t: 'Problema de **computación**. Hardware (disco, RAM) o software (virus).', c: 'electronica', tip: 'Reinicia el equipo. Si está lento, verifica espacio en disco.', u: 'baja', cost: '$15–$80' }
  if (l.match(/carro|motor|freno|mec[aá]nic|arranc|aceite/)) return { t: 'Problema **mecánico**. No arranca: batería. Ruidos: frenos o suspensión.', c: 'automotriz', tip: 'Verifica si las luces del tablero encienden al girar la llave.', u: 'media', cost: '$30–$200' }
  if (l.match(/tv|televisor|sonido|audio/)) return { t: 'Problema de **TV/Audio**. No enciende: fuente de poder. Sin imagen: backlight.', c: 'electronica', tip: 'Desconecta 30 segundos y reconecta.', u: 'baja', cost: '$20–$100' }
  if (l.match(/lavadora|secadora|microondas|licuadora/)) return { t: 'Problema de **electrodoméstico**. Puede necesitar repuesto o reparación.', c: 'hogar', tip: 'Prueba en otro enchufe para descartar problema eléctrico.', u: 'baja', cost: '$15–$60' }
  return { t: 'Cuéntame más para darte un diagnóstico:\n\n• **¿Qué equipo o área?**\n• **¿Qué síntomas tiene?**\n• **¿Desde cuándo?**', c: null, tip: null, u: null, cost: null }
}

// Normalizar texto para búsqueda (eliminar acentos)
export function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

// Búsqueda fuzzy
export function fuzzyMatch(query, text) {
  const nq = normalizeText(query)
  const nt = normalizeText(text)
  if (nt.includes(nq)) return true
  const words = nq.split(/\s+/)
  return words.every(w => nt.includes(w))
}
