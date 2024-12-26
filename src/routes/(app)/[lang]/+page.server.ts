import { loadHomePage } from '$lib/server/markdown';
import type { Locale } from '$lib/shared/defaults';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const home = await loadHomePage(params.lang as Locale);
  return { home };
};
