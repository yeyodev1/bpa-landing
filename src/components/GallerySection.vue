<script setup lang="ts">
import type { Product } from '@/types/product'

defineProps<{ product: Product }>()
</script>

<template>
  <section v-if="product.gallery.length" class="section gallery">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Desde cualquier dispositivo</span>
        <h2>Tu consultorio en el computador, la tablet o el celular</h2>
      </div>
      <ul class="shots">
        <li v-for="shot in product.gallery" :key="shot.src">
          <img :src="shot.src" :alt="shot.alt" loading="lazy" />
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
.gallery {
  background: var(--bg-soft);
}

.shots {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 2fr 1.2fr 0.8fr;
  gap: 20px;
  align-items: start;

  li {
    background: #fff;
    border-radius: var(--radius);
    padding: 14px;
    box-shadow: var(--shadow);
    overflow: hidden;
  }

  img {
    width: 100%;
    height: auto;
    border-radius: 10px;
  }
}

@media (max-width: 820px) {
  .shots {
    grid-template-columns: 1fr 1fr;

    li:first-child {
      grid-column: 1 / -1;
    }
  }
}
</style>
