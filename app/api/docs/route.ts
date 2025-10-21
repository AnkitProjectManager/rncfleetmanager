import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const apiDocs = {
  title: "RNCFleets API Documentation",
    version: "1.0.0",
  baseUrl: "https://api.rncfleets.local",
    authentication: {
      type: "Bearer Token",
      header: "Authorization: Bearer YOUR_API_KEY",
      description: "All API requests require a valid API key in the Authorization header",
    },
    endpoints: [
      {
        path: "/api/devices",
        method: "GET",
        description: "List all devices in your organization",
        authentication: true,
        response: {
          devices: [
            {
              id: "dev-1",
              hostname: "DESKTOP-001",
              osType: "Windows",
              osVersion: "11 Pro",
              enrollmentStatus: "enrolled",
              complianceStatus: "compliant",
            },
          ],
        },
      },
      {
        path: "/api/devices",
        method: "POST",
        description: "Enroll a new device",
        authentication: true,
        body: {
          hostname: "string",
          osType: "Windows|macOS|Linux|iOS|Android|ChromeOS",
          osVersion: "string",
          serialNumber: "string",
        },
      },
      {
        path: "/api/policies",
        method: "GET",
        description: "List all security policies",
        authentication: true,
      },
      {
        path: "/api/policies",
        method: "POST",
        description: "Create a new policy",
        authentication: true,
        body: {
          name: "string",
          description: "string",
          type: "security|compliance|deployment|configuration",
          rules: "array",
        },
      },
      {
        path: "/api/incidents",
        method: "GET",
        description: "List all security incidents",
        authentication: true,
      },
      {
        path: "/api/incidents",
        method: "POST",
        description: "Report a new incident",
        authentication: true,
        body: {
          type: "malware|policy-violation|unauthorized-access|data-exfiltration",
          severity: "critical|high|medium|low",
          description: "string",
        },
      },
      {
        path: "/api/queries",
        method: "GET",
        description: "List all live queries",
        authentication: true,
      },
      {
        path: "/api/queries",
        method: "POST",
        description: "Execute a live query",
        authentication: true,
        body: {
          query: "string (osquery SQL)",
          targetDevices: "array of device IDs",
        },
      },
    ],
    errorCodes: {
      400: "Bad Request - Invalid parameters",
      401: "Unauthorized - Missing or invalid API key",
      403: "Forbidden - Insufficient permissions",
      404: "Not Found - Resource does not exist",
      500: "Internal Server Error",
    },
    rateLimit: {
      requests: 1000,
      period: "1 hour",
      headers: {
        "X-RateLimit-Limit": "1000",
        "X-RateLimit-Remaining": "999",
        "X-RateLimit-Reset": "1234567890",
      },
    },
  }

  return NextResponse.json(apiDocs)
}
