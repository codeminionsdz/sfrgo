"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Eye,
  Heart,
  MessageCircle,
  TrendingUp,
  Users,
  Package,
  ArrowRight,
  Plus,
  Star,
  DollarSign,
} from "@/components/icons"
import { formatDistanceToNow } from "date-fns"
import { ar } from "date-fns/locale"
import type { Agency, Offer, Message } from "@/lib/database.types"

interface AgencyDashboardProps {
  agency: Agency
  offers: Pick<Offer, "id" | "title" | "view_count" | "rating" | "active" | "created_at">[]
  stats: {
    totalViews: number
    totalSaves: number
    unreadMessages: number
    followersCount: number
    offersCount: number
    maxOffers: number
  }
  recentMessages: (Message & { sender: { full_name: string; avatar_url: string | null } | null })[]
}

export function AgencyDashboard({ agency, offers, stats, recentMessages }: AgencyDashboardProps) {
  const safeStats = {
    totalViews: stats?.totalViews || 0,
    totalSaves: stats?.totalSaves || 0,
    unreadMessages: stats?.unreadMessages || 0,
    followersCount: stats?.followersCount || 0,
    offersCount: stats?.offersCount || 0,
    maxOffers: stats?.maxOffers || 0,
  }

  const statItems = [
    { label: "مشاهدات الملف", value: safeStats.totalViews.toLocaleString(), icon: Eye },
    { label: "إجمالي الحفظ", value: safeStats.totalSaves.toLocaleString(), icon: Heart },
    {
      label: "الرسائل",
      value: safeStats.unreadMessages.toString(),
      icon: MessageCircle,
    },
    {
      label: "المتابعون",
      value: safeStats.followersCount.toLocaleString(),
      icon: Users,
    },
  ]

  const subscriptionPlanName =
    agency.subscription_plan === "starter"
      ? "المبتدئ"
      : agency.subscription_plan === "premium"
        ? "المميز"
        : agency.subscription_plan === "enterprise"
          ? "المؤسسي"
          : "بدون اشتراك"

  const subscriptionStatusText =
    agency.subscription_status === "active"
      ? "نشط"
      : agency.subscription_status === "pending"
        ? "في انتظار الموافقة"
        : agency.subscription_status === "rejected"
          ? "مرفوض"
          : "غير نشط"

  const canCreateOffers =
    agency.status === "active" && agency.subscription_status === "active" && safeStats.offersCount < safeStats.maxOffers

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">مرحباً بعودتك</h1>
          <p className="text-muted-foreground">إليك ما يحدث في وكالتك</p>
        </div>
        {canCreateOffers ? (
          <Link href="/agency/offers/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              إنشاء عرض
            </Button>
          </Link>
        ) : (
          <Button disabled className="gap-2">
            <Plus className="w-4 h-4" />
            إنشاء عرض
          </Button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statItems.map((stat, index) => (
          <Card key={index} className="border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Top Performing Offers */}
          <Card className="border-0">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">أفضل العروض أداءً</CardTitle>
              <Link href="/agency/offers">
                <Button variant="ghost" size="sm" className="gap-1">
                  عرض الكل <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {offers.length > 0 ? (
                  offers.map((offer, index) => (
                    <div key={offer.id} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate">{offer.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            {(offer.view_count || 0).toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {offer.rating || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>لا توجد عروض بعد</p>
                    {canCreateOffers && (
                      <Link href="/agency/offers/new">
                        <Button variant="link" className="mt-2">
                          أنشئ عرضك الأول
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Package, label: "إدارة العروض", href: "/agency/offers" },
              { icon: MessageCircle, label: "الرسائل", href: "/agency/messages" },
              { icon: Users, label: "عرض الملف", href: "/agency/profile" },
              { icon: DollarSign, label: "الاشتراك", href: "/agency/subscription" },
            ].map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="border-0 hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <div className="w-10 h-10 rounded-xl bg-secondary mx-auto mb-2 flex items-center justify-center">
                      <action.icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">{action.label}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Subscription Status */}
          <Card className="border-0 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Star className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{subscriptionPlanName}</h3>
                  <p className="text-sm text-muted-foreground">{subscriptionStatusText}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">العروض المستخدمة</span>
                  <span className="font-medium">
                    {safeStats.offersCount} / {safeStats.maxOffers}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${safeStats.maxOffers > 0 ? Math.min((safeStats.offersCount / safeStats.maxOffers) * 100, 100) : 0}%`,
                    }}
                  />
                </div>
              </div>
              <Link href="/agency/subscription">
                <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
                  إدارة الخطة
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0">
            <CardHeader>
              <CardTitle className="text-lg">آخر الرسائل</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMessages.length > 0 ? (
                  recentMessages.map((message) => (
                    <div key={message.id} className="flex gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={message.sender?.avatar_url || ""} />
                        <AvatarFallback>{message.sender?.full_name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">
                          {message.sender?.full_name}: {message.content}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(message.created_at), { addSuffix: true, locale: ar })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">لا توجد رسائل جديدة</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
