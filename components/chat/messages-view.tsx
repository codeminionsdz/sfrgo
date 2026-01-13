"use client"

import { useState, useEffect } from "react"
import { chatService, type ConversationWithDetails } from "@/services/chat"
import { ConversationList } from "./conversation-list"
import { ChatWindow } from "./chat-window"

export function MessagesView() {
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = () => {
    const convs = chatService.getConversations()
    setConversations(convs)
    if (convs.length > 0 && !selectedConversationId) {
      setSelectedConversationId(convs[0].id)
    }
  }

  const handleSelectConversation = async (id: string) => {
    setSelectedConversationId(id)
    await chatService.markAsRead(id)
    loadConversations() // Refresh to update unread counts
  }

  const handleSendMessage = async (content: string) => {
    if (!selectedConversationId) return
    await chatService.sendMessage(selectedConversationId, content)
    loadConversations()
  }

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId)

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      <ConversationList
        conversations={conversations}
        selectedId={selectedConversationId}
        onSelect={handleSelectConversation}
      />
      <ChatWindow conversation={selectedConversation} onSendMessage={handleSendMessage} />
    </div>
  )
}
