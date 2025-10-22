/**
 * Admins API Route
 * 
 * GET /api/admins - Fetch all admins (optionally filter by company_id)
 * POST /api/admins - Create a new admin
 */

import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import type { ResultSetHeader, RowDataPacket } from 'mysql2'

export const dynamic = 'force-dynamic'

// GET /api/admins?company_id=xxx
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const companyId = searchParams.get('company_id')

    let query = `
      SELECT 
        id, email, name, role, company_id, created_at, updated_at
      FROM admins
    `
    const params: any[] = []

    if (companyId) {
      query += ' WHERE company_id = ?'
      params.push(companyId)
    }

    query += ' ORDER BY created_at DESC'

    const [rows] = await pool.query<RowDataPacket[]>(query, params)

    return NextResponse.json({ 
      ok: true, 
      data: rows,
      count: rows.length 
    })
  } catch (err: any) {
    console.error('GET /api/admins error:', err)
    return NextResponse.json(
      { ok: false, error: err.message }, 
      { status: 500 }
    )
  }
}

// POST /api/admins
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      email, 
      password, 
      name, 
      role = 'admin', 
      company_id 
    } = body

    if (!email || !password || !name) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields: email, password, name' },
        { status: 400 }
      )
    }

    // In production, hash the password before storing!
    // const hashedPassword = await bcrypt.hash(password, 10)

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO admins (id, email, password, name, role, company_id) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        `admin-${Date.now()}`,
        email,
        password, // TODO: Hash this in production!
        name,
        role,
        company_id
      ]
    )

    return NextResponse.json({ 
      ok: true, 
      id: result.insertId,
      message: 'Admin created successfully' 
    })
  } catch (err: any) {
    console.error('POST /api/admins error:', err)
    return NextResponse.json(
      { ok: false, error: err.message }, 
      { status: 500 }
    )
  }
}
