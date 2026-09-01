<script lang="ts">
  import SeoHead from '$lib/ui/toolkit/seo-head.svelte';
  import Button from '$lib/ui/toolkit/button.svelte';
  import { _ } from '$lib/i18n';
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
  @import '$lib/ui/template/product-page.css';
</style>
