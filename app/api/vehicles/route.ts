import { NextRequest } from 'next/server'
import { db } from '@/lib/db-helpers'
import { apiResponse } from '@/lib/api-response'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const companyId = request.nextUrl.searchParams.get('company_id')
    
    const vehicles = await db.query(
      `SELECT * FROM vehicles ${companyId ? 'WHERE company_id = ?' : ''} 
       ORDER BY created_at DESC LIMIT 500`,
      companyId ? [companyId] : []
    )

    return apiResponse.success(vehicles, { count: vehicles.length })
  } catch (err: any) {
    console.error('GET /api/vehicles:', err)
    return apiResponse.error(err.message)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { company_id, make, model, year, license_plate } = body

    if (!company_id || !make || !model || !year || !license_plate) {
      return apiResponse.badRequest('Missing required fields: company_id, make, model, year, license_plate')
    }

    const id = db.generateId('vehicle')
    
    await db.insert(
      `INSERT INTO vehicles (
        id, company_id, make, model, year, vin, license_plate,
        odometer, odometer_unit, obd_connected, obd_device_id,
        insurance_expiry_date, registration_expiry_date,
        next_service_date, next_tire_change_km, next_oil_change_date, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        company_id,
        make,
        model,
        year,
        body.vin || null,
        license_plate,
        body.odometer || 0,
        body.odometer_unit || 'km',
        body.obd_connected || false,
        body.obd_device_id || null,
        body.insurance_expiry_date || null,
        body.registration_expiry_date || null,
        body.next_service_date || null,
        body.next_tire_change_km || null,
        body.next_oil_change_date || null,
        body.status || 'active',
      ]
    )

    return apiResponse.success({ id, message: 'Vehicle created' })
  } catch (err: any) {
    console.error('POST /api/vehicles:', err)
    return apiResponse.error(err.message)
  }
}
