<script lang="ts">
  import SeoHead from '$lib/ui/toolkit/seo-head.svelte';
  import Button from '$lib/ui/toolkit/button.svelte';
  import { _ } from '$lib/i18n';
  import { getProductImageSrc } from '$lib/shared/product-image';
  import { buildAlternates, softwareApplicationJsonLd } from '$lib/shared/seo';
  import { origin } from '$lib/shared/defaults';
  import { absoluteUrl } from '$lib/shared/paths';

  let { data } = $props();
  const { lang, product } = data;
  const canonical = absoluteUrl(`/${lang}/dotrix/`, origin);
  const alternates = buildAlternates('/dotrix/');
  const imageSrc = $derived(product.image ? getProductImageSrc('dotrix', product.image) : null);
</script>

<SeoHead
  title={product.name}
  description={$_('seo.dotrix.description')}
  {canonical}
  {alternates}
  jsonLd={softwareApplicationJsonLd({
    name: product.name,
    description: product.summary,
    lang,
    slug: 'dotrix',
    externalHref: product.externalHref
  })}
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

      {#if product.highlights?.length}
        <section aria-labelledby="highlights-heading" class="highlights">
          <h2 id="highlights-heading" class="section-title">{$_('product.highlights')}</h2>
          <div class="highlights-grid">
            {#each product.highlights as item (item.title)}
              <article class="highlight-card">
                {#if item.image}
                  <img
                    src="/dotrix/{item.image}"
                    alt={item.title}
                    class="highlight-image"
                    loading="lazy"
                  />
                {/if}
                <div class="highlight-body">
                  <h3>{item.title}</h3>
                  <div class="prose prose-invert prose-sm">{@html item.html}</div>
                </div>
              </article>
            {/each}
          </div>
        </section>
      {/if}

      {#if product.faqHtml}
        <section aria-labelledby="faq-heading" class="faq">
          <h2 id="faq-heading" class="section-title">{$_('product.faq')}</h2>
          <div class="prose prose-invert container-narrow">{@html product.faqHtml}</div>
        </section>
      {/if}

      <div class="product-actions">
        {#if product.externalHref}
          <Button href={product.externalHref} variant="primary">{$_('product.externalSite')}</Button
          >
        {/if}
        <Button href="https://github.com/lowenware/dotrix" variant="outline"
          >{$_('product.seeOnGitHub')}</Button
        >
      </div>
    </article>
  </div>
</main>

<style>
  @import '$lib/ui/template/product-page.css';
</style>
