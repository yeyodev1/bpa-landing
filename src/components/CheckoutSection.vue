<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import type { BuyerForm, Product } from '@/types/product'
import { createOrder, errorMessage, isServiceDown } from '@/services/api'
import { money, periodLabel } from '@/composables/useMoney'
import { loadPayphoneWidget, renderPayphoneBox } from '@/composables/usePayphone'

const props = defineProps<{ product: Product }>()

const highlighted = props.product.plans.find((plan) => plan.highlighted) || props.product.plans[0]
const planId = ref(highlighted?.id || '')
const seats = ref(1)
const buyer = reactive<BuyerForm>({ name: '', identification: '', email: '', phone: '', clinic: '', city: '' })
const accepted = ref(false)
const submitting = ref(false)
const formError = ref('')
const gatewayOpen = ref(false)
const gatewayError = ref('')
const paymentOffline = ref(false)

const whatsappUrl = computed(() => {
  const text =
    `Hola, quiero comprar ${props.product.name}: plan ${plan.value.name}, ${seats.value} ` +
    `profesional${seats.value > 1 ? 'es' : ''}, total ${money(totalCents.value)}. ` +
    `Soy ${buyer.name.trim()} (${buyer.identification.trim()}), ${buyer.email.trim()}, ${buyer.city.trim()}.`
  return `https://wa.me/${props.product.whatsapp}?text=${encodeURIComponent(text)}`
})

const plan = computed(() => props.product.plans.find((item) => item.id === planId.value)!)
const subtotalCents = computed(() => plan.value.priceCents * seats.value)
const taxCents = computed(() => Math.round(subtotalCents.value * props.product.taxRate))
const totalCents = computed(() => subtotalCents.value + taxCents.value)
const taxPercent = computed(() => Math.round(props.product.taxRate * 100))

function monthlyEquivalent(priceCents: number, period: string) {
  return period === 'year' ? money(Math.round(priceCents / 12)) : ''
}

function changeSeats(delta: number) {
  seats.value = Math.min(props.product.maxSeats, Math.max(1, seats.value + delta))
}

watch(seats, (value) => {
  if (!Number.isInteger(value) || value < 1) seats.value = 1
  if (value > props.product.maxSeats) seats.value = props.product.maxSeats
})

function validate() {
  if (buyer.name.trim().length < 3) return 'Escribe tu nombre completo.'
  const id = buyer.identification.replace(/\D/g, '')
  if (id.length !== 10 && id.length !== 13) return 'La cédula debe tener 10 dígitos o el RUC 13.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(buyer.email.trim())) return 'Revisa tu correo electrónico.'
  const phone = buyer.phone.replace(/[\s()-]/g, '')
  if (!/^(09\d{8}|\+?5939\d{8}|\+[1-9]\d{6,14})$/.test(phone)) return 'Escribe un celular válido, por ejemplo 0991234567.'
  if (!buyer.city.trim()) return 'Indica tu ciudad.'
  if (!accepted.value) return 'Debes aceptar las condiciones para continuar.'
  return ''
}

async function pay() {
  formError.value = validate()
  if (formError.value) return
  submitting.value = true
  gatewayError.value = ''
  try {
    const [{ payphone }] = await Promise.all([
      createOrder({
        productSlug: props.product.slug,
        planId: planId.value,
        seats: seats.value,
        buyer: { ...buyer, identification: buyer.identification.replace(/\D/g, '') },
      }),
      loadPayphoneWidget(),
    ])
    gatewayOpen.value = true
    await nextTick()
    renderPayphoneBox(payphone, 'payphone-box', props.product.brand.primaryColor)
  } catch (error) {
    if (isServiceDown(error)) {
      closeGateway()
      paymentOffline.value = true
    } else if (gatewayOpen.value) gatewayError.value = errorMessage(error)
    else formError.value = errorMessage(error)
  } finally {
    submitting.value = false
  }
}

function closeGateway() {
  gatewayOpen.value = false
  const box = document.getElementById('payphone-box')
  if (box) box.innerHTML = ''
}
</script>

