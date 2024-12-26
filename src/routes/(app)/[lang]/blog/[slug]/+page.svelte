<script lang="ts">
  import { onMount } from 'svelte';
  import BlogListing from '$lib/ui/template/blog-listing.svelte';
  import SeoHead from '$lib/ui/toolkit/seo-head.svelte';
  import { _ } from '$lib/i18n';
  import { buildAlternates, blogPostingJsonLd } from '$lib/shared/seo';
  import { origin } from '$lib/shared/defaults';
  import { absoluteUrl } from '$lib/shared/paths';

  let { data } = $props();

  const post = $derived(data.mode === 'post' ? data.post : null);
  const lang = $derived(data.lang);
  const canonical = $derived(post ? absoluteUrl(`/${lang}/blog/${post.slug}/`, origin) : '');
  const alternates = $derived(post ? buildAlternates(`/blog/${post.slug}/`) : []);
  const dateStr = $derived(
    post
      ? post.date.toLocaleDateString(lang === 'cs' ? 'cs-CZ' : 'en-GB', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : ''
  );

  onMount(() => {
    if (!post?.comments) return;
    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.setAttribute('repo', 'lowenware/website');
    script.setAttribute('issue-term', 'pathname');
    script.setAttribute('theme', 'github-dark');
    script.crossOrigin = 'anonymous';
    script.async = true;
    document.getElementById('utterances-thread')?.appendChild(script);
  });
</script>

{#if data.mode === 'listing'}
  <BlogListing
    lang={data.lang}
    posts={data.posts}
    currentPage={data.currentPage}
    totalPages={data.totalPages}
  />
{:else if post}
  <SeoHead
    title={post.title}
    description={post.summary}
    {canonical}
    {alternates}
    ogImage={post.image ? absoluteUrl(`/blog/${post.image}`, origin) : undefined}
    ogType="article"
    jsonLd={blogPostingJsonLd({ ...post, lang })}
  />

  <main class="post-page">
    <article>
      <header class="post-header">
        <p class="post-back">
          <a href="/{lang}/blog/" class="text-sm text-blue-brand">← {$_('blog.backToBlog')}</a>
        </p>
        <h1 class="post-title">{post.title}</h1>
        <p class="post-meta text-sm text-grey-600">
          <time datetime={post.date.toISOString()}>{dateStr}</time> · {post.author}
        </p>
        {#if post.tags.length}
          <p class="post-tags text-sm">
            {$_('blog.tagged')}
            {#each post.tags as tag, i (tag)}
              <a href="/{lang}/blog/tags/{tag}/" class="text-blue-brand">{tag}</a>{i <
              post.tags.length - 1
                ? ', '
                : ''}
            {/each}
          </p>
        {/if}
      </header>
      {#if post.image}
        <img src="/blog/{post.image}" alt="" class="post-image" loading="lazy" />
      {/if}
      {#if post.youtube}
        <div class="video-embed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/{post.youtube}"
            title={post.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
      {/if}
      <div class="prose">{@html post.html}</div>
      {#if post.comments}
        <section aria-labelledby="comments-heading" class="post-comments">
          <h2 id="comments-heading" class="comments-heading">{$_('blog.comments')}</h2>
          <div id="utterances-thread"></div>
        </section>
      {/if}
    </article>
  </main>
{/if}

<style>
  .post-page {
    max-width: 48rem;
    margin: 0 auto;
    padding: 3rem 1rem;
  }

  @media (min-width: 768px) {
    .post-page {
      padding-left: 2rem;
      padding-right: 2rem;
    }
  }

  .post-header {
    margin-bottom: 2rem;
  }

  .post-back {
    margin-bottom: 0.5rem;
  }

  .post-title {
    margin-bottom: 1rem;
    font-size: 1.875rem;
    line-height: 1.2;
    color: #fff;
  }

  .post-tags {
    margin-top: 0.5rem;
  }

  .post-image {
    width: 100%;
    margin-bottom: 2rem;
    border-radius: 0.375rem;
  }

  .post-comments {
    margin-top: 3rem;
  }

  .comments-heading {
    margin-bottom: 1rem;
    font-size: 1.25rem;
    color: #fff;
  }

  .video-embed {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    margin-bottom: 2rem;
    overflow: hidden;
    border-radius: 0.5rem;
    background: var(--color-surface);
  }

  .video-embed iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
</style>
