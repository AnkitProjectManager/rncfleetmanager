'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Database, CheckCircle, XCircle, RefreshCw } from 'lucide-react'

interface Vehicle {
  id: string
  company_id: string
  make: string
  model: string
  year: number
  license_plate: string
  vin?: string
  odometer: number
  status: string
  created_at: string
}

export default function TestDBPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [admins, setAdmins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Fetch vehicles
      const vehiclesRes = await fetch('/api/vehicles', { cache: 'no-store' })
      const vehiclesJson = await vehiclesRes.json()
      if (!vehiclesJson.ok) throw new Error(`Vehicles: ${vehiclesJson.error}`)
      setVehicles(vehiclesJson.data)

      // Fetch companies
      const companiesRes = await fetch('/api/companies', { cache: 'no-store' })
      const companiesJson = await companiesRes.json()
      if (!companiesJson.ok) throw new Error(`Companies: ${companiesJson.error}`)
      setCompanies(companiesJson.data)

      // Fetch admins
      const adminsRes = await fetch('/api/admins', { cache: 'no-store' })
      const adminsJson = await adminsRes.json()
      if (!adminsJson.ok) throw new Error(`Admins: ${adminsJson.error}`)
      setAdmins(adminsJson.data)

    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Connecting to MySQL database...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Database className="w-8 h-8" />
            Database Connection Test
          </h1>
          <p className="text-muted-foreground mt-1">
            Verify MySQL connection and view seeded data
          </p>
        </div>
        <Button onClick={loadData} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="w-5 h-5" />
              Connection Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-mono bg-destructive/10 p-3 rounded">{error}</p>
            <div className="mt-4 text-sm space-y-2">
              <p className="font-semibold">Troubleshooting:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Check that MySQL is running</li>
                <li>Verify .env.local has correct DB credentials</li>
                <li>Ensure database 'rncfleets' exists</li>
                <li>Run schema.sql and seed-data.sql in MySQL Workbench</li>
                <li>Restart the dev server after changing .env.local</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {!error && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                Connection Successful!
              </CardTitle>
              <CardDescription>
                Successfully connected to MySQL and fetched data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Companies</p>
                  <p className="text-3xl font-bold text-blue-600">{companies.length}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Admins</p>
                  <p className="text-3xl font-bold text-green-600">{admins.length}</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Vehicles</p>
                  <p className="text-3xl font-bold text-purple-600">{vehicles.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Companies</CardTitle>
                <CardDescription>First 5 companies from database</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {companies.slice(0, 5).map((company) => (
                    <div key={company.id} className="p-3 border rounded-lg">
                      <p className="font-semibold">{company.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {company.subscription_tier} • ID: {company.id}
                      </p>
                    </div>
                  ))}
                  {companies.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No companies found. Run seed-data.sql to populate.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vehicles</CardTitle>
                <CardDescription>First 5 vehicles from database</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {vehicles.slice(0, 5).map((vehicle) => (
                    <div key={vehicle.id} className="p-3 border rounded-lg">
                      <p className="font-semibold">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {vehicle.license_plate} • {vehicle.odometer.toLocaleString()} km • {vehicle.status}
                      </p>
                    </div>
                  ))}
                  {vehicles.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No vehicles found. Run seed-data.sql to populate.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Raw Data Preview</CardTitle>
              <CardDescription>JSON output from API</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold mb-2">Vehicles (first 2):</p>
                  <pre className="text-xs bg-muted p-4 rounded overflow-x-auto">
                    {JSON.stringify(vehicles.slice(0, 2), null, 2)}
                  </pre>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2">Companies (first 2):</p>
                  <pre className="text-xs bg-muted p-4 rounded overflow-x-auto">
                    {JSON.stringify(companies.slice(0, 2), null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
