import type { PayphonePayload } from '@/types/product'

const CSS_URL = 'https://cdn.payphonetodoesposible.com/box/v2.0/payphone-payment-box.css'
const JS_URL = 'https://cdn.payphonetodoesposible.com/box/v2.0/payphone-payment-box.js'

export async function loadPayphoneWidget() {
  if (window.PPaymentButtonBox) return
  if (!document.querySelector(`link[href="${CSS_URL}"]`)) {
    const stylesheet = document.createElement('link')
    stylesheet.rel = 'stylesheet'
    stylesheet.href = CSS_URL
    document.head.appendChild(stylesheet)
  }
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'module'
    script.src = JS_URL
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('No se pudo cargar la pasarela de pago.'))
    document.head.appendChild(script)
  })
}

export function renderPayphoneBox(payphone: PayphonePayload, containerId: string, color: string) {
  if (!window.PPaymentButtonBox) throw new Error('La pasarela de pago no está disponible.')
  new window.PPaymentButtonBox({
    ...payphone,
    lang: 'es',
    defaultMethod: 'card',
    timeZone: -5,
    backgroundColor: color,
  }).render(containerId)
}
