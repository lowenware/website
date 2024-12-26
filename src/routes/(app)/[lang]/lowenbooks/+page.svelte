<script lang="ts">
  import SeoHead from '$lib/ui/toolkit/seo-head.svelte';
  import Button from '$lib/ui/toolkit/button.svelte';
  import { _ } from '$lib/i18n';
  import { getProductBadge } from '$lib/shared/product-badge';
  import { getProductImageSrc } from '$lib/shared/product-image';
  import { buildAlternates } from '$lib/shared/seo';
  import { origin } from '$lib/shared/defaults';
  import { absoluteUrl } from '$lib/shared/paths';

  let { data } = $props();
  const { lang, product } = data;
  const canonical = absoluteUrl(`/${lang}/lowenbooks/`, origin);
  const alternates = buildAlternates('/lowenbooks/');
  const imageSrc = $derived(
    product.image ? getProductImageSrc('lowenbooks', product.image) : null
  );
</script>

<SeoHead
  title={product.name}
  description={$_('seo.lowenbooks.description')}
  {canonical}
  {alternates}
/>

<main class="page">
  <div class="container-wide">
    <article>
      <p class="product-back">
        <a href="/{lang}/#products" class="text-sm text-blue-brand"
          >← {$_('product.backToProducts')}</a
        >
      </p>
      {#if imageSrc}
        <img src={imageSrc} alt="" class="product-image" loading="lazy" />
      {/if}
      <header class="product-header">
        <h1>{product.name}</h1>
        <p class="product-summary">{product.summary}</p>
      </header>

      <div class="prose prose-invert container-narrow">{@html product.html}</div>

      <div class="product-actions">
        {#if product.externalHref}
          <Button href={product.externalHref} variant="primary"
            >{$_('product.visitMarketplace')}</Button
          >
        {/if}
      </div>
    </article>
  </div>
</main>

<style>
  .page {
    padding: 4rem 0;
  }

  .container-wide {
    max-width: var(--container-8xl);
    margin: 0 auto;
    padding: 0 1rem;
  }

  @media (min-width: 768px) {
    .container-wide {
      padding: 0 2rem;
    }
  }

  .container-narrow {
    max-width: 48rem;
    margin: 0 auto;
  }

  .product-back {
    margin-bottom: 1rem;
  }

  .product-image {
    display: block;
    width: 100%;
    max-height: 240px;
    margin-bottom: 2rem;
    border-radius: 0.375rem;
    object-fit: cover;
    object-position: center;
  }

  .product-header {
    text-align: center;
    margin-bottom: 2.5rem;
  }

  .status-badge {
    display: inline-block;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    color: var(--color-green-brand);
    background: var(--color-dark);
    margin-bottom: 1rem;
  }

  .product-header h1 {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 700;
    color: #fff;
    margin-bottom: 0.75rem;
  }

  .product-summary {
    color: var(--color-grey-600);
    line-height: 1.6;
    max-width: 36rem;
    margin: 0 auto;
  }

  .product-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    margin-top: 2.5rem;
  }
</style>
