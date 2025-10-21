"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import BackButton from "@/components/back-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { fleetStorage } from "@/lib/fleet-storage"
import type { ServiceRequest, Vehicle, Service } from "@/lib/fleet-types"
import { Plus } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CreditCard } from "lucide-react"
import Checkout from "@/components/checkout"

export default function QuotationsPage() {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [showNewRequest, setShowNewRequest] = useState(false)
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([])
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [showCustomService, setShowCustomService] = useState(false)
  const [customService, setCustomService] = useState({
    name: "",
    estimatedCost: 0,
    estimatedDurationDays: 1,
  })
  const [showPayment, setShowPayment] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null)

  // Load companyId from localStorage safely on client
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
    setServiceRequests(fleetStorage.getServiceRequests(companyId))
    setVehicles(fleetStorage.getVehicles(companyId))
    setServices(fleetStorage.getServices(companyId))
  }, [companyId])

  const handleAddCustomService = (e: React.FormEvent) => {
    e.preventDefault()

    if (!companyId) return

    const newService: Service = {
      id: `service-custom-${Date.now()}`,
      companyId,
      name: customService.name,
      description: "Custom service",
      estimatedCost: customService.estimatedCost,
      estimatedDurationDays: customService.estimatedDurationDays,
      interval: { type: "days", value: Math.max(1, Number(customService.estimatedDurationDays) || 1) },
    }

    fleetStorage.addService(newService)
    setServices([...services, newService])
    setSelectedServices([...selectedServices, newService.id])
    setCustomService({ name: "", estimatedCost: 0, estimatedDurationDays: 1 })
    setShowCustomService(false)
  }

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedVehicles.length === 0 || selectedServices.length === 0) {
      alert("Please select at least one vehicle and one service")
      return
    }

    const selectedServicesList = services.filter((s) => selectedServices.includes(s.id))
    const totalCost = selectedServicesList.reduce((sum, s) => sum + s.estimatedCost, 0) * selectedVehicles.length
    const maxDuration = Math.max(...selectedServicesList.map((s) => s.estimatedDurationDays))

    if (!companyId) return

    const newRequest: ServiceRequest = {
      id: `request-${Date.now()}`,
      companyId,
      vehicleIds: selectedVehicles,
      serviceIds: selectedServices,
      status: "pending",
      estimatedCompletionDate: new Date(Date.now() + maxDuration * 24 * 60 * 60 * 1000).toISOString(),
      quotedPrice: totalCost,
      createdAt: new Date().toISOString(),
    }

    fleetStorage.addServiceRequest(newRequest)
    setServiceRequests([...serviceRequests, newRequest])
    setSelectedVehicles([])
    setSelectedServices([])
    setShowNewRequest(false)
  }

  const handleApproveQuote = (requestId: string) => {
    fleetStorage.updateServiceRequest(requestId, { status: "approved" })
    setServiceRequests(serviceRequests.map((r) => (r.id === requestId ? { ...r, status: "approved" } : r)))
  }

  const handleCompleteService = (requestId: string, invoiceAmount: number) => {
    fleetStorage.updateServiceRequest(requestId, {
      status: "completed",
      invoiceAmount,
      completedAt: new Date().toISOString(),
    })
    setServiceRequests(
      serviceRequests.map((r) => (r.id === requestId ? { ...r, status: "completed", invoiceAmount } : r)),
    )
  }

  const handlePayForService = (request: ServiceRequest) => {
    setSelectedRequest(request)
    setShowPayment(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <h1 className="text-3xl font-bold text-white">Service Quotations</h1>
            <p className="text-[var(--muted-foreground)]">Request and manage service quotes</p>
          </div>
        </div>
        <Button onClick={() => setShowNewRequest(true)} className="bg-blue-600 hover:bg-blue-700">
          Request Quote
        </Button>
      </div>

      {showNewRequest && (
  <Card className="" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
          <CardHeader>
            <CardTitle className="text-white">Request Service Quote</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateRequest} className="space-y-6">
              <div>
                <Label className="text-[var(--card-foreground)] mb-3 block">Select Vehicles</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {vehicles.map((vehicle) => (
                    <label key={vehicle.id} className="flex items-center gap-2 text-[var(--muted-foreground)]">
                      <input
                        type="checkbox"
                        checked={selectedVehicles.includes(vehicle.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedVehicles([...selectedVehicles, vehicle.id])
                          } else {
                            setSelectedVehicles(selectedVehicles.filter((id) => id !== vehicle.id))
                          }
                        }}
                      />
                      {vehicle.year} {vehicle.make} {vehicle.model} ({vehicle.licensePlate})
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-[var(--card-foreground)]">Select Services</Label>
                  <Button
                    type="button"
                    onClick={() => setShowCustomService(true)}
                    variant="outline"
                    size="sm"
                    className="border-slate-600"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Custom Service
                  </Button>
                </div>

                {showCustomService && (
                  <Card className="border-slate-600 bg-slate-700 mb-4">
                    <CardContent className="pt-4">
                      <form onSubmit={handleAddCustomService} className="space-y-3">
                        <div>
                          <Label className="text-[var(--card-foreground)] text-sm">Service Name</Label>
                          <Input
                            value={customService.name}
                            onChange={(e) => setCustomService({ ...customService, name: e.target.value })}
                            placeholder="e.g., Custom Paint Job"
                            required
                            className="bg-slate-600 border-slate-500 text-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-[var(--card-foreground)] text-sm">Estimated Cost ($)</Label>
                            <Input
                              type="number"
                              value={customService.estimatedCost}
                              onChange={(e) =>
                                setCustomService({ ...customService, estimatedCost: Number.parseFloat(e.target.value) })
                              }
                              required
                              className="bg-slate-600 border-slate-500 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-[var(--card-foreground)] text-sm">Duration (days)</Label>
                            <Input
                              type="number"
                              value={customService.estimatedDurationDays}
                              onChange={(e) =>
                                setCustomService({
                                  ...customService,
                                  estimatedDurationDays: Number.parseInt(e.target.value),
                                })
                              }
                              required
                              className="bg-slate-600 border-slate-500 text-white"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Add Service
                          </Button>
                          <Button
                            type="button"
                            onClick={() => setShowCustomService(false)}
                            variant="outline"
                            size="sm"
                            className="border-slate-500"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {services.map((service) => (
                    <label key={service.id} className="flex items-center gap-2 text-[var(--muted-foreground)]">
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(service.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedServices([...selectedServices, service.id])
                          } else {
                            setSelectedServices(selectedServices.filter((id) => id !== service.id))
                          }
                        }}
                      />
                      <div>
                        <div className="font-medium">{service.name}</div>
                        <div className="text-xs text-slate-400">
                          ${service.estimatedCost} - {service.estimatedDurationDays} day(s)
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Create Quote Request
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowNewRequest(false)}
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
        {serviceRequests.map((request) => {
          const requestVehicles = vehicles.filter((v) => request.vehicleIds.includes(v.id))
          const requestServices = services.filter((s) => request.serviceIds.includes(s.id))

          return (
            <Card key={request.id} className="border-slate-700 bg-slate-800">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Quote #{request.id.slice(-6)}</h3>
                      <p className="text-sm text-slate-400">
                        Created: {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        request.status === "completed"
                          ? "bg-green-900 text-green-200"
                          : request.status === "approved"
                            ? "bg-blue-900 text-blue-200"
                            : "bg-yellow-900 text-yellow-200"
                      }`}
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Vehicles:</span>
                      <div className="text-slate-200 mt-1">
                        {requestVehicles.map((v) => (
                          <div key={v.id}>
                            {v.year} {v.make} {v.model}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Services:</span>
                      <div className="text-slate-200 mt-1">
                        {requestServices.map((s) => (
                          <div key={s.id}>{s.name}</div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Quoted Price:</span>
                      <div className="text-slate-200 font-semibold">${request.quotedPrice}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Est. Completion:</span>
                      <div className="text-slate-200">
                        {new Date(request.estimatedCompletionDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {request.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApproveQuote(request.id)}
                        className="bg-green-600 hover:bg-green-700 flex-1"
                      >
                        Approve Quote
                      </Button>
                      <Button
                        onClick={() => handlePayForService(request)}
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 flex-1"
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pay Now
                      </Button>
                    </div>
                  )}

                  {request.status === "approved" && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          const invoiceAmount = prompt("Enter invoice amount:", request.quotedPrice?.toString())
                          if (invoiceAmount) {
                            handleCompleteService(request.id, Number.parseFloat(invoiceAmount))
                          }
                        }}
                        className="bg-blue-600 hover:bg-blue-700 flex-1"
                      >
                        Mark as Completed
                      </Button>
                      <Button
                        onClick={() => handlePayForService(request)}
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 flex-1"
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pay Now
                      </Button>
                    </div>
                  )}

                  {request.status === "completed" && request.invoiceAmount && (
                    <div className="bg-slate-700 p-3 rounded text-sm">
                      <span className="text-slate-400">Invoice Amount:</span>
                      <div className="text-slate-200 font-semibold">${request.invoiceAmount}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>
              Pay ${selectedRequest?.quotedPrice} for {selectedRequest?.vehicleIds.length} vehicle(s)
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <Checkout
              customService={{
                name: `Service Request #${selectedRequest.id.slice(-6)}`,
                priceInCents: Math.round((selectedRequest.quotedPrice || 0) * 100),
              }}
              quantity={1}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
