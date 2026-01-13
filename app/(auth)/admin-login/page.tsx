import type { Metadata } from "next"
import { AdminLoginForm } from "@/components/auth/admin-login-form"

export const metadata: Metadata = {
  title: "تسجيل دخول المسؤول - SAFRGO",
  description: "تسجيل دخول لوحة تحكم المسؤول",
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">لوحة تحكم المسؤول</h1>
          <p className="text-muted-foreground">أدخل كلمة المرور للوصول</p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  )
}
