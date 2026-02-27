import { getRepairer, getCategories, getStates, getReviewsForRepairer } from '@/lib/data'
import { notFound } from 'next/navigation'
import RepairerProfile from '@/components/RepairerProfile'

export const revalidate = 3600

export async function generateMetadata({ params }) {
  const repairer = await getRepairer(params.id)
  if (!repairer) return { title: 'Reparador no encontrado | QuiénRepara' }

  return {
    title: `${repairer.business_name} — ${repairer.city} | QuiénRepara`,
    description: repairer.description || `Contacta a ${repairer.business_name} en ${repairer.city}. Reparador verificado en QuiénRepara.`,
    openGraph: {
      title: `${repairer.business_name} | QuiénRepara`,
      description: repairer.description || `Reparador en ${repairer.city}`,
    },
  }
}

export default async function RepairerPage({ params }) {
  const [repairer, categories, states, reviews] = await Promise.all([
    getRepairer(params.id),
    getCategories(),
    getStates(),
    getReviewsForRepairer(params.id),
  ])

  if (!repairer) notFound()

  const catName = categories?.find(c => c.id === repairer.category_id)?.full_name ||
                  categories?.find(c => c.id === repairer.category_id)?.name || repairer.category_id
  const stName = states?.find(s => s.id === repairer.state_id)?.name || repairer.state_id

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: repairer.business_name,
          description: repairer.description,
          telephone: repairer.phone,
          address: {
            '@type': 'PostalAddress',
            addressLocality: repairer.city,
            addressRegion: stName,
            addressCountry: 'VE',
          },
          ...(repairer.avg_rating ? {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: repairer.avg_rating,
              reviewCount: repairer.total_reviews || 0,
            }
          } : {}),
        })
      }} />
      <RepairerProfile repairer={repairer} catName={catName} stName={stName} reviews={reviews} />
    </>
  )
}
