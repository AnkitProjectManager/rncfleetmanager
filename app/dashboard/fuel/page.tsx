"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import BackButton from "@/components/back-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, TrendingUp, DollarSign } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const mockFuelRecords = [
  { id: 1, vehicle: "Vehicle 001", date: "2024-10-20", gallons: 45, cost: 180, pricePerGallon: 4.0, odometer: 45230 },
  { id: 2, vehicle: "Vehicle 002", date: "2024-10-20", gallons: 38, cost: 152, pricePerGallon: 4.0, odometer: 32100 },
  { id: 3, vehicle: "Vehicle 001", date: "2024-10-19", gallons: 50, cost: 200, pricePerGallon: 4.0, odometer: 45185 },
  { id: 4, vehicle: "Vehicle 004", date: "2024-10-19", gallons: 35, cost: 140, pricePerGallon: 4.0, odometer: 12450 },
]

const mockFuelTrend = [
  { date: "Oct 14", cost: 450, gallons: 120 },
  { date: "Oct 15", cost: 520, gallons: 140 },
  { date: "Oct 16", cost: 480, gallons: 130 },
  { date: "Oct 17", cost: 610, gallons: 165 },
  { date: "Oct 18", cost: 700, gallons: 190 },
  { date: "Oct 19", cost: 340, gallons: 85 },
  { date: "Oct 20", cost: 332, gallons: 83 },
]

export default function FuelPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [fuelRecords, setFuelRecords] = useState(mockFuelRecords)
  const [newRecord, setNewRecord] = useState({ vehicle: "", gallons: "", cost: "", odometer: "" })

  useEffect(() => {
    const userData = localStorage.getItem("fleetio_user")
    if (!userData) {
      router.push("/")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const handleAddRecord = () => {
    if (newRecord.vehicle && newRecord.gallons && newRecord.cost) {
      const record = {
        id: Math.max(...fuelRecords.map((r) => r.id), 0) + 1,
        ...newRecord,
        gallons: Number.parseFloat(newRecord.gallons),
        cost: Number.parseFloat(newRecord.cost),
        odometer: Number.parseInt(newRecord.odometer) || 0,
        date: new Date().toISOString().split("T")[0],
        pricePerGallon: Number.parseFloat(newRecord.cost) / Number.parseFloat(newRecord.gallons),
      }
      setFuelRecords([...fuelRecords, record])
      setNewRecord({ vehicle: "", gallons: "", cost: "", odometer: "" })
    }
  }

  const totalCost = fuelRecords.reduce((sum, r) => sum + r.cost, 0)
  const totalGallons = fuelRecords.reduce((sum, r) => sum + r.gallons, 0)
  const avgMPG = totalGallons > 0 ? (fuelRecords.reduce((sum, r) => sum + r.odometer, 0) / totalGallons).toFixed(2) : 0

  if (!user) return <div className="flex items-center justify-center h-screen">Loading...</div>

  return (
    <div className="flex h-screen bg-background">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader user={user} />
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <BackButton />
                <div>
                  <h1 className="text-3xl font-bold">Fuel & Costs</h1>
                  <p className="text-muted-foreground">Track fuel consumption and costs</p>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Log Fuel
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Log Fuel Purchase</DialogTitle>
                    <DialogDescription>Record a fuel purchase</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="vehicle">Vehicle</Label>
                      <Input
                        id="vehicle"
                        placeholder="Vehicle 001"
                        value={newRecord.vehicle}
                        onChange={(e) => setNewRecord({ ...newRecord, vehicle: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gallons">Gallons</Label>
                      <Input
                        id="gallons"
                        type="number"
                        placeholder="45"
                        value={newRecord.gallons}
                        onChange={(e) => setNewRecord({ ...newRecord, gallons: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cost">Cost ($)</Label>
                      <Input
                        id="cost"
                        type="number"
                        placeholder="180"
                        value={newRecord.cost}
                        onChange={(e) => setNewRecord({ ...newRecord, cost: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="odometer">Odometer Reading</Label>
                      <Input
                        id="odometer"
                        type="number"
                        placeholder="45230"
                        value={newRecord.odometer}
                        onChange={(e) => setNewRecord({ ...newRecord, odometer: e.target.value })}
                      />
                    </div>
                    <Button onClick={handleAddRecord} className="w-full">
                      Log Fuel
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Fuel Cost</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">This period</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Gallons</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalGallons.toFixed(0)}</div>
                  <p className="text-xs text-muted-foreground">Consumed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg MPG</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{avgMPG}</div>
                  <p className="text-xs text-muted-foreground">Miles per gallon</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Fuel Cost Trend</CardTitle>
                <CardDescription>Weekly fuel spending</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockFuelTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="cost" stroke="#3b82f6" name="Cost ($)" />
                    <Line type="monotone" dataKey="gallons" stroke="#10b981" name="Gallons" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Fuel Records</CardTitle>
                <CardDescription>Latest fuel purchases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fuelRecords.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{record.vehicle}</p>
                        <p className="text-sm text-muted-foreground">{record.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${record.cost.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          {record.gallons} gal @ ${record.pricePerGallon.toFixed(2)}/gal
                        </p>
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
