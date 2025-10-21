import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, action } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 })
    }

    if (action === "login") {
      // In production, validate against database
      return NextResponse.json({
        user: {
          id: "user-1",
          email,
          role: "admin",
          orgId: "org-1",
        },
        token: `token_${Math.random().toString(36).substr(2, 32)}`,
      })
    }

    if (action === "signup") {
      // In production, create user in database
      return NextResponse.json(
        {
          user: {
            id: `user-${Date.now()}`,
            email,
            role: "admin",
            orgId: `org-${Date.now()}`,
          },
          token: `token_${Math.random().toString(36).substr(2, 32)}`,
        },
        { status: 201 },
      )
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
