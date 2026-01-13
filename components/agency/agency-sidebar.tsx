"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  SafrgoLogoText,
  Home,
  Package,
  MessageCircle,
  User,
  Settings,
  LogOut,
  CreditCard,
  BarChart3,
  QrCode,
} from "@/components/icons"
import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import type { Agency, Profile } from "@/lib/database.types"

interface AgencySidebarProps {
  agency: Agency
  profile: Profile
  unreadCount: number
}

export function AgencySidebar({ agency, profile, unreadCount }: AgencySidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const navItems = [
    { href: "/agency", label: "لوحة التحكم", icon: Home },
    { href: "/agency/offers", label: "عروضي", icon: Package },
    {
      href: "/agency/messages",
      label: "الرسائل",
      icon: MessageCircle,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { href: "/agency/analytics", label: "التحليلات", icon: BarChart3 },
    { href: "/agency/profile", label: "ملف الوكالة", icon: User },
    { href: "/agency/qr-code", label: "رمز QR", icon: QrCode },
    { href: "/agency/subscription", label: "الاشتراك", icon: CreditCard },
  ]

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const getSubscriptionDisplayName = (plan: string | null) => {
    switch (plan) {
      case "starter":
        return "باقة المبتدئ"
      case "premium":
        return "باقة بريميوم"
      case "enterprise":
        return "باقة الشركات"
      case "free":
        return "مجاني"
      default:
        return "مجاني"
    }
  }

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 border-r border-border bg-sidebar flex flex-col z-40 hidden lg:flex">
      {/* Logo */}
      <div className="p-6">
        <Link href="/agency">
          <SafrgoLogoText />
        </Link>
        <p className="text-xs text-muted-foreground mt-1">لوحة تحكم الوكالة</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                  {item.badge && (
                    <span className="ml-auto flex items-center justify-center w-5 h-5 text-xs font-semibold rounded-full bg-accent text-accent-foreground">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Menu */}
      <div className="p-4 border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button 
              className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-sidebar-accent transition-colors"
              suppressHydrationWarning
            >
              <Avatar className="w-10 h-10">
                <AvatarImage src={agency.logo || ""} alt={agency.name} />
                <AvatarFallback>{agency.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-sidebar-foreground">{agency.name}</p>
                <p className="text-xs text-sidebar-foreground/60">
                  {getSubscriptionDisplayName(agency.subscription_plan)}
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/agency/settings">
                <Settings className="w-4 h-4 mr-2" />
                الإعدادات
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              تسجيل الخروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
