"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Building2,
  Users,
  CreditCard,
  BadgeCheck,
  TrendingUp,
  ArrowRight,
  AlertCircle,
  Clock,
} from "@/components/icons"
import { formatDistanceToNow } from "date-fns"
import { ar } from "date-fns/locale"
import type { Agency } from "@/lib/database.types"

interface AdminDashboardProps {
  stats: {
    totalAgencies: number
    totalTravelers: number
    pendingPayments: number
    pendingVerifications: number
  }
  pendingSubscriptions: any[]
  pendingVerificationAgencies: any[]
  recentAgencies: Agency[]
}

export function AdminDashboard({
  stats,
  pendingSubscriptions,
  pendingVerificationAgencies,
  recentAgencies,
}: AdminDashboardProps) {
  const statItems = [
    {
      label: "إجمالي الوكالات",
      value: stats.totalAgencies.toLocaleString(),
      change: "+12 هذا الأسبوع",
      icon: Building2,
    },
    {
      label: "المسافرون النشطون",
      value: stats.totalTravelers.toLocaleString(),
      change: "+2.4k هذا الشهر",
      icon: Users,
    },
    {
      label: "مدفوعات معلقة",
      value: stats.pendingPayments.toString(),
      change: `${stats.pendingPayments} بحاجة للمراجعة`,
      icon: CreditCard,
    },
    { label: "توثيقات معلقة", value: stats.pendingVerifications.toString(), change: "طلبات جديدة", icon: BadgeCheck },
  ]

  const pendingItems = [
    ...pendingSubscriptions.map((req) => ({
      type: "payment" as const,
      agency: req.agency?.name || "Unknown",
      plan: req.plan,
      amount: `Plan: ${req.plan}`,
      date: req.submitted_at,
      id: req.id,
    })),
    ...pendingVerificationAgencies.map((req) => ({
      type: "verification" as const,
      agency: req.agency?.name || "Unknown",
      status: "بانتظار المراجعة",
      date: req.submitted_at,
      id: req.id,
    })),
  ].slice(0, 6)

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">لوحة تحكم المسؤول</h1>
        <p className="text-muted-foreground">نظرة عامة على نشاط المنصة والإجراءات المعلقة</p>
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
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-xs text-primary mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Pending Actions */}
        <Card className="border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              الإجراءات المعلقة
            </CardTitle>
            <span className="text-sm text-muted-foreground">{pendingItems.length} عنصر</span>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingItems.length > 0 ? (
                pendingItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        item.type === "payment" ? "bg-green-100" : "bg-blue-100"
                      }`}
                    >
                      {item.type === "payment" ? (
                        <CreditCard className="w-5 h-5 text-green-600" />
                      ) : (
                        <BadgeCheck className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground">{item.agency}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.type === "payment" ? item.amount : item.status}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(item.date), { addSuffix: true, locale: ar })}
                      </p>
                      <Link href={item.type === "payment" ? "/admin/payments" : "/admin/verification"}>
                        <Button variant="ghost" size="sm" className="mt-1">
                          مراجعة
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">لا توجد إجراءات معلقة</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card className="border-0">
            <CardHeader>
              <CardTitle className="text-lg">إجراءات سريعة</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Link href="/admin/agencies">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 bg-transparent">
                  <Building2 className="w-6 h-6" />
                  <span>إدارة الوكالات</span>
                </Button>
              </Link>
              <Link href="/admin/payments">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 bg-transparent">
                  <CreditCard className="w-6 h-6" />
                  <span>مراجعة المدفوعات</span>
                </Button>
              </Link>
              <Link href="/admin/verification">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 bg-transparent">
                  <BadgeCheck className="w-6 h-6" />
                  <span>توثيق الوكالات</span>
                </Button>
              </Link>
              <Link href="/admin/offers">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 bg-transparent">
                  <Users className="w-6 h-6" />
                  <span>مراجعة العروض</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">آخر النشاطات</CardTitle>
              <Link href="/admin/agencies">
                <Button variant="ghost" size="sm" className="gap-1">
                  عرض الكل <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAgencies.map((agency) => (
                  <div key={agency.id} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-foreground">وكالة جديدة: {agency.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {agency.created_at ? formatDistanceToNow(new Date(agency.created_at), { addSuffix: true, locale: ar }) : 'غير متاح'}
                      </p>
                    </div>
                  </div>
                ))}
                {recentAgencies.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">لا توجد نشاطات حديثة</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
