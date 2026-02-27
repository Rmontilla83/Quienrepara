import './globals.css'
import LayoutClient from '@/components/LayoutClient'

export const metadata = {
  title: 'QuiénRepara — Directorio Inteligente de Reparadores',
  description: 'Encuentra técnicos y reparadores verificados en Anzoátegui, Venezuela. Diagnóstico IA gratuito.',
  manifest: '/manifest.json',
}

export const viewport = {
  themeColor: '#fbbf24',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  )
}
