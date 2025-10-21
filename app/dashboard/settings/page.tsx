"use client"
export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import BackButton from "@/components/back-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Key, Lock, Bell } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [org, setOrg] = useState<any>(null)
  const [orgName, setOrgName] = useState("")
  const [email, setEmail] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [showApiKey, setShowApiKey] = useState(false)
  const [mfaEnabled, setMfaEnabled] = useState(false)
  const [ssoEnabled, setSsoEnabled] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("fleet_user")
    if (!userData) {
      router.push("/")
      return
    }
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setEmail(parsedUser.email)

    const orgs = JSON.parse(localStorage.getItem("fleet_orgs") || "[]")
    const userOrg = orgs.find((o: any) => o.id === parsedUser.orgId)
    if (userOrg) {
      setOrg(userOrg)
      setOrgName(userOrg.name)
    }

    // Generate API key if not exists
    const storedApiKey = localStorage.getItem(`fleet_api_key_${parsedUser.orgId}`)
    if (storedApiKey) {
      setApiKey(storedApiKey)
    } else {
      const newApiKey = `fleet_${Math.random().toString(36).substr(2, 32)}`
      localStorage.setItem(`fleet_api_key_${parsedUser.orgId}`, newApiKey)
      setApiKey(newApiKey)
    }
  }, [router])

  const handleSaveOrgSettings = () => {
    const orgs = JSON.parse(localStorage.getItem("fleet_orgs") || "[]")
    const index = orgs.findIndex((o: any) => o.id === user.orgId)
    if (index !== -1) {
      orgs[index].name = orgName
      orgs[index].settings = {
        mfaRequired: mfaEnabled,
        ssoEnabled: ssoEnabled,
      }
      localStorage.setItem("fleet_orgs", JSON.stringify(orgs))
      setOrg(orgs[index])
    }
  }

  const handleGenerateNewApiKey = () => {
    const newApiKey = `fleet_${Math.random().toString(36).substr(2, 32)}`
    localStorage.setItem(`fleet_api_key_${user.orgId}`, newApiKey)
    setApiKey(newApiKey)
  }

  if (!user) return null

  return (
    <main className="flex-1 overflow-auto bg-slate-950">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            <p className="text-slate-400">Manage your organization and account preferences</p>
          </div>
        </div>

        <Tabs defaultValue="organization" className="w-full">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="organization" className="text-slate-300">
              Organization
            </TabsTrigger>
            <TabsTrigger value="security" className="text-slate-300">
              Security
            </TabsTrigger>
            <TabsTrigger value="api" className="text-slate-300">
              API & Webhooks
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-slate-300">
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="organization" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Organization Settings</CardTitle>
                <CardDescription className="text-slate-400">Update your organization information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="org-name" className="text-slate-200">
                    Organization Name
                  </Label>
                  <Input
                    id="org-name"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="org-email" className="text-slate-200">
                    Admin Email
                  </Label>
                  <Input
                    id="org-email"
                    value={email}
                    disabled
                    className="bg-slate-700 border-slate-600 text-slate-400"
                  />
                </div>
                <Button onClick={handleSaveOrgSettings} className="bg-blue-600 hover:bg-blue-700">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Security Settings</CardTitle>
                <CardDescription className="text-slate-400">
                  Configure security policies for your organization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-slate-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="font-medium text-white">Multi-Factor Authentication</p>
                      <p className="text-sm text-slate-400">Require MFA for all users</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMfaEnabled(!mfaEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      mfaEnabled ? "bg-green-600" : "bg-slate-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        mfaEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-400" />
                    <div>
                      <p className="font-medium text-white">Single Sign-On (SSO)</p>
                      <p className="text-sm text-slate-400">Enable SSO for your organization</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSsoEnabled(!ssoEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      ssoEnabled ? "bg-green-600" : "bg-slate-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        ssoEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <Button onClick={handleSaveOrgSettings} className="bg-blue-600 hover:bg-blue-700">
                  Save Security Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">API Keys</CardTitle>
                <CardDescription className="text-slate-400">Manage API keys for programmatic access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
                  <p className="text-sm text-slate-400 mb-2">Your API Key</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm text-slate-300 font-mono break-all">
                      {showApiKey ? apiKey : "••••••••••••••••••••••••••••••••"}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="border-slate-600 text-slate-300"
                    >
                      {showApiKey ? "Hide" : "Show"}
                    </Button>
                  </div>
                </div>
                <Button onClick={handleGenerateNewApiKey} className="bg-orange-600 hover:bg-orange-700">
                  <Key className="w-4 h-4 mr-2" />
                  Generate New Key
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Webhooks</CardTitle>
                <CardDescription className="text-slate-400">Configure webhooks for real-time events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { event: "device.enrolled", description: "Device enrollment event" },
                    { event: "incident.created", description: "New security incident" },
                    { event: "policy.updated", description: "Policy configuration changed" },
                    { event: "vulnerability.detected", description: "New vulnerability found" },
                  ].map((webhook) => (
                    <div
                      key={webhook.event}
                      className="flex items-center justify-between p-3 border border-slate-700 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-white">{webhook.event}</p>
                        <p className="text-sm text-slate-400">{webhook.description}</p>
                      </div>
                      <Button variant="outline" className="border-slate-600 text-slate-300 bg-transparent">
                        Configure
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Notification Preferences</CardTitle>
                <CardDescription className="text-slate-400">Configure how you receive alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Critical Incidents", enabled: true },
                  { name: "Policy Violations", enabled: true },
                  { name: "Vulnerability Alerts", enabled: true },
                  { name: "Device Enrollment", enabled: false },
                  { name: "Weekly Reports", enabled: true },
                ].map((notif) => (
                  <div
                    key={notif.name}
                    className="flex items-center justify-between p-3 border border-slate-700 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-blue-400" />
                      <p className="text-white">{notif.name}</p>
                    </div>
                    <button
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notif.enabled ? "bg-green-600" : "bg-slate-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notif.enabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
