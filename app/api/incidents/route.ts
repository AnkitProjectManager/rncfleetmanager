import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const incidents = [
      {
        id: "inc-1",
        type: "malware",
        severity: "critical",
        status: "open",
        description: "Suspicious process detected",
        createdAt: new Date().toISOString(),
      },
    ]

    return NextResponse.json({ incidents })
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

    if (!body.type || !body.severity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newIncident = {
      id: `inc-${Date.now()}`,
      ...body,
      status: "open",
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(newIncident, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
