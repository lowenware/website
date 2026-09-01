<script lang="ts">
  import type { Locale } from '$lib/shared/defaults';
  import type { Strength } from '$lib/shared/markdown/types';
  import StrengthCard from '$lib/ui/template/strength-card.svelte';
  import Button from '$lib/ui/toolkit/button.svelte';
  import { _ } from '$lib/i18n';

  type Props = {
    lang: Locale;
    strengths: Strength[];
  };

  let { lang, strengths }: Props = $props();
</script>

<section id="strengths" class="section strengths-section" aria-labelledby="strengths-heading">
  <div class="tagline-container">
    <div class="tagline-card">
      <h1 id="strengths-heading" class="tagline-title">
        {$_('section.strengths.title')}
      </h1>
      <p class="tagline-subtitle">{$_('section.strengths.subtitle')}</p>
    </div>
  </div>
  <div class="container">
    <div class="strengths-grid">
      {#each strengths as strength, index (strength.slug)}
        <StrengthCard {strength} index={index + 1} />
      {/each}
    </div>
    <div class="section-cta">
      <Button href="/{lang}/services/" variant="primary">{$_('section.strengths.ctaMoreAboutServices')}</Button>
    </div>
  </div>
</section>

<style>
  @import './home-section.css';

  .strengths-section {
    position: relative;
  }

  .tagline-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 8rem;
    flex-direction: column;
    padding: 0 max(1rem, env(safe-area-inset-right)) 0 max(1rem, env(safe-area-inset-left));
    margin-bottom: 1.5rem;
  }

  .tagline-card {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    width: 100%;
    max-width: 48rem;
    padding: 1.5rem 1rem;
    text-align: center;
    background: var(--color-dark);
    backdrop-filter: blur(8px);
    border-radius: 0.5rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
  }

  @media (min-width: 768px) {
    .tagline-container {
      position: absolute;
      z-index: 10;
      top: -4rem;
      margin-bottom: 0;
      padding: 0;
    }

    .tagline-card {
      width: 90%;
      padding: 0;
    }
  }

  .tagline-title {
    font-size: clamp(1.25rem, 2.5vw, 1.75rem);
    font-weight: 700;
    line-height: 1.25;
    color: #fff;
  }

  .tagline-subtitle {
    font-size: clamp(0.9375rem, 2vw, 1.0625rem);
    line-height: 1.6;
    color: var(--color-grey-600);
    max-width: 36rem;
  }

  .strengths-grid {
    display: grid;
    gap: 2rem;
  }

  @media (min-width: 768px) {
    .strengths-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .strengths-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }
</style>
