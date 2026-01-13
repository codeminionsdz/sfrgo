// Mock data for SAFRGO travel application

export interface Agency {
  id: string
  name: string
  slug: string
  logo: string
  coverImage: string
  description: string
  location: string
  rating: number
  reviewCount: number
  verified: boolean
  specialties: string[]
  followerCount: number
  offerCount: number
  responseTime: string
  joinedDate: string
}

export interface Offer {
  id: string
  agencyId: string
  agency?: Agency
  title: string
  destination: string
  country: string
  image: string
  images: string[]
  price: number
  originalPrice?: number
  currency: string
  duration: string
  description: string
  highlights: string[]
  included: string[]
  notIncluded: string[]
  category: string
  rating: number
  reviewCount: number
  savedCount: number
  featured: boolean
  departureDate?: string
  maxGroupSize?: number
}

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: "traveler" | "agency" | "admin"
  savedOffers: string[]
  followedAgencies: string[]
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  offerId?: string
  content: string
  timestamp: string
  read: boolean
  type: "text" | "image"
}

export interface Conversation {
  id: string
  participants: string[]
  lastMessage: Message
  unreadCount: number
  offerId?: string
}

export const mockAgencies: Agency[] = [
  {
    id: "agency-1",
    name: "Wanderlust Adventures",
    slug: "wanderlust-adventures",
    logo: "/travel-agency-logo-w.jpg",
    coverImage: "/tropical-beach-resort-aerial-view.jpg",
    description:
      "Crafting unforgettable journeys across Southeast Asia for over 15 years. We specialize in authentic cultural experiences and eco-friendly travel.",
    location: "Bangkok, Thailand",
    rating: 4.9,
    reviewCount: 847,
    verified: true,
    specialties: ["Southeast Asia", "Cultural Tours", "Eco Tourism"],
    followerCount: 12500,
    offerCount: 45,
    responseTime: "< 2 hours",
    joinedDate: "2019-03-15",
  },
  {
    id: "agency-2",
    name: "Alpine Escapes",
    slug: "alpine-escapes",
    logo: "/mountain-travel-agency-logo-a.jpg",
    coverImage: "/swiss-alps-landscape.png",
    description:
      "Your gateway to European mountain adventures. From skiing to hiking, we create premium alpine experiences.",
    location: "Zurich, Switzerland",
    rating: 4.8,
    reviewCount: 623,
    verified: true,
    specialties: ["Europe", "Mountain Adventures", "Luxury Travel"],
    followerCount: 8900,
    offerCount: 32,
    responseTime: "< 4 hours",
    joinedDate: "2020-01-10",
  },
  {
    id: "agency-3",
    name: "Safari Dreams",
    slug: "safari-dreams",
    logo: "/safari-travel-agency-logo-s.jpg",
    coverImage: "/african-savanna-sunset-elephants.jpg",
    description:
      "Experience the magic of Africa with our curated safari packages. Wildlife encounters and luxury lodges await.",
    location: "Nairobi, Kenya",
    rating: 4.95,
    reviewCount: 412,
    verified: true,
    specialties: ["Africa", "Wildlife Safari", "Luxury Lodges"],
    followerCount: 6700,
    offerCount: 28,
    responseTime: "< 3 hours",
    joinedDate: "2018-06-20",
  },
  {
    id: "agency-4",
    name: "Pacific Horizons",
    slug: "pacific-horizons",
    logo: "/ocean-travel-agency-logo-p.jpg",
    coverImage: "/maldives-overwater-bungalows.png",
    description:
      "Island paradise specialists. We create bespoke tropical getaways across the Pacific and Indian Oceans.",
    location: "Sydney, Australia",
    rating: 4.85,
    reviewCount: 534,
    verified: true,
    specialties: ["Islands", "Beach Resorts", "Honeymoons"],
    followerCount: 9200,
    offerCount: 38,
    responseTime: "< 2 hours",
    joinedDate: "2019-09-05",
  },
]

