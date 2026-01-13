"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Conversation, Message, Profile, Offer, Agency } from "@/lib/database.types"

export interface ConversationWithDetails extends Conversation {
  participants: { user_id: string; profile: Profile }[]
  messages: Message[]
  offer?: Offer | null
  other_participant?: Profile
  agency?: Agency | null
  unread_count?: number
}

export async function getConversations() {
  // Use service role to bypass RLS policies with recursion issues
  const { createClient: createServiceClient } = await import("@supabase/supabase-js")
  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
  
  // Also get regular client to check current user
  const regularClient = await createClient()
  const {
    data: { user },
  } = await regularClient.auth.getUser()

  console.log("[getConversations] User:", user?.id)

  if (!user) {
    return []
  }

  // Get conversations where user is a participant - using service role
  const { data: participations, error: partError } = await supabase
    .from("conversation_participants")
    .select("conversation_id, last_read_at")
    .eq("user_id", user.id)

  console.log("[getConversations] Participations:", participations, "Error:", partError)

  if (!participations || participations.length === 0) {
    return []
  }

  const conversationIds = participations.map((p) => p.conversation_id)

  console.log("[getConversations] Conversation IDs:", conversationIds)

  // Get conversations with offer and agency details - using service role
  const { data: conversations, error: convError } = await supabase
    .from("conversations")
    .select(
      `
      *,
      offer:offers(
        *,
        agency:agencies(*)
      )
    `,
    )
    .in("id", conversationIds)
    .order("updated_at", { ascending: false })

  console.log("[getConversations] Conversations:", conversations, "Error:", convError)

  if (!conversations) {
    return []
  }

  // Get all participants for these conversations - using service role
  const { data: allParticipants } = await supabase
    .from("conversation_participants")
    .select(
      `
      conversation_id,
      user_id,
      profile:profiles(*)
    `,
    )
    .in("conversation_id", conversationIds)

  console.log("[getConversations] All participants:", allParticipants)

  // Get last message for each conversation - using service role
  const { data: lastMessages } = await supabase
    .from("messages")
    .select("*")
    .in("conversation_id", conversationIds)
    .order("created_at", { ascending: false })

  console.log("[getConversations] Last messages:", lastMessages)

  // Build conversation details
  const conversationsWithDetails: ConversationWithDetails[] = conversations.map((conv) => {
    const participation = participations.find((p) => p.conversation_id === conv.id)
    const participants = allParticipants?.filter((ap) => ap.conversation_id === conv.id) || []
    const otherParticipant = participants.find((ap) => ap.user_id !== user.id)?.profile as Profile | undefined
    const messages = lastMessages?.filter((m) => m.conversation_id === conv.id) || []
    const unreadCount = messages.filter(
      (m) => m.sender_id !== user.id && new Date(m.created_at) > new Date(participation?.last_read_at || 0),
    ).length

    return {
      ...conv,
      participants: participants.map((ap) => ({ user_id: ap.user_id, profile: ap.profile as Profile })),
      messages: messages.slice(0, 1),
      offer: conv.offer || null,
      other_participant: otherParticipant,
      agency: conv.offer?.agency || null,
      unread_count: unreadCount,
    }
  })

  console.log("[getConversations] Final result:", conversationsWithDetails)

  return conversationsWithDetails
}

export async function getConversation(conversationId: string) {
  // Use service role to bypass RLS
  const { createClient: createServiceClient } = await import("@supabase/supabase-js")
  const serviceSupabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
  
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Check if user is a participant - using service role
  const { data: participation } = await serviceSupabase
    .from("conversation_participants")
    .select("*")
    .eq("conversation_id", conversationId)
    .eq("user_id", user.id)
    .single()

  if (!participation) {
    return null
  }

  // Get conversation with details - using service role
  const { data: conversation, error } = await serviceSupabase
    .from("conversations")
    .select(
      `
      *,
      offer:offers(
        *,
        agency:agencies(*)
      )
    `,
    )
    .eq("id", conversationId)
    .single()

  if (error) {
    console.error("Error fetching conversation:", error)
    return null
  }

  // Get all participants - using service role
  const { data: participants } = await serviceSupabase
    .from("conversation_participants")
    .select(
      `
      user_id,
      profile:profiles(*)
    `,
    )
    .eq("conversation_id", conversationId)

  // Get messages - using service role
  const { data: messages } = await serviceSupabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })

  // Update last read - using service role
  await serviceSupabase
    .from("conversation_participants")
    .update({ last_read_at: new Date().toISOString() })
    .eq("conversation_id", conversationId)
    .eq("user_id", user.id)

  const otherParticipant = participants?.find((p) => p.user_id !== user.id)?.profile as Profile | undefined

  return {
    ...conversation,
    participants: participants?.map((p) => ({ user_id: p.user_id, profile: p.profile as Profile })) || [],
    messages: messages || [],
    other_participant: otherParticipant,
  } as ConversationWithDetails
}

