<script lang="ts">
  import type { Locale } from '$lib/shared/defaults';
  import type { HeroData } from '$lib/shared/markdown/types';
  import Button from '$lib/ui/toolkit/button.svelte';

  type Props = {
    lang: Locale;
    hero: HeroData;
  };

  let { lang, hero }: Props = $props();

  const primaryHref = $derived(
    hero.primaryCtaHref.startsWith('/') ? `/${lang}${hero.primaryCtaHref}` : hero.primaryCtaHref
  );
  const secondaryHref = $derived(
    hero.secondaryCtaHref.startsWith('/')
      ? `/${lang}${hero.secondaryCtaHref}`
      : hero.secondaryCtaHref
  );

  const imageSrc = $derived(hero.image ? `/${hero.image}` : null);

  // Switch hero theme: use 'hero--dark-bg' for dark background images.
  const heroTheme = 'hero--dark-bg';
</script>

<section id="home" class="hero {heroTheme}" aria-labelledby="hero-heading">
  {#if imageSrc}
    <img src={imageSrc} alt="" class="hero-image" fetchpriority="high" />
    <div class="hero-overlay" aria-hidden="true"></div>
  {/if}

  <div class="hero-content">
    <div class="hero-inner">
      <h1 id="hero-heading" class="hero-title">{hero.title}</h1>
      <p class="hero-subtitle">{hero.subtitle}</p>
    </div>
    <div class="hero-actions">
      <Button href={primaryHref} variant="primary">{hero.primaryCta}</Button>
      <Button href={secondaryHref} variant="outline">{hero.secondaryCta}</Button>
    </div>
  </div>
</section>

<style>
  .hero {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: min(75vh, 640px);
    overflow: hidden;
    background: var(--color-dark);
  }

  .hero-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  .hero-overlay {
    position: absolute;
    inset: 0;
  }

  /* Light background image: subtle scrim, dark text */
  .hero--light-bg {
    background: var(--color-grey-200);
  }

  .hero--light-bg .hero-overlay {
    background: linear-gradient(
      to bottom,
      rgba(10, 11, 13, 0.1) 0%,
      rgba(10, 11, 13, 0.2) 55%,
      rgba(10, 11, 13, 0.4) 100%
    );
  }

  .hero--light-bg .hero-title {
    color: var(--color-dark);
  }

  .hero--light-bg .hero-subtitle {
    color: var(--color-grey-600);
  }

  .hero--light-bg :global(.btn-outline) {
    color: var(--color-dark);
    border-color: var(--color-grey-300);
  }

  .hero--light-bg :global(.btn-outline:hover:not(:disabled)) {
    border-color: var(--color-blue-brand);
    color: var(--color-blue-brand);
  }

  /* Dark background image: heavy scrim, light text */
  .hero--dark-bg {
    background: var(--color-dark);
  }

  .hero--dark-bg .hero-overlay {
    background: linear-gradient(
      to bottom,
      rgba(10, 11, 13, 0.3) 0%,
      rgba(10, 11, 13, 0.6) 55%,
      rgba(10, 11, 13, 0.3) 100%
    );
  }

  .hero--dark-bg .hero-title {
    color: #fff;
  }

  .hero--dark-bg .hero-subtitle {
    color: var(--color-grey-200);
  }

  .hero-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2.5rem;
    padding: 4rem max(1rem, env(safe-area-inset-right)) 3rem max(1rem, env(safe-area-inset-left));
    text-align: center;
    width: 100%;
  }

  @media (min-width: 768px) {
    .hero-content {
      padding: 6rem 1.5rem 4rem;
    }
  }

  .hero-inner {
    max-width: 48rem;
  }

  .hero-title {
    font-size: clamp(2rem, 5vw, 3.25rem);
    font-weight: 700;
    line-height: 1.15;
    margin-bottom: 1.25rem;
  }

  .hero-subtitle {
    font-size: clamp(1rem, 2.5vw, 1.25rem);
    line-height: 1.6;
    max-width: 40rem;
    margin: 0 auto;
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
  }
</style>
