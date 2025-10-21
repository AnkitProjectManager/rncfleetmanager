import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const queries = [
      {
        id: "query-1",
        query: "SELECT * FROM processes;",
        status: "completed",
        results: [{ hostname: "DESKTOP-001", pid: 1234, name: "explorer.exe" }],
      },
    ]

    return NextResponse.json({ queries })
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

    if (!body.query) {
      return NextResponse.json({ error: "Missing query field" }, { status: 400 })
    }

    const newQuery = {
      id: `query-${Date.now()}`,
      ...body,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(newQuery, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
