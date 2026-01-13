import { getConversation } from "@/lib/actions/chat"
import { getProfile } from "@/lib/actions/auth"
import { ChatDetailView } from "@/components/chat/chat-detail-view"
import { redirect, notFound } from "next/navigation"

export default async function ChatDetailPage({ params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = await params
  const [conversation, profile] = await Promise.all([getConversation(chatId), getProfile()])

  if (!profile) {
    redirect("/login")
  }

  if (!conversation) {
    notFound()
  }

  return <ChatDetailView conversation={conversation} currentUserId={profile.id} />
}
