import { NextRequest } from 'next/server'
import { db } from '@/lib/db-helpers'
import { apiResponse } from '@/lib/api-response'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const companies = await db.query(
      'SELECT * FROM companies ORDER BY created_at DESC'
    )
    return apiResponse.success(companies, { count: companies.length })
  } catch (err: any) {
    console.error('GET /api/companies:', err)
    return apiResponse.error(err.message)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, admin_id, subscription_tier = 'basic' } = await request.json()

    if (!name || !admin_id) {
      return apiResponse.badRequest('Missing required fields: name, admin_id')
    }

    const id = db.generateId('company')
    
    await db.insert(
      'INSERT INTO companies (id, name, admin_id, subscription_tier) VALUES (?, ?, ?, ?)',
      [id, name, admin_id, subscription_tier]
    )

    return apiResponse.success({ id, message: 'Company created' })
  } catch (err: any) {
    console.error('POST /api/companies:', err)
    return apiResponse.error(err.message)
  }
}
