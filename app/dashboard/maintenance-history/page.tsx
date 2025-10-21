"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import BackButton from "@/components/back-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { fleetStorage } from "@/lib/fleet-storage"
import type { MaintenanceRecord, Vehicle } from "@/lib/fleet-types"
import { Calendar, DollarSign, Wrench, FileText } from "lucide-react"

export default function MaintenanceHistoryPage() {
  const [records, setRecords] = useState<MaintenanceRecord[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [showAddRecord, setShowAddRecord] = useState(false)
  const [selectedVehicleId, setSelectedVehicleId] = useState("")
  const [filterVehicleId, setFilterVehicleId] = useState<string>("all")
  const [formData, setFormData] = useState({
    serviceType: "",
    odometer: 0,
    cost: 0,
    invoiceAmount: 0,
    notes: "",
  })

  // Load companyId safely from localStorage
  useEffect(() => {
    const adminStr = typeof window !== "undefined" ? localStorage.getItem("fleet_admin") : null
    if (adminStr) {
      try {
        const admin = JSON.parse(adminStr)
        if (admin?.companyId) setCompanyId(admin.companyId as string)
      } catch {
        // ignore parse errors
      }
    }
  }, [])

  useEffect(() => {
    if (!companyId) return
    setRecords(fleetStorage.getMaintenanceRecords(companyId))
    setVehicles(fleetStorage.getVehicles(companyId))
  }, [companyId])

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault()

    if (!companyId) {
      alert("No company context available.")
      return
    }

    if (!selectedVehicleId) {
      alert("Please select a vehicle")
      return
    }

    const vehicle = vehicles.find((v) => v.id === selectedVehicleId)
    if (!vehicle) return

    const nextServiceDate = new Date()
    nextServiceDate.setMonth(nextServiceDate.getMonth() + 3)

    const newRecord: MaintenanceRecord = {
      id: `record-${Date.now()}`,
      companyId,
      vehicleId: selectedVehicleId,
      serviceType: formData.serviceType,
      odometer: formData.odometer,
      cost: formData.cost,
      invoiceAmount: formData.invoiceAmount,
      completionDate: new Date().toISOString(),
      nextServiceDate: nextServiceDate.toISOString(),
      notes: formData.notes,
      createdAt: new Date().toISOString(),
    }

    fleetStorage.addMaintenanceRecord(newRecord)
    fleetStorage.updateVehicle(selectedVehicleId, {
      odometer: formData.odometer,
      lastOdometerUpdate: new Date().toISOString(),
      nextServiceDate: nextServiceDate.toISOString(),
    })

    setRecords([...records, newRecord])
    setFormData({ serviceType: "", odometer: 0, cost: 0, invoiceAmount: 0, notes: "" })
    setSelectedVehicleId("")
    setShowAddRecord(false)
  }

  const getVehicleInfo = (vehicleId: string) => {
    return vehicles.find((v) => v.id === vehicleId)
  }

  const filteredRecords = filterVehicleId === "all" ? records : records.filter((r) => r.vehicleId === filterVehicleId)

  const totalSpent = filteredRecords.reduce((sum, r) => sum + r.invoiceAmount, 0)
  const totalServices = filteredRecords.length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <h1 className="text-3xl font-bold text-white">Maintenance History</h1>
            <p className="text-slate-400">Track all vehicle maintenance and service records</p>
          </div>
        </div>
        <Button onClick={() => setShowAddRecord(true)} className="bg-blue-600 hover:bg-blue-700">
          Add Record
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-slate-700 bg-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-900/30 rounded-lg">
                <Wrench className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Services</p>
                <p className="text-2xl font-bold text-white">{totalServices}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-900/30 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Spent</p>
                <p className="text-2xl font-bold text-white">${totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-900/30 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Avg Cost per Service</p>
                <p className="text-2xl font-bold text-white">
                  ${totalServices > 0 ? Math.round(totalSpent / totalServices) : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-700 bg-slate-800">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Label className="text-slate-200">Filter by Vehicle:</Label>
            <select
              value={filterVehicleId}
              onChange={(e) => setFilterVehicleId(e.target.value)}
              className="bg-slate-700 border border-slate-600 text-white p-2 rounded flex-1"
            >
              <option value="all">All Vehicles</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.year} {v.make} {v.model} ({v.licensePlate})
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {showAddRecord && (
        <Card className="border-slate-700 bg-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Add Maintenance Record</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddRecord} className="space-y-4">
              <div>
                <Label className="text-slate-200">Vehicle</Label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  required
                  className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded"
                >
                  <option value="">Select a vehicle</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.year} {v.make} {v.model} ({v.licensePlate})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-200">Service Type</Label>
                  <Input
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    placeholder="e.g., Oil Change"
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-200">Odometer (km)</Label>
                  <Input
                    type="number"
                    value={formData.odometer}
                    onChange={(e) => setFormData({ ...formData, odometer: Number.parseInt(e.target.value) })}
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-200">Cost</Label>
                  <Input
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: Number.parseFloat(e.target.value) })}
                    placeholder="0.00"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-200">Invoice Amount</Label>
                  <Input
                    type="number"
                    value={formData.invoiceAmount}
                    onChange={(e) => setFormData({ ...formData, invoiceAmount: Number.parseFloat(e.target.value) })}
                    placeholder="0.00"
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-slate-200">Notes</Label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Add Record
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowAddRecord(false)}
                  variant="outline"
                  className="border-slate-600"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {filteredRecords.length === 0 ? (
          <Card className="border-slate-700 bg-slate-800">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No maintenance records found</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredRecords.map((record) => {
            const vehicle = getVehicleInfo(record.vehicleId)
            return (
              <Card key={record.id} className="border-slate-700 bg-slate-800">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-400">Vehicle:</span>
                      <div className="text-white font-semibold">
                        {vehicle?.year} {vehicle?.make} {vehicle?.model}
                      </div>
                      <div className="text-slate-400 text-sm">{vehicle?.licensePlate}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Service Type:</span>
                      <div className="text-white font-semibold">{record.serviceType}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Odometer:</span>
                      <div className="text-white">{record.odometer.toLocaleString()} km</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Invoice Amount:</span>
                      <div className="text-white font-semibold">${record.invoiceAmount}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Completion Date:</span>
                      <div className="text-white">{new Date(record.completionDate).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Next Service Date:</span>
                      <div className="text-white">{new Date(record.nextServiceDate).toLocaleDateString()}</div>
                    </div>
                    {record.notes && (
                      <div className="col-span-2">
                        <span className="text-slate-400">Notes:</span>
                        <div className="text-white text-sm">{record.notes}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
