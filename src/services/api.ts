import axios from 'axios'
import type { BuyerForm, PayphonePayload, Product, PublicOrder } from '@/types/product'

const http = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8190/api').replace(/\/+$/, ''),
  timeout: 15000,
})

export function errorMessage(error: unknown) {
  if (axios.isAxiosError(error)) return error.response?.data?.message || 'No pudimos conectar. Intenta de nuevo.'
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado.'
}

export async function fetchProduct(slug: string) {
  const { data } = await http.get<{ product: Product }>(`/products/${encodeURIComponent(slug)}`)
  return data.product
}

export async function createOrder(input: { productSlug: string; planId: string; seats: number; buyer: BuyerForm }) {
  const { data } = await http.post<{ order: PublicOrder; payphone: PayphonePayload }>('/orders', input)
  return data
}

export async function retryOrder(reference: string) {
  const { data } = await http.post<{ order: PublicOrder; payphone: PayphonePayload }>(`/orders/${encodeURIComponent(reference)}/retry`)
  return data
}

export async function confirmOrder(id: string, clientTransactionId: string) {
  const { data } = await http.post<{ order: PublicOrder; message?: string }>('/orders/payphone/confirm', { id, clientTransactionId })
  return data
}
