"use client"
export const dynamic = 'force-dynamic'

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fleetStorage } from "@/lib/fleet-storage"
import { useMemo } from "react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [adminName, setAdminName] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [seededAdminEmails, setSeededAdminEmails] = useState<string[]>([])

  useEffect(() => {
    fleetStorage.initializeDemoData()
    const admin = localStorage.getItem("fleet_admin")
    // read current seeded admins for diagnostic display
    try {
      const admins = fleetStorage.getAdmins()
      setSeededAdminEmails(admins.map((a: any) => a.email))
    } catch (e) {
      setSeededAdminEmails([])
    }
    if (admin) {
      router.push("/dashboard")
    }
  }, [router])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (isSignUp) {
        const existingAdmin = fleetStorage.getAdminByEmail(email)
        if (existingAdmin) {
          setError("Email already exists")
          setLoading(false)
          return
        }

        // Create new company
        const newCompany = {
          id: `company-${Date.now()}`,
          name: companyName || "My Company",
          adminId: `admin-${Date.now()}`,
          subscriptionTier: "basic" as const,
          createdAt: new Date().toISOString(),
        }

        // Create new admin
        const newAdmin = {
          id: `admin-${Date.now()}`,
          email,
          password,
          name: adminName || email.split("@")[0],
          role: "admin" as const,
          companyId: newCompany.id,
          createdAt: new Date().toISOString(),
        }

        fleetStorage.addCompany(newCompany)
        fleetStorage.addAdmin(newAdmin)
        localStorage.setItem("fleet_admin", JSON.stringify(newAdmin))
      } else {
        const admin = fleetStorage.getAdminByEmail(email)
        if (!admin || admin.password !== password) {
          setError("Invalid credentials")
          setLoading(false)
          return
        }
        localStorage.setItem("fleet_admin", JSON.stringify(admin))
      }
      router.push("/dashboard")
    } catch (err) {
      setError("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <Card className="w-full max-w-md border border-[#e5e5e5] bg-white shadow-sm relative z-10">
        <CardHeader className="space-y-2 pb-6 pt-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#18181b] rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-[#18181b]">
              RNCFleets
            </span>
          </div>
          <CardTitle className="text-2xl text-center text-[#18181b] font-semibold">Welcome back</CardTitle>
          <CardDescription className="text-center text-[#71717a]">Enter your credentials to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#f4f4f5] border-0">
              <TabsTrigger
                value="signin"
                onClick={() => setIsSignUp(false)}
                className="data-[state=active]:bg-white data-[state=active]:text-[#18181b] data-[state=active]:shadow-sm text-[#71717a]"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                onClick={() => setIsSignUp(true)}
                className="data-[state=active]:bg-white data-[state=active]:text-[#18181b] data-[state=active]:shadow-sm text-[#71717a]"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4 mt-6">
              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#18181b] text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white border-[#e5e5e5] text-[#18181b] placeholder:text-[#a1a1aa] focus:border-[#18181b] focus:ring-[#18181b]/10 h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[#18181b] text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white border-[#e5e5e5] text-[#18181b] placeholder:text-[#a1a1aa] focus:border-[#18181b] focus:ring-[#18181b]/10 h-10"
                  />
                </div>
                {error && (
                  <div className="text-sm text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] p-3 rounded-lg">{error}</div>
                )}
                <Button
                  type="submit"
                  className="w-full bg-[#18181b] hover:bg-[#27272a] text-white font-medium h-10 shadow-sm transition-colors"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
              <div className="mt-6 pt-6 border-t border-[#e5e5e5]">
                <p className="text-xs text-[#71717a] mb-3 font-medium">Demo credentials</p>
                <div className="space-y-2 text-xs">
                  <div className="bg-[#fafafa] p-3 rounded-lg border border-[#e5e5e5]">
                    <p className="text-[#71717a] mb-1 text-[10px] uppercase tracking-wide">Superadmin</p>
                    <p className="text-[#18181b] font-mono text-xs">superadmin@rncfleets.com</p>
                    <p className="text-[#18181b] font-mono text-xs">admin123</p>
                  </div>
                  <div className="bg-[#fafafa] p-3 rounded-lg border border-[#e5e5e5]">
                    <p className="text-[#71717a] mb-1 text-[10px] uppercase tracking-wide">Company Admin</p>
                    <p className="text-[#18181b] font-mono text-xs">admin@abcrncfleets.com</p>
                    <p className="text-[#18181b] font-mono text-xs">admin123</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      // clear demo storage keys and re-seed demo data
                      localStorage.removeItem("fleet_companies")
                      localStorage.removeItem("fleet_vehicles")
                      localStorage.removeItem("fleet_services")
                      localStorage.removeItem("fleet_service_requests")
                      localStorage.removeItem("fleet_maintenance_records")
                      localStorage.removeItem("fleet_tire_options")
                      localStorage.removeItem("fleet_service_reminders")
                      localStorage.removeItem("fleet_admins")
                      localStorage.removeItem("fleet_admin")
                      // re-run initialize and reload
                      fleetStorage.initializeDemoData()
                      // reload to pick up seeded values
                      location.reload()
                    }}
                    className="w-full text-xs h-8 bg-white border border-[#e5e5e5] text-[#71717a] hover:bg-[#fafafa] hover:text-[#18181b]"
                  >
                    Reset demo data
                  </Button>
                </div>
                {seededAdminEmails.length > 0 && (
                  <div className="mt-3 text-xs text-[#71717a]">
                    <p className="text-[#a1a1aa] mb-1 text-[10px] uppercase tracking-wide">Currently seeded</p>
                    <ul className="list-disc ml-5 space-y-0.5">
                      {seededAdminEmails.map((e) => (
                        <li key={e} className="font-mono text-[11px]">{e}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 mt-6">
              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-[#18181b] text-sm font-medium">
                    Company Name
                  </Label>
                    <Input
                    id="company"
                    type="text"
                    placeholder="Your company name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="bg-white border-[#e5e5e5] text-[#18181b] placeholder:text-[#a1a1aa] focus:border-[#18181b] focus:ring-[#18181b]/10 h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-name" className="text-[#18181b] text-sm font-medium">
                    Your Name
                  </Label>
                  <Input
                    id="admin-name"
                    type="text"
                    placeholder="John Doe"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="bg-white border-[#e5e5e5] text-[#18181b] placeholder:text-[#a1a1aa] focus:border-[#18181b] focus:ring-[#18181b]/10 h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-[#18181b] text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white border-[#e5e5e5] text-[#18181b] placeholder:text-[#a1a1aa] focus:border-[#18181b] focus:ring-[#18181b]/10 h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-[#18181b] text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white border-[#e5e5e5] text-[#18181b] placeholder:text-[#a1a1aa] focus:border-[#18181b] focus:ring-[#18181b]/10 h-10"
                  />
                </div>
                {error && (
                  <div className="text-sm text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] p-3 rounded-lg">{error}</div>
                )}
                <Button
                  type="submit"
                  className="w-full bg-[#18181b] hover:bg-[#27272a] text-white font-medium h-10 shadow-sm transition-colors"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
