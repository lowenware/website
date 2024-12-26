<script lang="ts">
  import type { Locale } from '$lib/shared/defaults';
  import type { CaseStudy } from '$lib/shared/markdown/types';
  import CaseStudyCard from '$lib/ui/template/case-study-card.svelte';
  import Button from '$lib/ui/toolkit/button.svelte';
  import { _ } from '$lib/i18n';

  type Props = {
    lang: Locale;
    featuredWork: CaseStudy[];
  };

  let { lang, featuredWork }: Props = $props();
</script>

<section id="work" class="section section-alt" aria-labelledby="work-heading">
  <div class="container">
    <h2 id="work-heading" class="section-title">{$_('section.work.title')}</h2>
    <p class="section-subtitle">{$_('section.work.subtitle')}</p>
    <div class="work-grid">
      {#each featuredWork as study (study.slug)}
        <CaseStudyCard {study} />
      {/each}
    </div>
    <div class="section-cta">
      <Button href="/{lang}/services/#work" variant="primary">{$_('section.work.viewAll')}</Button>
    </div>
  </div>
</section>

<style>
  @import './home-section.css';

  .work-grid {
    display: grid;
    gap: 1.25rem;
  }

  @media (min-width: 768px) {
    .work-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>
