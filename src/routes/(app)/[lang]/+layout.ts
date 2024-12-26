import { setupI18n, waitLocale } from '$lib/i18n';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
  setupI18n(data.lang);
  await waitLocale();
  return data;
};
