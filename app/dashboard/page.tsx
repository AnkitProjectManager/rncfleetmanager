"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fleetStorage } from "@/lib/fleet-storage"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Car, AlertTriangle, Wrench, Droplet } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [vehicles, setVehicles] = useState<any[]>([])
  const [reminders, setReminders] = useState<any[]>([])
  const [maintenanceRecords, setMaintenanceRecords] = useState<any[]>([])

  useEffect(() => {
    const adminData = localStorage.getItem("fleet_admin")
    if (!adminData) {
      router.push("/")
      return
    }

    const parsedAdmin = JSON.parse(adminData)
    setAdmin(parsedAdmin)

    fleetStorage.initializeDemoData()

    const allVehicles = fleetStorage.getVehicles(parsedAdmin.companyId)
    const allReminders = fleetStorage.getServiceReminders(parsedAdmin.companyId)
    const allRecords = fleetStorage.getMaintenanceRecords(parsedAdmin.companyId)

    setVehicles(allVehicles)
    setReminders(allReminders)
    setMaintenanceRecords(allRecords)
    setLoading(false)
  }, [router])

  if (loading || !admin) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: 'var(--color-background)', color: 'var(--foreground)'}}>Loading...</div>
    )
  }

  const activeVehicles = vehicles.filter((v) => v.status === "active").length
  const maintenanceNeeded = vehicles.filter((v) => new Date(v.nextServiceDate) < new Date()).length
  const pendingReminders = reminders.filter((r) => r.status === "pending").length
  const totalMaintenanceCost = maintenanceRecords.reduce((sum, r) => sum + r.invoiceAmount, 0)

  const vehicleStatusData = [
    { name: "Active", value: vehicles.filter((v) => v.status === "active").length },
    { name: "Maintenance", value: vehicles.filter((v) => v.status === "maintenance").length },
    { name: "Inactive", value: vehicles.filter((v) => v.status === "inactive").length },
  ]

  const monthlyData = [
    { month: "Jan", maintenance: 1200, fuel: 2400 },
    { month: "Feb", maintenance: 1400, fuel: 2200 },
    { month: "Mar", maintenance: 1600, fuel: 2500 },
    { month: "Apr", maintenance: 1300, fuel: 2300 },
    { month: "May", maintenance: 1800, fuel: 2600 },
    { month: "Jun", maintenance: 1500, fuel: 2400 },
  ]

  return (
    <div className="flex h-screen" style={{ background: 'var(--color-background)' }}>
      <Sidebar user={admin} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader user={admin} />
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              {/* no-op space for consistent header alignment */}
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[var(--card-foreground)]">Active Vehicles</CardTitle>
                  <Car className="h-4 w-4 text-[var(--chart-1)]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[var(--card-foreground)]">{activeVehicles}</div>
                  <p className="text-xs text-[var(--muted-foreground)]">of {vehicles.length} total</p>
                </CardContent>
              </Card>

              <Card className="" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[var(--card-foreground)]">Maintenance Needed</CardTitle>
                  <Wrench className="h-4 w-4 text-[var(--chart-3)]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[var(--card-foreground)]">{maintenanceNeeded}</div>
                  <p className="text-xs text-[var(--muted-foreground)]">Overdue services</p>
                </CardContent>
              </Card>

              <Card className="" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[var(--card-foreground)]">Pending Reminders</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-[var(--destructive)]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[var(--card-foreground)]">{pendingReminders}</div>
                  <p className="text-xs text-[var(--muted-foreground)]">Awaiting action</p>
                </CardContent>
              </Card>

              <Card className="" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[var(--card-foreground)]">Total Maintenance Cost</CardTitle>
                  <Droplet className="h-4 w-4 text-[var(--chart-2)]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[var(--card-foreground)]">${totalMaintenanceCost.toFixed(0)}</div>
                  <p className="text-xs text-[var(--muted-foreground)]">Year to date</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
                <CardHeader>
                  <CardTitle className="text-[var(--card-foreground)]">Monthly Costs</CardTitle>
                  <CardDescription className="text-[var(--muted-foreground)]">Maintenance and fuel expenses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                      <YAxis stroke="var(--muted-foreground)" />
                      <Tooltip contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }} />
                      <Legend />
                      <Line type="monotone" dataKey="maintenance" stroke="var(--chart-3)" name="Maintenance" strokeWidth={2} />
                      <Line type="monotone" dataKey="fuel" stroke="var(--chart-1)" name="Fuel" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
                <CardHeader>
                  <CardTitle className="text-[var(--card-foreground)]">Vehicle Status</CardTitle>
                  <CardDescription className="text-[var(--muted-foreground)]">Fleet status distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={vehicleStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name} ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="var(--chart-1)" />
                        <Cell fill="var(--chart-3)" />
                        <Cell fill="var(--muted)" />
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Vehicles */}
            <Card className="" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
              <CardHeader>
                <CardTitle className="text-[var(--card-foreground)]">Recent Vehicles</CardTitle>
                <CardDescription className="text-[var(--muted-foreground)]">Latest fleet additions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vehicles.slice(0, 5).map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{ border: '1px solid var(--color-border)' }}
                    >
                      <div>
                        <p className="font-medium text-[var(--card-foreground)]">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </p>
                        <p className="text-sm text-[var(--muted-foreground)]">{vehicle.licensePlate}</p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            vehicle.status === "active"
                              ? "bg-[var(--chart-2)]/30 text-[var(--chart-2)]"
                              : vehicle.status === "maintenance"
                                ? "bg-[var(--chart-3)]/30 text-[var(--chart-3)]"
                                : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                          }`}
                        >
                          {vehicle.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
