import { loadPrivacyPage } from '#lib/server/markdown/index.ts';
import type { Locale } from '#lib/shared/defaults.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const privacy = await loadPrivacyPage(params.lang as Locale);
  return { privacy };
};
