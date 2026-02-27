import Link from 'next/link'
import { getRepairers, getCategories, getAd } from '@/lib/data'
import HomeClient from '@/components/HomeClient'

export const revalidate = 3600

export const metadata = {
  title: 'QuiénRepara — Encuentra Reparadores en Venezuela',
  description: 'Directorio de técnicos y reparadores verificados en Anzoátegui, Venezuela. Electricistas, plomeros, técnicos de aires, mecánicos y más.',
  openGraph: {
    title: 'QuiénRepara — Directorio de Reparadores',
    description: 'Encuentra el técnico que necesitas en Anzoátegui, Venezuela. Diagnóstico IA gratuito.',
    url: 'https://www.quienrepara.com',
    siteName: 'QuiénRepara',
    locale: 'es_VE',
    type: 'website',
  },
}

export default async function Home() {
  const [repairers, categories, ad] = await Promise.all([
    getRepairers(),
    getCategories(),
    getAd(),
  ])

  return <HomeClient repairers={repairers} categories={categories} ad={ad} />
}
