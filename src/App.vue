<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Product } from '@/types/product'
import { errorMessage, fetchProduct } from '@/services/api'
import HeroSection from '@/components/HeroSection.vue'
import FeatureGrid from '@/components/FeatureGrid.vue'
import GallerySection from '@/components/GallerySection.vue'
import IncludesSection from '@/components/IncludesSection.vue'
import CheckoutSection from '@/components/CheckoutSection.vue'
import FaqSection from '@/components/FaqSection.vue'
import PaymentResult from '@/components/PaymentResult.vue'

const slug = import.meta.env.VITE_PRODUCT_SLUG || 'smartmedic'
const product = ref<Product | null>(null)
const loadError = ref('')

// Payphone vuelve a la misma URL con ?id=...&clientTransactionId=...
const params = new URLSearchParams(window.location.search)
const payphoneId = params.get('id') || ''
const clientTransactionId = params.get('clientTransactionId') || ''
const isPaymentReturn = computed(() => Boolean(payphoneId && clientTransactionId))

const brandStyle = computed(() =>
  product.value
    ? { '--primary': product.value.brand.primaryColor, '--accent': product.value.brand.accentColor }
    : {},
)

onMounted(async () => {
  try {
    product.value = await fetchProduct(slug)
    document.title = `${product.value.name} | Compra tu licencia`
  } catch (error) {
    loadError.value = errorMessage(error)
  }
})
</script>

<template>
  <div class="landing" :style="brandStyle">
    <div v-if="loadError" class="state container">
      <i class="fa-solid fa-plug-circle-xmark" aria-hidden="true"></i>
      <p>{{ loadError }}</p>
    </div>

    <div v-else-if="!product" class="state container" aria-busy="true">
      <span class="spinner" aria-hidden="true"></span>
      <p>Cargando…</p>
    </div>

    <template v-else>
      <!-- Sin menú ni enlaces de salida: el único camino es comprar. -->
      <header class="topbar">
        <div class="container topbar-inner">
          <img :src="product.brand.logoUrl" :alt="product.name" class="topbar-logo" />
          <a v-if="!isPaymentReturn" href="#comprar" class="btn btn-accent topbar-cta">Comprar licencia</a>
        </div>
      </header>

      <main>
        <PaymentResult
          v-if="isPaymentReturn"
          :product="product"
          :payphone-id="payphoneId"
          :client-transaction-id="clientTransactionId"
        />
        <template v-else>
          <HeroSection :product="product" />
          <FeatureGrid :product="product" />
          <GallerySection :product="product" />
          <IncludesSection :product="product" />
          <CheckoutSection :product="product" />
          <FaqSection :product="product" />
        </template>
      </main>

      <footer class="footer">
        <div class="container footer-inner">
          <img src="/img/bpa-logo-color.png" alt="BPA Directores en Redes" class="footer-logo" />
          <p>{{ product.name }} es desarrollado por BPA Directores en Redes · Guayaquil, Ecuador</p>
          <p class="secure"><i class="fa-solid fa-lock" aria-hidden="true"></i> Pagos procesados de forma segura por Payphone</p>
        </div>
      </footer>
    </template>
  </div>
</template>

<style scoped lang="scss">
.state {
  min-height: 100vh;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 14px;
  text-align: center;

  i {
    font-size: 2rem;
    color: var(--danger);
  }
}

.spinner {
  width: 38px;
  height: 38px;
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

.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--line);
}

.topbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 68px;
}

.topbar-logo {
  height: 34px;
  width: auto;
}

.topbar-cta {
  padding: 11px 18px;
  font-size: 0.9rem;
}

.footer {
  background: var(--primary-dark);
  color: rgba(255, 255, 255, 0.75);
  padding: 40px 0;
  font-size: 0.9rem;
}

.footer-inner {
  display: grid;
  justify-items: center;
  gap: 10px;
  text-align: center;
}

.footer-logo {
  height: 40px;
  width: auto;
  filter: brightness(0) invert(1);
  opacity: 0.9;
}

.secure {
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.82rem;
}

@media (max-width: 420px) {
  .topbar-logo {
    height: 28px;
  }

  .topbar-cta {
    padding: 10px 14px;
  }
}
</style>
