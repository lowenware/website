<script lang="ts">
  import SeoHead from '$lib/ui/toolkit/seo-head.svelte';
  import Button from '$lib/ui/toolkit/button.svelte';
  import { _ } from '$lib/i18n';
  import { getProductBadge } from '$lib/shared/product-badge';
  import { getProductImageSrc } from '$lib/shared/product-image';
  import { buildAlternates, softwareApplicationJsonLd } from '$lib/shared/seo';
  import { origin } from '$lib/shared/defaults';
  import { absoluteUrl } from '$lib/shared/paths';

  let { data } = $props();
  const { lang, product } = data;
  const canonical = absoluteUrl(`/${lang}/dotrix/`, origin);
  const alternates = buildAlternates('/dotrix/');
  const imageSrc = $derived(
    product.image ? getProductImageSrc('dotrix', product.image) : null
  );
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
    color: var(--color-blue-brand);
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

  .section-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    text-align: center;
    margin-bottom: 2rem;
  }

  .highlights {
    margin-top: 4rem;
  }

  .highlights-grid {
    display: grid;
    gap: 1.25rem;
  }

  @media (min-width: 768px) {
    .highlights-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .highlight-card {
    border-radius: 0.5rem;
    background: var(--color-surface);
    overflow: hidden;
  }

  .highlight-image {
    height: 10rem;
    width: 100%;
    object-fit: cover;
    opacity: 0.85;
  }

  .highlight-body {
    padding: 1.25rem;
  }

  .highlight-body h3 {
    font-size: 1.125rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 0.75rem;
  }

  .faq {
    margin-top: 4rem;
  }

  .product-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    margin-top: 3rem;
  }
</style>
