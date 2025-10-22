/**
 * RNCFleets Demo Data Seeder
 * 
 * Usage:
 * 1. Open your RNCFleets app in the browser
 * 2. Log in as admin
 * 3. Open browser console (F12 → Console)
 * 4. Copy-paste this entire script
 * 5. Press Enter
 * 
 * This will add 10 sets of realistic data for:
 * - Companies (3 new)
 * - Admins (3 new)
 * - Vehicles (10 per company = 30 total)
 * - Services (10 types)
 * - Maintenance Records (10 per company = 30 total)
 * - Service Requests (10 per company = 30 total)
 * - Service Reminders (10 per company = 30 total)
 */

(function seedDemoData() {
  console.log('🚗 Starting RNCFleets Data Seeder...')

  const timestamp = Date.now()
  
  // Helper to generate random date offset
  const randomDate = (daysOffset = 0, spread = 30) => {
    const days = daysOffset + Math.floor(Math.random() * spread)
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
  }

  // Helper to generate random past date
  const pastDate = (daysAgo = 30, spread = 60) => {
    const days = daysAgo + Math.floor(Math.random() * spread)
    return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
  }

  // Get existing data
  const existingCompanies = JSON.parse(localStorage.getItem('fleet_companies') || '[]')
  const existingAdmins = JSON.parse(localStorage.getItem('fleet_admins') || '[]')
  const existingVehicles = JSON.parse(localStorage.getItem('fleet_vehicles') || '[]')
  const existingServices = JSON.parse(localStorage.getItem('fleet_services') || '[]')
  const existingRecords = JSON.parse(localStorage.getItem('fleet_maintenance_records') || '[]')
  const existingRequests = JSON.parse(localStorage.getItem('fleet_service_requests') || '[]')
  const existingReminders = JSON.parse(localStorage.getItem('fleet_service_reminders') || '[]')

  // ============= COMPANIES =============
  const newCompanies = [
    {
      id: `company-${timestamp}-1`,
      name: 'TransLog Solutions',
      adminId: `admin-${timestamp}-1`,
      subscriptionTier: 'professional',
      createdAt: pastDate(180, 30)
    },
    {
      id: `company-${timestamp}-2`,
      name: 'Metro Delivery Services',
      adminId: `admin-${timestamp}-2`,
      subscriptionTier: 'enterprise',
      createdAt: pastDate(240, 60)
    },
    {
      id: `company-${timestamp}-3`,
      name: 'FastTrack Logistics',
      adminId: `admin-${timestamp}-3`,
      subscriptionTier: 'basic',
      createdAt: pastDate(90, 30)
    }
  ]

  console.log(`✅ Generated ${newCompanies.length} companies`)

  // ============= ADMINS =============
  const newAdmins = [
    {
      id: `admin-${timestamp}-1`,
      email: 'admin@translog.com',
      password: 'admin123',
      name: 'Sarah Johnson',
      role: 'admin',
      companyId: `company-${timestamp}-1`,
      createdAt: pastDate(180, 30)
    },
    {
      id: `admin-${timestamp}-2`,
      email: 'admin@metrodelivery.com',
      password: 'admin123',
      name: 'Mike Chen',
      role: 'admin',
      companyId: `company-${timestamp}-2`,
      createdAt: pastDate(240, 60)
    },
    {
      id: `admin-${timestamp}-3`,
      email: 'admin@fasttrack.com',
      password: 'admin123',
      name: 'Emily Rodriguez',
      role: 'admin',
      companyId: `company-${timestamp}-3`,
      createdAt: pastDate(90, 30)
    }
  ]

  console.log(`✅ Generated ${newAdmins.length} admins`)

  // ============= VEHICLES =============
  const vehicleTemplates = [
    { make: 'Toyota', model: 'Hiace', year: 2022 },
    { make: 'Ford', model: 'Transit', year: 2021 },
    { make: 'Mercedes-Benz', model: 'Sprinter', year: 2023 },
    { make: 'Nissan', model: 'NV3500', year: 2020 },
    { make: 'RAM', model: 'ProMaster', year: 2022 },
    { make: 'Chevrolet', model: 'Express', year: 2021 },
    { make: 'GMC', model: 'Savana', year: 2022 },
    { make: 'Ford', model: 'E-Series', year: 2020 },
    { make: 'Isuzu', model: 'NPR', year: 2023 },
    { make: 'Freightliner', model: 'Sprinter', year: 2021 }
  ]

  const statuses = ['active', 'active', 'active', 'maintenance', 'inactive']
  const newVehicles = []

  newCompanies.forEach((company, companyIdx) => {
    vehicleTemplates.forEach((template, idx) => {
      const baseOdometer = 10000 + Math.floor(Math.random() * 90000)
      const vehicle = {
        id: `vehicle-${timestamp}-${companyIdx}-${idx}`,
        companyId: company.id,
        make: template.make,
        model: template.model,
        year: template.year,
        vin: `VIN${timestamp.toString().slice(-7)}${companyIdx}${idx}`,
        licensePlate: `${String.fromCharCode(65 + companyIdx)}${String.fromCharCode(65 + Math.floor(idx / 10))}${String.fromCharCode(65 + (idx % 10))}-${1000 + companyIdx * 10 + idx}`,
        odometer: baseOdometer,
        odometerUnit: 'km',
        lastOdometerUpdate: pastDate(0, 15),
        obdConnected: Math.random() > 0.3,
        obdDeviceId: Math.random() > 0.3 ? `obd-${timestamp}-${companyIdx}-${idx}` : undefined,
        insuranceExpiryDate: randomDate(30, 180),
        registrationExpiryDate: randomDate(60, 240),
        nextServiceDate: randomDate(10, 45),
        nextTireChangeKm: baseOdometer + 40000 + Math.floor(Math.random() * 20000),
        nextOilChangeDate: randomDate(20, 40),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdAt: pastDate(90, 180)
      }
      newVehicles.push(vehicle)
    })
  })

  console.log(`✅ Generated ${newVehicles.length} vehicles`)

  // ============= SERVICES =============
  const serviceTemplates = [
    {
      name: 'Oil Change',
      description: 'Engine oil and filter replacement',
      estimatedCost: 80,
      estimatedDurationDays: 1,
      interval: { type: 'km', value: 5000 }
    },
    {
      name: 'Tire Rotation',
      description: 'Rotate and balance all tires',
      estimatedCost: 100,
      estimatedDurationDays: 1,
      interval: { type: 'km', value: 10000 }
    },
    {
      name: 'Brake Service',
      description: 'Brake pads, rotors, and fluid inspection',
      estimatedCost: 350,
      estimatedDurationDays: 2,
      interval: { type: 'months', value: 12 }
    },
    {
      name: 'Air Filter Replacement',
      description: 'Engine and cabin air filter replacement',
      estimatedCost: 60,
      estimatedDurationDays: 1,
      interval: { type: 'months', value: 6 }
    },
    {
      name: 'Transmission Service',
      description: 'Transmission fluid and filter change',
      estimatedCost: 250,
      estimatedDurationDays: 2,
      interval: { type: 'km', value: 40000 }
    },
    {
      name: 'Battery Replacement',
      description: 'Battery testing and replacement',
      estimatedCost: 150,
      estimatedDurationDays: 1,
      interval: { type: 'months', value: 36 }
    },
    {
      name: 'Wheel Alignment',
      description: 'Four-wheel alignment and suspension check',
      estimatedCost: 120,
      estimatedDurationDays: 1,
      interval: { type: 'km', value: 15000 }
    },
    {
      name: 'Coolant Flush',
      description: 'Coolant system flush and refill',
      estimatedCost: 130,
      estimatedDurationDays: 1,
      interval: { type: 'months', value: 24 }
    },
    {
      name: 'Spark Plug Replacement',
      description: 'Replace spark plugs and ignition system check',
      estimatedCost: 180,
      estimatedDurationDays: 2,
      interval: { type: 'km', value: 50000 }
    },
    {
      name: 'Timing Belt Replacement',
      description: 'Timing belt and tensioner replacement',
      estimatedCost: 600,
      estimatedDurationDays: 3,
      interval: { type: 'km', value: 100000 }
    }
  ]

  const newServices = []
  newCompanies.forEach((company, companyIdx) => {
    serviceTemplates.forEach((template, idx) => {
      newServices.push({
        id: `service-${timestamp}-${companyIdx}-${idx}`,
        companyId: company.id,
        ...template
      })
    })
  })

  console.log(`✅ Generated ${newServices.length} services`)

  // ============= MAINTENANCE RECORDS =============
  const newRecords = []
  newCompanies.forEach((company, companyIdx) => {
    // Get vehicles for this company
    const companyVehicles = newVehicles.filter(v => v.companyId === company.id)
    
    for (let i = 0; i < 10; i++) {
      const vehicle = companyVehicles[Math.floor(Math.random() * companyVehicles.length)]
      const service = serviceTemplates[Math.floor(Math.random() * serviceTemplates.length)]
      const cost = service.estimatedCost * (0.8 + Math.random() * 0.4) // ±20% variance
      
      newRecords.push({
        id: `record-${timestamp}-${companyIdx}-${i}`,
        companyId: company.id,
        vehicleId: vehicle.id,
        serviceType: service.name,
        odometer: vehicle.odometer - Math.floor(Math.random() * 20000),
        cost: Math.round(cost),
        invoiceAmount: Math.round(cost),
        completionDate: pastDate(15, 90),
        nextServiceDate: randomDate(30, 60),
        notes: `${service.description} - Completed by certified technician`,
        createdAt: pastDate(15, 90)
      })
    }
  })

  console.log(`✅ Generated ${newRecords.length} maintenance records`)

  // ============= SERVICE REQUESTS =============
  const requestStatuses = ['pending', 'approved', 'approved', 'approved', 'completed']
  const newRequests = []
  
  newCompanies.forEach((company, companyIdx) => {
    const companyVehicles = newVehicles.filter(v => v.companyId === company.id)
    const companyServices = newServices.filter(s => s.companyId === company.id)
    
    for (let i = 0; i < 10; i++) {
      const vehicle = companyVehicles[Math.floor(Math.random() * companyVehicles.length)]
      const service = companyServices[Math.floor(Math.random() * companyServices.length)]
      const status = requestStatuses[Math.floor(Math.random() * requestStatuses.length)]
      
      newRequests.push({
        id: `request-${timestamp}-${companyIdx}-${i}`,
        companyId: company.id,
        vehicleId: vehicle.id,
        serviceId: service.id,
        requestedDate: pastDate(5, 30),
        status: status,
        priority: Math.random() > 0.7 ? 'high' : 'normal',
        notes: `${service.name} requested for ${vehicle.make} ${vehicle.model}`,
        createdAt: pastDate(5, 30),
        ...(status === 'approved' && { approvedDate: pastDate(2, 10) }),
        ...(status === 'completed' && { 
          completedDate: pastDate(0, 5),
          actualCost: Math.round(service.estimatedCost * (0.9 + Math.random() * 0.2))
        })
      })
    }
  })

  console.log(`✅ Generated ${newRequests.length} service requests`)

  // ============= SERVICE REMINDERS =============
  const reminderStatuses = ['pending', 'pending', 'pending', 'completed', 'dismissed']
  const newReminders = []
  
  newCompanies.forEach((company, companyIdx) => {
    const companyVehicles = newVehicles.filter(v => v.companyId === company.id)
    const companyServices = newServices.filter(s => s.companyId === company.id)
    
    for (let i = 0; i < 10; i++) {
      const vehicle = companyVehicles[Math.floor(Math.random() * companyVehicles.length)]
      const service = companyServices[Math.floor(Math.random() * companyServices.length)]
      const status = reminderStatuses[Math.floor(Math.random() * reminderStatuses.length)]
      const dueDate = randomDate(-10, 40) // Some overdue, some upcoming
      
      newReminders.push({
        id: `reminder-${timestamp}-${companyIdx}-${i}`,
        companyId: company.id,
        vehicleId: vehicle.id,
        serviceType: service.name,
        dueDate: dueDate,
        status: status,
        message: `${service.name} due for ${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})`,
        createdAt: pastDate(20, 40)
      })
    }
  })

  console.log(`✅ Generated ${newReminders.length} service reminders`)

  // ============= SAVE TO LOCALSTORAGE =============
  const allCompanies = [...existingCompanies, ...newCompanies]
  const allAdmins = [...existingAdmins, ...newAdmins]
  const allVehicles = [...existingVehicles, ...newVehicles]
  const allServices = [...existingServices, ...newServices]
  const allRecords = [...existingRecords, ...newRecords]
  const allRequests = [...existingRequests, ...newRequests]
  const allReminders = [...existingReminders, ...newReminders]

  localStorage.setItem('fleet_companies', JSON.stringify(allCompanies))
  localStorage.setItem('fleet_admins', JSON.stringify(allAdmins))
  localStorage.setItem('fleet_vehicles', JSON.stringify(allVehicles))
  localStorage.setItem('fleet_services', JSON.stringify(allServices))
  localStorage.setItem('fleet_maintenance_records', JSON.stringify(allRecords))
  localStorage.setItem('fleet_service_requests', JSON.stringify(allRequests))
  localStorage.setItem('fleet_service_reminders', JSON.stringify(allReminders))

  console.log('\n🎉 SUCCESS! Demo data seeded:')
  console.log(`   📊 Total Companies: ${allCompanies.length} (+${newCompanies.length})`)
  console.log(`   👤 Total Admins: ${allAdmins.length} (+${newAdmins.length})`)
  console.log(`   🚗 Total Vehicles: ${allVehicles.length} (+${newVehicles.length})`)
  console.log(`   🔧 Total Services: ${allServices.length} (+${newServices.length})`)
  console.log(`   📝 Total Maintenance Records: ${allRecords.length} (+${newRecords.length})`)
  console.log(`   📋 Total Service Requests: ${allRequests.length} (+${newRequests.length})`)
  console.log(`   ⏰ Total Service Reminders: ${allReminders.length} (+${newReminders.length})`)
  console.log('\n✨ Refresh the page to see your new data!')
  console.log('\n📧 New admin logins:')
  newAdmins.forEach(admin => {
    console.log(`   ${admin.email} / admin123`)
  })

})()
