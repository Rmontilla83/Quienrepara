import dynamic from 'next/dynamic'
import { getRepairers, getCategories } from '@/lib/data'

export const metadata = {
  title: 'Mapa de Reparadores | QuiénRepara',
  description: 'Encuentra reparadores cerca de ti en el mapa interactivo. Barcelona, Puerto La Cruz, Lechería y más.',
  openGraph: {
    title: 'Mapa de Reparadores | QuiénRepara',
    description: 'Mapa interactivo de técnicos verificados en Anzoátegui.',
  },
}

const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 140px)' }}>
      <p style={{ color: '#94a3b8' }}>Cargando mapa...</p>
    </div>
  ),
})

export default async function MapaPage() {
  const [repairers, categories] = await Promise.all([
    getRepairers(),
    getCategories(),
  ])

  return <MapView repairers={repairers} categories={categories} />
}
