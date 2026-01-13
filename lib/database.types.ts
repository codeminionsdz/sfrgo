// Database types for SAFRGO
// Generated from Supabase schema

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          avatar: string | null
          role: "traveler" | "agency" | "admin"
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          avatar?: string | null
          role?: "traveler" | "agency" | "admin"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          avatar?: string | null
          role?: "traveler" | "agency" | "admin"
          created_at?: string
          updated_at?: string
        }
      }
      agencies: {
        Row: {
          id: string
          owner_id: string
          name: string
          slug: string
          logo: string | null
          cover_image: string | null
          description: string | null
          location: string | null
          latitude: number | null
          longitude: number | null
          rating: number
          review_count: number
          verified: boolean
          specialties: string[]
          follower_count: number
          offer_count: number
          response_time: string
          joined_date: string
          status: "pending" | "active" | "suspended"
          subscription_plan: "starter" | "pro" | "business" | null
          subscription_status: "none" | "pending" | "active" | "expired" | "rejected"
          subscription_expires_at: string | null
          subscription_receipt_url: string | null
          subscription_submitted_at: string | null
          subscription_started_at: string | null
          subscription_amount: number | null
          subscription_currency: string
          subscription_period: string
          offer_limit: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          slug: string
          logo?: string | null
          cover_image?: string | null
          description?: string | null
          location?: string | null
          latitude?: number | null
          longitude?: number | null
          rating?: number
          review_count?: number
          verified?: boolean
          specialties?: string[]
          follower_count?: number
          offer_count?: number
          response_time?: string
          joined_date?: string
          status?: "pending" | "active" | "suspended"
          subscription_plan?: "starter" | "pro" | "business" | null
          subscription_status?: "none" | "pending" | "active" | "expired" | "rejected"
          subscription_expires_at?: string | null
          subscription_receipt_url?: string | null
          subscription_submitted_at?: string | null
          subscription_started_at?: string | null
          subscription_amount?: number | null
          subscription_currency?: string
          subscription_period?: string
          offer_limit?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          slug?: string
          logo?: string | null
          cover_image?: string | null
          description?: string | null
          location?: string | null
          latitude?: number | null
          longitude?: number | null
          rating?: number
          review_count?: number
          verified?: boolean
          specialties?: string[]
          follower_count?: number
          offer_count?: number
          response_time?: string
          joined_date?: string
          status?: "pending" | "active" | "suspended"
          subscription_plan?: "starter" | "pro" | "business" | null
          subscription_status?: "none" | "pending" | "active" | "expired" | "rejected"
          subscription_expires_at?: string | null
          subscription_receipt_url?: string | null
          subscription_submitted_at?: string | null
          subscription_started_at?: string | null
          subscription_amount?: number | null
          subscription_currency?: string
          subscription_period?: string
          offer_limit?: number
          created_at?: string
          updated_at?: string
        }
      }
      subscription_history: {
        Row: {
          id: string
          agency_id: string
          plan: string
          amount: number
          currency: string
          period: string
          status: string
          receipt_url: string | null
          submitted_at: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          review_notes: string | null
          started_at: string | null
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          agency_id: string
          plan: string
          amount: number
          currency?: string
          period?: string
          status: string
          receipt_url?: string | null
          submitted_at?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          review_notes?: string | null
          started_at?: string | null
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          agency_id?: string
          plan?: string
          amount?: number
          currency?: string
          period?: string
          status?: string
          receipt_url?: string | null
          submitted_at?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          review_notes?: string | null
          started_at?: string | null
          expires_at?: string | null
          created_at?: string
        }
      }
      offers: {
        Row: {
          id: string
          agency_id: string
          offer_type: "travel" | "umrah" | "hajj"
          title: string
          destination: string
          country: string
          image: string | null
          images: string[]
          price: number
          original_price: number | null
          currency: string
          duration: string
          description: string | null
          highlights: string[]
          included: string[]
          not_included: string[]
          category: string
          rating: number
          review_count: number
          saved_count: number
          view_count: number
          featured: boolean
          active: boolean
          departure_date: string | null
          max_group_size: number | null
          // Umrah & Hajj specific fields
          season: string | null
          accommodation_details: string | null
          transport_details: string | null
          religious_program: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          agency_id: string
          offer_type?: "travel" | "umrah" | "hajj"
          title: string
          destination: string
          country: string
          image?: string | null
          images?: string[]
          price: number
          original_price?: number | null
          currency?: string
          duration: string
          description?: string | null
          highlights?: string[]
          included?: string[]
          not_included?: string[]
          category: string
          rating?: number
          review_count?: number
          saved_count?: number
          view_count?: number
          featured?: boolean
          active?: boolean
          departure_date?: string | null
          max_group_size?: number | null
          // Umrah & Hajj specific fields
          season?: string | null
          accommodation_details?: string | null
          transport_details?: string | null
          religious_program?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          agency_id?: string
          offer_type?: "travel" | "umrah" | "hajj"
          title?: string
          destination?: string
          country?: string
          image?: string | null
          images?: string[]
          price?: number
          original_price?: number | null
          currency?: string
          duration?: string
          description?: string | null
          highlights?: string[]
          included?: string[]
          not_included?: string[]
          category?: string
          rating?: number
          review_count?: number
          saved_count?: number
          view_count?: number
          featured?: boolean
          active?: boolean
          departure_date?: string | null
          max_group_size?: number | null
          // Umrah & Hajj specific fields
          season?: string | null
          accommodation_details?: string | null
          transport_details?: string | null
          religious_program?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      saved_offers: {
        Row: {
          id: string
          user_id: string
          offer_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          offer_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          offer_id?: string
          created_at?: string
        }
      }
      followed_agencies: {
        Row: {
          id: string
          user_id: string
          agency_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          agency_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          agency_id?: string
          created_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          offer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          offer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          offer_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      conversation_participants: {
        Row: {
          id: string
          conversation_id: string
          user_id: string
          last_read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          user_id: string
          last_read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          user_id?: string
          last_read_at?: string | null
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          content: string
          message_type: "text" | "image"
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          content: string
          message_type?: "text" | "image"
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          content?: string
          message_type?: "text" | "image"
          created_at?: string
        }
      }
      verification_requests: {
        Row: {
          id: string
          agency_id: string
          documents: string[]
          status: "pending" | "approved" | "rejected"
          submitted_at: string
          reviewed_at: string | null
          reviewed_by: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          agency_id: string
          documents?: string[]
          status?: "pending" | "approved" | "rejected"
          submitted_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          agency_id?: string
          documents?: string[]
          status?: "pending" | "approved" | "rejected"
          submitted_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          notes?: string | null
        }
      }
      subscription_requests: {
        Row: {
          id: string
          agency_id: string
          plan: "starter" | "pro" | "business"
          receipt_url: string
          status: "pending" | "approved" | "rejected"
          submitted_at: string
          reviewed_at: string | null
          reviewed_by: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          agency_id: string
          plan: "starter" | "pro" | "business"
          receipt_url: string
          status?: "pending" | "approved" | "rejected"
          submitted_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          agency_id?: string
          plan?: "starter" | "pro" | "business"
          receipt_url?: string
          status?: "pending" | "approved" | "rejected"
          submitted_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          notes?: string | null
        }
      }
      subscription_history: {
        Row: {
          id: string
          agency_id: string
          plan: string
          amount: number
          currency: string
          period: string
          status: string
          receipt_url: string | null
          submitted_at: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          review_notes: string | null
          started_at: string | null
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          agency_id: string
          plan: string
          amount: number
          currency?: string
          period?: string
          status: string
          receipt_url?: string | null
          submitted_at?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          review_notes?: string | null
          started_at?: string | null
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          agency_id?: string
          plan?: string
          amount?: number
          currency?: string
          period?: string
          status?: string
          receipt_url?: string | null
          submitted_at?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          review_notes?: string | null
          started_at?: string | null
          expires_at?: string | null
          created_at?: string
        }
      }
    }
  }
}

// Helper types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type Agency = Database["public"]["Tables"]["agencies"]["Row"]
export type Offer = Database["public"]["Tables"]["offers"]["Row"]
export type SavedOffer = Database["public"]["Tables"]["saved_offers"]["Row"]
export type FollowedAgency = Database["public"]["Tables"]["followed_agencies"]["Row"]
export type Conversation = Database["public"]["Tables"]["conversations"]["Row"]
export type ConversationParticipant = Database["public"]["Tables"]["conversation_participants"]["Row"]
export type Message = Database["public"]["Tables"]["messages"]["Row"]
export type VerificationRequest = Database["public"]["Tables"]["verification_requests"]["Row"]
export type SubscriptionRequest = Database["public"]["Tables"]["subscription_requests"]["Row"]
export type SubscriptionHistory = Database["public"]["Tables"]["subscription_history"]["Row"]

// Extended types with relations
export type OfferWithAgency = Offer & { agency: Agency }
export type ConversationWithDetails = Conversation & {
  participants: (ConversationParticipant & { profile: Profile })[]
  messages: Message[]
  offer?: Offer | null
}
