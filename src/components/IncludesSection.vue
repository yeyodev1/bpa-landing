<script setup lang="ts">
import type { Product } from '@/types/product'

defineProps<{ product: Product }>()
</script>

<template>
  <section class="section includes">
    <div class="container layout">
      <div class="intro">
        <span class="eyebrow">Tu licencia incluye</span>
        <h2>Sin módulos escondidos ni costos sorpresa</h2>
        <p v-if="product.support" class="support">
          <i class="fa-solid fa-headset" aria-hidden="true"></i>
          {{ product.support }}
        </p>
        <div v-if="product.trustedBy.length" class="trusted">
          <p>Confían en {{ product.name }}</p>
          <ul>
            <li v-for="brand in product.trustedBy" :key="brand">{{ brand }}</li>
          </ul>
        </div>
      </div>
      <ul class="list">
        <li v-for="item in product.includes" :key="item">
          <i class="fa-solid fa-circle-check" aria-hidden="true"></i>
          {{ item }}
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
.layout {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: clamp(32px, 5vw, 64px);
  align-items: start;
}

.intro {
  display: grid;
  gap: 18px;
  position: sticky;
  top: 100px;

  .eyebrow {
    justify-self: start;
  }

  h2 {
    font-size: clamp(1.8rem, 3.4vw, 2.5rem);
  }
}

.support {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: var(--bg-soft);
  border-radius: 14px;
  padding: 16px 18px;

  i {
    color: var(--primary);
    margin-top: 4px;
  }
}

.trusted {
  display: grid;
  gap: 10px;

  p {
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  li {
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: 6px 14px;
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--ink);
  }
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 24px;

  li {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    padding: 10px 0;
    border-bottom: 1px solid var(--line);
    color: var(--ink);
    font-weight: 500;
  }

  i {
    color: var(--success);
    margin-top: 5px;
  }
}

@media (max-width: 860px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .intro {
    position: static;
  }
}

@media (max-width: 520px) {
  .list {
    grid-template-columns: 1fr;
  }
}
</style>
