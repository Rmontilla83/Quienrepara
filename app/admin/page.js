import dynamic from 'next/dynamic'

export const metadata = {
  title: 'Administración | QuiénRepara',
  description: 'Panel de administración de QuiénRepara.',
}

const AdminPanel = dynamic(() => import('@/components/AdminPanel'), { ssr: false })

export default function AdminPage() {
  return <AdminPanel />
}
