<script lang="ts">
  import SeoHead from '$lib/ui/toolkit/seo-head.svelte';
  import ServiceCard from '$lib/ui/template/service-card.svelte';
  import CaseStudyCard from '$lib/ui/template/case-study-card.svelte';
  import TechnologiesSection from '$lib/ui/template/technologies-section.svelte';
  import Button from '$lib/ui/toolkit/button.svelte';
  import { _ } from '$lib/i18n';
  import { buildAlternates } from '$lib/shared/seo';
  import { origin } from '$lib/shared/defaults';
  import { absoluteUrl } from '$lib/shared/paths';

  let { data } = $props();
  const { lang, services, studies, technologies } = $derived(data);
  const canonical = $derived(absoluteUrl(`/${lang}/services/`, origin));
  const alternates = $derived(buildAlternates('/services/'));
</script>

<SeoHead
  title={$_('section.services.title')}
  description={$_('seo.services.description')}
  {canonical}
  {alternates}
/>

<main class="page">
  <div class="container services-intro">
    <header class="page-header">
      <h1>{$_('section.services.title')}</h1>
      <p class="page-subtitle">{$_('section.services.subtitle')}</p>
    </header>

    <div class="services-grid">
      {#each services as service (service.slug)}
        <ServiceCard {service} />
      {/each}
    </div>
  </div>

  <section id="work" class="section work-section" aria-labelledby="work-heading">
    <div class="container">
      <header class="work-header">
        <h2 id="work-heading">{$_('section.work.title')}</h2>
        <p class="work-subtitle">{$_('section.work.subtitle')}</p>
      </header>

      <div class="work-grid">
        {#each studies as study (study.slug)}
          <CaseStudyCard {study} />
        {/each}
      </div>
    </div>
  </section>

  <TechnologiesSection {technologies} />

  <section class="section page-cta-section" aria-labelledby="services-cta-heading">
    <div class="container">
      <div class="page-cta">
        <h2 id="services-cta-heading" class="page-cta-title">{$_('section.services.ctaTitle')}</h2>
        <Button href="/{lang}/contact/" variant="primary">{$_('section.services.cta')}</Button>
      </div>
    </div>
  </section>
</main>

<style>
  @import '$lib/ui/template/home-section.css';

  .page {
    padding: 4rem 0 0;
  }

  .container {
    max-width: var(--container-8xl);
    margin: 0 auto;
    padding: 0 1rem;
  }

  @media (min-width: 768px) {
    .container {
      padding: 0 2rem;
    }
  }

  .services-intro {
    padding-bottom: 4rem;
  }

  .page-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .page-header h1 {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 700;
    color: #fff;
    margin-bottom: 0.75rem;
  }

  .page-subtitle {
    color: var(--color-grey-600);
    max-width: 36rem;
    margin: 0 auto;
    line-height: 1.6;
  }

  .services-grid {
    display: grid;
    gap: 1.5rem;
  }

  @media (min-width: 768px) {
    .services-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .work-section {
    background: var(--color-surface-lighter);
    padding: 6rem 0;
    border-top: none;
  }

  .work-header {
    text-align: center;
    margin-bottom: 2.5rem;
  }

  .work-header h2 {
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 700;
    color: #fff;
    margin-bottom: 0.75rem;
  }

  .work-subtitle {
    color: var(--color-grey-600);
    max-width: 36rem;
    margin: 0 auto;
    line-height: 1.6;
  }

  .work-grid {
    display: grid;
    gap: 1.25rem;
  }

  @media (min-width: 768px) {
    .work-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .work-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .page-cta-section {
    background: var(--color-surface-lighter);
  }

  .page-cta {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    text-align: center;
  }

  .page-cta-title {
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 700;
    color: #fff;
  }
</style>
