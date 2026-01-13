"use client"

import { useState, useEffect } from "react"
import type { ConversationWithDetails } from "@/lib/actions/chat"
import { ConversationList } from "./conversation-list"
import { ChatWindow } from "./chat-window"
import { getConversation } from "@/lib/actions/chat"

interface AgencyMessagesViewProps {
  conversations: ConversationWithDetails[]
}

export function AgencyMessagesView({ conversations }: AgencyMessagesViewProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    conversations[0]?.id || null
  )
  const [selectedConversation, setSelectedConversation] = useState<ConversationWithDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (selectedConversationId) {
      setIsLoading(true)
      getConversation(selectedConversationId).then((conv) => {
        setSelectedConversation(conv)
        setIsLoading(false)
      })
    }
  }, [selectedConversationId])

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden rounded-lg border border-border">
      <ConversationList
        conversations={conversations}
        selectedId={selectedConversationId}
        onSelect={setSelectedConversationId}
      />
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : selectedConversation ? (
        <ChatWindow 
          conversationId={selectedConversation.id}
          offer={selectedConversation.offer}
          otherParticipant={selectedConversation.other_participant}
          initialMessages={selectedConversation.messages || []}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-muted/30">
          <p className="text-muted-foreground">Select a conversation to start messaging</p>
        </div>
      )}
    </div>
  )
}
