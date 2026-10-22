<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import type { Product, PublicOrder } from '@/types/product'
import { confirmOrder, errorMessage, retryOrder } from '@/services/api'
import { money } from '@/composables/useMoney'
import { loadPayphoneWidget, renderPayphoneBox } from '@/composables/usePayphone'

const props = defineProps<{ product: Product; payphoneId: string; clientTransactionId: string }>()

const loading = ref(true)
const order = ref<PublicOrder | null>(null)
const message = ref('')
const retrying = ref(false)
const showBox = ref(false)

const paid = computed(() => order.value?.status === 'paid')

const whatsappUrl = computed(() => {
  if (!order.value) return ''
  const text = `Hola, acabo de comprar ${order.value.productName} (${order.value.plan.tierName}, ${order.value.plan.name}, ${order.value.seats} profesional(es)). Mi referencia es ${order.value.reference}. Quiero activar mi cuenta.`
  return `https://wa.me/${props.product.whatsapp}?text=${encodeURIComponent(text)}`
})

onMounted(async () => {
  try {
    const result = await confirmOrder(props.payphoneId, props.clientTransactionId)
    order.value = result.order
    message.value = result.message || ''
  } catch (error) {
    message.value = errorMessage(error)
  } finally {
    loading.value = false
    // Quita los parámetros de Payphone para que un refresh no reconfirme.
    window.history.replaceState({}, '', window.location.pathname)
  }
})

async function retry() {
  if (!order.value) return
  retrying.value = true
  try {
    const [result] = await Promise.all([retryOrder(order.value.reference), loadPayphoneWidget()])
    showBox.value = true
    await nextTick()
    renderPayphoneBox(result.payphone, 'payphone-retry-box', props.product.brand.primaryColor)
  } catch (error) {
    message.value = errorMessage(error)
  } finally {
    retrying.value = false
  }
}

function restart() {
  window.location.assign(window.location.pathname)
}
</script>

<template>
  <section class="result">
    <div class="container card">
      <template v-if="loading">
        <span class="spinner" aria-hidden="true"></span>
        <h1>Confirmando tu pago…</h1>
        <p>No cierres esta ventana.</p>
      </template>

      <template v-else-if="paid && order">
        <span class="badge ok"><i class="fa-solid fa-check" aria-hidden="true"></i></span>
        <h1>¡Bienvenido a {{ order.productName }}, {{ order.buyerName.split(' ')[0] }}!</h1>
        <p>Tu pago fue aprobado. Escríbenos por WhatsApp para activar tu cuenta y agendar tu capacitación.</p>
        <dl>
          <div><dt>Referencia</dt><dd>{{ order.reference }}</dd></div>
          <div><dt>Plan</dt><dd>{{ order.plan.tierName }} ({{ order.plan.name }}) · {{ order.seats }} profesional(es)</dd></div>
          <div><dt>Total pagado</dt><dd>{{ money(order.totalCents) }}</dd></div>
        </dl>
        <a :href="whatsappUrl" target="_blank" rel="noopener" class="btn btn-accent">
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Activar mi cuenta
        </a>
      </template>

      <template v-else>
        <span class="badge fail"><i class="fa-solid fa-xmark" aria-hidden="true"></i></span>
        <h1>El pago no se completó</h1>
        <p>{{ message || 'Tu tarjeta no fue cobrada. Puedes intentarlo de nuevo.' }}</p>
        <div class="actions">
          <button v-if="order" type="button" class="btn btn-accent" :disabled="retrying" @click="retry">
            {{ retrying ? 'Preparando…' : `Reintentar pago de ${money(order.totalCents)}` }}
          </button>
          <button type="button" class="btn btn-ghost" @click="restart">Volver al inicio</button>
        </div>
        <div v-show="showBox" id="payphone-retry-box" class="retry-box"></div>
      </template>
    </div>
  </section>
</template>

<style scoped lang="scss">
.result {
  min-height: calc(100vh - 220px);
  display: grid;
  place-items: center;
  padding: 56px 0;
  background: var(--bg-soft);
}

.card {
  max-width: 600px;
  background: #fff;
  border-radius: 24px;
  box-shadow: var(--shadow);
  padding: clamp(28px, 5vw, 48px);
  display: grid;
  justify-items: center;
  gap: 16px;
  text-align: center;

  h1 {
    font-size: clamp(1.5rem, 3.4vw, 2rem);
  }
}

.badge {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 2rem;
  color: #fff;

  &.ok {
    background: var(--success);
  }

  &.fail {
    background: var(--danger);
  }
}

dl {
  width: 100%;
  margin: 4px 0;
  display: grid;
  gap: 8px;
  background: var(--bg-soft);
  border-radius: 14px;
  padding: 16px 18px;

  div {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }

  dd {
    margin: 0;
    font-weight: 700;
    color: var(--ink);
    word-break: break-all;
  }
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.retry-box {
  width: 100%;
}

.spinner {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 4px solid var(--line);
  border-top-color: var(--primary);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
