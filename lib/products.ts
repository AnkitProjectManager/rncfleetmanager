export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
}

// Service packages for fleet management
export const PRODUCTS: Product[] = [
  {
    id: "oil-change",
    name: "Oil Change Service",
    description: "Standard oil change with filter replacement",
    priceInCents: 4999, // $49.99
  },
  {
    id: "tire-rotation",
    name: "Tire Rotation",
    description: "Complete tire rotation and balance",
    priceInCents: 7999, // $79.99
  },
  {
    id: "brake-service",
    name: "Brake Service",
    description: "Brake pad replacement and inspection",
    priceInCents: 29999, // $299.99
  },
  {
    id: "full-inspection",
    name: "Full Vehicle Inspection",
    description: "Comprehensive 150-point inspection",
    priceInCents: 12999, // $129.99
  },
  {
    id: "transmission-service",
    name: "Transmission Service",
    description: "Transmission fluid change and inspection",
    priceInCents: 19999, // $199.99
  },
]
