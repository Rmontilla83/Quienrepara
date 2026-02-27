import { supabase } from './supabase'

export async function getRepairers() {
  if (!supabase) return []
  const { data } = await supabase
    .from('repairers')
    .select('id,business_name,contact_name,category_id,subcategory_id,state_id,city,phone,whatsapp,email,instagram,description,hours,avg_rating,total_reviews,is_premium,is_verified,is_active')
    .eq('is_active', true)
    .order('is_premium', { ascending: false })
    .order('avg_rating', { ascending: false })
    .limit(100)
  return data || []
}

export async function getRepairer(id) {
  if (!supabase) return null
  const { data } = await supabase
    .from('repairers')
    .select('*')
    .eq('id', id)
    .single()
  return data
}

export async function getCategories() {
  if (!supabase) return []
  const { data } = await supabase.from('categories').select('*').order('sort_order')
  return data || []
}

export async function getStates() {
  if (!supabase) return []
  const { data } = await supabase.from('states').select('*').order('name')
  return data || []
}

export async function getAd() {
  if (!supabase) return null
  const { data } = await supabase.from('ads').select('*').eq('is_active', true).limit(1)
  return data?.[0] || null
}

export async function getRepairersByCategory(categoryId) {
  if (!supabase) return []
  const { data } = await supabase
    .from('repairers')
    .select('id,business_name,contact_name,category_id,state_id,city,phone,whatsapp,email,description,avg_rating,total_reviews,is_premium,is_verified')
    .eq('is_active', true)
    .eq('category_id', categoryId)
    .order('is_premium', { ascending: false })
    .order('avg_rating', { ascending: false })
  return data || []
}

export async function getReviewsForRepairer(repairerId) {
  if (!supabase) return []
  const { data } = await supabase
    .from('reviews')
    .select('id,rating,comment,created_at,user_id,profiles(full_name)')
    .eq('repairer_id', repairerId)
    .order('created_at', { ascending: false })
    .limit(20)
  return data || []
}
