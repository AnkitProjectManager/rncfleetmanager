import type { Device, Policy, SoftwarePackage, Vulnerability, IncidentResponse, LiveQuery, Integration } from "./types"

const STORAGE_KEYS = {
  DEVICES: "fleet_devices",
  POLICIES: "fleet_policies",
  SOFTWARE: "fleet_software",
  VULNERABILITIES: "fleet_vulnerabilities",
  INCIDENTS: "fleet_incidents",
  QUERIES: "fleet_queries",
  INTEGRATIONS: "fleet_integrations",
}

export const storage = {
  // Devices
  getDevices: (orgId: string): Device[] => {
    const devices = JSON.parse(localStorage.getItem(STORAGE_KEYS.DEVICES) || "[]")
    return devices.filter((d: Device) => d.orgId === orgId)
  },
  addDevice: (device: Device) => {
    const devices = JSON.parse(localStorage.getItem(STORAGE_KEYS.DEVICES) || "[]")
    devices.push(device)
    localStorage.setItem(STORAGE_KEYS.DEVICES, JSON.stringify(devices))
  },
  updateDevice: (deviceId: string, updates: Partial<Device>) => {
    const devices = JSON.parse(localStorage.getItem(STORAGE_KEYS.DEVICES) || "[]")
    const index = devices.findIndex((d: Device) => d.id === deviceId)
    if (index !== -1) {
      devices[index] = { ...devices[index], ...updates }
      localStorage.setItem(STORAGE_KEYS.DEVICES, JSON.stringify(devices))
    }
  },

  // Policies
  getPolicies: (orgId: string): Policy[] => {
    const policies = JSON.parse(localStorage.getItem(STORAGE_KEYS.POLICIES) || "[]")
    return policies.filter((p: Policy) => p.orgId === orgId)
  },
  addPolicy: (policy: Policy) => {
    const policies = JSON.parse(localStorage.getItem(STORAGE_KEYS.POLICIES) || "[]")
    policies.push(policy)
    localStorage.setItem(STORAGE_KEYS.POLICIES, JSON.stringify(policies))
  },

  // Software
  getSoftware: (orgId: string): SoftwarePackage[] => {
    const software = JSON.parse(localStorage.getItem(STORAGE_KEYS.SOFTWARE) || "[]")
    return software.filter((s: SoftwarePackage) => s.orgId === orgId)
  },

  // Vulnerabilities
  getVulnerabilities: (orgId: string): Vulnerability[] => {
    const vulns = JSON.parse(localStorage.getItem(STORAGE_KEYS.VULNERABILITIES) || "[]")
    return vulns
  },

  // Incidents
  getIncidents: (orgId: string): IncidentResponse[] => {
    const incidents = JSON.parse(localStorage.getItem(STORAGE_KEYS.INCIDENTS) || "[]")
    return incidents.filter((i: IncidentResponse) => i.orgId === orgId)
  },
  addIncident: (incident: IncidentResponse) => {
    const incidents = JSON.parse(localStorage.getItem(STORAGE_KEYS.INCIDENTS) || "[]")
    incidents.push(incident)
    localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(incidents))
  },

  // Queries
  getQueries: (orgId: string): LiveQuery[] => {
    const queries = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUERIES) || "[]")
    return queries.filter((q: LiveQuery) => q.orgId === orgId)
  },
  addQuery: (query: LiveQuery) => {
    const queries = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUERIES) || "[]")
    queries.push(query)
    localStorage.setItem(STORAGE_KEYS.QUERIES, JSON.stringify(queries))
  },

  // Integrations
  getIntegrations: (orgId: string): Integration[] => {
    const integrations = JSON.parse(localStorage.getItem(STORAGE_KEYS.INTEGRATIONS) || "[]")
    return integrations.filter((i: Integration) => i.orgId === orgId)
  },
  addIntegration: (integration: Integration) => {
    const integrations = JSON.parse(localStorage.getItem(STORAGE_KEYS.INTEGRATIONS) || "[]")
    integrations.push(integration)
    localStorage.setItem(STORAGE_KEYS.INTEGRATIONS, JSON.stringify(integrations))
  },
}

// Initialize demo data
export const initializeDemoData = (orgId: string) => {
  const existingDevices = storage.getDevices(orgId)
  if (existingDevices.length === 0) {
    const demoDevices: Device[] = [
      {
        id: "dev-1",
        orgId,
        hostname: "DESKTOP-ADMIN-01",
        osType: "Windows",
        osVersion: "11 Pro",
        serialNumber: "SN123456",
        enrollmentStatus: "enrolled",
        lastSeen: new Date().toISOString(),
        ipAddress: "192.168.1.100",
        macAddress: "00:1A:2B:3C:4D:5E",
        userId: "user-1",
        policies: ["pol-1", "pol-2"],
        vulnerabilities: [],
        complianceStatus: "compliant",
      },
      {
        id: "dev-2",
        orgId,
        hostname: "MacBook-Pro-Dev",
        osType: "macOS",
        osVersion: "14.1",
        serialNumber: "SN789012",
        enrollmentStatus: "enrolled",
        lastSeen: new Date().toISOString(),
        ipAddress: "192.168.1.101",
        macAddress: "00:1A:2B:3C:4D:5F",
        userId: "user-2",
        policies: ["pol-1"],
        vulnerabilities: [],
        complianceStatus: "compliant",
      },
    ]
    demoDevices.forEach((d) => storage.addDevice(d))
  }
}
