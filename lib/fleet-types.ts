export interface Company {
  id: string
  name: string
  adminId: string
  createdAt: string
  subscriptionTier: "basic" | "professional" | "enterprise"
}

export interface Vehicle {
  id: string
  companyId: string
  make: string
  model: string
  year: number
  vin: string
  licensePlate: string
  odometer: number
  odometerUnit: "km" | "miles"
  lastOdometerUpdate: string
  obdConnected: boolean
  obdDeviceId?: string
  insuranceExpiryDate: string
  registrationExpiryDate: string
  nextServiceDate: string
  nextTireChangeKm: number
  nextOilChangeDate: string
  status: "active" | "inactive" | "maintenance"
  createdAt: string
}

export interface Service {
  id: string
  companyId: string
  name: string
  description: string
  estimatedCost: number
  estimatedDurationDays: number
  interval: {
    type: "km" | "months" | "days"
    value: number
  }
}

export interface ServiceRequest {
  id: string
  companyId: string
  vehicleIds: string[]
  serviceIds: string[]
  status: "pending" | "quoted" | "approved" | "in-progress" | "completed"
  estimatedCompletionDate: string
  quotedPrice?: number
  invoiceAmount?: number
  createdAt: string
  completedAt?: string
}

export interface MaintenanceRecord {
  id: string
  companyId: string
  vehicleId: string
  serviceType: string
  odometer: number
  cost: number
  invoiceAmount: number
  completionDate: string
  nextServiceDate: string
  notes: string
  createdAt: string
}

export interface TireOption {
  id: string
  brand: string
  model: string
  size: string
  price: number
  rating: number
  reviews: number
  treadwear: number
  traction: string
  temperature: string
}

export interface ServiceReminder {
  id: string
  companyId: string
  vehicleId: string
  reminderType: "service" | "insurance" | "registration" | "tire-change" | "oil-change"
  dueDate: string
  status: "pending" | "sent" | "acknowledged"
  createdAt: string
}

export interface Admin {
  id: string
  email: string
  password: string
  name: string
  role: "superadmin" | "admin"
  companyId?: string
  createdAt: string
}