<template>
  <section id="comprar" class="section checkout">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Compra tu licencia</span>
        <h2>Elige tu plan y empieza hoy</h2>
        <p>Precio por profesional. Activamos tu cuenta y te capacitamos apenas se confirme el pago.</p>
      </div>

      <form class="layout" novalidate @submit.prevent="pay">
        <div class="config">
          <fieldset class="plans">
            <legend>1. Plan</legend>
            <label
              v-for="item in product.plans"
              :key="item.id"
              class="plan"
              :class="{ active: item.id === planId }"
            >
              <input v-model="planId" type="radio" name="plan" :value="item.id" />
              <span v-if="item.badge" class="badge">{{ item.badge }}</span>
              <span class="plan-name">{{ item.name }}</span>
              <span class="plan-price">
                {{ money(item.priceCents) }}
                <small>+ IVA / {{ periodLabel[item.period] }}</small>
              </span>
              <span v-if="monthlyEquivalent(item.priceCents, item.period)" class="plan-eq">
                Equivale a {{ monthlyEquivalent(item.priceCents, item.period) }} al mes
              </span>
              <span v-if="item.note" class="plan-note">{{ item.note }}</span>
            </label>
          </fieldset>

          <fieldset class="seats">
            <legend>2. Profesionales</legend>
            <p>¿Cuántos médicos u odontólogos usarán {{ product.name }}?</p>
            <div class="stepper">
              <button type="button" aria-label="Quitar un profesional" :disabled="seats <= 1" @click="changeSeats(-1)">
                <i class="fa-solid fa-minus" aria-hidden="true"></i>
              </button>
              <input v-model.number="seats" type="number" min="1" :max="product.maxSeats" aria-label="Número de profesionales" />
              <button type="button" aria-label="Agregar un profesional" :disabled="seats >= product.maxSeats" @click="changeSeats(1)">
                <i class="fa-solid fa-plus" aria-hidden="true"></i>
              </button>
            </div>
          </fieldset>

          <fieldset class="buyer">
            <legend>3. Datos para tu cuenta y factura</legend>
            <div class="fields">
              <label class="wide">
                Nombre completo
                <input v-model="buyer.name" type="text" autocomplete="name" maxlength="120" required />
              </label>
              <label>
                Cédula o RUC
                <input v-model="buyer.identification" type="text" inputmode="numeric" maxlength="13" required />
              </label>
              <label>
                Celular (WhatsApp)
                <input v-model="buyer.phone" type="tel" autocomplete="tel" placeholder="0991234567" maxlength="16" required />
              </label>
              <label class="wide">
                Correo electrónico
                <input v-model="buyer.email" type="email" autocomplete="email" maxlength="254" required />
              </label>
              <label>
                Clínica o consultorio <span class="optional">(opcional)</span>
                <input v-model="buyer.clinic" type="text" autocomplete="organization" maxlength="120" />
              </label>
              <label>
                Ciudad
                <input v-model="buyer.city" type="text" autocomplete="address-level2" maxlength="80" required />
              </label>
            </div>
          </fieldset>
        </div>

        <aside class="summary">
          <h3>Resumen</h3>
          <dl>
            <div>
              <dt>{{ product.name }} · {{ plan.name }}</dt>
              <dd>{{ money(plan.priceCents) }} × {{ seats }}</dd>
            </div>
            <div>
              <dt>Subtotal</dt>
              <dd>{{ money(subtotalCents) }}</dd>
            </div>
            <div>
              <dt>IVA {{ taxPercent }}%</dt>
              <dd>{{ money(taxCents) }}</dd>
            </div>
            <div class="total">
              <dt>Total a pagar</dt>
              <dd>{{ money(totalCents) }}</dd>
            </div>
          </dl>

          <label class="terms">
            <input v-model="accepted" type="checkbox" />
            <span>
              Acepto que mis datos se usen para activar mi licencia y emitir mi factura electrónica.
              {{ plan.period === 'month' ? 'El plan mensual se paga mes a mes.' : '' }}
            </span>
          </label>

          <p v-if="formError" class="error" role="alert">{{ formError }}</p>

          <div v-if="paymentOffline" class="offline" role="status">
            <p>Termina tu compra con un asesor por WhatsApp. Ya preparamos el mensaje con tu plan y tus datos.</p>
            <a :href="whatsappUrl" target="_blank" rel="noopener" class="btn btn-accent pay">
              <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Comprar por WhatsApp
            </a>
          </div>

          <button v-else type="submit" class="btn btn-accent pay" :disabled="submitting">
            <i v-if="submitting" class="fa-solid fa-circle-notch fa-spin" aria-hidden="true"></i>
            <i v-else class="fa-solid fa-lock" aria-hidden="true"></i>
            {{ submitting ? 'Preparando pago…' : `Pagar ${money(totalCents)}` }}
          </button>
          <p class="methods">
            <i class="fa-brands fa-cc-visa" aria-hidden="true"></i>
            <i class="fa-brands fa-cc-mastercard" aria-hidden="true"></i>
            <i class="fa-brands fa-cc-diners-club" aria-hidden="true"></i>
            Tarjeta de crédito o débito · Payphone
          </p>
        </aside>
      </form>
    </div>

    <Transition name="fade">
      <div v-if="gatewayOpen" class="overlay" @click.self="closeGateway">
        <div class="gateway" role="dialog" aria-modal="true" aria-labelledby="gateway-title">
          <button type="button" class="close" aria-label="Cerrar pago" @click="closeGateway">
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
          <p class="eyebrow">Pago seguro</p>
          <h3 id="gateway-title">Completa tu pago</h3>
          <p class="gateway-total">
            Total <b>{{ money(totalCents) }}</b>
          </p>
          <p v-if="gatewayError" class="error" role="alert">{{ gatewayError }}</p>
          <div id="payphone-box"></div>
        </div>
      </div>
    </Transition>
  </section>
</template>

