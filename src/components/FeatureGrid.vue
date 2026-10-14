<script setup lang="ts">
import type { Product } from '@/types/product'

defineProps<{ product: Product }>()
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Acerca de la plataforma</span>
        <h2>Todo lo que necesitas en una sola plataforma</h2>
      </div>
      <ul class="grid">
        <li v-for="feature in product.features" :key="feature.title" class="card">
          <span class="icon"><i :class="['fa-solid', feature.icon]" aria-hidden="true"></i></span>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
.grid {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: 20px;
}

.card {
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 28px;
  display: grid;
  gap: 12px;
  align-content: start;
  transition: box-shadow 0.25s ease, transform 0.25s ease;

  &:hover {
    box-shadow: var(--shadow);
    transform: translateY(-3px);
  }

  h3 {
    font-size: 1.15rem;
  }
}

.icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  font-size: 1.3rem;
  color: var(--primary);
  background: rgba(2, 112, 180, 0.09);
}

.card:nth-child(even) .icon {
  color: var(--accent);
  background: rgba(238, 139, 5, 0.12);
}
</style>
