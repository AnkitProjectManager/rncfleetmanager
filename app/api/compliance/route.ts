import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const compliance = {
      frameworks: [
        { name: "CIS", score: 85, status: "compliant" },
        { name: "NIST", score: 78, status: "partial" },
        { name: "PCI-DSS", score: 92, status: "compliant" },
      ],
      overallScore: 85,
      lastAudit: new Date().toISOString(),
    }

    return NextResponse.json(compliance)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
