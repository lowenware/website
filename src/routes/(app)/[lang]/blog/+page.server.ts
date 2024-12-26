import { loadBlogPosts, paginatePosts } from '$lib/server/markdown';
import type { Locale } from '$lib/shared/defaults';
import type { PageServerLoad } from './$types';

function stripPostBody<
  T extends { body: string; html: string; comments: boolean; youtube?: string }
>({ body: _b, html: _h, comments: _c, youtube: _y, ...meta }: T) {
  return meta;
}

export const load: PageServerLoad = async ({ params }) => {
  const posts = await loadBlogPosts(params.lang as Locale);
  const pagination = paginatePosts(posts, 1);
  return {
    posts: pagination.items.map(stripPostBody),
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages,
    totalItems: pagination.totalItems
  };
};
