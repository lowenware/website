import { error } from '@sveltejs/kit';
import { loadProductPage } from '#lib/server/markdown/index.ts';
import type { Locale } from '#lib/shared/defaults.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const product = await loadProductPage(params.lang as Locale, 'lowenbooks');
  if (!product) error(404, 'Not found');
  return { product };
};
