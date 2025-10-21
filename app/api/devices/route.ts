import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // In production, validate API key against database
    const apiKey = authHeader.substring(7)

    // Mock response - in production, fetch from database
    const devices = [
      {
        id: "dev-1",
        hostname: "DESKTOP-ADMIN-01",
        osType: "Windows",
        osVersion: "11 Pro",
        enrollmentStatus: "enrolled",
        complianceStatus: "compliant",
      },
    ]

    return NextResponse.json({ devices })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate required fields
    if (!body.hostname || !body.osType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In production, save to database
    const newDevice = {
      id: `dev-${Date.now()}`,
      ...body,
      enrollmentStatus: "pending",
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(newDevice, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
