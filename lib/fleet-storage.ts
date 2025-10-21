import type {
  Company,
  Vehicle,
  Service,
  ServiceRequest,
  MaintenanceRecord,
  ServiceReminder,
  Admin,
} from "./fleet-types"

const STORAGE_KEYS = {
  COMPANIES: "fleet_companies",
  VEHICLES: "fleet_vehicles",
  SERVICES: "fleet_services",
  SERVICE_REQUESTS: "fleet_service_requests",
  MAINTENANCE_RECORDS: "fleet_maintenance_records",
  TIRE_OPTIONS: "fleet_tire_options",
  SERVICE_REMINDERS: "fleet_service_reminders",
  ADMINS: "fleet_admins",
}

export const fleetStorage = {
  // Company Management
  getCompanies: (): Company[] => {
    if (typeof window === "undefined") return []
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.COMPANIES) || "[]")
  },

  addCompany: (company: Company) => {
    if (typeof window === "undefined") return
    const companies = fleetStorage.getCompanies()
    companies.push(company)
    localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies))
  },

  getCompanyById: (id: string): Company | undefined => {
    return fleetStorage.getCompanies().find((c) => c.id === id)
  },

  // Vehicle Management
  getVehicles: (companyId?: string): Vehicle[] => {
    if (typeof window === "undefined") return []
    const vehicles = JSON.parse(localStorage.getItem(STORAGE_KEYS.VEHICLES) || "[]")
    return companyId ? vehicles.filter((v: Vehicle) => v.companyId === companyId) : vehicles
  },

  addVehicle: (vehicle: Vehicle) => {
    if (typeof window === "undefined") return
    const vehicles = fleetStorage.getVehicles()
    vehicles.push(vehicle)
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles))
  },

  bulkAddVehicles: (vehicles: Vehicle[]) => {
    if (typeof window === "undefined") return
    const existing = fleetStorage.getVehicles()
    existing.push(...vehicles)
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(existing))
  },

  updateVehicle: (id: string, updates: Partial<Vehicle>) => {
    if (typeof window === "undefined") return
    const vehicles = fleetStorage.getVehicles()
    const index = vehicles.findIndex((v) => v.id === id)
    if (index !== -1) {
      vehicles[index] = { ...vehicles[index], ...updates }
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles))
    }
  },

  getVehicleById: (id: string): Vehicle | undefined => {
    return fleetStorage.getVehicles().find((v) => v.id === id)
  },

  // Service Management
  getServices: (companyId?: string): Service[] => {
    if (typeof window === "undefined") return []
    const services = JSON.parse(localStorage.getItem(STORAGE_KEYS.SERVICES) || "[]")
    return companyId ? services.filter((s: Service) => s.companyId === companyId) : services
  },

  addService: (service: Service) => {
    if (typeof window === "undefined") return
    const services = fleetStorage.getServices()
    services.push(service)
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services))
  },

  // Service Requests
  getServiceRequests: (companyId?: string): ServiceRequest[] => {
    if (typeof window === "undefined") return []
    const requests = JSON.parse(localStorage.getItem(STORAGE_KEYS.SERVICE_REQUESTS) || "[]")
    return companyId ? requests.filter((r: ServiceRequest) => r.companyId === companyId) : requests
  },

  addServiceRequest: (request: ServiceRequest) => {
    if (typeof window === "undefined") return
    const requests = fleetStorage.getServiceRequests()
    requests.push(request)
    localStorage.setItem(STORAGE_KEYS.SERVICE_REQUESTS, JSON.stringify(requests))
  },

  updateServiceRequest: (id: string, updates: Partial<ServiceRequest>) => {
    if (typeof window === "undefined") return
    const requests = fleetStorage.getServiceRequests()
    const index = requests.findIndex((r) => r.id === id)
    if (index !== -1) {
      requests[index] = { ...requests[index], ...updates }
      localStorage.setItem(STORAGE_KEYS.SERVICE_REQUESTS, JSON.stringify(requests))
    }
  },

  // Maintenance Records
  getMaintenanceRecords: (companyId?: string, vehicleId?: string): MaintenanceRecord[] => {
    if (typeof window === "undefined") return []
    const records = JSON.parse(localStorage.getItem(STORAGE_KEYS.MAINTENANCE_RECORDS) || "[]")
    return records.filter(
      (r: MaintenanceRecord) => (!companyId || r.companyId === companyId) && (!vehicleId || r.vehicleId === vehicleId),
    )
  },

  addMaintenanceRecord: (record: MaintenanceRecord) => {
    if (typeof window === "undefined") return
    const records = fleetStorage.getMaintenanceRecords()
    records.push(record)
    localStorage.setItem(STORAGE_KEYS.MAINTENANCE_RECORDS, JSON.stringify(records))
  },

  // Service Reminders
  getServiceReminders: (companyId?: string): ServiceReminder[] => {
    if (typeof window === "undefined") return []
    const reminders = JSON.parse(localStorage.getItem(STORAGE_KEYS.SERVICE_REMINDERS) || "[]")
    return companyId ? reminders.filter((r: ServiceReminder) => r.companyId === companyId) : reminders
  },

  addServiceReminder: (reminder: ServiceReminder) => {
    if (typeof window === "undefined") return
    const reminders = fleetStorage.getServiceReminders()
    reminders.push(reminder)
    localStorage.setItem(STORAGE_KEYS.SERVICE_REMINDERS, JSON.stringify(reminders))
  },

  // Admin Management
  getAdmins: (): Admin[] => {
    if (typeof window === "undefined") return []
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMINS) || "[]")
  },

  addAdmin: (admin: Admin) => {
    if (typeof window === "undefined") return
    const admins = fleetStorage.getAdmins()
    admins.push(admin)
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(admins))
  },

  getAdminByEmail: (email: string): Admin | undefined => {
    return fleetStorage.getAdmins().find((a) => a.email === email)
  },

  // Initialize demo data
  initializeDemoData: () => {
    if (typeof window === "undefined") return

    const existingCompanies = fleetStorage.getCompanies()
    if (existingCompanies.length > 0) return

    // Create demo superadmin
    const superadmin: Admin = {
      id: "admin-super-1",
      email: "superadmin@rncfleets.com",
      password: "admin123",
      name: "Super Admin",
      role: "superadmin",
      createdAt: new Date().toISOString(),
    }

    // Create demo companies
    const company1: Company = {
      id: "company-1",
      name: "ABC Fleet Services",
      adminId: "admin-1",
      subscriptionTier: "professional",
      createdAt: new Date().toISOString(),
    }

    const company2: Company = {
      id: "company-2",
      name: "XYZ Logistics",
      adminId: "admin-2",
      subscriptionTier: "enterprise",
      createdAt: new Date().toISOString(),
    }

    // Create demo admins for each company
    const admin1: Admin = {
      id: "admin-1",
      email: "admin@abcrncfleets.com",
      password: "admin123",
      name: "John Admin",
      role: "admin",
      companyId: "company-1",
      createdAt: new Date().toISOString(),
    }

    const admin2: Admin = {
      id: "admin-2",
      email: "admin@xyzlogistics.com",
      password: "admin123",
      name: "Jane Admin",
      role: "admin",
      companyId: "company-2",
      createdAt: new Date().toISOString(),
    }

    // Create demo vehicles
    const vehicles: Vehicle[] = [
      {
        id: "vehicle-1",
        companyId: "company-1",
        make: "Toyota",
        model: "Hiace",
        year: 2022,
        vin: "JTDKN3EU5L0123456",
        licensePlate: "ABC-1234",
        odometer: 45000,
        odometerUnit: "km",
        lastOdometerUpdate: new Date().toISOString(),
        obdConnected: true,
        obdDeviceId: "obd-001",
        insuranceExpiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
        registrationExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        nextServiceDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        nextTireChangeKm: 50000,
        nextOilChangeDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active",
        createdAt: new Date().toISOString(),
      },
      {
        id: "vehicle-2",
        companyId: "company-1",
        make: "Ford",
        model: "Transit",
        year: 2021,
        vin: "WFOZZ9FS5LCK12345",
        licensePlate: "ABC-5678",
        odometer: 62000,
        odometerUnit: "km",
        lastOdometerUpdate: new Date().toISOString(),
        obdConnected: false,
        insuranceExpiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        registrationExpiryDate: new Date(Date.now() + 200 * 24 * 60 * 60 * 1000).toISOString(),
        nextServiceDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        nextTireChangeKm: 65000,
        nextOilChangeDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active",
        createdAt: new Date().toISOString(),
      },
    ]

    // Create demo services
    const services: Service[] = [
      {
        id: "service-1",
        companyId: "company-1",
        name: "Regular Maintenance",
        description: "Oil change, filter replacement, fluid check",
        estimatedCost: 150,
        estimatedDurationDays: 1,
        interval: { type: "km", value: 5000 },
      },
      {
        id: "service-2",
        companyId: "company-1",
        name: "Tire Rotation",
        description: "Rotate and balance tires",
        estimatedCost: 100,
        estimatedDurationDays: 1,
        interval: { type: "km", value: 10000 },
      },
      {
        id: "service-3",
        companyId: "company-1",
        name: "Brake Inspection",
        description: "Full brake system inspection and service",
        estimatedCost: 200,
        estimatedDurationDays: 2,
        interval: { type: "months", value: 12 },
      },
    ]

    // Create demo maintenance records
    const maintenanceRecords: MaintenanceRecord[] = [
      {
        id: "record-1",
        companyId: "company-1",
        vehicleId: "vehicle-1",
        serviceType: "Regular Maintenance",
        odometer: 40000,
        cost: 150,
        invoiceAmount: 150,
        completionDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        nextServiceDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        notes: "Oil changed, filters replaced",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]

    // Save all demo data
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify([superadmin, admin1, admin2]))
    localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify([company1, company2]))
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles))
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services))
    localStorage.setItem(STORAGE_KEYS.MAINTENANCE_RECORDS, JSON.stringify(maintenanceRecords))
  },
}