<style scoped lang="scss">
.offline {
  display: grid;
  gap: 12px;
  p {
    margin: 0;
    font-size: 0.95rem;
  }
  a {
    text-decoration: none;
  }
}

.checkout {
  background: #fff;
  scroll-margin-top: 60px;

  .section-head p {
    color: var(--muted);
  }
}

.layout {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 28px;
  align-items: start;
}

.config {
  display: grid;
  gap: 22px;
  min-width: 0;
}

fieldset {
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 22px;
  margin: 0;
  min-width: 0;
}

legend {
  font-weight: 800;
  color: var(--ink);
  padding: 0 8px;
}

.plans {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.plan {
  position: relative;
  display: grid;
  gap: 4px;
  align-content: start;
  border: 2px solid var(--line);
  border-radius: 14px;
  padding: 18px;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease;

  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  &:has(input:focus-visible) {
    outline: 3px solid rgba(2, 112, 180, 0.35);
    outline-offset: 2px;
  }

  &.active {
    border-color: var(--primary);
    background: rgba(2, 112, 180, 0.05);
  }
}

.badge {
  position: absolute;
  top: -11px;
  right: 14px;
  background: var(--accent);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 999px;
}

.plan-name {
  font-weight: 700;
  color: var(--ink);
}

.plan-price {
  font-size: 1.9rem;
  font-weight: 800;
  color: var(--primary-dark);
  line-height: 1.2;

  small {
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--muted);
  }
}

.plan-eq {
  font-size: 0.86rem;
  font-weight: 600;
  color: var(--success);
}

.plan-note {
  font-size: 0.86rem;
  color: var(--muted);
}

.seats p {
  margin-bottom: 14px;
}

.stepper {
  display: inline-flex;
  align-items: center;
  border: 1.5px solid var(--line);
  border-radius: 14px;
  overflow: hidden;

  button {
    width: 50px;
    height: 50px;
    border: 0;
    background: var(--bg-soft);
    color: var(--primary-dark);
    cursor: pointer;

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  input {
    width: 70px;
    height: 50px;
    border: 0;
    text-align: center;
    font-weight: 800;
    font-size: 1.15rem;
    color: var(--ink);
    -moz-appearance: textfield;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
    }
  }
}

.fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;

  label {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 6px 4px;
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--ink);
    min-width: 0;
  }

  .wide {
    grid-column: 1 / -1;
  }

  input {
    width: 100%;
    border: 1.5px solid var(--line);
    border-radius: 12px;
    padding: 13px 14px;
    font-size: 1rem;
    color: var(--ink);
    background: #fff;

    &:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(2, 112, 180, 0.1);
    }
  }
}

.optional {
  font-weight: 400;
  color: var(--muted);
}

.summary {
  position: sticky;
  top: 92px;
  background: var(--primary-dark);
  color: rgba(255, 255, 255, 0.85);
  border-radius: 22px;
  padding: 28px;
  display: grid;
  gap: 18px;
  box-shadow: var(--shadow);

  h3 {
    color: #fff;
    font-size: 1.3rem;
  }

  dl {
    margin: 0;
    display: grid;
    gap: 10px;

    div {
      display: flex;
      justify-content: space-between;
      gap: 16px;
    }
  }

  dd {
    margin: 0;
    font-weight: 600;
    color: #fff;
    white-space: nowrap;
  }

  .total {
    border-top: 1px solid rgba(255, 255, 255, 0.18);
    padding-top: 14px;
    margin-top: 4px;

    dt {
      font-weight: 700;
      color: #fff;
    }

    dd {
      font-size: 1.6rem;
      font-weight: 800;
    }
  }
}

.terms {
  display: flex;
  gap: 10px;
  font-size: 0.85rem;
  cursor: pointer;

  input {
    margin-top: 4px;
    accent-color: var(--accent);
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
}

.error {
  background: rgba(217, 58, 58, 0.12);
  color: #ffb4b4;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 0.9rem;
  font-weight: 600;
}

.pay {
  width: 100%;
  font-size: 1.08rem;
  padding: 18px;
}

.methods {
  text-align: center;
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.6);

  i {
    font-size: 1.3rem;
    margin-right: 4px;
    vertical-align: middle;
  }
}

.overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(1, 25, 41, 0.65);
  display: grid;
  place-items: center;
  padding: 16px;
  overflow-y: auto;
}

.gateway {
  position: relative;
  width: min(480px, 100%);
  background: #fff;
  border-radius: 22px;
  padding: 30px 24px;
  display: grid;
  gap: 10px;
  text-align: center;

  .eyebrow {
    justify-self: center;
  }

  .error {
    color: var(--danger);
  }
}

.gateway-total b {
  color: var(--ink);
  font-size: 1.2rem;
}

.close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 0;
  background: var(--bg-soft);
  color: var(--ink);
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 920px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .summary {
    position: static;
  }
}

@media (max-width: 560px) {
  .plans,
  .fields {
    grid-template-columns: 1fr;
  }

  fieldset {
    padding: 18px 14px;
  }
}
</style>
