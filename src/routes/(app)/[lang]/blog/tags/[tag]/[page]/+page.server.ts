import { redirect } from '@sveltejs/kit';
import { getAllTags, loadBlogPostsByTag, paginatePosts } from '$lib/server/markdown';
import { supportedLanguages, type Locale } from '$lib/shared/defaults';
import type { PageServerLoad } from './$types';

function stripPostBody<
  T extends { body: string; html: string; comments: boolean; youtube?: string }
>({ body: _b, html: _h, comments: _c, youtube: _y, ...meta }: T) {
  return meta;
}

export const entries = async () => {
  const result: Array<{ lang: string; tag: string; page: string }> = [];

  for (const lang of supportedLanguages) {
    const tags = await getAllTags(lang);
    for (const tag of tags) {
      const posts = await loadBlogPostsByTag(lang, tag);
      const { totalPages } = paginatePosts(posts, 1);
      for (let page = 2; page <= totalPages; page++) {
        result.push({ lang, tag, page: String(page) });
      }
    }
  }

  return result;
};

export const load: PageServerLoad = async ({ params }) => {
  const lang = params.lang as Locale;
  const page = Number(params.page);

  if (page === 1) {
    redirect(302, `/${lang}/blog/tags/${params.tag}/`);
  }

  const posts = await loadBlogPostsByTag(lang, params.tag);
  const pagination = paginatePosts(posts, page);

  if (page > pagination.totalPages) {
    redirect(302, `/${lang}/blog/tags/${params.tag}/`);
  }

  return {
    tag: params.tag,
    posts: pagination.items.map(stripPostBody),
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages
  };
};
