const formatter = new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' })

export function money(cents: number) {
  return formatter.format(cents / 100)
}

export const periodLabel: Record<string, string> = { month: 'mes', year: 'año', once: 'pago único' }
