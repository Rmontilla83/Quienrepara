import dynamic from 'next/dynamic'

export const metadata = {
  title: 'Mi Perfil | QuiénRepara',
  description: 'Gestiona tu perfil y negocio en QuiénRepara.',
}

const Dashboard = dynamic(() => import('@/components/Dashboard'), { ssr: false })

export default function DashboardPage() {
  return <Dashboard />
}
