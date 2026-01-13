"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  SafrgoLogoText,
  Home,
  Building2,
  CreditCard,
  BadgeCheck,
  Settings,
  LogOut,
  Shield,
  Package,
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
import type { Profile } from "@/lib/database.types"

interface AdminSidebarProps {
  profile: Profile
  pendingPayments: number
  pendingVerifications: number
}

export function AdminSidebar({ profile, pendingPayments, pendingVerifications }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const navItems = [
    { href: "/admin", label: "لوحة التحكم", icon: Home },
    { href: "/admin/agencies", label: "الوكالات", icon: Building2 },
    {
      href: "/admin/payments",
      label: "إيصالات الدفع",
      icon: CreditCard,
      badge: pendingPayments > 0 ? pendingPayments : undefined,
    },
    {
      href: "/admin/verification",
      label: "التوثيق",
      icon: BadgeCheck,
      badge: pendingVerifications > 0 ? pendingVerifications : undefined,
    },
    { href: "/admin/offers", label: "العروض", icon: Package },
  ]

  const handleSignOut = async () => {
    // Clear admin session
    localStorage.removeItem("safrgo_admin_session")
    await supabase.auth.signOut()
    router.push("/admin-login")
  }

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 border-r border-border bg-sidebar flex flex-col z-40 hidden lg:flex">
      {/* Logo */}
      <div className="p-6">
        <Link href="/admin">
          <SafrgoLogoText />
        </Link>
        <div className="flex items-center gap-2 mt-1">
          <Shield className="w-3 h-3 text-primary" />
          <p className="text-xs text-primary font-medium">لوحة المسؤول</p>
        </div>
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
            <button className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-sidebar-accent transition-colors">
              <Avatar className="w-10 h-10">
                <AvatarImage src={profile.avatar || ""} alt="Admin" />
                <AvatarFallback>{profile.name?.charAt(0) || "A"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-sidebar-foreground">{profile.name || "مسؤول"}</p>
                <p className="text-xs text-sidebar-foreground/60">مسؤول النظام</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/admin/settings">
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
