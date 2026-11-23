import { loadAboutPage } from '#lib/server/markdown/index.ts';
import type { Locale } from '#lib/shared/defaults.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const about = await loadAboutPage(params.lang as Locale);
  return { about };
};
