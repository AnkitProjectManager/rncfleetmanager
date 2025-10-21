"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import BackButton from "@/components/back-button"
import { CheckCircle, AlertCircle } from "lucide-react"

export default function IntegrationsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [integrations, setIntegrations] = useState<any[]>([])

  useEffect(() => {
    const userData = localStorage.getItem("fleet_user")
    if (!userData) {
      router.push("/")
      return
    }
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    const mockIntegrations = [
      {
        id: "int-1",
        orgId: parsedUser.orgId,
        type: "sso",
        name: "Okta SSO",
        config: { domain: "company.okta.com" },
        enabled: true,
        lastSync: new Date().toISOString(),
      },
      {
        id: "int-2",
        orgId: parsedUser.orgId,
        type: "siem",
        name: "Splunk",
        config: { endpoint: "splunk.company.com" },
        enabled: true,
        lastSync: new Date().toISOString(),
      },
      {
        id: "int-3",
        orgId: parsedUser.orgId,
        type: "itsm",
        name: "ServiceNow",
        config: { instance: "company.service-now.com" },
        enabled: false,
      },
      {
        id: "int-4",
        orgId: parsedUser.orgId,
        type: "devops",
        name: "GitHub",
        config: { org: "company" },
        enabled: true,
        lastSync: new Date().toISOString(),
      },
    ]
    setIntegrations(mockIntegrations)
  }, [router])

  const getIntegrationIcon = (type: string) => {
    const icons: Record<string, string> = {
      sso: "🔐",
      siem: "📊",
      itsm: "🎫",
      devops: "🚀",
      webhook: "🔗",
    }
    return icons[type] || "🔌"
  }

  if (!user) return null

  return (
  <main className="flex-1 overflow-auto" style={{ background: 'var(--color-background)' }}>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <h1 className="text-3xl font-bold text-white">Integrations</h1>
            <p className="text-[var(--muted-foreground)]">Connect third-party services and tools</p>
          </div>
        </div>

        <div className="grid gap-4">
          {integrations.map((integration) => (
            <Card key={integration.id} className="" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-3xl">{getIntegrationIcon(integration.type)}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{integration.name}</h3>
                      <p className="text-[var(--muted-foreground)] text-sm capitalize">{integration.type} Integration</p>
                      {integration.lastSync && (
                        <p className="text-xs text-slate-500 mt-1">
                          Last synced: {new Date(integration.lastSync).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {integration.enabled ? (
                      <div className="flex items-center gap-1 text-[var(--chart-2)]">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Connected</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-[var(--muted-foreground)]">
                        <AlertCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Disconnected</span>
                      </div>
                    )}
                    <Button className="bg-blue-600 hover:bg-blue-700">Configure</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Available Integrations</CardTitle>
            <CardDescription className="text-slate-400">Add more integrations to extend Fleet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Slack", icon: "💬" },
                { name: "Microsoft Teams", icon: "👥" },
                { name: "PagerDuty", icon: "🚨" },
                { name: "Datadog", icon: "📈" },
                { name: "New Relic", icon: "🔍" },
                { name: "Jira", icon: "🎯" },
                { name: "AWS", icon: "☁️" },
                { name: "Azure", icon: "🔷" },
              ].map((app) => (
                <Button
                  key={app.name}
                  variant="outline"
                  className="border-slate-600 h-20 flex flex-col items-center justify-center gap-2 bg-transparent"
                >
                  <span className="text-2xl">{app.icon}</span>
                  <span className="text-xs text-center">{app.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
