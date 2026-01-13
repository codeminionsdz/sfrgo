import type { Metadata } from "next"
import { OfferDetails } from "@/components/traveler/offer-details"
import { getOfferById, getSavedOfferIds } from "@/lib/actions/offers"
import { getProfile } from "@/lib/actions/auth"
import { notFound } from "next/navigation"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const offer = await getOfferById(id)
  
  if (!offer) {
    return {
      title: "عرض غير موجود - SAFRGO",
    }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://safrgo.online"
  const url = `${appUrl}/offers/${id}`
  const ogImageUrl = `${appUrl}/api/og/offer/${id}`
  
  // Format price for description
  const formatPrice = (price: number, currency: string = 'DZD') => {
    if (currency === 'DZD') {
      return `${price.toLocaleString('ar-DZ')} دج`
    }
    return `${price.toLocaleString('en-US')} ${currency}`
  }

  const priceText = formatPrice(offer.price, offer.currency)
  const description = offer.description || `${offer.destination}, ${offer.country} - ${offer.duration} - ${priceText} للشخص | ${offer.agency.name}`

  return {
    title: `${offer.title} - ${offer.agency.name} | SAFRGO`,
    description,
    keywords: [
      offer.destination,
      offer.country,
      offer.category,
      'سياحة',
      'سفر',
      'عروض سياحية',
      offer.agency.name,
      'SAFRGO',
    ],
    openGraph: {
      title: offer.title,
      description,
      url,
      siteName: "SAFRGO - اكتشف أفضل العروض السياحية",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: offer.title,
          type: 'image/png',
        },
      ],
      locale: "ar_DZ",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: offer.title,
      description,
      images: [ogImageUrl],
      creator: "@safrgo",
      site: "@safrgo",
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function OfferPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [offer, profile, savedOfferIds] = await Promise.all([getOfferById(id), getProfile(), getSavedOfferIds()])

  if (!offer) {
    notFound()
  }

  const isSaved = savedOfferIds.includes(offer.id)

  return <OfferDetails offer={offer} isAuthenticated={!!profile} initialIsSaved={isSaved} />
}
