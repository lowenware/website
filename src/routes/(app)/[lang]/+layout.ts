import { prepareLocaleForLoad } from '#lib/i18n/index.ts';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
  await prepareLocaleForLoad(data.lang);
  return data;
};
