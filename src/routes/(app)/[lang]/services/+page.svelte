<script lang="ts">
  import SeoHead from '#lib/ui/toolkit/seo-head.svelte';
  import PageHero from '#lib/ui/template/page-hero.svelte';
  import ServiceCard from '#lib/ui/template/service-card.svelte';
  import CaseStudyCard from '#lib/ui/template/case-study-card.svelte';
  import TechnologiesSection from '#lib/ui/template/technologies-section.svelte';
  import Button from '#lib/ui/toolkit/button.svelte';
  import { _ } from '#lib/i18n/index.ts';
  import { buildAlternates } from '#lib/shared/seo.ts';
  import { origin } from '#lib/shared/defaults.ts';
  import { absoluteUrl } from '#lib/shared/paths.ts';

  let { data } = $props();
  const { lang, services, studies, technologies } = $derived(data);
  const canonical = $derived(absoluteUrl(`/${lang}/services/`, origin));
  const alternates = $derived(buildAlternates('/services/'));

  const processSteps = $derived([1, 2, 3, 4] as const);
</script>

<SeoHead
  title={$_('section.services.title')}
  description={$_('seo.services.description')}
  {canonical}
  {alternates}
/>

<main class="page">
  <PageHero
    eyebrow={$_('section.services.eyebrow')}
    title={$_('section.services.heroTitle')}
    subtitle={$_('section.services.subtitle')}
    image="slides/services-hero.webp"
    headingId="services-hero-heading"
  />

  <section class="section services-section">
    <div class="container">
      <div class="services-grid">
        {#each services as service (service.slug)}
          <ServiceCard {lang} {service} />
        {/each}
      </div>
    </div>
  </section>

  <section class="section process-section" aria-labelledby="process-heading">
    <div class="container">
      <h2 id="process-heading" class="process-title">{$_('section.services.process.title')}</h2>
      <div class="process-grid">
        {#each processSteps as step (step)}
          <article class="process-step">
            <div class="process-step-content">
              <div class="process-step-num-wrap">
                <span class="process-step-num">{step}</span>
              </div>
              <h3 class="process-step-title">{$_(`section.services.process.step${step}.title`)}</h3>
              <p class="process-step-text">{$_(`section.services.process.step${step}.text`)}</p>
            </div>
          </article>
        {/each}
      </div>
    </div>
  </section>

  <section id="work" class="section work-section" aria-labelledby="work-heading">
    <div class="container">
      <header class="work-header">
        <h2 id="work-heading">{$_('section.services.trusted.title')}</h2>
        <p class="work-subtitle">{$_('section.services.trusted.subtitle')}</p>
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
        <p class="page-cta-text">{$_('section.services.ctaText')}</p>
        <Button href="/{lang}/contact/" variant="primary">{$_('section.services.cta')}</Button>
      </div>
    </div>
  </section>
</main>

<style>
  @import '../../../../lib/ui/template/home-section.css';

  .page {
    padding: 0;
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

  .services-section {
    padding-top: 3.5rem;
  }

  @media (min-width: 768px) {
    .services-section {
      padding-top: 4rem;
    }
  }

  .services-grid {
    display: grid;
    gap: 1.5rem;
  }

  @media (min-width: 1024px) {
    .services-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .process-section {
    background: var(--color-surface-lighter);
  }

  .process-title {
    margin: 0 0 2rem;
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 700;
    color: #fff;
    text-align: center;
  }

  .process-grid {
    display: grid;
    gap: 1.5rem;
  }

  @media (min-width: 768px) {
    .process-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .process-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .process-step {
    margin: 0;
    border-radius: 0.5rem;
    background: var(--color-surface);
    overflow: hidden;
    height: 100%;
  }

  .process-step-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1.75rem;
    text-align: center;
    height: 100%;
  }

  .process-step-num-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 4rem;
    width: 100%;
  }

  .process-step-num {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 9999px;
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--color-blue-brand);
    background: var(--color-dark);
  }

  .process-step-title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 700;
    color: #fff;
  }

  .process-step-text {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.6;
    color: var(--color-grey-600);
  }

  .work-section {
    background: var(--color-surface-lighter);
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
    margin: 0;
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 700;
    color: #fff;
  }

  .page-cta-text {
    margin: 0;
    max-width: 40rem;
    font-size: 1.0625rem;
    line-height: 1.6;
    color: var(--color-grey-600);
  }
</style>
