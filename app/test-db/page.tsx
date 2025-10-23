'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Database, CheckCircle, XCircle, RefreshCw } from 'lucide-react'

export default function TestDBPage() {
  const [data, setData] = useState<any>({ vehicles: [], companies: [], admins: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const endpoints = ['vehicles', 'companies', 'admins']
      const responses = await Promise.all(
        endpoints.map(e => fetch(`/api/${e}`, { cache: 'no-store' }).then(r => r.json()))
      )
      
      if (responses.some(r => !r.ok)) {
        throw new Error(responses.find(r => !r.ok)?.error || 'API error')
      }
      
      setData({
        vehicles: responses[0].data,
        companies: responses[1].data,
        admins: responses[2].data,
      })
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Connecting to MySQL...</p>
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
            Database Test
          </h1>
          <p className="text-muted-foreground mt-1">MySQL connection & data verification</p>
        </div>
        <Button onClick={loadData} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {error ? (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="w-5 h-5" />
              Connection Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-mono bg-destructive/10 p-3 rounded mb-4">{error}</p>
            <div className="text-sm space-y-1 text-muted-foreground">
              <p> Check MySQL is running</p>
              <p> Verify .env.local has correct credentials</p>
              <p> Run database/schema.sql and database/seed-data.sql</p>
              <p> Restart dev server</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="border-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                Connection Successful
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
              {Object.entries(data).map(([key, items]: [string, any]) => (
                <div key={key} className="text-center p-4 bg-secondary/50 rounded">
                  <div className="text-3xl font-bold">{items.length}</div>
                  <div className="text-sm text-muted-foreground capitalize">{key}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {Object.entries(data).map(([key, items]: [string, any]) => (
            items.length > 0 && (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="capitalize">Sample {key}</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-secondary/50 p-4 rounded overflow-auto max-h-64">
                    {JSON.stringify(items.slice(0, 3), null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )
          ))}
        </>
      )}
    </div>
  )
}
