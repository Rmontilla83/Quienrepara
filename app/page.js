import { supabase } from '@/lib/supabase'
import ClientApp from '@/components/ClientApp'

export const revalidate = 60

export default async function Home() {
  const [repRes, catRes, stRes, adRes] = await Promise.all([
    supabase.from('repairers').select('*').eq('is_active', true).order('is_premium', { ascending: false }).order('avg_rating', { ascending: false }).limit(100),
    supabase.from('categories').select('*').order('sort_order'),
    supabase.from('states').select('*').order('name'),
    supabase.from('ads').select('*').eq('is_active', true).limit(1),
  ])

  return <ClientApp
    repairers={repRes.data || []}
    categories={catRes.data || []}
    states={stRes.data || []}
    ad={adRes.data?.[0] || null}
  />
}
