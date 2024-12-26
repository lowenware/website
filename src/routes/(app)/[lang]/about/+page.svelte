<script lang="ts">
  import SeoHead from '$lib/ui/toolkit/seo-head.svelte';
  import Button from '$lib/ui/toolkit/button.svelte';
  import { _ } from '$lib/i18n';
  import { buildAlternates } from '$lib/shared/seo';
  import { origin } from '$lib/shared/defaults';
  import { absoluteUrl } from '$lib/shared/paths';

  let { data } = $props();
  const { lang, about } = $derived(data);
  const canonical = $derived(absoluteUrl(`/${lang}/about/`, origin));
  const alternates = $derived(buildAlternates('/about/'));
</script>

<SeoHead
  title={$_('section.about.title')}
  description={$_('seo.about.description')}
  {canonical}
  {alternates}
/>

<main class="page">
  <div class="container">
    <header class="page-header">
      <h1>{$_('section.about.title')}</h1>
    </header>

    <div class="prose prose-invert about-body">{@html about.intro.html}</div>

    {#if about.mission}
      <section class="mission" aria-labelledby="mission-heading">
        <h2 id="mission-heading">{about.mission.title}</h2>
        <div class="prose prose-invert">{@html about.mission.html}</div>
      </section>
    {/if}

    <section class="how-we-work" aria-labelledby="how-heading">
      <h2 id="how-heading">{$_('section.about.howWeWork')}</h2>
      <div class="prose prose-invert">{@html about.howWeWork.html}</div>
    </section>

    <div class="page-cta">
      <Button href="/{lang}/contact/" variant="primary">{$_('section.about.cta')}</Button>
    </div>
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

  .page-header {
    margin-bottom: 2rem;
  }

  .page-header h1 {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 700;
    color: #fff;
  }

  .about-body {
    margin-bottom: 2.5rem;
  }

  .mission {
    margin-bottom: 2.5rem;
    padding: 1.5rem;
    border-radius: 0.5rem;
    background: var(--color-surface);
  }

  .mission h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 1rem;
  }

  .how-we-work h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 1rem;
  }

  .page-cta {
    margin-top: 3rem;
    text-align: center;
  }
</style>
