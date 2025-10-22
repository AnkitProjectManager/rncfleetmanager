/**
 * Vehicles API Route
 * 
 * GET /api/vehicles - Fetch all vehicles (optionally filter by company_id)
 * POST /api/vehicles - Create a new vehicle
 */

import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import type { ResultSetHeader, RowDataPacket } from 'mysql2'

export const dynamic = 'force-dynamic'

// GET /api/vehicles?company_id=xxx
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const companyId = searchParams.get('company_id')

    let query = `
      SELECT 
        id, company_id, make, model, year, vin, license_plate, 
        odometer, odometer_unit, obd_connected, obd_device_id,
        insurance_expiry_date, registration_expiry_date, 
        next_service_date, next_tire_change_km, next_oil_change_date,
        status, created_at, updated_at
      FROM vehicles
    `
    const params: any[] = []

    if (companyId) {
      query += ' WHERE company_id = ?'
      params.push(companyId)
    }

    query += ' ORDER BY created_at DESC LIMIT 500'

    const [rows] = await pool.query<RowDataPacket[]>(query, params)

    return NextResponse.json({ 
      ok: true, 
      data: rows,
      count: rows.length 
    })
  } catch (err: any) {
    console.error('GET /api/vehicles error:', err)
    return NextResponse.json(
      { ok: false, error: err.message }, 
      { status: 500 }
    )
  }
}

// POST /api/vehicles
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      company_id,
      make,
      model,
      year,
      vin,
      license_plate,
      odometer = 0,
      odometer_unit = 'km',
      obd_connected = false,
      obd_device_id,
      insurance_expiry_date,
      registration_expiry_date,
      next_service_date,
      next_tire_change_km,
      next_oil_change_date,
      status = 'active',
    } = body

    // Validate required fields
    if (!company_id || !make || !model || !year || !license_plate) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields: company_id, make, model, year, license_plate' },
        { status: 400 }
      )
    }

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO vehicles (
        id, company_id, make, model, year, vin, license_plate,
        odometer, odometer_unit, obd_connected, obd_device_id,
        insurance_expiry_date, registration_expiry_date,
        next_service_date, next_tire_change_km, next_oil_change_date,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        `vehicle-${Date.now()}`,
        company_id,
        make,
        model,
        year,
        vin,
        license_plate,
        odometer,
        odometer_unit,
        obd_connected,
        obd_device_id,
        insurance_expiry_date,
        registration_expiry_date,
        next_service_date,
        next_tire_change_km,
        next_oil_change_date,
        status,
      ]
    )

    return NextResponse.json({ 
      ok: true, 
      id: result.insertId,
      message: 'Vehicle created successfully' 
    })
  } catch (err: any) {
    console.error('POST /api/vehicles error:', err)
    return NextResponse.json(
      { ok: false, error: err.message }, 
      { status: 500 }
    )
  }
}
