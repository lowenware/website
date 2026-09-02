<script lang="ts">
  import SeoHead from '$lib/ui/toolkit/seo-head.svelte';
  import { _ } from '$lib/i18n';
  import { getProductImageSrc } from '$lib/shared/product-image';
  import { buildAlternates } from '$lib/shared/seo';
  import { origin } from '$lib/shared/defaults';
  import { absoluteUrl } from '$lib/shared/paths';

  let { data } = $props();
  const { lang, product } = data;
  const canonical = absoluteUrl(`/${lang}/mythstic/`, origin);
  const alternates = buildAlternates('/mythstic/');
  const imageSrc = $derived(product.image ? getProductImageSrc('mythstic', product.image) : null);
</script>

<SeoHead
  title={product.name}
  description={$_('seo.mythstic.description')}
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
        <div class="btn btn-outline stay-tuned" role="status">Stay tuned...</div>
      </div>
    </article>
  </div>
</main>

<style>
  @import '$lib/ui/template/product-page.css';

  .stay-tuned {
    cursor: default;
    pointer-events: none;
    opacity: 0.6;
  }
</style>
