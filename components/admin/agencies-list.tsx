"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreVertical, Eye, BadgeCheck, Ban, Star, MapPin, Users, Loader2 } from "@/components/icons"
import { updateAgencyStatus, verifyAgency } from "@/lib/actions/admin"
import type { Agency } from "@/lib/database.types"

interface AdminAgenciesProps {
  agencies: (Agency & {
    offersCount: number
    followersCount: number
    owner: { name: string; email: string } | null
  })[]
}

export function AdminAgencies({ agencies }: AdminAgenciesProps) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const filteredAgencies = agencies.filter((agency) => {
    const matchesSearch =
      agency.name.toLowerCase().includes(search.toLowerCase()) ||
      agency.location?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && agency.status === "active") ||
      (statusFilter === "pending" && agency.status === "pending") ||
      (statusFilter === "suspended" && agency.status === "suspended") ||
      (statusFilter === "verified" && agency.verified) ||
      (statusFilter === "unverified" && !agency.verified)
    return matchesSearch && matchesStatus
  })

  const handleVerify = async (agencyId: string, verified: boolean) => {
    setLoadingId(agencyId)
    const result = await verifyAgency(agencyId, verified)
    setLoadingId(null)
    if (result.success) {
      router.refresh()
    } else {
      alert(result.error || "فشل في توثيق الوكالة")
    }
  }

  const handleSuspend = async (agencyId: string) => {
    if (!confirm("هل أنت متأكد من إيقاف هذه الوكالة؟")) return
    setLoadingId(agencyId)
    const result = await updateAgencyStatus(agencyId, "suspended")
    setLoadingId(null)
    if (result.success) {
      router.refresh()
    } else {
      alert(result.error || "فشل في إيقاف الوكالة")
    }
  }

  const getPlanName = (plan: string | null) => {
    if (!plan) return "بدون اشتراك"
    const planNames: Record<string, string> = {
      starter: "المبتدئ",
      premium: "المميز",
      enterprise: "المؤسسات",
    }
    return planNames[plan] || plan
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">الوكالات</h1>
        <p className="text-muted-foreground">إدارة ومراقبة جميع وكالات المنصة</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="البحث عن وكالات..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="تصفية حسب الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الوكالات</SelectItem>
            <SelectItem value="active">نشط</SelectItem>
            <SelectItem value="pending">معلق</SelectItem>
            <SelectItem value="suspended">موقوف</SelectItem>
            <SelectItem value="verified">موثق</SelectItem>
            <SelectItem value="unverified">غير موثق</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Agencies Table */}
      <Card className="border-0 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">الوكالة</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">الموقع</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">الحالة</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">الخطة</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">الإحصائيات</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredAgencies.map((agency) => (
                  <tr key={agency.id} className="border-t border-border hover:bg-secondary/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={agency.logo || "/placeholder.svg?height=40&width=40&query=agency logo"}
                          alt={agency.name}
                          width={40}
                          height={40}
                          className="rounded-lg object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{agency.name}</span>
                            {agency.verified && <BadgeCheck className="w-4 h-4 text-primary" />}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            انضم {new Date(agency.created_at).toLocaleDateString("ar-SA")}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {agency.location || "غير محدد"}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          agency.status === "active"
                            ? "default"
                            : agency.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {agency.status === "active" ? "نشط" : agency.status === "pending" ? "معلق" : "موقوف"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="text-sm">{getPlanName(agency.subscription_plan)}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          {agency.rating || "N/A"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {agency.followersCount}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-left">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" disabled={loadingId === agency.id}>
                            {loadingId === agency.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <MoreVertical className="w-4 h-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <a href={`/agencies/${agency.slug}`} target="_blank" rel="noopener noreferrer">
                              <Eye className="w-4 h-4 mr-2" />
                              عرض الملف
                            </a>
                          </DropdownMenuItem>
                          {!agency.verified && (
                            <DropdownMenuItem onClick={() => handleVerify(agency.id, true)}>
                              <BadgeCheck className="w-4 h-4 mr-2" />
                              توثيق الوكالة
                            </DropdownMenuItem>
                          )}
                          {agency.status !== "suspended" && (
                            <DropdownMenuItem className="text-destructive" onClick={() => handleSuspend(agency.id)}>
                              <Ban className="w-4 h-4 mr-2" />
                              إيقاف
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredAgencies.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">لا توجد وكالات تطابق البحث</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
