import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Server-side client (for page.js data fetching)
export const supabase = createClient(supabaseUrl, supabaseKey)

// Client-side singleton (for auth and realtime in components)
let clientInstance = null
export function getSupabaseClient() {
  if (!clientInstance) {
    clientInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  }
  return clientInstance
}

export async function signUp({ email, password, role, fullName, phone, businessName, categoryId, description, stateId, city }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: role || 'client',
        full_name: fullName,
        phone,
        business_name: businessName,
        category_id: categoryId,
        description,
        state_id: stateId,
        city,
      }
    }
  })
  return { data, error }
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export async function signOut() {
  return await supabase.auth.signOut()
}

export async function getMyRepairer(userId) {
  const { data } = await supabase.from('repairers').select('*').eq('user_id', userId).single()
  return data
}

export async function updateRepairer(id, updates) {
  const { data, error } = await supabase.from('repairers').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single()
  return { data, error }
}
