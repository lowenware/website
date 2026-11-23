import { loadHomePage } from '#lib/server/markdown/index.ts';
import type { Locale } from '#lib/shared/defaults.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const home = await loadHomePage(params.lang as Locale);
  return { home };
};
