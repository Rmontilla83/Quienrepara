import { NextResponse } from 'next/server'

const GEMINI_KEY = process.env.GEMINI_API_KEY
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

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
    const { message, history } = await request.json()

    if (!GEMINI_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    // Build conversation context
    const contents = []
    
    // Add history if exists
    if (history && history.length) {
      for (const msg of history) {
        contents.push({
          role: msg.role === 'ai' ? 'model' : 'user',
          parts: [{ text: msg.text }]
        })
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
    // Find the text part that contains our JSON
    const parts = data.candidates?.[0]?.content?.parts || []
    let text = ''
    for (const part of parts) {
      if (part.text && !part.thought) {
        text = part.text
      }
    }
    // Fallback: just get any text
    if (!text) text = parts.find(p => p.text)?.text || ''

    // Parse JSON response from Gemini
    let parsed
    try {
      // Clean up potential markdown wrapping and find JSON
      let clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      // Try to extract JSON object from the text
      const jsonMatch = clean.match(/\{[\s\S]*\}/)
      if (jsonMatch) clean = jsonMatch[0]
      parsed = JSON.parse(clean)
    } catch {
      // If Gemini didn't return valid JSON, create a fallback
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
