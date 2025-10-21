import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const vulnerabilities = [
      {
        id: "cve-2024-001",
        cveId: "CVE-2024-1234",
        title: "Critical RCE in Windows Kernel",
        severity: "critical",
        description: "Remote code execution vulnerability",
        affectedSoftware: ["Windows 11", "Windows 10"],
        discoveredAt: new Date().toISOString(),
        remediationStatus: "unpatched",
      },
    ]

    return NextResponse.json({ vulnerabilities })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
