// Chat service - manages conversations and messages

import { store } from "@/lib/store"
import type { Conversation, Message } from "@/lib/types"
import { authService } from "./auth"
import { agencyService } from "./agencies"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export interface ConversationWithDetails extends Conversation {
  participantName: string
  participantAvatar: string
  participantId: string
  offer?: {
    id: string
    title: string
    image: string
  }
  unreadCount: number
  lastMessage?: Message
}

export const chatService = {
  // Get conversations for current user
  getConversations(): ConversationWithDetails[] {
    const user = authService.getCurrentUser()
    if (!user) return []

    let userIdentifier: string
    if (user.role === "agency") {
      const agency = agencyService.getCurrentAgency()
      if (!agency) return []
      userIdentifier = agency.id
    } else {
      userIdentifier = user.id
    }

    return store.conversations
      .filter((c) => c.participants.includes(userIdentifier))
      .map((conv) => {
        const otherParticipantId = conv.participants.find((p) => p !== userIdentifier)!

        // Determine if other participant is agency or user
        let participantName = ""
        let participantAvatar = ""
        const participantId = otherParticipantId

        if (otherParticipantId.startsWith("agency-")) {
          const agency = store.agencies.find((a) => a.id === otherParticipantId)
          if (agency) {
            participantName = agency.name
            participantAvatar = agency.logo
          }
        } else {
          const otherUser = store.users.find((u) => u.id === otherParticipantId)
          if (otherUser) {
            participantName = otherUser.name
            participantAvatar = otherUser.avatar
          }
        }

        // Get offer info
        let offer: ConversationWithDetails["offer"]
        if (conv.offerId) {
          const offerData = store.offers.find((o) => o.id === conv.offerId)
          if (offerData) {
            offer = {
              id: offerData.id,
              title: offerData.title,
              image: offerData.image,
            }
          }
        }

        // Get messages
        const messages = store.messages.filter((m) => m.conversationId === conv.id)
        const unreadCount = messages.filter((m) => !m.read && m.senderId !== userIdentifier).length
        const lastMessage = messages.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        )[0]

        return {
          ...conv,
          participantName,
          participantAvatar,
          participantId,
          offer,
          unreadCount,
          lastMessage,
        }
      })
      .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
  },

  // Get messages for a conversation
  getMessages(conversationId: string): Message[] {
    return store.messages
      .filter((m) => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  },

  // Send a message
  async sendMessage(
    conversationId: string,
    content: string,
  ): Promise<{ success: boolean; message?: Message; error?: string }> {
    await delay(200)

    const user = authService.getCurrentUser()
    if (!user) {
      return { success: false, error: "Not logged in" }
    }

    let senderId: string
    if (user.role === "agency") {
      const agency = agencyService.getCurrentAgency()
      if (!agency) return { success: false, error: "Agency not found" }
      senderId = agency.id
    } else {
      senderId = user.id
    }

    const conversation = store.conversations.find((c) => c.id === conversationId)
    if (!conversation) {
      return { success: false, error: "Conversation not found" }
    }

    const message: Message = {
      id: store.generateId("msg"),
      conversationId,
      senderId,
      content,
      timestamp: new Date().toISOString(),
      read: false,
      type: "text",
    }

    store.messages.push(message)

    // Update conversation
    conversation.lastMessageAt = message.timestamp

    return { success: true, message }
  },

  // Start a new conversation (traveler -> agency about an offer)
  async startConversation(
    agencyId: string,
    offerId: string,
    initialMessage: string,
  ): Promise<{ success: boolean; conversationId?: string; error?: string }> {
    await delay(300)

    const user = authService.getCurrentUser()
    if (!user || user.role !== "traveler") {
      return { success: false, error: "Only travelers can start conversations" }
    }

    // Check if agency is active
    const agency = store.agencies.find((a) => a.id === agencyId)
    if (!agency || agency.status !== "active") {
      return { success: false, error: "This agency is not available for chat" }
    }

    // Check if conversation already exists
    let conversation = store.conversations.find(
      (c) => c.participants.includes(user.id) && c.participants.includes(agencyId) && c.offerId === offerId,
    )

    if (!conversation) {
      // Create new conversation
      conversation = {
        id: store.generateId("conv"),
        participants: [user.id, agencyId],
        participantType: "traveler-agency",
        offerId,
        lastMessageAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      }
      store.conversations.push(conversation)
    }

    // Send initial message
    const message: Message = {
      id: store.generateId("msg"),
      conversationId: conversation.id,
      senderId: user.id,
      content: initialMessage,
      timestamp: new Date().toISOString(),
      read: false,
      type: "text",
    }

    store.messages.push(message)
    conversation.lastMessageAt = message.timestamp

    return { success: true, conversationId: conversation.id }
  },

  // Mark messages as read
  async markAsRead(conversationId: string): Promise<void> {
    const user = authService.getCurrentUser()
    if (!user) return

    let userIdentifier: string
    if (user.role === "agency") {
      const agency = agencyService.getCurrentAgency()
      if (!agency) return
      userIdentifier = agency.id
    } else {
      userIdentifier = user.id
    }

    store.messages
      .filter((m) => m.conversationId === conversationId && m.senderId !== userIdentifier)
      .forEach((m) => {
        m.read = true
      })
  },

  // Get total unread count
  getUnreadCount(): number {
    const conversations = this.getConversations()
    return conversations.reduce((sum, c) => sum + c.unreadCount, 0)
  },
}
