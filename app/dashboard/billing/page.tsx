"use client"
export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import BackButton from "@/components/back-button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CreditCard, DollarSign, Receipt, Calendar } from "lucide-react"
import Checkout from "@/components/checkout"
import { PRODUCTS } from "@/lib/products"

interface Payment {
  id: string
  date: string
  amount: number
  service: string
  status: "completed" | "pending" | "failed"
  invoiceUrl?: string
}

export default function BillingPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [showCheckout, setShowCheckout] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [selectedQuantity, setSelectedQuantity] = useState(1)

  useEffect(() => {
    // Load payment history from localStorage
    const stored = localStorage.getItem("payments")
    if (stored) {
      setPayments(JSON.parse(stored))
    } else {
      // Initialize with sample data
      const samplePayments: Payment[] = [
        {
          id: "PAY-001",
          date: "2024-01-15",
          amount: 49.99,
          service: "Oil Change Service",
          status: "completed",
          invoiceUrl: "#",
        },
        {
          id: "PAY-002",
          date: "2024-01-20",
          amount: 299.99,
          service: "Brake Service",
          status: "completed",
          invoiceUrl: "#",
        },
      ]
      setPayments(samplePayments)
      localStorage.setItem("payments", JSON.stringify(samplePayments))
    }
  }, [])

  const totalSpent = payments.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.amount, 0)

  const handlePayNow = (productId: string, quantity = 1) => {
    setSelectedProduct(productId)
    setSelectedQuantity(quantity)
    setShowCheckout(true)
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4">
        <BackButton />
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Billing & Payments
          </h1>
          <p className="text-muted-foreground mt-2">Manage your payments and view transaction history</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-[var(--chart-1)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--chart-1)]">${totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Lifetime payments</p>
          </CardContent>
        </Card>

        <Card className="border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Receipt className="h-4 w-4 text-cyan-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-600">{payments.length}</div>
            <p className="text-xs text-muted-foreground">Total payments</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Payment</CardTitle>
            <Calendar className="h-4 w-4 text-[var(--chart-1)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--chart-1)]">
              {payments.length > 0 ? new Date(payments[0].date).toLocaleDateString() : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">Most recent</p>
          </CardContent>
        </Card>
      </div>

      {/* Available Services */}
      <Card>
        <CardHeader>
          <CardTitle>Available Services</CardTitle>
          <CardDescription>Select a service to make a payment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((product) => (
              <Card key={product.id} className="border-2 hover:border-blue-400 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-2xl font-bold text-[var(--chart-1)]">${(product.priceInCents / 100).toFixed(2)}</div>
                  <Button
                    onClick={() => handlePayNow(product.id)}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>View all your past transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No payment history yet</div>
            ) : (
              payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                      <Receipt className="h-5 w-5 text-[var(--chart-1)]" />
                    </div>
                    <div>
                      <p className="font-medium">{payment.service}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(payment.date).toLocaleDateString()} • {payment.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-[var(--chart-1)]">${payment.amount.toFixed(2)}</p>
                      <Badge
                        variant={
                          payment.status === "completed"
                            ? "default"
                            : payment.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {payment.status}
                      </Badge>
                    </div>
                    {payment.invoiceUrl && (
                      <Button variant="outline" size="sm">
                        View Invoice
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Checkout Dialog */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>Enter your payment details to complete the transaction</DialogDescription>
          </DialogHeader>
          {selectedProduct && <Checkout productId={selectedProduct} quantity={selectedQuantity} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
