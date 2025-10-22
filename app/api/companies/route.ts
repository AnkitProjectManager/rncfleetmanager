/**
 * Companies API Route
 * 
 * GET /api/companies - Fetch all companies
 * POST /api/companies - Create a new company
 */

import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import type { ResultSetHeader, RowDataPacket } from 'mysql2'

export const dynamic = 'force-dynamic'

// GET /api/companies
export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
        id, name, admin_id, subscription_tier, created_at, updated_at
      FROM companies
      ORDER BY created_at DESC`
    )

    return NextResponse.json({ 
      ok: true, 
      data: rows,
      count: rows.length 
    })
  } catch (err: any) {
    console.error('GET /api/companies error:', err)
    return NextResponse.json(
      { ok: false, error: err.message }, 
      { status: 500 }
    )
  }
}

// POST /api/companies
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, admin_id, subscription_tier = 'basic' } = body

    if (!name || !admin_id) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields: name, admin_id' },
        { status: 400 }
      )
    }

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO companies (id, name, admin_id, subscription_tier) 
       VALUES (?, ?, ?, ?)`,
      [`company-${Date.now()}`, name, admin_id, subscription_tier]
    )

    return NextResponse.json({ 
      ok: true, 
      id: result.insertId,
      message: 'Company created successfully' 
    })
  } catch (err: any) {
    console.error('POST /api/companies error:', err)
    return NextResponse.json(
      { ok: false, error: err.message }, 
      { status: 500 }
    )
  }
}
