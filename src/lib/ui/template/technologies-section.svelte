<script lang="ts">
  import type { Technology } from '$lib/shared/markdown/types';
  import { _ } from '$lib/i18n';

  type Props = {
    technologies: Technology[];
  };

  let { technologies }: Props = $props();
</script>

<section
  id="technologies"
  class="section section-alt technologies-section"
  aria-labelledby="technologies-heading"
>
  <div class="container">
    <h2 id="technologies-heading" class="section-title">{$_('section.technologies.title')}</h2>
    <p class="section-subtitle">{$_('section.technologies.subtitle')}</p>
    <ul class="technologies-grid">
      {#each technologies as tech (tech.slug)}
        <li class="technology-item">
          {#if tech.icon}
            <img
              class="technology-icon"
              src="/icons/{tech.icon}"
              alt=""
              width={tech.width ?? 48}
              height={tech.height ?? 48}
              loading="lazy"
            />
          {/if}
          <span class="technology-label">{tech.label}</span>
        </li>
      {/each}
    </ul>
  </div>
</section>

<style>
  @import './home-section.css';

  .technologies-section {
    background: var(--color-surface);
  }

  .technologies-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  @media (min-width: 640px) {
    .technologies-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .technologies-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .technology-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 1.25rem 1rem;
    border-radius: 0.5rem;
    border: 1px solid var(--color-surface-border);
    background: var(--color-surface-lighter);
  }

  .technology-icon {
    width: auto;
    height: 3rem;
    max-width: 100%;
    object-fit: contain;
  }

  .technology-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-grey-400);
    text-align: center;
  }
</style>
