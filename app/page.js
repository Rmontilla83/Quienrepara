import { supabase } from '@/lib/supabase'
import ClientApp from '@/components/ClientApp'

export const revalidate = 60 // revalidate data every 60 seconds

export default async function Home() {
  // Fetch all data server-side
  const [repRes, catRes, stRes, adRes] = await Promise.all([
    supabase.from('repairers').select('*').eq('is_active', true).order('is_premium', { ascending: false }).order('avg_rating', { ascending: false }).limit(100),
    supabase.from('categories').select('*').order('sort_order'),
    supabase.from('states').select('*').order('name'),
    supabase.from('ads').select('*').eq('is_active', true).limit(1),
  ])

  const repairers = repRes.data || []
  const categories = catRes.data || []
  const states = stRes.data || []
  const ad = adRes.data?.[0] || null

  return <ClientApp repairers={repairers} categories={categories} states={states} ad={ad} />
}
