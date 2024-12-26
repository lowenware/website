import { loadPrivacyPage } from '$lib/server/markdown';
import type { Locale } from '$lib/shared/defaults';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const privacy = await loadPrivacyPage(params.lang as Locale);
  return { privacy };
};
