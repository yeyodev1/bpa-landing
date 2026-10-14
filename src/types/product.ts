export interface Plan {
  id: string
  name: string
  period: 'month' | 'year' | 'once'
  priceCents: number
  note?: string
  badge?: string
  highlighted?: boolean
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
  taxRate: number
  maxSeats: number
  trustedBy: string[]
  faqs: { question: string; answer: string }[]
  whatsapp: string
}

export interface PublicOrder {
  reference: string
  productName: string
  plan: { id: string; name: string; period: string; unitPriceCents: number }
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
