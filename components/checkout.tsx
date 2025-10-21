"use client"

import { useCallback } from "react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

import { startCheckoutSession, startCustomCheckoutSession } from "@/app/actions/stripe"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutProps {
  productId?: string
  quantity?: number
  customService?: {
    name: string
    priceInCents: number
  }
}

export default function Checkout({ productId, quantity = 1, customService }: CheckoutProps) {
  const fetchClientSecret = useCallback(async () => {
    if (customService) {
      return startCustomCheckoutSession(customService.name, customService.priceInCents, quantity)
    }
    if (productId) {
      return startCheckoutSession(productId, quantity)
    }
    throw new Error("Either productId or customService must be provided")
  }, [productId, quantity, customService])

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