export async function sendMessage(conversationId: string, content: string) {
  // Use service role to bypass RLS
  const { createClient: createServiceClient } = await import("@supabase/supabase-js")
  const serviceSupabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
  
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  // Check participation - using service role
  const { data: participation } = await serviceSupabase
    .from("conversation_participants")
    .select("*")
    .eq("conversation_id", conversationId)
    .eq("user_id", user.id)
    .single()

  if (!participation) {
    return { error: "Not authorized to send messages in this conversation" }
  }

  // Check agency status - using service role
  const { data: conversation } = await serviceSupabase
    .from("conversations")
    .select(
      `
      *,
      offer:offers(
        agency:agencies(
          status,
          subscription_status
        )
      )
    `,
    )
    .eq("id", conversationId)
    .single()

  if (
    conversation?.offer?.agency &&
    (conversation.offer.agency.status === "suspended" ||
      !["active", "pending"].includes(conversation.offer.agency.subscription_status))
  ) {
    return { error: "This agency is currently unavailable" }
  }

  // Insert message - using service role
  const { data: message, error } = await serviceSupabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content,
      message_type: "text",
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  // Update conversation timestamp - using service role
  await serviceSupabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversationId)

  revalidatePath("/messages")
  revalidatePath(`/messages/${conversationId}`)
  revalidatePath("/agency/messages")
  
  return { success: true, message }
}

export async function startConversation(offerId: string, initialMessage?: string) {
  console.log("[startConversation] Called with:", { offerId, initialMessage })
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log("[startConversation] User:", user?.id)

  if (!user) {
    console.log("[startConversation] Not authenticated")
    return { error: "Not authenticated" }
  }

  const { data: offer, error: offerError } = await supabase
    .from("offers")
    .select(
      `
      *,
      agency:agencies(
        id,
        owner_id,
        status,
        subscription_status
      )
    `,
    )
    .eq("id", offerId)
    .single()

  console.log("[startConversation] Offer:", offer, "Error:", offerError)

  if (!offer || !offer.agency) {
    return { error: "Offer not found" }
  }

  if (offer.agency.status !== "active") {
    return { error: "This agency is not active" }
  }

  if (offer.agency.subscription_status !== "active") {
    return { error: "This agency does not have an active subscription" }
  }

  const recipientId = offer.agency.owner_id

  // Check if conversation already exists between these users for this offer
  const { data: existingParticipations } = await supabase
    .from("conversation_participants")
    .select("conversation_id")
    .eq("user_id", user.id)

  if (existingParticipations && existingParticipations.length > 0) {
    const conversationIds = existingParticipations.map((p) => p.conversation_id)

    const { data: otherParticipations } = await supabase
      .from("conversation_participants")
      .select("conversation_id")
      .eq("user_id", recipientId)
      .in("conversation_id", conversationIds)

    if (otherParticipations && otherParticipations.length > 0) {
      // Check if there's a conversation for this offer
      const { data: existingConv } = await supabase
        .from("conversations")
        .select("id")
        .eq("offer_id", offerId)
        .in(
          "id",
          otherParticipations.map((p) => p.conversation_id),
        )
        .single()

      if (existingConv) {
        return { conversationId: existingConv.id }
      }
    }
  }

  // Use service role to bypass RLS temporarily
  const { createClient: createServiceClient } = await import("@supabase/supabase-js")
  const adminClient = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  // Create new conversation using admin client
  const { data: newConversation, error: convError } = await adminClient
    .from("conversations")
    .insert({
      offer_id: offerId,
    })
    .select()
    .single()

  console.log("[startConversation] New conversation:", newConversation, "Error:", convError)

  if (convError) {
    console.error("[startConversation] Failed to create conversation:", convError)
    return { error: convError.message }
  }

  // Add participants using admin client
  const { error: partError } = await adminClient.from("conversation_participants").insert([
    { conversation_id: newConversation.id, user_id: user.id },
    { conversation_id: newConversation.id, user_id: recipientId },
  ])

  console.log("[startConversation] Participants error:", partError)

  if (partError) {
    console.error("[startConversation] Failed to add participants:", partError)
    return { error: partError.message }
  }

  // Send initial message if provided using admin client
  if (initialMessage) {
    const { error: msgError } = await adminClient.from("messages").insert({
      conversation_id: newConversation.id,
      sender_id: user.id,
      content: initialMessage,
      message_type: "text",
    })
    
    console.log("[startConversation] Message error:", msgError)
    
    if (msgError) {
      console.error("[startConversation] Failed to send message:", msgError)
    }
  }

  revalidatePath("/messages")
  revalidatePath("/agency/messages")
  console.log("[startConversation] Success! Conversation ID:", newConversation.id)
  return { conversationId: newConversation.id }
}

export async function getUnreadCount() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return 0
    }

    const { data: participations, error: participationsError } = await supabase
      .from("conversation_participants")
      .select("conversation_id, last_read_at")
      .eq("user_id", user.id)

    if (!participations || participations.length === 0) {
      return 0
    }

    let totalUnread = 0

    for (const p of participations) {
      const { count, error: countError } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("conversation_id", p.conversation_id)
        .neq("sender_id", user.id)
        .gt("created_at", p.last_read_at || "1970-01-01")

      if (countError) {
        console.error("[v0] Error counting messages:", countError)
        continue
      }

      totalUnread += count || 0
    }

    return totalUnread
  } catch (error) {
    console.error("[v0] Unread count error:", error)
    return 0
  }
}