export const mockOffers: Offer[] = [
  {
    id: "offer-1",
    agencyId: "agency-1",
    title: "Enchanting Bali Discovery",
    destination: "Bali",
    country: "Indonesia",
    image: "/bali-rice-terraces-temple.jpg",
    images: ["/bali-rice-terraces.png", "/bali-temple-sunset.jpg", "/bali-beach.png", "/bali-traditional-dance.jpg"],
    price: 1299,
    originalPrice: 1599,
    currency: "USD",
    duration: "8 days / 7 nights",
    description:
      "Immerse yourself in the spiritual heart of Bali. From ancient temples to pristine beaches, this journey offers the perfect blend of culture, adventure, and relaxation.",
    highlights: [
      "Visit Uluwatu Temple at sunset",
      "Traditional Balinese cooking class",
      "Ubud rice terrace trek",
      "Snorkeling in crystal-clear waters",
    ],
    included: ["Accommodation", "Daily breakfast", "Airport transfers", "Guided tours", "Entrance fees"],
    notIncluded: ["International flights", "Travel insurance", "Personal expenses"],
    category: "Cultural",
    rating: 4.9,
    reviewCount: 156,
    savedCount: 892,
    featured: true,
    departureDate: "2025-03-15",
    maxGroupSize: 12,
  },
  {
    id: "offer-2",
    agencyId: "agency-2",
    title: "Swiss Alps Winter Wonderland",
    destination: "Zermatt",
    country: "Switzerland",
    image: "/matterhorn-mountain-snow.jpg",
    images: ["/zermatt-village-winter.jpg", "/skiing-alps.jpg", "/swiss-chalet-interior.jpg", "/fondue-swiss.jpg"],
    price: 2899,
    currency: "USD",
    duration: "6 days / 5 nights",
    description:
      "Experience the magic of the Swiss Alps in Zermatt, home to the iconic Matterhorn. Perfect for skiing enthusiasts and winter lovers.",
    highlights: [
      "Ski the world-famous slopes",
      "Matterhorn Glacier Paradise",
      "Gourmet Swiss dining",
      "Scenic train journey",
    ],
    included: ["5-star hotel accommodation", "Ski pass", "Gourmet meals", "Train transfers"],
    notIncluded: ["Flights", "Ski equipment rental", "Travel insurance"],
    category: "Adventure",
    rating: 4.85,
    reviewCount: 98,
    savedCount: 654,
    featured: true,
    departureDate: "2025-02-01",
    maxGroupSize: 8,
  },
  {
    id: "offer-3",
    agencyId: "agency-3",
    title: "Serengeti Safari Experience",
    destination: "Serengeti",
    country: "Tanzania",
    image: "/serengeti-lions-safari.jpg",
    images: [
      "/serengeti-wildebeest-migration.png",
      "/safari-lodge-luxury.jpg",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    price: 4599,
    originalPrice: 5299,
    currency: "USD",
    duration: "10 days / 9 nights",
    description:
      "Witness the Great Migration and encounter Africa's magnificent wildlife on this once-in-a-lifetime safari adventure.",
    highlights: ["Great Migration viewing", "Big Five game drives", "Luxury tented camp", "Maasai village visit"],
    included: ["Luxury lodge accommodation", "All meals", "Game drives", "Park fees", "Flying doctors insurance"],
    notIncluded: ["International flights", "Visa fees", "Gratuities"],
    category: "Wildlife",
    rating: 4.95,
    reviewCount: 73,
    savedCount: 421,
    featured: true,
    departureDate: "2025-07-10",
    maxGroupSize: 6,
  },
  {
    id: "offer-4",
    agencyId: "agency-4",
    title: "Maldives Luxury Escape",
    destination: "Maldives",
    country: "Maldives",
    image: "/placeholder.svg?height=600&width=800",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    price: 3799,
    currency: "USD",
    duration: "7 days / 6 nights",
    description:
      "Indulge in pure paradise with overwater villas, pristine beaches, and world-class diving in the Maldives.",
    highlights: ["Overwater villa stay", "Private beach dinner", "Diving & snorkeling", "Sunset dolphin cruise"],
    included: ["Overwater villa", "Full board meals", "Speedboat transfers", "Water activities"],
    notIncluded: ["International flights", "Spa treatments", "Premium beverages"],
    category: "Beach",
    rating: 4.92,
    reviewCount: 134,
    savedCount: 1023,
    featured: true,
    departureDate: "2025-04-20",
    maxGroupSize: 2,
  },
  {
    id: "offer-5",
    agencyId: "agency-1",
    title: "Vietnam Heritage Trail",
    destination: "Hanoi to Ho Chi Minh",
    country: "Vietnam",
    image: "/placeholder.svg?height=600&width=800",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    price: 1599,
    currency: "USD",
    duration: "12 days / 11 nights",
    description:
      "Journey through Vietnam from north to south, discovering ancient traditions, stunning landscapes, and incredible cuisine.",
    highlights: ["Ha Long Bay cruise", "Hoi An ancient town", "Cu Chi Tunnels", "Mekong Delta exploration"],
    included: ["Hotels & overnight cruise", "Breakfast daily", "Domestic flights", "Guided tours"],
    notIncluded: ["International flights", "Visa", "Travel insurance"],
    category: "Cultural",
    rating: 4.88,
    reviewCount: 201,
    savedCount: 756,
    featured: false,
    departureDate: "2025-05-05",
    maxGroupSize: 14,
  },
  {
    id: "offer-6",
    agencyId: "agency-2",
    title: "Italian Lakes Romance",
    destination: "Lake Como",
    country: "Italy",
    image: "/placeholder.svg?height=600&width=800",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    price: 2199,
    currency: "USD",
    duration: "5 days / 4 nights",
    description:
      "Experience la dolce vita on the shores of Lake Como. Elegant villas, charming villages, and exquisite Italian cuisine await.",
    highlights: ["Villa Carlotta gardens", "Private boat tour", "Wine tasting", "Bellagio exploration"],
    included: ["Boutique hotel", "Breakfast", "Boat tours", "Wine experience"],
    notIncluded: ["Flights", "Lunches & dinners", "Personal expenses"],
    category: "Romance",
    rating: 4.87,
    reviewCount: 89,
    savedCount: 534,
    featured: false,
    departureDate: "2025-06-12",
    maxGroupSize: 10,
  },
]

export const mockUser: User = {
  id: "user-1",
  name: "Alex Thompson",
  email: "alex@example.com",
  avatar: "/placeholder.svg?height=100&width=100",
  role: "traveler",
  savedOffers: ["offer-1", "offer-4"],
  followedAgencies: ["agency-1", "agency-3"],
}

export const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    participants: ["user-1", "agency-1"],
    lastMessage: {
      id: "msg-1",
      senderId: "agency-1",
      receiverId: "user-1",
      offerId: "offer-1",
      content: "Great choice! The March departure has availability. Would you like me to reserve spots for you?",
      timestamp: "2025-01-07T14:30:00Z",
      read: false,
      type: "text",
    },
    unreadCount: 1,
    offerId: "offer-1",
  },
  {
    id: "conv-2",
    participants: ["user-1", "agency-3"],
    lastMessage: {
      id: "msg-2",
      senderId: "user-1",
      receiverId: "agency-3",
      offerId: "offer-3",
      content: "What's the best time of year to see the Great Migration?",
      timestamp: "2025-01-06T09:15:00Z",
      read: true,
      type: "text",
    },
    unreadCount: 0,
    offerId: "offer-3",
  },
]

