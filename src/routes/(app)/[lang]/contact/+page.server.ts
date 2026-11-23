import { inquiryApiUrl } from '#lib/server/env.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  return { inquiryApiUrl };
};
