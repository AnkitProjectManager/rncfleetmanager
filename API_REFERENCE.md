# RNCFleets API Reference

## Overview

The RNCFleets API provides programmatic access to manage your endpoint management infrastructure. All API requests require authentication using a Bearer token.

## Authentication

All API requests must include an Authorization header with a valid API key:

\`\`\`
Authorization: Bearer rncfleets_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
\`\`\`

### Getting Your API Key

1. Log in to RNCFleets
2. Go to Settings → API & Webhooks
3. Copy your API key
4. Use it in the Authorization header

## Base URL

\`\`\`
https://api.fleet.local/api
\`\`\`

## Rate Limiting

- **Limit**: 1000 requests per hour
- **Headers**:
  - \`X-RateLimit-Limit\`: Total requests allowed
  - \`X-RateLimit-Remaining\`: Requests remaining
  - \`X-RateLimit-Reset\`: Unix timestamp when limit resets

## Error Handling

### Error Response Format

\`\`\`json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
\`\`\`

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| UNAUTHORIZED | 401 | Invalid or missing API key |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 400 | Invalid request parameters |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |

## Endpoints

### Devices

#### List Devices

\`\`\`
GET /devices
\`\`\`

**Query Parameters**:
- \`status\`: Filter by enrollment status (enrolled, pending, unenrolled)
- \`os_type\`: Filter by OS type
- \`compliance_status\`: Filter by compliance status
- \`limit\`: Number of results (default: 50, max: 500)
- \`offset\`: Pagination offset

**Response**:
\`\`\`json
{
  "devices": [
    {
      "id": "dev-1",
      "hostname": "DESKTOP-001",
      "osType": "Windows",
      "osVersion": "11 Pro",
      "enrollmentStatus": "enrolled",
      "complianceStatus": "compliant",
      "lastSeen": "2024-01-20T10:30:00Z"
    }
  ],
  "total": 100,
  "limit": 50,
  "offset": 0
}
\`\`\`

#### Get Device

\`\`\`
GET /devices/{deviceId}
\`\`\`

**Response**:
\`\`\`json
{
  "id": "dev-1",
  "hostname": "DESKTOP-001",
  "osType": "Windows",
  "osVersion": "11 Pro",
  "serialNumber": "SN123456",
  "enrollmentStatus": "enrolled",
  "complianceStatus": "compliant",
  "ipAddress": "192.168.1.100",
  "macAddress": "00:1A:2B:3C:4D:5E",
  "lastSeen": "2024-01-20T10:30:00Z",
  "policies": ["pol-1", "pol-2"],
  "vulnerabilities": []
}
\`\`\`

#### Enroll Device

\`\`\`
POST /devices
\`\`\`

**Request Body**:
\`\`\`json
{
  "hostname": "DESKTOP-001",
  "osType": "Windows",
  "osVersion": "11 Pro",
  "serialNumber": "SN123456"
}
\`\`\`

**Response** (201 Created):
\`\`\`json
{
  "id": "dev-1",
  "hostname": "DESKTOP-001",
  "enrollmentStatus": "pending",
  "enrollmentToken": "token_xxxxx"
}
\`\`\`

### Policies

#### List Policies

\`\`\`
GET /policies
\`\`\`

**Query Parameters**:
- \`type\`: Filter by policy type
- \`enabled\`: Filter by enabled status

**Response**:
\`\`\`json
{
  "policies": [
    {
      "id": "pol-1",
      "name": "Password Policy",
      "type": "security",
      "enabled": true,
      "rules": [],
      "targetDevices": 45,
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}
\`\`\`

#### Create Policy

\`\`\`
POST /policies
\`\`\`

**Request Body**:
\`\`\`json
{
  "name": "Password Policy",
  "description": "Enforce strong passwords",
  "type": "security",
  "rules": [
    {
      "name": "Min Length",
      "condition": "length >= 12",
      "action": "enforce",
      "severity": "high"
    }
  ]
}
\`\`\`

### Incidents

#### List Incidents

\`\`\`
GET /incidents
\`\`\`

**Query Parameters**:
- \`status\`: Filter by status (open, investigating, resolved, closed)
- \`severity\`: Filter by severity
- \`type\`: Filter by incident type

**Response**:
\`\`\`json
{
  "incidents": [
    {
      "id": "inc-1",
      "type": "malware",
      "severity": "critical",
      "status": "open",
      "description": "Suspicious process detected",
      "deviceId": "dev-1",
      "createdAt": "2024-01-20T10:30:00Z"
    }
  ]
}
\`\`\`

#### Report Incident

\`\`\`
POST /incidents
\`\`\`

**Request Body**:
\`\`\`json
{
  "type": "malware",
  "severity": "critical",
  "description": "Suspicious process detected",
  "deviceId": "dev-1"
}
\`\`\`

### Live Queries

#### Execute Query

\`\`\`
POST /queries
\`\`\`

**Request Body**:
\`\`\`json
{
  "query": "SELECT * FROM processes;",
  "targetDevices": ["dev-1", "dev-2"]
}
\`\`\`

**Response** (201 Created):
\`\`\`json
{
  "id": "query-1",
  "query": "SELECT * FROM processes;",
  "status": "pending",
  "targetDevices": ["dev-1", "dev-2"],
  "createdAt": "2024-01-20T10:30:00Z"
}
\`\`\`

#### Get Query Results

\`\`\`
GET /queries/{queryId}
\`\`\`

**Response**:
\`\`\`json
{
  "id": "query-1",
  "query": "SELECT * FROM processes;",
  "status": "completed",
  "results": [
    {
      "hostname": "DESKTOP-001",
      "pid": 1234,
      "name": "explorer.exe"
    }
  ],
  "completedAt": "2024-01-20T10:31:00Z"
}
\`\`\`

### Vulnerabilities

#### List Vulnerabilities

\`\`\`
GET /vulnerabilities
\`\`\`

**Query Parameters**:
- \`severity\`: Filter by severity
- \`status\`: Filter by remediation status

**Response**:
\`\`\`json
{
  "vulnerabilities": [
    {
      "id": "cve-2024-001",
      "cveId": "CVE-2024-1234",
      "title": "Critical RCE",
      "severity": "critical",
      "affectedSoftware": ["Windows 11"],
      "remediationStatus": "unpatched",
      "affectedDevices": 12
    }
  ]
}
\`\`\`

## Webhooks

### Webhook Events

RNCFleets can send webhooks for the following events:

- \`device.enrolled\`: Device enrollment
- \`device.unenrolled\`: Device unenrollment
- \`incident.created\`: New incident
- \`incident.resolved\`: Incident resolved
- \`policy.updated\`: Policy updated
- \`vulnerability.detected\`: New vulnerability

### Webhook Payload

\`\`\`json
{
  "event": "device.enrolled",
  "timestamp": "2024-01-20T10:30:00Z",
  "data": {
    "id": "dev-1",
    "hostname": "DESKTOP-001"
  }
}
\`\`\`

## Examples

### Python

\`\`\`python
import requests

API_KEY = "rncfleets_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
BASE_URL = "https://api.rncfleets.local/api"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

# List devices
response = requests.get(f"{BASE_URL}/devices", headers=headers)
devices = response.json()

# Enroll device
device_data = {
    "hostname": "DESKTOP-001",
    "osType": "Windows",
    "osVersion": "11 Pro",
    "serialNumber": "SN123456"
}
response = requests.post(f"{BASE_URL}/devices", json=device_data, headers=headers)
new_device = response.json()
\`\`\`

### JavaScript

\`\`\`javascript
const API_KEY = "rncfleets_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
const BASE_URL = "https://api.rncfleets.local/api";

const headers = {
  "Authorization": \`Bearer \${API_KEY}\`,
  "Content-Type": "application/json"
};

// List devices
const response = await fetch(\`\${BASE_URL}/devices\`, { headers });
const devices = await response.json();

// Enroll device
const deviceData = {
  hostname: "DESKTOP-001",
  osType: "Windows",
  osVersion: "11 Pro",
  serialNumber: "SN123456"
};

const enrollResponse = await fetch(\`\${BASE_URL}/devices\`, {
  method: "POST",
  headers,
  body: JSON.stringify(deviceData)
});
const newDevice = await enrollResponse.json();
\`\`\`

### cURL

\`\`\`bash
# List devices
curl -H "Authorization: Bearer rncfleets_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \\
  https://api.rncfleets.local/api/devices

# Enroll device
curl -X POST \\
  -H "Authorization: Bearer rncfleets_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "hostname": "DESKTOP-001",
    "osType": "Windows",
    "osVersion": "11 Pro",
    "serialNumber": "SN123456"
  }' \\
  https://api.rncfleets.local/api/devices
\`\`\`

## Support

For API support, email api-support@rncfleets.local or visit https://rncfleets.local/docs
