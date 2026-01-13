import Link from "next/link"
import { SafrgoLogoText, Home, Compass, Heart, MessageCircle, User, Settings, LogOut, Bell } from "@/components/icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getProfile, signOut } from "@/lib/actions/auth"
import { getUnreadCount } from "@/lib/actions/chat"

const navItems = [
  { href: "/traveler", label: "Home", icon: Home },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/traveler/saved", label: "Saved", icon: Heart },
  { href: "/messages", label: "Messages", icon: MessageCircle },
]

interface AppSidebarProps {
  pathname: string
}

export async function AppSidebar({ pathname }: AppSidebarProps) {
  const profile = await getProfile()
  const unreadCount = await getUnreadCount()

  const getInitials = (name: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 border-r border-border bg-sidebar flex flex-col z-40 hidden lg:flex">
      {/* Logo */}
      <div className="p-6">
        <Link href="/traveler">
          <SafrgoLogoText />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/traveler" && pathname.startsWith(item.href))
            const badge = item.href === "/messages" && unreadCount > 0 ? unreadCount : null
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
                  {badge && (
                    <span className="ml-auto flex items-center justify-center w-5 h-5 text-xs font-semibold rounded-full bg-accent text-accent-foreground">
                      {badge > 9 ? "9+" : badge}
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
                <AvatarImage src={profile?.avatar || undefined} alt={profile?.name || "User"} />
                <AvatarFallback>{getInitials(profile?.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-sidebar-foreground">{profile?.name || "User"}</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">{profile?.email}</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/traveler/profile">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/traveler/settings">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <form action={signOut}>
                <button type="submit" className="flex items-center w-full text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}

interface AppMobileNavProps {
  pathname: string
  unreadCount?: number
}

export function AppMobileNav({ pathname, unreadCount = 0 }: AppMobileNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border lg:hidden z-40">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/traveler" && pathname.startsWith(item.href))
          const badge = item.href === "/messages" && unreadCount > 0 ? unreadCount : null
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors relative",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
              {badge && (
                <span className="absolute top-1 right-2 flex items-center justify-center w-4 h-4 text-[10px] font-semibold rounded-full bg-accent text-accent-foreground">
                  {badge > 9 ? "9+" : badge}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

interface AppHeaderProps {
  profile?: { name: string | null; avatar: string | null } | null
  unreadCount?: number
}

export function AppHeader({ profile, unreadCount = 0 }: AppHeaderProps) {
  const getInitials = (name: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border lg:hidden">
      <div className="flex items-center justify-between px-4 h-16">
        <SafrgoLogoText />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/messages">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />}
            </Link>
          </Button>
          <Avatar className="w-8 h-8">
            <AvatarImage src={profile?.avatar || undefined} alt={profile?.name || "User"} />
            <AvatarFallback>{getInitials(profile?.name || null)}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
