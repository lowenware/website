<script lang="ts">
  type Props = {
    title: string;
    description?: string;
    canonical?: string;
    alternates?: Array<{ lang: string; href: string }>;
    ogImage?: string;
    ogType?: string;
    jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
    noindex?: boolean;
  };

  let {
    title,
    description,
    canonical,
    alternates = [],
    ogImage,
    ogType = 'website',
    jsonLd,
    noindex = false
  }: Props = $props();

  const fullTitle = $derived(title.includes('Löwenware') ? title : `${title} | Löwenware`);

  function jsonLdScriptTag(item: Record<string, unknown>): string {
    const endScript = '</' + 'script>';
    return `<script type="application/ld+json">${JSON.stringify(item)}${endScript}`;
  }

  const jsonLdItems = $derived(jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []);
</script>

<svelte:head>
  <title>{fullTitle}</title>
  {#if description}
    <meta name="description" content={description} />
  {/if}
  {#if noindex}
    <meta name="robots" content="noindex" />
  {/if}
  {#if canonical}
    <link rel="canonical" href={canonical} />
  {/if}
  {#each alternates as alt (alt.lang)}
    <link rel="alternate" hreflang={alt.lang} href={alt.href} />
  {/each}
  {#if alternates.length}
    <link
      rel="alternate"
      hreflang="x-default"
      href={alternates.find((a) => a.lang === 'en')?.href ?? canonical}
    />
  {/if}
  <meta property="og:title" content={fullTitle} />
  {#if description}
    <meta property="og:description" content={description} />
  {/if}
  {#if canonical}
    <meta property="og:url" content={canonical} />
  {/if}
  <meta property="og:type" content={ogType} />
  {#if ogImage}
    <meta property="og:image" content={ogImage} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content={ogImage} />
  {/if}
  {#if jsonLdItems.length}
    {#each jsonLdItems as item, i (i)}
      {@html jsonLdScriptTag(item)}
    {/each}
  {/if}
</svelte:head>
