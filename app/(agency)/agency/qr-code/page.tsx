import { getCurrentUserAgency } from "@/lib/actions/agencies"
import { getProfile } from "@/lib/actions/auth"
import { redirect } from "next/navigation"
import { PrintableQRCode } from "@/components/agency/printable-qr-code"

export default async function AgencyQRCodePage() {
  const profile = await getProfile()

  if (!profile || profile.role !== "agency") {
    redirect("/login")
  }

  const agency = await getCurrentUserAgency()

  if (!agency) {
    redirect("/agency")
  }

  return <PrintableQRCode agency={agency} />
}
