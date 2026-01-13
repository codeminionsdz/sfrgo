// In-memory data store for SAFRGO application
// This simulates a database - data persists during session but resets on refresh

import type {
  User,
  TravelerProfile,
  AgencyProfile,
  Agency,
  Offer,
  Message,
  Conversation,
  VerificationRequest,
  SubscriptionRequest,
} from "./types"

// Initialize with mock data
const initialUsers: User[] = [
  {
    id: "user-1",
    name: "Alex Thompson",
    email: "demo@safrgo.com",
    password: "password",
    avatar: "/alex-traveler.jpg",
    role: "traveler",
    createdAt: "2024-06-15T10:00:00Z",
  },
  {
    id: "user-2",
    name: "Sarah Chen",
    email: "agency@safrgo.com",
    password: "password",
    avatar: "/sarah-agency-owner.jpg",
    role: "agency",
    createdAt: "2024-03-10T08:00:00Z",
  },
  {
    id: "user-3",
    name: "Admin User",
    email: "admin@safrgo.com",
    password: "password",
    avatar: "/admin-user-interface.png",
    role: "admin",
    createdAt: "2024-01-01T00:00:00Z",
  },
]

const initialTravelerProfiles: Record<string, TravelerProfile> = {
  "user-1": {
    ...initialUsers[0],
    role: "traveler",
    savedOffers: ["offer-1", "offer-4"],
    followedAgencies: ["agency-1", "agency-3"],
  },
}

const initialAgencyProfiles: Record<string, AgencyProfile> = {
  "user-2": {
    ...initialUsers[1],
    role: "agency",
    agencyId: "agency-1",
  },
}

const initialAgencies: Agency[] = [
  {
    id: "agency-1",
    ownerId: "user-2",
    name: "Wanderlust Adventures",
    slug: "wanderlust-adventures",
    logo: "/wanderlust-travel-agency-logo.jpg",
    coverImage: "/tropical-beach-resort-aerial.jpg",
    description:
      "Crafting unforgettable journeys across Southeast Asia for over 15 years. We specialize in authentic cultural experiences and eco-friendly travel.",
    location: "Bangkok, Thailand",
    rating: 4.9,
    reviewCount: 847,
    verified: true,
    specialties: ["Southeast Asia", "Cultural Tours", "Eco Tourism"],
    followerCount: 12500,
    offerCount: 2,
    responseTime: "< 2 hours",
    joinedDate: "2019-03-15",
    status: "active",
    subscription: {
      plan: "premium",
      status: "active",
      expiresAt: "2025-02-15T00:00:00Z",
      receiptUrl: null,
      submittedAt: null,
    },
    offerLimit: 50,
  },
  {
    id: "agency-2",
    ownerId: "user-4",
    name: "Alpine Escapes",
    slug: "alpine-escapes",
    logo: "/mountain-travel-agency-logo.jpg",
    coverImage: "/swiss-alps-landscape.png",
    description:
      "Your gateway to European mountain adventures. From skiing to hiking, we create premium alpine experiences.",
    location: "Zurich, Switzerland",
    rating: 4.8,
    reviewCount: 623,
    verified: true,
    specialties: ["Europe", "Mountain Adventures", "Luxury Travel"],
    followerCount: 8900,
    offerCount: 2,
    responseTime: "< 4 hours",
    joinedDate: "2020-01-10",
    status: "active",
    subscription: {
      plan: "premium",
      status: "active",
      expiresAt: "2025-03-20T00:00:00Z",
      receiptUrl: null,
      submittedAt: null,
    },
    offerLimit: 50,
  },
  {
    id: "agency-3",
    ownerId: "user-5",
    name: "Safari Dreams",
    slug: "safari-dreams",
    logo: "/safari-travel-agency-logo.jpg",
    coverImage: "/african-savanna-sunset-elephants.jpg",
    description:
      "Experience the magic of Africa with our curated safari packages. Wildlife encounters and luxury lodges await.",
    location: "Nairobi, Kenya",
    rating: 4.95,
    reviewCount: 412,
    verified: true,
    specialties: ["Africa", "Wildlife Safari", "Luxury Lodges"],
    followerCount: 6700,
    offerCount: 1,
    responseTime: "< 3 hours",
    joinedDate: "2018-06-20",
    status: "active",
    subscription: {
      plan: "enterprise",
      status: "active",
      expiresAt: "2025-06-01T00:00:00Z",
      receiptUrl: null,
      submittedAt: null,
    },
    offerLimit: 999999,
  },
  {
    id: "agency-4",
    ownerId: "user-6",
    name: "Pacific Horizons",
    slug: "pacific-horizons",
    logo: "/ocean-travel-agency-logo.jpg",
    coverImage: "/maldives-overwater-bungalows.png",
    description:
      "Island paradise specialists. We create bespoke tropical getaways across the Pacific and Indian Oceans.",
    location: "Sydney, Australia",
    rating: 4.85,
    reviewCount: 534,
    verified: true,
    specialties: ["Islands", "Beach Resorts", "Honeymoons"],
    followerCount: 9200,
    offerCount: 1,
    responseTime: "< 2 hours",
    joinedDate: "2019-09-05",
    status: "active",
    subscription: {
      plan: "premium",
      status: "active",
      expiresAt: "2025-04-10T00:00:00Z",
      receiptUrl: null,
      submittedAt: null,
    },
    offerLimit: 50,
  },
  {
    id: "agency-5",
    ownerId: "user-7",
    name: "Beach Bliss Travel",
    slug: "beach-bliss",
    logo: "/beach-travel-agency-logo.jpg",
    coverImage: "/caribbean-beach.png",
    description: "Tropical beach getaways specialist focusing on Caribbean and Central American destinations.",
    location: "Miami, USA",
    rating: 4.7,
    reviewCount: 234,
    verified: false,
    specialties: ["Beach", "Caribbean"],
    followerCount: 3200,
    offerCount: 0,
    responseTime: "< 6 hours",
    joinedDate: "2024-12-01",
    status: "pending",
    subscription: {
      plan: "starter",
      status: "pending",
      expiresAt: null,
      receiptUrl: "/receipts/beach-bliss-receipt.jpg",
      submittedAt: "2025-01-06T14:00:00Z",
    },
    offerLimit: 10,
  },
]

