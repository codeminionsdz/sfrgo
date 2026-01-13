import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Building2 } from "@/components/icons"

export function LandingCTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0">
            <img src="/placeholder.svg?height=600&width=1400" alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-primary/90" />
          </div>

          {/* Content */}
          <div className="relative px-8 py-16 sm:px-16 sm:py-24 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 max-w-3xl mx-auto text-balance">
              Ready to start your next adventure?
            </h2>
            <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto mb-10">
              Join thousands of travelers who have found their perfect trips through SAFRGO. Your journey starts here.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" variant="secondary" className="gap-2 text-base px-8">
                  Start exploring
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/agency/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 text-base px-8 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground bg-transparent"
                >
                  <Building2 className="w-5 h-5" />
                  List your agency
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
