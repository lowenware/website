<script lang="ts">
  import SeoHead from '$lib/ui/toolkit/seo-head.svelte';
  import BlogCard from '$lib/ui/template/blog-card.svelte';
  import { _ } from '$lib/i18n';
  import { buildAlternates } from '$lib/shared/seo';
  import { origin } from '$lib/shared/defaults';
  import { absoluteUrl } from '$lib/shared/paths';
  import type { BlogPostMeta } from '$lib/shared/markdown';
  import type { Locale } from '$lib/shared/defaults';

  interface Props {
    lang: Locale;
    posts: BlogPostMeta[];
    currentPage: number;
    totalPages: number;
  }

  let { lang, posts, currentPage, totalPages }: Props = $props();

  const canonical = $derived(
    absoluteUrl(`/${lang}/blog/${currentPage > 1 ? `${currentPage}/` : ''}`, origin)
  );
  const alternates = buildAlternates('/blog/');
</script>

<SeoHead
  title={$_('nav.insights')}
  description={$_('seo.blog.description')}
  {canonical}
  {alternates}
/>

<main class="page-shell">
  <h1 class="section-heading">{$_('nav.insights')}</h1>
  {#if posts.length === 0}
    <p class="text-center text-grey-600">{$_('blog.noPosts')}</p>
  {:else}
    <div class="blog-grid">
      {#each posts as post (post.slug)}
        <BlogCard {lang} {post} />
      {/each}
    </div>
  {/if}
  {#if totalPages > 1}
    <nav aria-label="Pagination" class="pagination">
      {#if currentPage > 1}
        <a
          href="/{lang}/blog/{currentPage === 2 ? '' : `${currentPage - 1}/`}"
          class="btn btn-primary">← {$_('blog.page')} {currentPage - 1}</a
        >
      {/if}
      <span class="pagination-status"
        >{$_('blog.page')} {currentPage} {$_('blog.of')} {totalPages}</span
      >
      {#if currentPage < totalPages}
        <a href="/{lang}/blog/{currentPage + 1}/" class="btn btn-primary"
          >{$_('blog.page')} {currentPage + 1} →</a
        >
      {/if}
    </nav>
  {/if}
</main>
