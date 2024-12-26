import { error } from '@sveltejs/kit';
import { loadProductPage } from '$lib/server/markdown';
import type { Locale } from '$lib/shared/defaults';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const product = await loadProductPage(params.lang as Locale, 'lowenbooks');
  if (!product) error(404, 'Not found');
  return { product };
};
