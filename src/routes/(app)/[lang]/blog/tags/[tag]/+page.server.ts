import { getAllTags, loadBlogPostsByTag, paginatePosts } from '$lib/server/markdown';
import { supportedLanguages, type Locale } from '$lib/shared/defaults';
import type { PageServerLoad } from './$types';

function stripPostBody<
  T extends { body: string; html: string; comments: boolean; youtube?: string }
>({ body: _b, html: _h, comments: _c, youtube: _y, ...meta }: T) {
  return meta;
}

export const entries = async () => {
  const result: Array<{ lang: string; tag: string }> = [];

  for (const lang of supportedLanguages) {
    const tags = await getAllTags(lang);
    for (const tag of tags) {
      result.push({ lang, tag });
    }
  }

  return result;
};

export const load: PageServerLoad = async ({ params }) => {
  const posts = await loadBlogPostsByTag(params.lang as Locale, params.tag);
  const pagination = paginatePosts(posts, 1);
  return {
    tag: params.tag,
    posts: pagination.items.map(stripPostBody),
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages
  };
};
