import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail, ArrowLeft } from "@/components/icons"
import { SafrgoLogoText } from "@/components/icons"

export default function SignupSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <Link href="/" className="inline-block mb-8">
          <SafrgoLogoText />
        </Link>

        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Check your email</h1>
          <p className="text-muted-foreground">
            We&apos;ve sent you a confirmation link. Please check your email to verify your account and complete the
            registration.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive the email? Check your spam folder or try signing up again.
          </p>

          <Button asChild variant="outline" className="w-full bg-transparent">
            <Link href="/login">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
