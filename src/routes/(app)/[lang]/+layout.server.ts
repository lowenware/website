import { error } from '@sveltejs/kit';
import { isValidLocale, supportedLanguages } from '$lib/shared/defaults';
import { loadCommunityLinks, loadMarkdownFile } from '$lib/server/markdown';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, locals }) => {
  if (!isValidLocale(params.lang)) {
    error(404, 'Not found');
  }
  locals.lang = params.lang;
  const community = await loadCommunityLinks(params.lang);
  const contactFile = await loadMarkdownFile(params.lang, 'home', 'contact.md');
  const contactMeta = contactFile.meta as Record<string, string>;
  return {
    lang: params.lang,
    community,
    contact: {
      street: contactMeta.street ?? '',
      zipCode: contactMeta.zipCode ?? '',
      city: contactMeta.city ?? '',
      country: contactMeta.country ?? '',
      regNumber: contactMeta.regNumber ?? '',
      vatNumber: contactMeta.vatNumber ?? ''
    }
  };
};
