/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_PRODUCT_SLUG?: string
}

interface PayphoneBoxOptions {
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
  lang?: string
  defaultMethod?: string
  timeZone?: number
  backgroundColor?: string
}

interface Window {
  PPaymentButtonBox?: new (options: PayphoneBoxOptions) => { render: (containerId: string) => void }
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}
