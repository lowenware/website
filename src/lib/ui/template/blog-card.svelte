<script lang="ts">
  import type { Locale } from '$lib/shared/defaults';
  import type { BlogPostMeta } from '$lib/shared/markdown';
  import { _ } from '$lib/i18n';

  type Props = {
    lang: Locale;
    post: BlogPostMeta;
  };

  let { lang, post }: Props = $props();

  const href = $derived(`/${lang}/blog/${post.slug}/`);
  const cardImage = $derived(post.preview ?? post.image);
  const dateStr = $derived(
    post.date.toLocaleDateString(lang === 'cs' ? 'cs-CZ' : 'en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  );
</script>

<article class="blog-card">
  {#if cardImage}
    <a {href} tabindex="-1" aria-hidden="true">
      <img src="/blog/{cardImage}" alt="" class="blog-image" loading="lazy" />
    </a>
  {/if}
  <div class="blog-body">
    <h3 class="blog-title">
      <a {href}>{post.title}</a>
    </h3>
    <p class="blog-meta">{dateStr} · {post.author}</p>
    <p class="blog-summary">{post.summary}</p>
    <a {href} class="blog-read-more">{$_('blog.readMore')}</a>
  </div>
</article>

<style>
  .blog-card {
    display: flex;
    flex-direction: column;
    border-radius: 0.5rem;
    background: var(--color-surface);
    overflow: hidden;
    height: 100%;
  }

  .blog-image {
    height: 10rem;
    width: 100%;
    object-fit: cover;
    opacity: 0.85;
  }

  .blog-body {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 0.5rem;
    padding: 1.25rem;
  }

  .blog-title {
    font-size: 1rem;
    font-weight: 700;
  }

  .blog-title a {
    color: #fff;
    text-decoration: none;
  }

  .blog-title a:hover {
    color: var(--color-blue-brand);
  }

  .blog-meta {
    font-size: 0.75rem;
    color: var(--color-grey-500);
  }

  .blog-summary {
    flex: 1;
    font-size: 0.875rem;
    line-height: 1.6;
    color: var(--color-grey-600);
  }

  .blog-read-more {
    font-size: 0.8125rem;
    color: var(--color-blue-brand);
    margin-top: 0.25rem;
  }
</style>
