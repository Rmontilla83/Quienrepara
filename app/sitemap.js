import { getRepairers, getCategories } from '@/lib/data'

export default async function sitemap() {
  const [repairers, categories] = await Promise.all([
    getRepairers(),
    getCategories(),
  ])

  const base = 'https://www.quienrepara.com'

  const staticPages = [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}/buscar`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/mapa`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/diagnostico`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  const categoryPages = (categories || []).map(cat => ({
    url: `${base}/buscar?cat=${cat.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  const repairerPages = (repairers || []).map(r => ({
    url: `${base}/reparador/${r.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [...staticPages, ...categoryPages, ...repairerPages]
}
