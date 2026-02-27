import { Suspense } from 'react'
import { getRepairers, getCategories, getStates } from '@/lib/data'
import SearchClient from '@/components/SearchClient'

export const revalidate = 3600

export const metadata = {
  title: 'Buscar Reparadores | QuiénRepara',
  description: 'Busca electricistas, plomeros, técnicos de aires, mecánicos y más en Anzoátegui, Venezuela. Filtros por categoría, ciudad y estado.',
  openGraph: {
    title: 'Buscar Reparadores | QuiénRepara',
    description: 'Encuentra el técnico que necesitas en tu ciudad.',
  },
}

export default async function BuscarPage() {
  const [repairers, categories, states] = await Promise.all([
    getRepairers(),
    getCategories(),
    getStates(),
  ])

  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Cargando...</div>}>
      <SearchClient repairers={repairers} categories={categories} states={states} />
    </Suspense>
  )
}
