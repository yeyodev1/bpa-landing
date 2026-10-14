<script setup lang="ts">
import type { Product } from '@/types/product'

defineProps<{ product: Product }>()
</script>

<template>
  <section v-if="product.faqs.length" class="section faq">
    <div class="container narrow">
      <div class="section-head">
        <span class="eyebrow">Preguntas frecuentes</span>
        <h2>Resolvemos tus dudas</h2>
      </div>
      <details v-for="faq in product.faqs" :key="faq.question">
        <summary>{{ faq.question }}</summary>
        <p>{{ faq.answer }}</p>
      </details>
      <div class="again">
        <a href="#comprar" class="btn btn-accent">Comprar mi licencia</a>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.faq {
  background: var(--bg-soft);
}

.narrow {
  max-width: 780px;
}

details {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 14px;
  margin-bottom: 12px;
  padding: 0 22px;

  &[open] summary::after {
    transform: rotate(45deg);
  }

  p {
    padding-bottom: 20px;
  }
}

summary {
  list-style: none;
  cursor: pointer;
  padding: 20px 0;
  font-weight: 700;
  color: var(--ink);
  display: flex;
  justify-content: space-between;
  gap: 16px;

  &::-webkit-details-marker {
    display: none;
  }

  &::after {
    content: '+';
    font-size: 1.4rem;
    line-height: 1;
    color: var(--primary);
    transition: transform 0.2s ease;
  }
}

.again {
  display: flex;
  justify-content: center;
  margin-top: 36px;
}
</style>
