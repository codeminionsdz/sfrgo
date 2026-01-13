"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Search, MessageCircle } from "@/components/icons"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { ConversationWithDetails } from "@/lib/actions/chat"

interface MessagesListViewProps {
  conversations: ConversationWithDetails[]
}

export function MessagesListView({ conversations }: MessagesListViewProps) {
  const router = useRouter()
  const [search, setSearch] = useState("")

  const filtered = conversations.filter((c) => c.other_participant?.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 border-b border-border bg-card">
        <h1 className="text-2xl font-bold mb-4">Messages</h1>
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

      {/* Conversations List */}
      <div className="divide-y divide-border">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <MessageCircle className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">
              {conversations.length === 0 ? "No messages yet" : "No conversations found"}
            </h3>
            <p className="text-muted-foreground text-sm text-center max-w-sm">
              {conversations.length === 0
                ? "Start a conversation by contacting an agency about their offers"
                : "Try a different search term"}
            </p>
            {conversations.length === 0 && (
              <Link href="/explore" className="mt-4">
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  Explore Offers
                </button>
              </Link>
            )}
          </div>
        ) : (
          filtered.map((conversation) => {
            const lastMessage = conversation.messages[0]
            return (
              <button
                key={conversation.id}
                onClick={() => router.push(`/messages/${conversation.id}`)}
                className="w-full p-4 flex items-start gap-4 hover:bg-accent/50 transition-colors text-left"
              >
                <div className="relative flex-shrink-0">
                  <Image
                    src={
                      conversation.other_participant?.avatar ||
                      "/placeholder.svg?height=56&width=56&query=user avatar" ||
                      "/placeholder.svg"
                    }
                    alt={conversation.other_participant?.name || "User"}
                    width={56}
                    height={56}
                    className="rounded-full object-cover"
                  />
                  {conversation.unread_count && conversation.unread_count > 0 && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-semibold">
                      {conversation.unread_count > 9 ? "9+" : conversation.unread_count}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-foreground truncate">
                      {conversation.other_participant?.name}
                    </span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {formatTime(lastMessage?.created_at || conversation.updated_at)}
                    </span>
                  </div>
                  {conversation.offer && (
                    <p className="text-xs text-primary truncate mb-1">{conversation.offer.title}</p>
                  )}
                  {lastMessage && (
                    <p
                      className={cn(
                        "text-sm truncate",
                        conversation.unread_count && conversation.unread_count > 0
                          ? "font-medium text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {lastMessage.content}
                    </p>
                  )}
                </div>
              </button>
            )
          })
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
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60))
      if (minutes === 0) return "Just now"
      return `${minutes}m ago`
    }
    return `${hours}h ago`
  } else if (days === 1) {
    return "Yesterday"
  } else if (days < 7) {
    return `${days}d ago`
  } else {
    return date.toLocaleDateString([], { month: "short", day: "numeric" })
  }
}
