"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import BackButton from "@/components/back-button"
import { Card, CardContent } from "@/components/ui/card"
import { fleetStorage } from "@/lib/fleet-storage"
import type { ServiceReminder, Vehicle } from "@/lib/fleet-types"

export default function RemindersPage() {
  const [reminders, setReminders] = useState<ServiceReminder[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])

  const [companyId, setCompanyId] = useState<string | null>(null)

  // Safely read from localStorage on the client to get companyId
  useEffect(() => {
    const adminStr = typeof window !== "undefined" ? localStorage.getItem("fleet_admin") : null
    if (adminStr) {
      try {
        const admin = JSON.parse(adminStr)
        if (admin?.companyId) setCompanyId(admin.companyId as string)
      } catch {
        // no-op if parse fails
      }
    }
  }, [])

  useEffect(() => {
    if (!companyId) return
    const allReminders = fleetStorage.getServiceReminders(companyId)
    const allVehicles = fleetStorage.getVehicles(companyId)
    setReminders(allReminders)
    setVehicles(allVehicles)

    // Generate reminders based on vehicle dates, then refresh from storage
    generateReminders(allVehicles, allReminders, companyId)
    const updated = fleetStorage.getServiceReminders(companyId)
    setReminders(updated)
  }, [companyId])

  const generateReminders = (allVehicles: Vehicle[], currentReminders: ServiceReminder[], cid: string) => {
    const now = new Date()
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    allVehicles.forEach((vehicle) => {
      // Service reminder
      if (new Date(vehicle.nextServiceDate) <= thirtyDaysFromNow) {
        const existingReminder = currentReminders.find(
          (r) => r.vehicleId === vehicle.id && r.reminderType === "service" && r.status === "pending",
        )
        if (!existingReminder) {
          const reminder: ServiceReminder = {
            id: `reminder-${Date.now()}-${vehicle.id}`,
            companyId: cid,
            vehicleId: vehicle.id,
            reminderType: "service",
            dueDate: vehicle.nextServiceDate,
            status: "pending",
            createdAt: new Date().toISOString(),
          }
          fleetStorage.addServiceReminder(reminder)
        }
      }

      // Insurance expiry reminder
      if (new Date(vehicle.insuranceExpiryDate) <= thirtyDaysFromNow) {
        const existingReminder = currentReminders.find(
          (r) => r.vehicleId === vehicle.id && r.reminderType === "insurance" && r.status === "pending",
        )
        if (!existingReminder) {
          const reminder: ServiceReminder = {
            id: `reminder-${Date.now()}-${vehicle.id}-ins`,
            companyId: cid,
            vehicleId: vehicle.id,
            reminderType: "insurance",
            dueDate: vehicle.insuranceExpiryDate,
            status: "pending",
            createdAt: new Date().toISOString(),
          }
          fleetStorage.addServiceReminder(reminder)
        }
      }

      // Oil change reminder
      if (new Date(vehicle.nextOilChangeDate) <= thirtyDaysFromNow) {
        const existingReminder = currentReminders.find(
          (r) => r.vehicleId === vehicle.id && r.reminderType === "oil-change" && r.status === "pending",
        )
        if (!existingReminder) {
          const reminder: ServiceReminder = {
            id: `reminder-${Date.now()}-${vehicle.id}-oil`,
            companyId: cid,
            vehicleId: vehicle.id,
            reminderType: "oil-change",
            dueDate: vehicle.nextOilChangeDate,
            status: "pending",
            createdAt: new Date().toISOString(),
          }
          fleetStorage.addServiceReminder(reminder)
        }
      }
    })
  }

  const getVehicleInfo = (vehicleId: string) => {
    return vehicles.find((v) => v.id === vehicleId)
  }

  const getReminderIcon = (type: string) => {
    switch (type) {
      case "service":
        return "🔧"
      case "insurance":
        return "📋"
      case "registration":
        return "📝"
      case "tire-change":
        return "🛞"
      case "oil-change":
        return "🛢️"
      default:
        return "⏰"
    }
  }

  const getReminderColor = (type: string) => {
    switch (type) {
      case "service":
        return "bg-blue-900 text-blue-200"
      case "insurance":
        return "bg-yellow-900 text-yellow-200"
      case "registration":
        return "bg-purple-900 text-purple-200"
      case "tire-change":
        return "bg-orange-900 text-orange-200"
      case "oil-change":
        return "bg-red-900 text-red-200"
      default:
        return "bg-slate-700 text-slate-200"
    }
  }

  const handleAcknowledge = (reminderId: string) => {
    const reminder = reminders.find((r) => r.id === reminderId)
    if (reminder) {
      const updatedReminder = { ...reminder, status: "acknowledged" as const }
      fleetStorage.addServiceReminder(updatedReminder)
      setReminders(reminders.map((r) => (r.id === reminderId ? updatedReminder : r)))
    }
  }

  const pendingReminders = reminders.filter((r) => r.status === "pending")
  const acknowledgedReminders = reminders.filter((r) => r.status === "acknowledged")

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BackButton />
        <div>
          <h1 className="text-3xl font-bold text-[var(--card-foreground)]">Service Reminders</h1>
          <p className="text-[var(--muted-foreground)]">Stay on top of vehicle maintenance and renewals</p>
        </div>
      </div>

      {pendingReminders.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-[var(--card-foreground)] mb-4">Pending Reminders ({pendingReminders.length})</h2>
          <div className="grid gap-4">
            {pendingReminders.map((reminder) => {
              const vehicle = getVehicleInfo(reminder.vehicleId)
              const daysUntilDue = Math.ceil(
                (new Date(reminder.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
              )

                return (
                <Card key={reminder.id} className="" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="text-3xl">{getReminderIcon(reminder.reminderType)}</div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-[var(--card-foreground)] capitalize">
                            {reminder.reminderType.replace("-", " ")} Reminder
                          </h3>
                          <p className="text-[var(--muted-foreground)]">
                            {vehicle?.year} {vehicle?.make} {vehicle?.model} ({vehicle?.licensePlate})
                          </p>
                          <div className="flex gap-4 mt-2 text-sm text-[var(--muted-foreground)]">
                            <span>Due: {new Date(reminder.dueDate).toLocaleDateString()}</span>
                            <span
                              className={`font-semibold ${daysUntilDue <= 7 ? "text-[var(--destructive)]" : daysUntilDue <= 14 ? "text-[var(--chart-3)]" : "text-[var(--chart-2)]"}`}
                            >
                              {daysUntilDue} days remaining
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span
                          className={`px-3 py-1 rounded text-sm font-medium ${getReminderColor(reminder.reminderType)}`}
                        >
                          {reminder.reminderType.replace("-", " ")}
                        </span>
                        <Button
                          onClick={() => handleAcknowledge(reminder.id)}
                          className="bg-[var(--chart-2)] hover:brightness-95 text-sm"
                        >
                          Acknowledge
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {acknowledgedReminders.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">
            Acknowledged Reminders ({acknowledgedReminders.length})
          </h2>
          <div className="grid gap-4">
            {acknowledgedReminders.map((reminder) => {
              const vehicle = getVehicleInfo(reminder.vehicleId)

              return (
                <Card key={reminder.id} className="border-slate-700 bg-slate-800 opacity-75">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="text-3xl opacity-50">{getReminderIcon(reminder.reminderType)}</div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-400 capitalize">
                            {reminder.reminderType.replace("-", " ")} Reminder
                          </h3>
                          <p className="text-slate-400">
                            {vehicle?.year} {vehicle?.make} {vehicle?.model} ({vehicle?.licensePlate})
                          </p>
                          <div className="flex gap-4 mt-2 text-sm text-slate-500">
                            <span>Due: {new Date(reminder.dueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded text-sm font-medium bg-green-900 text-green-200">
                        Acknowledged
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {reminders.length === 0 && (
        <Card className="border-slate-700 bg-slate-800">
          <CardContent className="pt-6 text-center">
            <p className="text-slate-400">No reminders at this time. All vehicles are up to date!</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
