export interface Organization {
  id: string
  name: string
  createdAt: string
  settings?: {
    ssoEnabled?: boolean
    mfaRequired?: boolean
  }
}

export interface User {
  id: string
  email: string
  password: string
  orgId: string
  role: "admin" | "manager" | "user" | "viewer"
  name: string
  createdAt: string
}

export interface Device {
  id: string
  orgId: string
  hostname: string
  osType: "macOS" | "Windows" | "Linux" | "iOS" | "Android" | "ChromeOS"
  osVersion: string
  serialNumber: string
  enrollmentStatus: "pending" | "enrolled" | "unenrolled"
  lastSeen: string
  ipAddress: string
  macAddress: string
  userId?: string
  policies: string[]
  vulnerabilities: Vulnerability[]
  complianceStatus: "compliant" | "non-compliant" | "unknown"
}

export interface Policy {
  id: string
  orgId: string
  name: string
  description: string
  type: "security" | "compliance" | "deployment" | "configuration"
  rules: PolicyRule[]
  targetDevices: string[]
  enabled: boolean
  createdAt: string
}

export interface PolicyRule {
  id: string
  name: string
  condition: string
  action: string
  severity: "critical" | "high" | "medium" | "low"
}

export interface SoftwarePackage {
  id: string
  orgId: string
  name: string
  version: string
  publisher: string
  releaseDate: string
  installCount: number
  vulnerabilityCount: number
}

export interface Vulnerability {
  id: string
  cveId: string
  title: string
  severity: "critical" | "high" | "medium" | "low"
  description: string
  affectedSoftware: string[]
  discoveredAt: string
  remediationStatus: "unpatched" | "patched" | "mitigated"
}

export interface IncidentResponse {
  id: string
  orgId: string
  deviceId: string
  type: "malware" | "policy-violation" | "unauthorized-access" | "data-exfiltration"
  severity: "critical" | "high" | "medium" | "low"
  status: "open" | "investigating" | "resolved" | "closed"
  description: string
  createdAt: string
  resolvedAt?: string
  actions: RemediationAction[]
}

export interface RemediationAction {
  id: string
  type: "isolate" | "quarantine" | "patch" | "uninstall" | "block" | "alert"
  status: "pending" | "in-progress" | "completed" | "failed"
  description: string
  executedAt?: string
}

export interface LiveQuery {
  id: string
  orgId: string
  query: string
  targetDevices: string[]
  status: "pending" | "running" | "completed" | "failed"
  results: Record<string, any>[]
  createdAt: string
  completedAt?: string
}

export interface Integration {
  id: string
  orgId: string
  type: "sso" | "siem" | "itsm" | "devops" | "webhook"
  name: string
  config: Record<string, any>
  enabled: boolean
  lastSync?: string
}
