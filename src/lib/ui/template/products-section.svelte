<script lang="ts">
  import type { Locale } from '$lib/shared/defaults';
  import type { ProductCard } from '$lib/shared/markdown/types';
  import ProductCardComponent from '$lib/ui/template/product-card.svelte';
  import { _ } from '$lib/i18n';

  type Props = {
    lang: Locale;
    products: ProductCard[];
  };

  let { lang, products }: Props = $props();
</script>

<section id="products" class="section section-alt" aria-labelledby="products-heading">
  <div class="container">
    <h2 id="products-heading" class="section-title">{$_('section.products.title')}</h2>
    <p class="section-subtitle">{$_('section.products.subtitle')}</p>
    <div class="products-grid">
      {#each products as product (product.slug)}
        <ProductCardComponent {lang} {product} />
      {/each}
    </div>
  </div>
</section>

<style>
  @import './home-section.css';

  .products-grid {
    display: grid;
    gap: 1.25rem;
  }

  @media (min-width: 768px) {
    .products-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>