// Helper function to get offers with agency data
export function getOffersWithAgencies(): (Offer & { agency: Agency })[] {
  return mockOffers.map((offer) => ({
    ...offer,
    agency: mockAgencies.find((a) => a.id === offer.agencyId)!,
  }))
}

// Categories for filtering
export const categories = [
  { id: "all", name: "All", icon: "Globe" },
  { id: "cultural", name: "Cultural", icon: "Landmark" },
  { id: "adventure", name: "Adventure", icon: "Mountain" },
  { id: "beach", name: "Beach", icon: "Umbrella" },
  { id: "wildlife", name: "Wildlife", icon: "Bird" },
  { id: "romance", name: "Romance", icon: "Heart" },
]

// Popular destinations for landing page
export const popularDestinations = [
  { name: "Bali", country: "Indonesia", image: "/bali-temple-sunset.jpg", offerCount: 24 },
  { name: "Santorini", country: "Greece", image: "/placeholder.svg?height=400&width=300", offerCount: 18 },
  { name: "Tokyo", country: "Japan", image: "/placeholder.svg?height=400&width=300", offerCount: 31 },
  { name: "Maldives", country: "Maldives", image: "/placeholder.svg?height=400&width=300", offerCount: 15 },
  { name: "Paris", country: "France", image: "/placeholder.svg?height=400&width=300", offerCount: 42 },
  { name: "Cape Town", country: "South Africa", image: "/placeholder.svg?height=400&width=300", offerCount: 12 },
]

// Stats for landing page
export const platformStats = {
  agencies: 2500,
  travelers: 150000,
  destinations: 180,
  countries: 85,
}

export const mockMessages: Message[] = [
  {
    id: "msg-1",
    senderId: "agency-1",
    receiverId: "user-1",
    offerId: "offer-1",
    content: "Great choice! The March departure has availability. Would you like me to reserve spots for you?",
    timestamp: "2025-01-07T14:30:00Z",
    read: false,
    type: "text",
  },
  {
    id: "msg-2",
    senderId: "user-1",
    receiverId: "agency-3",
    offerId: "offer-3",
    content: "What's the best time of year to see the Great Migration?",
    timestamp: "2025-01-06T09:15:00Z",
    read: true,
    type: "text",
  },
  {
    id: "msg-3",
    senderId: "agency-3",
    receiverId: "user-1",
    offerId: "offer-3",
    content: "The best time is between July and September when the herds cross the Mara River. It's truly spectacular!",
    timestamp: "2025-01-06T10:45:00Z",
    read: true,
    type: "text",
  },
]
