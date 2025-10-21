"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import BackButton from "@/components/back-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { fleetStorage } from "@/lib/fleet-storage"
import type { Admin, Company } from "@/lib/fleet-types"

export default function AdminPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [showAddAdmin, setShowAddAdmin] = useState(false)
  const [showAddCompany, setShowAddCompany] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    companyId: "",
  })
  const [companyFormData, setCompanyFormData] = useState<{
    name: string
    subscriptionTier: "basic" | "professional" | "enterprise"
  }>({
    name: "",
    subscriptionTier: "basic",
  })

  // Load current admin safely on the client
  useEffect(() => {
    const adminStr = typeof window !== "undefined" ? localStorage.getItem("fleet_admin") : null
    if (adminStr) {
      try {
        const parsed = JSON.parse(adminStr)
        setAdmin(parsed)
      } catch {
        // ignore parse errors
      }
    }
  }, [])

  const isSuperAdmin = admin?.role === "superadmin"

  useEffect(() => {
    setAdmins(fleetStorage.getAdmins())
    setCompanies(fleetStorage.getCompanies())
  }, [])

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isSuperAdmin) {
      alert("Only superadmins can add admins")
      return
    }

    const newAdmin: Admin = {
      id: `admin-${Date.now()}`,
      email: formData.email,
      password: formData.password,
      name: formData.name,
      role: "admin",
      companyId: formData.companyId,
      createdAt: new Date().toISOString(),
    }

    fleetStorage.addAdmin(newAdmin)
    setAdmins([...admins, newAdmin])
    setFormData({ email: "", password: "", name: "", companyId: "" })
    setShowAddAdmin(false)
  }

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isSuperAdmin) {
      alert("Only superadmins can add companies")
      return
    }

    const newCompany: Company = {
      id: `company-${Date.now()}`,
      name: companyFormData.name,
      adminId: `admin-${Date.now()}`,
      subscriptionTier: companyFormData.subscriptionTier,
      createdAt: new Date().toISOString(),
    }

    fleetStorage.addCompany(newCompany)
    setCompanies([...companies, newCompany])
    setCompanyFormData({ name: "", subscriptionTier: "basic" })
    setShowAddCompany(false)
  }

  const displayAdmins = isSuperAdmin ? admins : admins.filter((a) => a.companyId === admin?.companyId)
  const displayCompanies = isSuperAdmin ? companies : companies.filter((c) => c.id === admin?.companyId)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BackButton />
        <div>
          <h1 className="text-3xl font-bold text-[var(--card-foreground)]">Administration</h1>
          <p className="text-[var(--muted-foreground)]">{isSuperAdmin ? "Manage all companies and admins" : "Manage your company"}</p>
        </div>
      </div>

      {isSuperAdmin && (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-[var(--card-foreground)]">Companies</h2>
            <Button onClick={() => setShowAddCompany(true)} className="bg-primary hover:brightness-95">
              Add Company
            </Button>
          </div>

          {showAddCompany && (
            <Card className="" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
              <CardHeader>
                <CardTitle className="text-[var(--card-foreground)]">Add New Company</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddCompany} className="space-y-4">
                  <div>
                    <Label className="text-[var(--card-foreground)]">Company Name</Label>
                    <Input
                      value={companyFormData.name}
                      onChange={(e) => setCompanyFormData({ ...companyFormData, name: e.target.value })}
                      placeholder="Company Name"
                      required
                      className="bg-[var(--color-input)] border border-[var(--color-border)] text-[var(--card-foreground)]"
                    />
                  </div>
                  <div>
                    <Label className="text-[var(--card-foreground)]">Subscription Tier</Label>
                    <select
                      value={companyFormData.subscriptionTier}
                      onChange={(e) =>
                        setCompanyFormData({
                          ...companyFormData,
                          subscriptionTier: e.target.value as "basic" | "professional" | "enterprise",
                        })
                      }
                      className="w-full bg-[var(--color-input)] border border-[var(--color-border)] text-[var(--card-foreground)] p-2 rounded"
                    >
                      <option value="basic">Basic</option>
                      <option value="professional">Professional</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="bg-primary hover:brightness-95">
                      Add Company
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setShowAddCompany(false)}
                      variant="outline"
                      className="border-[var(--color-border)] text-[var(--muted-foreground)]"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {displayCompanies.map((company) => (
              <Card key={company.id} className="" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--card-foreground)]">{company.name}</h3>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        Tier: {company.subscriptionTier.charAt(0).toUpperCase() + company.subscriptionTier.slice(1)}
                      </p>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        Created: {new Date(company.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded text-sm font-medium bg-[var(--muted)] text-[var(--muted-foreground)]">
                      {company.subscriptionTier}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[var(--card-foreground)]">Admins</h2>
        {isSuperAdmin && (
          <Button onClick={() => setShowAddAdmin(true)} className="bg-primary hover:brightness-95">
            Add Admin
          </Button>
        )}
      </div>

      {showAddAdmin && (
        <Card className="border-slate-700 bg-slate-800">
              <CardHeader>
            <CardTitle className="text-[var(--card-foreground)]">Add New Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div>
                <Label className="text-[var(--card-foreground)]">Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Admin Name"
                  required
                  className="bg-[var(--color-input)] border border-[var(--color-border)] text-[var(--card-foreground)]"
                />
              </div>
              <div>
                <Label className="text-[var(--card-foreground)]">Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin@company.com"
                  required
                  className="bg-[var(--color-input)] border border-[var(--color-border)] text-[var(--card-foreground)]"
                />
              </div>
              <div>
                <Label className="text-[var(--card-foreground)]">Password</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="bg-[var(--color-input)] border border-[var(--color-border)] text-[var(--card-foreground)]"
                />
              </div>
              <div>
                <Label className="text-[var(--card-foreground)]">Company</Label>
                <select
                  value={formData.companyId}
                  onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                  required
                  className="w-full bg-[var(--color-input)] border border-[var(--color-border)] text-[var(--card-foreground)] p-2 rounded"
                >
                  <option value="">Select a company</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-primary hover:brightness-95">
                  Add Admin
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowAddAdmin(false)}
                  variant="outline"
                  className="border-[var(--color-border)] text-[var(--muted-foreground)]"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {displayAdmins.map((adminItem) => {
          const company = companies.find((c) => c.id === adminItem.companyId)
          return (
            <Card key={adminItem.id} className="" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--card-foreground)]">{adminItem.name}</h3>
                    <p className="text-sm text-[var(--muted-foreground)]">{adminItem.email}</p>
                    {company && <p className="text-sm text-[var(--muted-foreground)]">Company: {company.name}</p>}
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Created: {new Date(adminItem.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      adminItem.role === "superadmin" ? "bg-[var(--destructive)] text-[var(--destructive-foreground)]" : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {adminItem.role}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
