"use client"
export const dynamic = 'force-dynamic'

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import BackButton from "@/components/back-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { fleetStorage } from "@/lib/fleet-storage"
import type { Vehicle, TireOption } from "@/lib/fleet-types"

// Mock TireRack data - in production, this would come from TireRack API
const MOCK_TIRE_OPTIONS: TireOption[] = [
  {
    id: "tire-1",
    brand: "Michelin",
    model: "Defender T+H",
    size: "225/65R17",
    price: 145.99,
    rating: 4.8,
    reviews: 2341,
    treadwear: 820,
    traction: "A",
    temperature: "A",
  },
  {
    id: "tire-2",
    brand: "Goodyear",
    model: "Assurance WeatherReady",
    size: "225/65R17",
    price: 139.99,
    rating: 4.6,
    reviews: 1856,
    treadwear: 800,
    traction: "A",
    temperature: "A",
  },
  {
    id: "tire-3",
    brand: "Bridgestone",
    model: "Turanza QuietTrack",
    size: "225/65R17",
    price: 152.99,
    rating: 4.7,
    reviews: 1923,
    treadwear: 840,
    traction: "A",
    temperature: "A",
  },
  {
    id: "tire-4",
    brand: "Continental",
    model: "TrueContact Plus",
    size: "225/65R17",
    price: 148.99,
    rating: 4.5,
    reviews: 1654,
    treadwear: 800,
    traction: "A",
    temperature: "A",
  },
  {
    id: "tire-5",
    brand: "Pirelli",
    model: "Cinturato P7",
    size: "225/65R17",
    price: 165.99,
    rating: 4.9,
    reviews: 2156,
    treadwear: 860,
    traction: "A",
    temperature: "A",
  },
]

export default function TiresPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedVehicleId, setSelectedVehicleId] = useState("")
  const [tireOptions, setTireOptions] = useState<TireOption[]>(MOCK_TIRE_OPTIONS)
  const [selectedTire, setSelectedTire] = useState<TireOption | null>(null)
  const [quantity, setQuantity] = useState(4)
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [companyId, setCompanyId] = useState<string>("")

  // Safely read from localStorage on the client
  useEffect(() => {
    if (typeof window === "undefined") return
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

  const handleOrderTires = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedVehicleId || !selectedTire) {
      alert("Please select a vehicle and tire")
      return
    }

    const vehicle = vehicles.find((v) => v.id === selectedVehicleId)
    if (!vehicle) return

    const totalCost = selectedTire.price * quantity
    const nextTireChangeKm = vehicle.odometer + 50000

    fleetStorage.updateVehicle(selectedVehicleId, {
      nextTireChangeKm,
    })

    alert(
      `Order placed for ${quantity} ${selectedTire.brand} ${selectedTire.model} tires\nTotal: $${totalCost.toFixed(2)}`,
    )
    setSelectedTire(null)
    setQuantity(4)
    setSelectedVehicleId("")
    setShowOrderForm(false)
  }

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <h1 className="text-3xl font-bold text-white">Tire Management</h1>
            <p className="text-slate-400">Browse and order tires from TireRack</p>
          </div>
        </div>
        <Button onClick={() => setShowOrderForm(true)} className="bg-blue-600 hover:bg-blue-700">
          Order Tires
        </Button>
      </div>

      {showOrderForm && (
        <Card className="border-slate-700 bg-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Order Tires</CardTitle>
            <CardDescription>Select a vehicle and choose tires from TireRack</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOrderTires} className="space-y-6">
              <div>
                <Label className="text-slate-200">Select Vehicle</Label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  required
                  className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded"
                >
                  <option value="">Choose a vehicle</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.year} {v.make} {v.model} ({v.licensePlate})
                    </option>
                  ))}
                </select>
              </div>

              {selectedVehicle && (
                <div className="bg-slate-700 p-4 rounded">
                  <p className="text-slate-300 text-sm">
                    <span className="text-slate-400">Current Odometer:</span>{" "}
                    {selectedVehicle.odometer.toLocaleString()} km
                  </p>
                  <p className="text-slate-300 text-sm">
                    <span className="text-slate-400">Next Tire Change:</span>{" "}
                    {selectedVehicle.nextTireChangeKm.toLocaleString()} km
                  </p>
                </div>
              )}

              <div>
                <Label className="text-slate-200 mb-3 block">Available Tires</Label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {tireOptions.map((tire) => (
                    <label
                      key={tire.id}
                      className={`flex items-center gap-3 p-3 rounded border cursor-pointer transition ${
                        selectedTire?.id === tire.id
                          ? "border-blue-500 bg-blue-900/20"
                          : "border-slate-600 hover:border-slate-500"
                      }`}
                    >
                      <input
                        type="radio"
                        name="tire"
                        checked={selectedTire?.id === tire.id}
                        onChange={() => setSelectedTire(tire)}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-white">
                          {tire.brand} {tire.model}
                        </div>
                        <div className="text-xs text-slate-400">
                          Size: {tire.size} | Rating: {tire.rating}/5 ({tire.reviews} reviews)
                        </div>
                        <div className="text-xs text-slate-400">
                          Treadwear: {tire.treadwear} | Traction: {tire.traction} | Temp: {tire.temperature}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-white">${tire.price}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-slate-200">Quantity</Label>
                <Input
                  type="number"
                  min="1"
                  max="8"
                  value={quantity}
                  onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              {selectedTire && (
                <div className="bg-slate-700 p-4 rounded">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Total Cost:</span>
                    <span className="text-2xl font-bold text-white">${(selectedTire.price * quantity).toFixed(2)}</span>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={!selectedTire}>
                  Place Order
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowOrderForm(false)}
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
        <Card className="border-slate-700 bg-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Available Tires from TireRack</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {tireOptions.map((tire) => (
                <div key={tire.id} className="flex items-center justify-between p-4 border border-slate-700 rounded">
                  <div>
                    <h3 className="font-semibold text-white">
                      {tire.brand} {tire.model}
                    </h3>
                    <p className="text-sm text-slate-400">Size: {tire.size}</p>
                    <div className="flex gap-4 mt-2 text-xs text-slate-400">
                      <span>
                        Rating: {tire.rating}/5 ({tire.reviews} reviews)
                      </span>
                      <span>Treadwear: {tire.treadwear}</span>
                      <span>Traction: {tire.traction}</span>
                      <span>Temp: {tire.temperature}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">${tire.price}</div>
                    <Button
                      onClick={() => {
                        setSelectedTire(tire)
                        setShowOrderForm(true)
                      }}
                      className="mt-2 bg-blue-600 hover:bg-blue-700"
                    >
                      Select
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
