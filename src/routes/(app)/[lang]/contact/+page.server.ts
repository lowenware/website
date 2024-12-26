import { inquiryApiUrl } from '$lib/server/env';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  return { inquiryApiUrl };
};
