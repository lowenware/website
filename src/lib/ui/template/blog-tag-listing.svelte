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
    tag: string;
    posts: BlogPostMeta[];
    currentPage: number;
    totalPages: number;
  }

  let { lang, tag, posts, currentPage, totalPages }: Props = $props();

  const canonical = $derived(
    absoluteUrl(`/${lang}/blog/tags/${tag}/${currentPage > 1 ? `${currentPage}/` : ''}`, origin)
  );
  const alternates = $derived(buildAlternates(`/blog/tags/${tag}/`));
</script>

<SeoHead title="{tag} | {$_('nav.blog')}" {canonical} {alternates} />

<main class="page-shell">
  <h1 class="section-heading">{$_('blog.tagged')} {tag}</h1>
  <div class="blog-grid">
    {#each posts as post (post.slug)}
      <BlogCard {lang} {post} />
    {/each}
  </div>
  {#if totalPages > 1}
    <nav aria-label="Pagination" class="pagination">
      {#if currentPage > 1}
        <a
          href="/{lang}/blog/tags/{tag}/{currentPage === 2 ? '' : `${currentPage - 1}/`}"
          class="btn btn-primary">←</a
        >
      {/if}
      <span class="pagination-status">{currentPage} / {totalPages}</span>
      {#if currentPage < totalPages}
        <a href="/{lang}/blog/tags/{tag}/{currentPage + 1}/" class="btn btn-primary">→</a>
      {/if}
    </nav>
  {/if}
</main>
