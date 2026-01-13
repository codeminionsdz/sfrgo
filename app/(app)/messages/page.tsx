import { getConversations } from "@/lib/actions/chat"
import { getProfile } from "@/lib/actions/auth"
import { MessagesListView } from "@/components/chat/messages-list-view"
import { redirect } from "next/navigation"

export default async function MessagesPage() {
  const profile = await getProfile()

  if (!profile) {
    redirect("/login")
  }

  const conversations = await getConversations()

  return <MessagesListView conversations={conversations} />
}
