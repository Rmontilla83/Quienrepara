import './globals.css'

export const metadata = {
  title: 'QuiénRepara — Directorio Inteligente de Reparadores',
  description: 'Encuentra técnicos y reparadores verificados en Anzoátegui, Venezuela. Diagnóstico IA gratuito.',
  manifest: '/manifest.json',
  themeColor: '#fbbf24',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  )
}
