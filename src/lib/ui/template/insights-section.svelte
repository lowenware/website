<script lang="ts">
  import type { Locale } from '$lib/shared/defaults';
  import type { BlogPostMeta } from '$lib/shared/markdown/types';
  import BlogCard from '$lib/ui/template/blog-card.svelte';
  import Button from '$lib/ui/toolkit/button.svelte';
  import { _ } from '$lib/i18n';

  type Props = {
    lang: Locale;
    blogPreview: BlogPostMeta[];
  };

  let { lang, blogPreview }: Props = $props();
</script>

{#if blogPreview.length > 0}
  <section id="insights" class="section" aria-labelledby="insights-heading">
    <div class="container">
      <h2 id="insights-heading" class="section-title">{$_('section.insights.title')}</h2>
      <p class="section-subtitle">{$_('section.insights.subtitle')}</p>
      <div class="insights-grid">
        {#each blogPreview as post (post.slug)}
          <BlogCard {lang} {post} />
        {/each}
      </div>
      <div class="section-cta">
        <Button href="/{lang}/blog/" variant="primary">{$_('section.blog.viewAll')}</Button>
      </div>
    </div>
  </section>
{/if}

<style>
  @import './home-section.css';

  .insights-grid {
    display: grid;
    gap: 1.25rem;
  }

  @media (min-width: 768px) {
    .insights-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>
