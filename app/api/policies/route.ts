import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const policies = [
      {
        id: "pol-1",
        name: "Password Policy",
        type: "security",
        enabled: true,
        rules: [
          { name: "Min Length", value: 12 },
          { name: "Complexity", value: "high" },
        ],
      },
    ]

    return NextResponse.json({ policies })
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

    if (!body.name || !body.type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newPolicy = {
      id: `pol-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(newPolicy, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
