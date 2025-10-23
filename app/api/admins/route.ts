import { NextRequest } from 'next/server'
import { db } from '@/lib/db-helpers'
import { apiResponse } from '@/lib/api-response'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const companyId = request.nextUrl.searchParams.get('company_id')
    
    const admins = await db.query(
      `SELECT id, email, name, role, company_id, created_at, updated_at 
       FROM admins ${companyId ? 'WHERE company_id = ?' : ''} 
       ORDER BY created_at DESC`,
      companyId ? [companyId] : []
    )

    return apiResponse.success(admins, { count: admins.length })
  } catch (err: any) {
    console.error('GET /api/admins:', err)
    return apiResponse.error(err.message)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role = 'admin', company_id } = await request.json()

    if (!email || !password || !name) {
      return apiResponse.badRequest('Missing required fields: email, password, name')
    }

    // TODO: Hash password in production using bcrypt
    // const hashedPassword = await bcrypt.hash(password, 10)

    const id = db.generateId('admin')
    
    await db.insert(
      'INSERT INTO admins (id, email, password, name, role, company_id) VALUES (?, ?, ?, ?, ?, ?)',
      [id, email, password, name, role, company_id]
    )

    return apiResponse.success({ id, message: 'Admin created' })
  } catch (err: any) {
    console.error('POST /api/admins:', err)
    return apiResponse.error(err.message)
  }
}
