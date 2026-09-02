<script lang="ts">
  import type { Locale } from '$lib/shared/defaults';
  import type { ProductCard } from '$lib/shared/markdown';
  import Button from '$lib/ui/toolkit/button.svelte';
  import { _ } from '$lib/i18n';
  import { getProductBadge } from '$lib/shared/product-badge';
  import { getProductImageSrc } from '$lib/shared/product-image';

  type Props = {
    lang: Locale;
    product: ProductCard;
  };

  let { lang: _lang, product }: Props = $props();

  const imageSrc = $derived(product.image ? getProductImageSrc(product.slug, product.image) : null);

  const primaryLabel = $derived(
    product.isPlaceholder ? $_('product.comingSoon') : $_('product.learnMore')
  );

  const primaryHref = $derived(product.pagePath);
</script>

<article class="product-card">
  {#if imageSrc}
    <a href={primaryHref}>
      <img src={imageSrc} alt="" class="product-image" loading="lazy" />
    </a>
  {/if}
  <div class="product-body">
    <div class="product-caption">
      <h3 class="product-title"><a href={primaryHref}>{product.name}</a></h3>
      {#if product.badge}
        {@const badge = getProductBadge(product.badge)}
        <span class={badge.className}>{$_(badge.labelKey)}</span>
      {/if}
    </div>
    <p class="product-summary">{product.summary}</p>
    <div class="product-actions">
      <Button href={primaryHref} variant="primary">{primaryLabel}</Button>
    </div>
  </div>
</article>

<style>
  .product-card {
    display: flex;
    flex-direction: column;
    border-radius: 0.5rem;
    background: var(--color-surface-lighter);
    overflow: hidden;
    height: 100%;
  }

  .product-image {
    height: 10rem;
    width: 100%;
    object-fit: cover;
    opacity: 0.85;
  }

  .product-caption {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem 1rem;
    justify-content: space-between;
  }

  @media (max-width: 400px) {
    .product-caption {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  .product-body {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 0.75rem;
    padding: 1.5rem;
  }

  .status-badge {
    display: inline-block;
    align-self: flex-start;
    font-size: 0.8rem;
    text-transform: uppercase;
    padding: 0.2rem 0.6rem;
    border-radius: 9999px;
    color: var(--color-grey-600);
    background: var(--color-dark);
  }

  .status-live {
    color: var(--color-green-brand);
  }

  .status-oss {
    color: var(--color-blue-brand);
  }

  .product-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: #fff;
  }

  .product-summary {
    flex: 1;
    font-size: 0.875rem;
    line-height: 1.6;
    color: var(--color-grey-600);
  }

  .product-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
</style>
