"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { ConversationWithDetails } from "@/lib/actions/chat"

interface ConversationListProps {
  conversations: ConversationWithDetails[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  const [search, setSearch] = useState("")

  const filtered = conversations.filter((c) => 
    c.other_participant?.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="w-80 border-r border-border flex flex-col bg-card">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold mb-3">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.map((conversation) => {
          const lastMessage = conversation.messages?.[0]
          const lastMessageTime = conversation.updated_at || conversation.created_at
          
          return (
            <button
              key={conversation.id}
              onClick={() => onSelect(conversation.id)}
              className={cn(
                "w-full p-4 flex items-start gap-3 hover:bg-accent/50 transition-colors text-left border-b border-border/50",
                selectedId === conversation.id && "bg-accent",
              )}
            >
              <div className="relative">
                <Image
                  src={conversation.other_participant?.avatar || "/placeholder.svg"}
                  alt={conversation.other_participant?.name || "User"}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
                {(conversation.unread_count ?? 0) > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                    {conversation.unread_count}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium truncate">{conversation.other_participant?.name || "Unknown"}</span>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {formatTime(lastMessageTime)}
                  </span>
                </div>
                {conversation.offer && <p className="text-xs text-primary truncate">{conversation.offer.title}</p>}
                {lastMessage && (
                  <p className="text-sm text-muted-foreground truncate mt-0.5">{lastMessage.content}</p>
                )}
              </div>
            </button>
          )
        })}

        {filtered.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            {conversations.length === 0 ? "No conversations yet" : "No conversations found"}
          </div>
        )}
      </div>
    </div>
  )
}

function formatTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  } else if (days === 1) {
    return "Yesterday"
  } else if (days < 7) {
    return date.toLocaleDateString([], { weekday: "short" })
  } else {
    return date.toLocaleDateString([], { month: "short", day: "numeric" })
  }
}
