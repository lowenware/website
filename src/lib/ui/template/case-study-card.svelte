<script lang="ts">
  import type { CaseStudy } from '$lib/shared/markdown/types';

  type Props = {
    study: CaseStudy;
    compact?: boolean;
  };

  let { study, compact = false }: Props = $props();
</script>

<article class="work-card" class:compact>
  <div class="work-card-content">
    <div class="work-logo-wrap">
      <img src="/projects/{study.logo}" alt="" class="work-logo" loading="lazy" />
    </div>
    <div class="work-body">
      <h3 class="work-title">{study.title}</h3>
      <p class="work-summary">{study.summary}</p>
      {#if study.technologies.length > 0 && !compact}
        <ul class="work-tech" aria-label="Technologies">
          {#each study.technologies as tech (tech)}
            <li>{tech}</li>
          {/each}
        </ul>
      {/if}
    </div>
  </div>
</article>

<style>
  .work-card {
    border-radius: 0.5rem;
    background: var(--color-surface);
    overflow: hidden;
  }

  .work-card-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1.75rem;
    text-align: center;
    height: 100%;
  }

  .work-logo-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 4rem;
    width: 100%;
  }

  .work-logo {
    display: block;
    height: 4rem;
    width: auto;
    object-fit: contain;
    object-position: center;
    filter: brightness(0) invert(1);
    opacity: 0.85;
  }

  .work-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 0.5rem;
  }

  .work-summary {
    font-size: 0.875rem;
    line-height: 1.6;
    color: var(--color-grey-600);
  }

  .work-tech {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
    margin-top: 0.75rem;
    list-style: none;
    padding: 0;
  }

  .work-tech li {
    font-size: 0.75rem;
    padding: 0.2rem 0.6rem;
    border-radius: 9999px;
    background: var(--color-dark);
    color: var(--color-grey-600);
  }

  .compact .work-summary {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
