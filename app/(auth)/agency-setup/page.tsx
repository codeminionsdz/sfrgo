import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AgencySetupForm } from "@/components/agency/agency-setup-form"

export default async function AgencySetupPage() {
  const supabase = await createClient()

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      redirect("/login")
    }

    // Check if agency already exists
    const { data: existingAgency } = await supabase.from("agencies").select("id").eq("owner_id", user.id).maybeSingle()

    if (existingAgency) {
      redirect("/agency")
    }

    // Check user has agency role
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()

    if (!profile || profile.role !== "agency") {
      redirect("/traveler")
    }

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">إعداد وكالتك</h1>
            <p className="text-muted-foreground">أكمل المعلومات التالية لإنشاء ملف وكالتك</p>
          </div>
          <AgencySetupForm userId={user.id} userEmail={profile.email || ""} userName={profile.name || ""} />
        </div>
      </div>
    )
  } catch (error) {
    console.error("[v0] Agency setup page error:", error)
    redirect("/login")
  }
}
