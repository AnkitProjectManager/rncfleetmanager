"use server"

import { stripe } from "@/lib/stripe"
import { PRODUCTS } from "@/lib/products"

export async function startCheckoutSession(productId: string, quantity = 1) {
  const product = PRODUCTS.find((p) => p.id === productId)
  if (!product) {
    throw new Error(`Product with id "${productId}" not found`)
  }

  // Create Checkout Sessions from body params
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.priceInCents,
        },
        quantity,
      },
    ],
    mode: "payment",
  })

  return session.client_secret
}

export async function startCustomCheckoutSession(serviceName: string, priceInCents: number, quantity = 1) {
  // Create Checkout Sessions for custom services
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: serviceName,
            description: "Custom fleet service",
          },
          unit_amount: priceInCents,
        },
        quantity,
      },
    ],
    mode: "payment",
  })

  return session.client_secret
}
