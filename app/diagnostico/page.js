import dynamic from 'next/dynamic'

export const metadata = {
  title: 'Diagnóstico IA | QuiénRepara',
  description: 'Describe tu problema y nuestra IA te dice qué puede ser, qué hacer y a quién llamar. Diagnóstico gratuito para reparaciones en Venezuela.',
  openGraph: {
    title: 'Diagnóstico IA | QuiénRepara',
    description: 'Describe tu falla y recibe un diagnóstico inteligente gratis.',
  },
}

const AIDiagnosis = dynamic(() => import('@/components/AIDiagnosis'), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 170px)' }}>
      <p style={{ color: '#94a3b8' }}>Cargando diagnóstico...</p>
    </div>
  ),
})

export default function DiagnosticoPage() {
  return <AIDiagnosis />
}
