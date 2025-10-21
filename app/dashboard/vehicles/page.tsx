"use client"
export const dynamic = 'force-dynamic'

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import BackButton from "@/components/back-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { fleetStorage } from "@/lib/fleet-storage"
import type { Vehicle } from "@/lib/fleet-types"
import { Upload, Plus, Zap, Edit } from "lucide-react"

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [showAddVehicle, setShowAddVehicle] = useState(false)
  const [showBulkUpload, setShowBulkUpload] = useState(false)
  const [showManualUpdate, setShowManualUpdate] = useState(false)
  const [selectedVehicleForUpdate, setSelectedVehicleForUpdate] = useState<Vehicle | null>(null)
  const [manualUpdateData, setManualUpdateData] = useState({
    odometer: 0,
    insuranceExpiryDate: "",
    registrationExpiryDate: "",
    nextServiceDate: "",
    nextTireChangeKm: 0,
    nextOilChangeDate: "",
  })
  const [csvData, setCsvData] = useState("")
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    vin: "",
    licensePlate: "",
    odometer: 0,
  })
  const [companyId, setCompanyId] = useState<string>("")

  // Safely read from localStorage on the client
  useEffect(() => {
    const adminStr = localStorage.getItem("fleet_admin")
    try {
      const admin = adminStr ? JSON.parse(adminStr) : null
      setCompanyId(admin?.companyId || "")
    } catch {
      setCompanyId("")
    }
  }, [])

  useEffect(() => {
    if (!companyId) return
    setVehicles(fleetStorage.getVehicles(companyId))
  }, [companyId])

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault()

    const newVehicle: Vehicle = {
      id: `vehicle-${Date.now()}`,
      companyId,
      make: formData.make,
      model: formData.model,
      year: formData.year,
      vin: formData.vin,
      licensePlate: formData.licensePlate,
      odometer: formData.odometer,
      odometerUnit: "km",
      lastOdometerUpdate: new Date().toISOString(),
      obdConnected: false,
      insuranceExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      registrationExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      nextServiceDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      nextTireChangeKm: formData.odometer + 50000,
      nextOilChangeDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
      createdAt: new Date().toISOString(),
    }

    fleetStorage.addVehicle(newVehicle)
    setVehicles([...vehicles, newVehicle])
    setFormData({ make: "", model: "", year: new Date().getFullYear(), vin: "", licensePlate: "", odometer: 0 })
    setShowAddVehicle(false)
  }

  const handleBulkUpload = (e: React.FormEvent) => {
    e.preventDefault()

    const lines = csvData.trim().split("\n")
    const newVehicles: Vehicle[] = []

    lines.forEach((line, index) => {
      if (index === 0) return // Skip header

      const [make, model, year, vin, licensePlate, odometer] = line.split(",").map((s) => s.trim())

      if (make && model && year && vin && licensePlate) {
        const vehicle: Vehicle = {
          id: `vehicle-${Date.now()}-${index}`,
          companyId,
          make,
          model,
          year: Number.parseInt(year),
          vin,
          licensePlate,
          odometer: Number.parseInt(odometer) || 0,
          odometerUnit: "km",
          lastOdometerUpdate: new Date().toISOString(),
          obdConnected: false,
          insuranceExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          registrationExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          nextServiceDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          nextTireChangeKm: (Number.parseInt(odometer) || 0) + 50000,
          nextOilChangeDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
          status: "active",
          createdAt: new Date().toISOString(),
        }
        newVehicles.push(vehicle)
      }
    })

    if (newVehicles.length > 0) {
      fleetStorage.bulkAddVehicles(newVehicles)
      setVehicles([...vehicles, ...newVehicles])
      setCsvData("")
      setShowBulkUpload(false)
      alert(`Successfully imported ${newVehicles.length} vehicles`)
    }
  }

  const handleConnectOBD = (vehicleId: string) => {
    // Simulate OBD connection
    const randomOdometer = Math.floor(Math.random() * 100000) + 10000
    fleetStorage.updateVehicle(vehicleId, {
      obdConnected: true,
      obdDeviceId: `obd-${Date.now()}`,
      odometer: randomOdometer,
      lastOdometerUpdate: new Date().toISOString(),
    })
    setVehicles(
      vehicles.map((v) =>
        v.id === vehicleId
          ? {
              ...v,
              obdConnected: true,
              obdDeviceId: `obd-${Date.now()}`,
              odometer: randomOdometer,
              lastOdometerUpdate: new Date().toISOString(),
            }
          : v,
      ),
    )
  }

  const handleManualUpdate = (vehicle: Vehicle) => {
    setSelectedVehicleForUpdate(vehicle)
    setManualUpdateData({
      odometer: vehicle.odometer,
      insuranceExpiryDate: vehicle.insuranceExpiryDate.split("T")[0],
      registrationExpiryDate: vehicle.registrationExpiryDate.split("T")[0],
      nextServiceDate: vehicle.nextServiceDate.split("T")[0],
      nextTireChangeKm: vehicle.nextTireChangeKm,
      nextOilChangeDate: vehicle.nextOilChangeDate.split("T")[0],
    })
    setShowManualUpdate(true)
  }

  const handleSaveManualUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedVehicleForUpdate) return

    fleetStorage.updateVehicle(selectedVehicleForUpdate.id, {
      odometer: manualUpdateData.odometer,
      insuranceExpiryDate: new Date(manualUpdateData.insuranceExpiryDate).toISOString(),
      registrationExpiryDate: new Date(manualUpdateData.registrationExpiryDate).toISOString(),
      nextServiceDate: new Date(manualUpdateData.nextServiceDate).toISOString(),
      nextTireChangeKm: manualUpdateData.nextTireChangeKm,
      nextOilChangeDate: new Date(manualUpdateData.nextOilChangeDate).toISOString(),
      lastOdometerUpdate: new Date().toISOString(),
    })

    setVehicles(
      vehicles.map((v) =>
        v.id === selectedVehicleForUpdate.id
          ? {
              ...v,
              odometer: manualUpdateData.odometer,
              insuranceExpiryDate: new Date(manualUpdateData.insuranceExpiryDate).toISOString(),
              registrationExpiryDate: new Date(manualUpdateData.registrationExpiryDate).toISOString(),
              nextServiceDate: new Date(manualUpdateData.nextServiceDate).toISOString(),
              nextTireChangeKm: manualUpdateData.nextTireChangeKm,
              nextOilChangeDate: new Date(manualUpdateData.nextOilChangeDate).toISOString(),
              lastOdometerUpdate: new Date().toISOString(),
            }
          : v,
      ),
    )

    setShowManualUpdate(false)
    setSelectedVehicleForUpdate(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <h1 className="text-3xl font-bold text-white">Vehicles</h1>
            <p className="text-slate-400">Manage your fleet of vehicles</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowBulkUpload(true)} variant="outline" className="border-slate-600">
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>
          <Button onClick={() => setShowAddVehicle(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Vehicle
          </Button>
        </div>
      </div>

      {showAddVehicle && (
        <Card className="border-slate-700 bg-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Add New Vehicle</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-200">Make</Label>
                  <Input
                    value={formData.make}
                    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                    placeholder="Toyota"
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-200">Model</Label>
                  <Input
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="Hiace"
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-200">Year</Label>
                  <Input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: Number.parseInt(e.target.value) })}
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-200">VIN</Label>
                  <Input
                    value={formData.vin}
                    onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                    placeholder="VIN123456"
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-200">License Plate</Label>
                  <Input
                    value={formData.licensePlate}
                    onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                    placeholder="ABC-1234"
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
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Add Vehicle
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowAddVehicle(false)}
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

      {showBulkUpload && (
        <Card className="border-slate-700 bg-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Bulk Upload Vehicles</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBulkUpload} className="space-y-4">
              <div>
                <Label className="text-slate-200 mb-2 block">
                  CSV Format (Make, Model, Year, VIN, License Plate, Odometer)
                </Label>
                <textarea
                  value={csvData}
                  onChange={(e) => setCsvData(e.target.value)}
                  placeholder="Toyota,Hiace,2022,VIN123456,ABC-1234,45000&#10;Ford,Transit,2021,VIN789012,ABC-5678,62000"
                  className="w-full bg-slate-700 border border-slate-600 text-white p-3 rounded font-mono text-sm"
                  rows={6}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Import Vehicles
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowBulkUpload(false)}
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

      {showManualUpdate && selectedVehicleForUpdate && (
        <Card className="border-slate-700 bg-slate-800">
          <CardHeader>
            <CardTitle className="text-white">
              Update Vehicle Data - {selectedVehicleForUpdate.year} {selectedVehicleForUpdate.make}{" "}
              {selectedVehicleForUpdate.model}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveManualUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-200">Odometer (km)</Label>
                  <Input
                    type="number"
                    value={manualUpdateData.odometer}
                    onChange={(e) =>
                      setManualUpdateData({ ...manualUpdateData, odometer: Number.parseInt(e.target.value) })
                    }
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-200">Insurance Expiry Date</Label>
                  <Input
                    type="date"
                    value={manualUpdateData.insuranceExpiryDate}
                    onChange={(e) => setManualUpdateData({ ...manualUpdateData, insuranceExpiryDate: e.target.value })}
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-200">Registration Expiry Date</Label>
                  <Input
                    type="date"
                    value={manualUpdateData.registrationExpiryDate}
                    onChange={(e) =>
                      setManualUpdateData({ ...manualUpdateData, registrationExpiryDate: e.target.value })
                    }
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-200">Next Service Date</Label>
                  <Input
                    type="date"
                    value={manualUpdateData.nextServiceDate}
                    onChange={(e) => setManualUpdateData({ ...manualUpdateData, nextServiceDate: e.target.value })}
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-200">Next Tire Change (km)</Label>
                  <Input
                    type="number"
                    value={manualUpdateData.nextTireChangeKm}
                    onChange={(e) =>
                      setManualUpdateData({ ...manualUpdateData, nextTireChangeKm: Number.parseInt(e.target.value) })
                    }
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-200">Next Oil Change Date</Label>
                  <Input
                    type="date"
                    value={manualUpdateData.nextOilChangeDate}
                    onChange={(e) => setManualUpdateData({ ...manualUpdateData, nextOilChangeDate: e.target.value })}
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Save Updates
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowManualUpdate(false)
                    setSelectedVehicleForUpdate(null)
                  }}
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
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="border-slate-700 bg-slate-800">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                    <div>
                      <span className="text-slate-400">License Plate:</span>
                      <div className="text-white font-medium">{vehicle.licensePlate}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">VIN:</span>
                      <div className="text-white font-medium">{vehicle.vin}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Odometer:</span>
                      <div className="text-white font-medium">{vehicle.odometer.toLocaleString()} km</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Last Updated:</span>
                      <div className="text-white font-medium">
                        {new Date(vehicle.lastOdometerUpdate).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Insurance Expiry:</span>
                      <div className="text-white font-medium">
                        {new Date(vehicle.insuranceExpiryDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Next Service:</span>
                      <div className="text-white font-medium">
                        {new Date(vehicle.nextServiceDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Next Tire Change:</span>
                      <div className="text-white font-medium">{vehicle.nextTireChangeKm.toLocaleString()} km</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Next Oil Change:</span>
                      <div className="text-white font-medium">
                        {new Date(vehicle.nextOilChangeDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      vehicle.obdConnected ? "bg-green-900 text-green-200" : "bg-slate-700 text-slate-300"
                    }`}
                  >
                    {vehicle.obdConnected ? "OBD Connected" : "OBD Not Connected"}
                  </span>
                  {!vehicle.obdConnected && (
                    <Button
                      onClick={() => handleConnectOBD(vehicle.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-sm"
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      Connect OBD
                    </Button>
                  )}
                  <Button
                    onClick={() => handleManualUpdate(vehicle)}
                    variant="outline"
                    className="border-slate-600 text-sm"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Manual Update
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
