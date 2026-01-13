import { getConversations } from "@/lib/actions/chat"
import { getAgency } from "@/lib/actions/auth"
import { AgencyMessagesView } from "@/components/chat/agency-messages-view"
import { redirect } from "next/navigation"

export default async function AgencyMessagesPage() {
  const agency = await getAgency()

  if (!agency) {
    redirect("/agency-setup")
  }

  const conversations = await getConversations()

  return <AgencyMessagesView conversations={conversations} />
}
