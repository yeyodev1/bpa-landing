export interface Plan {
  id: string
  name: string
  period: 'month' | 'year' | 'once'
  note?: string
  badge?: string
  highlighted?: boolean
}

// Nivel de precio según el número de profesionales (flyer "Cuenta y Precios 2026").
export interface Tier {
  id: string
  name: string
  minSeats: number
  maxSeats: number
  priceCents: { month: number; year: number }
}

export interface Overflow {
  fromSeats: number
  perSeatCents: { month: number; year: number }
}

export interface Product {
  slug: string
  name: string
  brand: { logoUrl: string; iconUrl?: string; primaryColor: string; accentColor: string }
  hero: { eyebrow?: string; title: string; highlight?: string; subtitle: string; videoUrl?: string; posterUrl?: string }
  stats: { value: string; label: string }[]
  features: { icon: string; title: string; description: string }[]
  includes: string[]
  gallery: { src: string; alt: string }[]
  support?: string
  plans: Plan[]
  tiers: Tier[]
  overflow?: Overflow | null
  taxRate: number
  maxSeats: number
  trustedBy: string[]
  faqs: { question: string; answer: string }[]
  whatsapp: string
}

export interface PublicOrder {
  reference: string
  productName: string
  plan: { id: string; name: string; period: string; tierId: string; tierName: string; unitPriceCents: number }
  seats: number
  buyerName: string
  subtotalCents: number
  taxCents: number
  totalCents: number
  status: 'pending' | 'paid' | 'failed'
}

export interface PayphonePayload {
  token: string
  storeId: string
  clientTransactionId: string
  amount: number
  amountWithTax: number
  amountWithoutTax: number
  tax: number
  currency: string
  reference: string
  email?: string
  phoneNumber?: string
  documentId?: string
}

export interface BuyerForm {
  name: string
  identification: string
  email: string
  phone: string
  clinic: string
  city: string
}
