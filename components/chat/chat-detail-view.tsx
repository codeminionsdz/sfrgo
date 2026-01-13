"use client"

import { useState, useRef, useEffect, useTransition } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Send, ChevronLeft, Loader2 } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { sendMessage, type ConversationWithDetails } from "@/lib/actions/chat"
import { toast } from "sonner"

interface ChatDetailViewProps {
  conversation: ConversationWithDetails
  currentUserId: string
}

export function ChatDetailView({ conversation, currentUserId }: ChatDetailViewProps) {
  const router = useRouter()
  const [newMessage, setNewMessage] = useState("")
  const [isPending, startTransition] = useTransition()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation.messages])

  const handleSend = () => {
    if (!newMessage.trim()) return

    const content = newMessage
    setNewMessage("")

    startTransition(async () => {
      const result = await sendMessage(conversation.id, content)
      if (result.error) {
        toast.error(result.error)
        setNewMessage(content) // Restore message on error
      } else {
        router.refresh()
      }
    })
  }

  const otherParticipant = conversation.other_participant

  // Check if agency is suspended or subscription is inactive
  const isAgencyUnavailable =
    conversation.agency &&
    (conversation.agency.status === "suspended" ||
      !["active", "pending"].includes(conversation.agency.subscription_status))

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/messages")} className="lg:hidden">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Image
            src={otherParticipant?.avatar || "/placeholder.svg?height=48&width=48&query=user avatar"}
            alt={otherParticipant?.name || "User"}
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg">{otherParticipant?.name}</h3>
            {conversation.offer && (
              <Link
                href={`/offers/${conversation.offer.id}`}
                className="text-sm text-primary hover:underline truncate block"
              >
                About: {conversation.offer.title}
              </Link>
            )}
          </div>
          {conversation.agency && (
            <Link href={`/agencies/${conversation.agency.slug}`}>
              <Button variant="outline" size="sm">
                View Agency
              </Button>
            </Link>
          )}
        </div>

        {isAgencyUnavailable && (
          <div className="px-4 pb-4">
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
              This agency is currently unavailable. You cannot send messages at this time.
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
        {conversation.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <p>No messages yet</p>
              <p className="text-sm mt-1">Start the conversation!</p>
            </div>
          </div>
        ) : (
          <>
            {conversation.messages.map((message) => {
              const isOwn = message.sender_id === currentUserId
              return (
                <div key={message.id} className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm",
                      isOwn
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-card text-card-foreground rounded-bl-md",
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                    <p
                      className={cn("text-[10px] mt-1", isOwn ? "text-primary-foreground/70" : "text-muted-foreground")}
                    >
                      {new Date(message.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card p-4">
        <div className="flex items-end gap-2 max-w-4xl mx-auto">
          <Textarea
            placeholder={isAgencyUnavailable ? "This agency is unavailable" : "Type a message..."}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            disabled={isPending || isAgencyUnavailable}
            className="flex-1 min-h-[60px] max-h-[200px] resize-none"
            rows={2}
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim() || isPending || isAgencyUnavailable}
            size="lg"
            className="h-[60px] px-6"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
