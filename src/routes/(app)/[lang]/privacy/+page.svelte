<script lang="ts">
  import SeoHead from '$lib/ui/toolkit/seo-head.svelte';
  import { _ } from '$lib/i18n';
  import { buildAlternates } from '$lib/shared/seo';
  import { origin } from '$lib/shared/defaults';
  import { absoluteUrl } from '$lib/shared/paths';

  let { data } = $props();
  const { lang, privacy } = $derived(data);
  const canonical = $derived(absoluteUrl(`/${lang}/privacy/`, origin));
  const alternates = $derived(buildAlternates('/privacy/'));
</script>

<SeoHead
  title={privacy.title}
  description={$_('seo.privacy.description')}
  {canonical}
  {alternates}
/>

<main class="page">
  <div class="container">
    <h1>{privacy.title}</h1>
    <div class="prose prose-invert">{@html privacy.html}</div>
  </div>
</main>

<style>
  .page {
    padding: 4rem 0;
  }

  .container {
    max-width: 48rem;
    margin: 0 auto;
    padding: 0 1rem;
  }

  @media (min-width: 768px) {
    .container {
      padding: 0 2rem;
    }
  }

  h1 {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 700;
    color: #fff;
    margin-bottom: 2rem;
  }
</style>