const initialOffers: Offer[] = [
  {
    id: "offer-1",
    agencyId: "agency-1",
    title: "Enchanting Bali Discovery",
    destination: "Bali",
    country: "Indonesia",
    image: "/bali-rice-terraces-temple.jpg",
    images: [
      "/bali-rice-terraces.png",
      "/bali-temple-sunset.jpg",
      "/bali-beach.png",
      "/bali-traditional-dance.jpg",
    ],
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
    viewCount: 3240,
    featured: true,
    active: true,
    departureDate: "2025-03-15",
    maxGroupSize: 12,
    createdAt: "2024-10-15T10:00:00Z",
  },
  {
    id: "offer-2",
    agencyId: "agency-2",
    title: "Swiss Alps Winter Wonderland",
    destination: "Zermatt",
    country: "Switzerland",
    image: "/matterhorn-mountain-snow.jpg",
    images: [
      "/zermatt-village-winter.jpg",
      "/skiing-alps.jpg",
      "/swiss-chalet-interior.jpg",
      "/fondue-swiss.jpg",
    ],
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
    viewCount: 2180,
    featured: true,
    active: true,
    departureDate: "2025-02-01",
    maxGroupSize: 8,
    createdAt: "2024-09-20T14:00:00Z",
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
      "/african-elephant-safari.jpg",
      "/maasai-village.jpg",
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
    viewCount: 1890,
    featured: true,
    active: true,
    departureDate: "2025-07-10",
    maxGroupSize: 6,
    createdAt: "2024-08-05T09:00:00Z",
  },
  {
    id: "offer-4",
    agencyId: "agency-4",
    title: "Maldives Luxury Escape",
    destination: "Maldives",
    country: "Maldives",
    image: "/maldives-overwater-villa.png",
    images: [
      "/maldives-sunset.png",
      "/maldives-underwater-diving.jpg",
      "/maldives-spa-resort.jpg",
      "/maldives-beach-dinner.jpg",
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
    viewCount: 4520,
    featured: true,
    active: true,
    departureDate: "2025-04-20",
    maxGroupSize: 2,
    createdAt: "2024-11-01T11:00:00Z",
  },
  {
    id: "offer-5",
    agencyId: "agency-1",
    title: "Vietnam Heritage Trail",
    destination: "Hanoi to Ho Chi Minh",
    country: "Vietnam",
    image: "/vietnam-ha-long-bay.jpg",
    images: [
      "/hanoi-old-quarter.png",
      "/placeholder.svg?height=600&width=800",
      "/mekong-delta-boats.jpg",
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
    viewCount: 2890,
    featured: false,
    active: true,
    departureDate: "2025-05-05",
    maxGroupSize: 14,
    createdAt: "2024-07-20T16:00:00Z",
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
    viewCount: 1750,
    featured: false,
    active: true,
    departureDate: "2025-06-12",
    maxGroupSize: 10,
    createdAt: "2024-06-10T13:00:00Z",
  },
]

const initialConversations: Conversation[] = [
  {
    id: "conv-1",
    participants: ["user-1", "agency-1"],
    participantType: "traveler-agency",
    offerId: "offer-1",
    lastMessageAt: "2025-01-07T14:30:00Z",
    createdAt: "2025-01-05T10:00:00Z",
  },
  {
    id: "conv-2",
    participants: ["user-1", "agency-3"],
    participantType: "traveler-agency",
    offerId: "offer-3",
    lastMessageAt: "2025-01-06T09:15:00Z",
    createdAt: "2025-01-04T15:00:00Z",
  },
]

const initialMessages: Message[] = [
  {
    id: "msg-1",
    conversationId: "conv-1",
    senderId: "user-1",
    content: "Hi! I'm interested in the Bali Discovery trip. Is the March departure still available?",
    timestamp: "2025-01-05T10:00:00Z",
    read: true,
    type: "text",
  },
  {
    id: "msg-2",
    conversationId: "conv-1",
    senderId: "agency-1",
    content:
      "Hello! Yes, we still have spots available for the March 15th departure. How many travelers will be joining?",
    timestamp: "2025-01-05T10:30:00Z",
    read: true,
    type: "text",
  },
  {
    id: "msg-3",
    conversationId: "conv-1",
    senderId: "user-1",
    content: "It would be just me and my partner. Do you have any couples packages?",
    timestamp: "2025-01-07T09:00:00Z",
    read: true,
    type: "text",
  },
  {
    id: "msg-4",
    conversationId: "conv-1",
    senderId: "agency-1",
    content: "Great choice! The March departure has availability. Would you like me to reserve spots for you?",
    timestamp: "2025-01-07T14:30:00Z",
    read: false,
    type: "text",
  },
  {
    id: "msg-5",
    conversationId: "conv-2",
    senderId: "user-1",
    content: "What's the best time of year to see the Great Migration?",
    timestamp: "2025-01-06T09:15:00Z",
    read: true,
    type: "text",
  },
]

const initialVerificationRequests: VerificationRequest[] = [
  {
    id: "ver-1",
    agencyId: "agency-5",
    documents: ["Business License", "Insurance Certificate", "Owner ID"],
    status: "pending",
    submittedAt: "2025-01-07T14:00:00Z",
  },
]

const initialSubscriptionRequests: SubscriptionRequest[] = [
  {
    id: "sub-1",
    agencyId: "agency-5",
    plan: "starter",
    receiptUrl: "/receipts/beach-bliss-receipt.jpg",
    status: "pending",
    submittedAt: "2025-01-06T14:00:00Z",
  },
]

// The actual store - mutable data
class DataStore {
  users: User[] = [...initialUsers]
  travelerProfiles: Record<string, TravelerProfile> = { ...initialTravelerProfiles }
  agencyProfiles: Record<string, AgencyProfile> = { ...initialAgencyProfiles }
  agencies: Agency[] = [...initialAgencies]
  offers: Offer[] = [...initialOffers]
  conversations: Conversation[] = [...initialConversations]
  messages: Message[] = [...initialMessages]
  verificationRequests: VerificationRequest[] = [...initialVerificationRequests]
  subscriptionRequests: SubscriptionRequest[] = [...initialSubscriptionRequests]

  // Current session
  currentUserId: string | null = null

  // Generate unique IDs
  generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}

// Singleton instance
export const store = new DataStore()
