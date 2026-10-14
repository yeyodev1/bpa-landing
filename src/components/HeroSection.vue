<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/types/product'
import { money, periodLabel } from '@/composables/useMoney'

const props = defineProps<{ product: Product }>()

const fromPlan = computed(() => [...props.product.plans].sort((a, b) => a.priceCents - b.priceCents)[0])

// YouTube / Vimeo se incrustan; un .mp4 se reproduce nativo; sin URL se muestra el mockup.
const video = computed(() => {
  const url = props.product.hero.videoUrl?.trim() || ''
  if (!url) return null
  const youtube = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/)
  if (youtube) return { type: 'embed', src: `https://www.youtube-nocookie.com/embed/${youtube[1]}?rel=0&modestbranding=1` }
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeo) return { type: 'embed', src: `https://player.vimeo.com/video/${vimeo[1]}` }
  return { type: 'file', src: url }
})
</script>

<template>
  <section class="hero">
    <div class="container hero-inner">
      <div class="hero-copy">
        <span class="eyebrow">{{ product.hero.eyebrow }}</span>
        <h1>
          {{ product.hero.title }}
          <span v-if="product.hero.highlight" class="highlight">{{ product.hero.highlight }}</span>
        </h1>
        <p class="subtitle">{{ product.hero.subtitle }}</p>
      </div>

      <div class="media">
        <div v-if="video?.type === 'embed'" class="frame">
          <iframe
            :src="video.src"
            :title="`Video de ${product.name}`"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
        <div v-else-if="video?.type === 'file'" class="frame">
          <video :src="video.src" :poster="product.hero.posterUrl" controls playsinline preload="metadata"></video>
        </div>
        <img
          v-else
          :src="product.hero.posterUrl"
          :alt="`${product.name} en computador, tablet y celular`"
          class="mockup"
          fetchpriority="high"
        />
      </div>

      <div class="hero-actions">
        <a href="#comprar" class="btn btn-accent">
          Compra tu licencia <i class="fa-solid fa-arrow-down" aria-hidden="true"></i>
        </a>
        <p v-if="fromPlan" class="from">
          Desde <b>{{ money(fromPlan.priceCents) }}</b> + IVA por profesional / {{ periodLabel[fromPlan.period] }}
        </p>
      </div>

      <ul v-if="product.stats.length" class="stats">
        <li v-for="stat in product.stats" :key="stat.label">
          <b>{{ stat.value }}</b>
          <span>{{ stat.label }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero {
  background:
    radial-gradient(1200px 500px at 50% -10%, rgba(2, 112, 180, 0.12), transparent 70%),
    linear-gradient(180deg, #fff 0%, var(--bg-soft) 100%);
  padding: clamp(40px, 7vw, 80px) 0 clamp(56px, 8vw, 90px);
}

.hero-inner {
  display: grid;
  gap: clamp(28px, 4vw, 40px);
  justify-items: center;
  text-align: center;
}

.hero-copy {
  display: grid;
  gap: 18px;
  max-width: 820px;

  h1 {
    font-size: clamp(2.1rem, 5.4vw, 3.8rem);
    font-weight: 800;
  }
}

.highlight {
  display: block;
  color: var(--accent);
}

.subtitle {
  font-size: clamp(1rem, 1.8vw, 1.18rem);
  max-width: 680px;
  margin-inline: auto;
}

.media {
  width: 100%;
  max-width: 920px;
}

.frame {
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: 22px;
  overflow: hidden;
  background: var(--primary-dark);
  box-shadow: var(--shadow);

  iframe,
  video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
}

.mockup {
  width: 100%;
  height: auto;
  border-radius: 22px;
  background: #fff;
  padding: clamp(12px, 3vw, 28px);
  box-shadow: var(--shadow);
}

.hero-actions {
  display: grid;
  gap: 12px;
  justify-items: center;

  .btn {
    font-size: 1.08rem;
    padding: 18px 34px;
  }
}

.from {
  font-size: 0.95rem;
  color: var(--muted);

  b {
    color: var(--ink);
  }
}

.stats {
  list-style: none;
  padding: 0;
  margin: 8px 0 0;
  width: 100%;
  max-width: 920px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  li {
    background: #fff;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    padding: 20px 14px;
    display: grid;
    gap: 4px;
  }

  b {
    font-size: clamp(1.6rem, 3.4vw, 2.2rem);
    color: var(--primary);
    font-weight: 800;
  }

  span {
    font-size: 0.9rem;
  }
}

@media (max-width: 640px) {
  .stats {
    grid-template-columns: 1fr;
  }
}
</style>
