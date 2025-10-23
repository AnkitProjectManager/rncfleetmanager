/**
 * Standardized API response helpers
 */

import { NextResponse } from 'next/server'

export const apiResponse = {
  success: (data: any, meta?: Record<string, any>) => 
    NextResponse.json({ ok: true, data, ...meta }),
  
  error: (message: string, status = 500) => 
    NextResponse.json({ ok: false, error: message }, { status }),
  
  badRequest: (message: string) => 
    NextResponse.json({ ok: false, error: message }, { status: 400 }),
  
  notFound: (message = 'Resource not found') => 
    NextResponse.json({ ok: false, error: message }, { status: 404 }),
}
