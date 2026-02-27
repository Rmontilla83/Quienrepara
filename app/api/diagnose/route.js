import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const GEMINI_KEY = process.env.GEMINI_API_KEY
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

// Rate limiter en memoria
const rateLimit = new Map()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minuto
const RATE_LIMIT_MAX = 5 // 5 requests por minuto

function checkRateLimit(identifier) {
  const now = Date.now()
  const windowStart = now - RATE_LIMIT_WINDOW
  const requests = rateLimit.get(identifier) || []
  const recentRequests = requests.filter(time => time > windowStart)

  if (recentRequests.length >= RATE_LIMIT_MAX) {
    return false
  }

  recentRequests.push(now)
  rateLimit.set(identifier, recentRequests)

  // Limpiar entradas viejas periódicamente
  if (rateLimit.size > 1000) {
    for (const [key, times] of rateLimit) {
      if (times.every(t => t < windowStart)) rateLimit.delete(key)
    }
  }

  return true
}

const SYSTEM_PROMPT = `Eres el asistente de diagnóstico de QuiénRepara, una app venezolana para encontrar técnicos y reparadores en Anzoátegui, Venezuela.

Tu trabajo es:
1. Escuchar el problema del usuario (en español venezolano informal)
2. Dar un diagnóstico breve y claro
3. Dar un consejo inmediato que pueda hacer AHORA
4. Clasificar la urgencia y categoría

SIEMPRE responde en este formato JSON exacto:
{
  "diagnostico": "Explicación breve del problema probable (2-3 oraciones máximo)",
  "consejo": "Un consejo práctico que puede hacer ahora mismo",
  "categoria": "hogar|electronica|automotriz|servicios|salud",
  "urgencia": "alta|media|baja",
  "costo_estimado": "$XX–$XX (en dólares USD)",
  "preguntas": null o "pregunta de seguimiento si necesitas más info"
}

Categorías disponibles:
- hogar: plomería, electricidad, aires acondicionados, refrigeración, pintura, albañilería, línea blanca, herrería, piscinas, fumigación, impermeabilización
- electronica: celulares, computadoras, TV, audio, redes, domótica
- automotriz: mecánica, frenos, latonería, aire acondicionado automotriz, radiadores
- servicios: cerrajería, carpintería, jardinería, limpieza, mudanzas
- salud: equipos médicos, odontología

Contexto: Los usuarios están en Venezuela (Anzoátegui), usan bolívares y dólares. Hablan español venezolano. Sé directo, útil y empático. Si hay peligro (eléctrico, gas, inundación), advierte PRIMERO.

IMPORTANTE: Solo responde con el JSON, sin markdown, sin backticks, sin explicación adicional.`

export async function POST(request) {
  try {
    // Verificar autenticación
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Rate limit por usuario
    if (!checkRateLimit(user.id)) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Espera un momento.' },
        { status: 429 }
      )
    }

    const { message, history } = await request.json()

    if (!message || typeof message !== 'string' || message.length > 1000) {
      return NextResponse.json({ error: 'Mensaje inválido' }, { status: 400 })
    }

    if (!GEMINI_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    // Build conversation context
    const contents = []

    // Add history if exists
    if (history && Array.isArray(history)) {
      for (const msg of history.slice(-6)) {
        if (msg.role && msg.text) {
          contents.push({
            role: msg.role === 'ai' ? 'model' : 'user',
            parts: [{ text: String(msg.text).slice(0, 1000) }]
          })
        }
      }
    }

    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    })

    const body = {
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }]
      },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
        topP: 0.9,
      }
    }

    const res = await fetch(`${GEMINI_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_KEY,
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Gemini error:', err)
      return NextResponse.json({ error: 'AI service error' }, { status: 500 })
    }

    const data = await res.json()

    // Gemini 2.5 may have multiple parts (thinking + response)
    const parts = data.candidates?.[0]?.content?.parts || []
    let text = ''
    for (const part of parts) {
      if (part.text && !part.thought) {
        text = part.text
      }
    }
    if (!text) text = parts.find(p => p.text)?.text || ''

    // Parse JSON response from Gemini
    let parsed
    try {
      let clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      const jsonMatch = clean.match(/\{[\s\S]*\}/)
      if (jsonMatch) clean = jsonMatch[0]
      parsed = JSON.parse(clean)
    } catch {
      parsed = {
        diagnostico: text,
        consejo: null,
        categoria: null,
        urgencia: null,
        costo_estimado: null,
        preguntas: null,
      }
    }

    return NextResponse.json(parsed)

  } catch (error) {
    console.error('Diagnose API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
