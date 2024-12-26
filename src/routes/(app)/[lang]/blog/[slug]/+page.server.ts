import { error, redirect } from '@sveltejs/kit';
import { getAllBlogSlugs, loadBlogPost, loadBlogPosts, paginatePosts } from '$lib/server/markdown';
import { supportedLanguages, type Locale } from '$lib/shared/defaults';
import type { PageServerLoad } from './$types';

function stripPostBody<
  T extends { body: string; html: string; comments: boolean; youtube?: string }
>({ body: _b, html: _h, comments: _c, youtube: _y, ...meta }: T) {
  return meta;
}

export const entries = async () => {
  const slugs = await getAllBlogSlugs();
  const result: Array<{ lang: string; slug: string }> = [];

  for (const lang of supportedLanguages) {
    const posts = await loadBlogPosts(lang);
    const { totalPages } = paginatePosts(posts, 1);

    for (const slug of slugs) {
      result.push({ lang, slug });
    }

    for (let page = 2; page <= totalPages; page++) {
      result.push({ lang, slug: String(page) });
    }
  }

  return result;
};

export const load: PageServerLoad = async ({ params }) => {
  const lang = params.lang as Locale;
  const { slug } = params;

  if (/^\d+$/.test(slug)) {
    const page = Number(slug);
    if (page === 1) {
      redirect(302, `/${lang}/blog/`);
    }

    const posts = await loadBlogPosts(lang);
    const pagination = paginatePosts(posts, page);
    if (page > pagination.totalPages) {
      error(404, 'Not found');
    }

    return {
      mode: 'listing' as const,
      posts: pagination.items.map(stripPostBody),
      currentPage: pagination.currentPage,
      totalPages: pagination.totalPages
    };
  }

  const post = await loadBlogPost(lang, slug);
  if (!post) error(404, 'Not found');
  return { mode: 'post' as const, post };
};
