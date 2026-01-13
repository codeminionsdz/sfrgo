import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format price with currency symbol
 * @param price - The price amount
 * @param currency - Currency code (DZD, USD, SAR, AED, EUR)
 * @returns Formatted price string
 */
export function formatPrice(price: number, currency: string = 'DZD'): string {
  const formattedAmount = price.toLocaleString('ar-DZ')
  
  switch (currency) {
    case 'DZD':
      return `${formattedAmount} دج`
    case 'USD':
      return `$${formattedAmount}`
    case 'SAR':
      return `${formattedAmount} ر.س`
    case 'AED':
      return `${formattedAmount} د.إ`
    case 'EUR':
      return `€${formattedAmount}`
    default:
      return `${formattedAmount} ${currency}`
  }
}

/**
 * Generate a deterministic pseudo-rating for offers without real reviews
 * @param id - Offer ID (used to generate consistent rating)
 * @param reviewsCount - Number of reviews (if 0, generate pseudo-rating)
 * @returns Object with displayRating and label
 */
export function getPseudoRating(id: string, reviewsCount: number = 0): {
  rating: number
  label: string | null
} {
  // If there are real reviews, return null (no pseudo rating needed)
  if (reviewsCount > 0) {
    return { rating: 0, label: null }
  }

  // Generate deterministic hash from offer ID
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }

  // Map hash to range 4.0 - 4.9
  const normalized = Math.abs(hash % 100) / 100 // 0.00 - 0.99
  const rating = 4.0 + (normalized * 0.9) // 4.0 - 4.9
  const roundedRating = Math.round(rating * 10) / 10 // Round to 1 decimal

  return {
    rating: roundedRating,
    label: "موثوق" // Trusted
  }
}

