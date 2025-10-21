"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Cpu, AlertTriangle, Shield, TrendingUp } from "lucide-react"
import { storage } from "@/lib/storage"

export function DashboardContent({ user }: { user: any }) {
  const [devices, setDevices] = useState<any[]>([])
  const [incidents, setIncidents] = useState<any[]>([])

  useEffect(() => {
    const devs = storage.getDevices(user.orgId)
    const incs = storage.getIncidents(user.orgId)
    setDevices(devs)
    setIncidents(incs)
  }, [user.orgId])

  const enrolledDevices = devices.filter((d) => d.enrollmentStatus === "enrolled").length
  const compliantDevices = devices.filter((d) => d.complianceStatus === "compliant").length
  const criticalVulnerabilities = devices.reduce((sum, d) => sum + (d.vulnerabilities?.length || 0), 0)
  const openIncidents = incidents.filter((i) => i.status === "open").length

  const devicesByOS = [
    { name: "Windows", value: devices.filter((d) => d.osType === "Windows").length },
    { name: "macOS", value: devices.filter((d) => d.osType === "macOS").length },
    { name: "Linux", value: devices.filter((d) => d.osType === "Linux").length },
    { name: "iOS", value: devices.filter((d) => d.osType === "iOS").length },
    { name: "Android", value: devices.filter((d) => d.osType === "Android").length },
  ].filter((d) => d.value > 0)

  const complianceData = [
    { name: "Compliant", value: compliantDevices, color: "#10b981" },
    { name: "Non-Compliant", value: devices.length - compliantDevices, color: "#ef4444" },
  ]

  const weeklyData = [
    { day: "Mon", enrolled: 45, compliant: 42 },
    { day: "Tue", enrolled: 48, compliant: 45 },
    { day: "Wed", enrolled: 50, compliant: 48 },
    { day: "Thu", enrolled: 52, compliant: 50 },
    { day: "Fri", enrolled: 55, compliant: 52 },
    { day: "Sat", enrolled: 55, compliant: 53 },
    { day: "Sun", enrolled: 55, compliant: 54 },
  ]

  return (
    <main className="flex-1 overflow-auto" style={{ background: 'var(--color-background)' }}>
      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[var(--card-foreground)]">Enrolled Devices</CardTitle>
              <Cpu className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[var(--card-foreground)]">{enrolledDevices}</div>
              <p className="text-xs text-slate-400">of {devices.length} total</p>
            </CardContent>
          </Card>

          <Card className="" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[var(--card-foreground)]">Compliant Devices</CardTitle>
              <Shield className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[var(--card-foreground)]">{compliantDevices}</div>
              <p className="text-xs text-slate-400">
                {devices.length > 0 ? Math.round((compliantDevices / devices.length) * 100) : 0}% compliance
              </p>
            </CardContent>
          </Card>

          <Card className="" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[var(--card-foreground)]">Vulnerabilities</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[var(--card-foreground)]">{criticalVulnerabilities}</div>
              <p className="text-xs text-slate-400">Across all devices</p>
            </CardContent>
          </Card>

          <Card className="" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[var(--card-foreground)]">Open Incidents</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[var(--card-foreground)]">{openIncidents}</div>
              <p className="text-xs text-slate-400">Requiring attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
            <CardHeader>
                <CardTitle className="text-[var(--card-foreground)]">Enrollment & Compliance Trend</CardTitle>
              <CardDescription className="text-slate-400">Weekly device status</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="day" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
                    labelStyle={{ color: "var(--card-foreground)" }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="enrolled" stroke="var(--chart-1)" name="Enrolled" strokeWidth={2} />
                  <Line type="monotone" dataKey="compliant" stroke="var(--chart-2)" name="Compliant" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
            <CardHeader>
                <CardTitle className="text-[var(--card-foreground)]">Devices by OS</CardTitle>
              <CardDescription className="text-slate-400">Operating system distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={devicesByOS}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[
                      { color: "#3b82f6" },
                      { color: "#10b981" },
                      { color: "#f59e0b" },
                      { color: "#8b5cf6" },
                      { color: "#ec4899" },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
                    labelStyle={{ color: "var(--card-foreground)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Device & Incident Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
            <CardHeader>
                <CardTitle className="text-[var(--card-foreground)]">Recent Devices</CardTitle>
              <CardDescription className="text-slate-400">Latest enrolled devices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {devices.slice(0, 5).map((device) => (
                  <div
                      key={device.id}
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{ border: '1px solid var(--color-border)' }}
                  >
                    <div>
                        <p className="font-medium text-[var(--card-foreground)]">{device.hostname}</p>
                        <p className="text-sm text-[var(--muted-foreground)]">
                        {device.osType} {device.osVersion}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          device.complianceStatus === "compliant"
                              ? "bg-[var(--chart-2)]/30 text-[var(--chart-2)]"
                              : "bg-[var(--destructive)]/30 text-[var(--destructive)]"
                        }`}
                      >
                        {device.complianceStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
            <CardHeader>
                <CardTitle className="text-[var(--card-foreground)]">Recent Incidents</CardTitle>
              <CardDescription className="text-slate-400">Security incidents and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incidents.slice(0, 5).map((incident) => (
                  <div
                    key={incident.id}
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{ border: '1px solid var(--color-border)' }}
                  >
                    <div>
                        <p className="font-medium text-[var(--card-foreground)]">{incident.type}</p>
                        <p className="text-sm text-[var(--muted-foreground)]">{incident.description}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          incident.severity === "critical"
                              ? "bg-[var(--destructive)]/30 text-[var(--destructive)]"
                              : incident.severity === "high"
                                ? "bg-[var(--chart-5)]/30 text-[var(--chart-5)]"
                                : "bg-[var(--chart-3)]/30 text-[var(--chart-3)]"
                        }`}
                      >
                        {incident.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
