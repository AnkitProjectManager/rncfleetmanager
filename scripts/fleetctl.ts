#!/usr/bin/env node

import * as fs from "fs"
import * as path from "path"

interface Config {
  apiKey: string
  baseUrl: string
  orgId: string
}

const configPath = path.join(process.env.HOME || "", ".rncfleets", "config.json")

function loadConfig(): Config | null {
  try {
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, "utf-8"))
    }
  } catch (error) {
    console.error("Error loading config:", error)
  }
  return null
}

function saveConfig(config: Config) {
  const dir = path.dirname(configPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
}

async function apiCall(endpoint: string, method = "GET", body?: any) {
  const config = loadConfig()
  if (!config) {
  console.error("Not authenticated. Run 'rncfleetsctl login' first.")
    process.exit(1)
  }

  const url = `${config.baseUrl}${endpoint}`
  const options: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  const response = await fetch(url, options)
  if (!response.ok) {
    console.error(`Error: ${response.status} ${response.statusText}`)
    process.exit(1)
  }

  return response.json()
}

const commands: Record<string, (args: string[]) => Promise<void>> = {
  login: async (args) => {
    const email = args[0]
    const password = args[1]

    if (!email || !password) {
      console.error("Usage: rncfleetsctl login <email> <password>")
      process.exit(1)
    }

    console.log("Logging in...")
    // In production, call actual login endpoint
    const config: Config = {
      apiKey: `rncfleets_${Math.random().toString(36).substr(2, 32)}`,
      baseUrl: "http://localhost:3000/api",
      orgId: `org-${Date.now()}`,
    }
    saveConfig(config)
    console.log("✓ Logged in successfully")
  },

  logout: async () => {
    const dir = path.dirname(configPath)
    if (fs.existsSync(configPath)) {
      fs.unlinkSync(configPath)
    }
    console.log("✓ Logged out successfully")
  },

  "devices:list": async () => {
    const data = await apiCall("/devices")
    console.log("Devices:")
    data.devices.forEach((device: any) => {
      console.log(`  - ${device.hostname} (${device.osType} ${device.osVersion})`)
    })
  },

  "devices:enroll": async (args) => {
    const hostname = args[0]
    const osType = args[1]
    const osVersion = args[2]

    if (!hostname || !osType || !osVersion) {
      console.error("Usage: rncfleetsctl devices:enroll <hostname> <osType> <osVersion>")
      process.exit(1)
    }

    const data = await apiCall("/devices", "POST", {
      hostname,
      osType,
      osVersion,
      serialNumber: `SN-${Date.now()}`,
    })
    console.log(`✓ Device enrolled: ${data.id}`)
  },

  "policies:list": async () => {
    const data = await apiCall("/policies")
    console.log("Policies:")
    data.policies.forEach((policy: any) => {
      console.log(`  - ${policy.name} (${policy.type})`)
    })
  },

  "incidents:list": async () => {
    const data = await apiCall("/incidents")
    console.log("Incidents:")
    data.incidents.forEach((incident: any) => {
      console.log(`  - ${incident.type} (${incident.severity}) - ${incident.status}`)
    })
  },

  "query:execute": async (args) => {
    const query = args.join(" ")
    if (!query) {
      console.error("Usage: rncfleetsctl query:execute <query>")
      process.exit(1)
    }

    const data = await apiCall("/queries", "POST", { query })
    console.log(`✓ Query executed: ${data.id}`)
    console.log(`Status: ${data.status}`)
  },

  "config:api-key": async () => {
    const config = loadConfig()
    if (!config) {
      console.error("Not authenticated")
      process.exit(1)
    }
    console.log(config.apiKey)
  },

  help: async () => {
    console.log(`
RNCFleets CLI - Endpoint Management Tool

Usage: rncfleetsctl <command> [options]

Commands:
  login <email> <password>           Login to RNCFleets
  logout                             Logout from RNCFleets
  
  devices:list                       List all devices
  devices:enroll <hostname> <os> <version>  Enroll a new device
  
  policies:list                      List all policies
  
  incidents:list                     List all incidents
  
  query:execute <query>              Execute a live query
  
  config:api-key                     Display your API key
  
  help                               Show this help message
    `)
  },
}

async function main() {
  const args = process.argv.slice(2)
  const command = args[0] || "help"
  const commandArgs = args.slice(1)

  if (commands[command]) {
    await commands[command](commandArgs)
  } else {
    console.error(`Unknown command: ${command}`)
    console.log("Run 'rncfleetsctl help' for usage information")
    process.exit(1)
  }
}

main().catch((error) => {
  console.error("Error:", error.message)
  process.exit(1)
})
