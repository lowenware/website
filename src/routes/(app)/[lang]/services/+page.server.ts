import { loadCaseStudies, loadServices, loadTechnologies } from '$lib/server/markdown';
import type { Locale } from '$lib/shared/defaults';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const lang = params.lang as Locale;
  const [services, studies, technologies] = await Promise.all([
    loadServices(lang),
    loadCaseStudies(lang),
    loadTechnologies(lang)
  ]);
  return { services, studies, technologies };
};
